/**
 * TypeScript types for the generated token-map.json data.
 */

export interface TokenUsage {
  usedBy: string[];
  tier: 'component' | 'semantic' | 'primitive';
  category: string;
}

export interface ComponentTokenData {
  componentTokens: string[];
  semanticTokens: string[];
  allTokens: string[];
  fallbacks: Record<string, string>;
  cssFile: string;
}

export interface TokenMapData {
  generatedAt: string;
  componentCount: number;
  tokenCount: number;
  components: Record<string, ComponentTokenData>;
  tokens: Record<string, TokenUsage>;
  fallbackMap: Record<string, string>;
}
