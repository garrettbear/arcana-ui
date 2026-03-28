/**
 * generate-token-map.mjs
 *
 * Scans all component CSS files in packages/core/src and extracts var() references.
 * Outputs a JSON mapping of component → tokens and token → components.
 *
 * Run: node scripts/generate-token-map.mjs
 * Output: playground/src/data/token-map.json
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CORE_SRC = path.resolve(__dirname, '../packages/core/src');
const OUTPUT_PATH = path.resolve(__dirname, '../playground/src/data/token-map.json');

function classifyToken(token) {
  if (token.startsWith('--color-') || token.startsWith('--primitive-')) return 'color';
  if (
    token.startsWith('--font-') ||
    token.startsWith('--line-height') ||
    token.startsWith('--letter-spacing')
  )
    return 'typography';
  if (token.startsWith('--spacing-')) return 'spacing';
  if (
    token.startsWith('--shadow-') ||
    token.startsWith('--elevation-') ||
    token.startsWith('--z-') ||
    token.startsWith('--backdrop-blur')
  )
    return 'elevation';
  if (token.startsWith('--radius-') || token.startsWith('--border-')) return 'shape';
  if (
    token.startsWith('--duration-') ||
    token.startsWith('--ease-') ||
    token.startsWith('--transition-')
  )
    return 'motion';
  if (token.startsWith('--opacity-')) return 'opacity';
  if (token.startsWith('--focus-')) return 'shape';
  if (token.startsWith('--container-') || token.startsWith('--grid-')) return 'layout';
  return 'other';
}

function isComponentToken(token) {
  const category = classifyToken(token);
  // If not classified as a known semantic category, it's likely a component token
  // Component tokens follow the pattern --component-name-property (e.g., --button-bg, --card-radius)
  if (category === 'other') {
    // Check if it starts with a known component prefix
    return /^--(button|input|textarea|select|checkbox|radio|toggle|badge|avatar|card|modal|alert|toast|banner|tabs|accordion|skeleton|spinner|navbar|sidebar|breadcrumb|pagination|footer|hero|feature-section|testimonial|pricing-card|cta|stats-bar|timeline|logo-cloud|data-table|stat-card|kpi-card|progress-bar|drawer|popover|command-palette|bottom-sheet|mobile-nav|drawer-nav|table|divider|spacer|product-card|cart-item|quantity-selector|price-display|rating-stars|article-layout|pull-quote|author-card|related-posts|newsletter-signup|scroll-area|collapsible|copy-button|keyboard-shortcut|date-picker|file-upload|form|empty-state|error-boundary|carousel|image)-/.test(
      token,
    );
  }
  return false;
}

function extractVarReferences(cssContent) {
  const varRegex = /var\(\s*(--[\w-]+)/g;
  const tokens = new Set();
  let match = varRegex.exec(cssContent);
  while (match !== null) {
    tokens.add(match[1]);
    match = varRegex.exec(cssContent);
  }
  return Array.from(tokens).sort();
}

function findCSSFiles(dir) {
  const results = [];
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.module.css')) {
        const componentName = entry.name.replace('.module.css', '').toLowerCase();
        results.push({ componentName, filePath: fullPath });
      }
    }
  }
  walk(dir);
  return results;
}

// Also parse CSS comments at the top of files to extract fallback info
function extractFallbackMap(cssContent) {
  const fallbacks = {};
  // Match patterns like var(--button-bg, var(--color-action-primary))
  const fallbackRegex = /var\(\s*(--[\w-]+)\s*,\s*var\(\s*(--[\w-]+)\s*\)/g;
  let match = fallbackRegex.exec(cssContent);
  while (match !== null) {
    fallbacks[match[1]] = match[2];
    match = fallbackRegex.exec(cssContent);
  }
  return fallbacks;
}

function main() {
  const cssFiles = findCSSFiles(CORE_SRC);
  const componentMap = {};
  const tokenMap = {};
  const fallbackMap = {}; // component-token → semantic-token fallback

  for (const { componentName, filePath } of cssFiles) {
    const cssContent = fs.readFileSync(filePath, 'utf-8');
    const allTokens = extractVarReferences(cssContent);
    const fallbacks = extractFallbackMap(cssContent);

    const componentTokens = allTokens.filter((t) => isComponentToken(t));
    const semanticTokens = allTokens.filter((t) => !isComponentToken(t));

    componentMap[componentName] = {
      componentTokens,
      semanticTokens,
      allTokens,
      fallbacks,
      cssFile: path.relative(path.resolve(__dirname, '..'), filePath),
    };

    // Merge fallbacks
    Object.assign(fallbackMap, fallbacks);

    // Build inverse mapping
    for (const token of allTokens) {
      if (!tokenMap[token]) {
        tokenMap[token] = {
          usedBy: [],
          tier: isComponentToken(token)
            ? 'component'
            : token.startsWith('--primitive-')
              ? 'primitive'
              : 'semantic',
          category: isComponentToken(token) ? 'component' : classifyToken(token),
        };
      }
      if (!tokenMap[token].usedBy.includes(componentName)) {
        tokenMap[token].usedBy.push(componentName);
      }
    }
  }

  // For semantic tokens, also find indirect usage via component token fallbacks
  // e.g., if --button-bg falls back to --color-action-primary, then button indirectly uses --color-action-primary
  for (const [compName, data] of Object.entries(componentMap)) {
    for (const [compToken, semanticFallback] of Object.entries(data.fallbacks)) {
      if (tokenMap[semanticFallback]) {
        if (!tokenMap[semanticFallback].usedBy.includes(compName)) {
          tokenMap[semanticFallback].usedBy.push(compName);
        }
      }
    }
  }

  // Sort
  for (const token of Object.values(tokenMap)) {
    token.usedBy.sort();
  }

  const output = {
    generatedAt: new Date().toISOString(),
    componentCount: Object.keys(componentMap).length,
    tokenCount: Object.keys(tokenMap).length,
    components: componentMap,
    tokens: tokenMap,
    fallbackMap,
  };

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(
    `Token map generated: ${Object.keys(componentMap).length} components, ${Object.keys(tokenMap).length} tokens`,
  );
  console.log(`Output: ${OUTPUT_PATH}`);
}

main();
