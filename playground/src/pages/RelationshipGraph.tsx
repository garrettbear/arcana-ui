/**
 * RelationshipGraph — /playground/graph
 * Interactive D3 force-directed graph visualization showing
 * the relationships between tokens and components.
 */

import { Badge, Input, Spinner } from '@arcana-ui/core';
import * as d3 from 'd3';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMPONENT_REGISTRY } from '../data/component-registry';
import type { TokenMapData } from '../data/token-map-types';
import tokenMapRaw from '../data/token-map.json';
import styles from './RelationshipGraph.module.css';

const tokenMapData = tokenMapRaw as unknown as TokenMapData;

// ─── Types ───────────────────────────────────────────────────────────────────

type NodeKind = 'component' | 'category' | 'token';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  kind: NodeKind;
  category?: string;
  radius: number;
  /** For component nodes — number of tokens used */
  tokenCount?: number;
  /** For token nodes — number of components that use it */
  componentCount?: number;
  /** Navigation slug */
  slug?: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  category: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  color: '#60a5fa',
  typography: '#4ade80',
  spacing: '#fb923c',
  elevation: '#a78bfa',
  shape: '#f472b6',
  motion: '#facc15',
  opacity: '#94a3b8',
  layout: '#2dd4bf',
  component: '#e879f9',
  other: '#6b7280',
};

const CATEGORY_LABELS: Record<string, string> = {
  color: 'Colors',
  typography: 'Typography',
  spacing: 'Spacing',
  elevation: 'Elevation',
  shape: 'Shape',
  motion: 'Motion',
  opacity: 'Opacity',
  layout: 'Layout',
  component: 'Component',
  other: 'Other',
};

const COMPONENT_COLOR = '#e2e8f0';

// ─── Data Preparation ────────────────────────────────────────────────────────

/**
 * Build the graph data from token-map.json.
 * We aggregate tokens by category to keep node count manageable,
 * then show individual "important" tokens (used by 5+ components).
 */
function buildGraphData(): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeMap = new Map<string, GraphNode>();

  // 1. Category nodes (hub nodes)
  const categorySet = new Set<string>();
  for (const info of Object.values(tokenMapData.tokens)) {
    categorySet.add(info.category || 'other');
  }

  for (const cat of categorySet) {
    const id = `cat:${cat}`;
    const node: GraphNode = {
      id,
      label: CATEGORY_LABELS[cat] || cat,
      kind: 'category',
      category: cat,
      radius: 20,
    };
    nodes.push(node);
    nodeMap.set(id, node);
  }

  // 2. Token nodes — only show tokens used by 3+ components to avoid clutter
  const tokenThreshold = 3;
  for (const [tokenName, info] of Object.entries(tokenMapData.tokens)) {
    const usedByCount = info.usedBy?.length || 0;
    if (usedByCount >= tokenThreshold) {
      const cat = info.category || 'other';
      const id = `tok:${tokenName}`;
      const shortName = tokenName.replace(/^--/, '').replace(new RegExp(`^${cat}-`), '');
      const node: GraphNode = {
        id,
        label: shortName,
        kind: 'token',
        category: cat,
        radius: Math.min(4 + usedByCount * 0.5, 10),
        componentCount: usedByCount,
        slug: tokenName,
      };
      nodes.push(node);
      nodeMap.set(id, node);

      // Link token → category
      const catId = `cat:${cat}`;
      if (nodeMap.has(catId)) {
        links.push({ source: id, target: catId, category: cat });
      }
    }
  }

  // 3. Component nodes
  const componentKeys = Object.keys(tokenMapData.components);
  for (const compKey of componentKeys) {
    const compData = tokenMapData.components[compKey];
    const meta = COMPONENT_REGISTRY.find((r) => r.tokenMapKey === compKey || r.slug === compKey);
    const label = meta?.name || compKey;
    const id = `comp:${compKey}`;
    const tokCount = compData.allTokens?.length || 0;
    const node: GraphNode = {
      id,
      label,
      kind: 'component',
      radius: Math.min(6 + tokCount * 0.08, 14),
      tokenCount: tokCount,
      slug: meta?.slug || compKey,
    };
    nodes.push(node);
    nodeMap.set(id, node);

    // Link component → token nodes it uses (only tokens that exist as nodes)
    const linkedCategories = new Set<string>();
    for (const tokenName of compData.allTokens || []) {
      const tokId = `tok:${tokenName}`;
      if (nodeMap.has(tokId)) {
        const cat = tokenMapData.tokens[tokenName]?.category || 'other';
        links.push({ source: id, target: tokId, category: cat });
        linkedCategories.add(cat);
      }
    }

    // Also link component → categories for tokens below threshold
    for (const tokenName of compData.allTokens || []) {
      const info = tokenMapData.tokens[tokenName];
      if (!info) continue;
      const cat = info.category || 'other';
      if (!linkedCategories.has(cat)) {
        const catId = `cat:${cat}`;
        if (nodeMap.has(catId)) {
          links.push({ source: id, target: catId, category: cat });
          linkedCategories.add(cat);
        }
      }
    }
  }

  return { nodes, links };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function RelationshipGraph(): React.JSX.Element {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const navigate = useNavigate();

  const graphData = useMemo(() => buildGraphData(), []);

  // Track connected nodes for hover highlighting
  const connections = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const link of graphData.links) {
      const s = typeof link.source === 'string' ? link.source : link.source.id;
      const t = typeof link.target === 'string' ? link.target : link.target.id;
      if (!map.has(s)) map.set(s, new Set());
      if (!map.has(t)) map.set(t, new Set());
      map.get(s)?.add(t);
      map.get(t)?.add(s);
    }
    return map;
  }, [graphData]);

  // Search match
  const searchMatch = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return graphData.nodes.find(
      (n) =>
        n.label.toLowerCase().includes(q) ||
        n.id.toLowerCase().includes(q) ||
        n.slug?.toLowerCase().includes(q),
    );
  }, [search, graphData]);

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: Math.max(entry.contentRect.height, 500),
        });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Click handler
  const handleNodeClick = useCallback(
    (node: GraphNode) => {
      if (node.kind === 'component') {
        navigate(`/playground/components/${node.slug}`);
      } else if (node.kind === 'token' && node.slug) {
        const cat = node.category || 'other';
        const name = node.slug.replace(/^--/, '').replace(new RegExp(`^${cat}-`), '');
        navigate(`/playground/tokens/${cat}/${name || node.slug.replace(/^--/, '')}`);
      }
    },
    [navigate],
  );

  // D3 force simulation
  useEffect(() => {
    if (!svgRef.current) return;
    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);

    // Clear previous
    svg.selectAll('*').remove();

    // Defs for glow filter
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Stronger glow for hover
    const filterHover = defs.append('filter').attr('id', 'glow-hover');
    filterHover.append('feGaussianBlur').attr('stdDeviation', '6').attr('result', 'coloredBlur');
    const feMergeHover = filterHover.append('feMerge');
    feMergeHover.append('feMergeNode').attr('in', 'coloredBlur');
    feMergeHover.append('feMergeNode').attr('in', 'SourceGraphic');

    // Zoom container
    const g = svg.append('g');

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoom);

    // Deep clone nodes/links for simulation
    const nodes: GraphNode[] = graphData.nodes.map((n) => ({ ...n }));
    const links: GraphLink[] = graphData.links.map((l) => ({
      ...l,
      source: typeof l.source === 'string' ? l.source : l.source.id,
      target: typeof l.target === 'string' ? l.target : l.target.id,
    }));

    // Force simulation
    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance((d) => {
            const s = d.source as GraphNode;
            const t = d.target as GraphNode;
            if (s.kind === 'category' || t.kind === 'category') return 80;
            return 50;
          })
          .strength(0.3),
      )
      .force('charge', d3.forceManyBody().strength(-60).distanceMax(300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collide',
        d3.forceCollide<GraphNode>().radius((d) => d.radius + 3),
      )
      .force('x', d3.forceX(width / 2).strength(0.03))
      .force('y', d3.forceY(height / 2).strength(0.03));

    simulationRef.current = simulation;

    // Draw links
    const linkGroup = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', (d) => CATEGORY_COLORS[d.category] || '#6b7280')
      .attr('stroke-opacity', 0.12)
      .attr('stroke-width', 0.5);

    // Draw nodes
    const nodeGroup = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', (d) => (d.kind === 'category' ? 'default' : 'pointer'))
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      );

    // Node circles
    nodeGroup
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => {
        if (d.kind === 'component') return COMPONENT_COLOR;
        return CATEGORY_COLORS[d.category || 'other'] || '#6b7280';
      })
      .attr('stroke', (d) => {
        if (d.kind === 'component') return '#94a3b8';
        return 'transparent';
      })
      .attr('stroke-width', (d) => (d.kind === 'category' ? 2 : 1))
      .attr('filter', (d) => (d.kind === 'category' ? 'url(#glow)' : 'none'));

    // Labels for category nodes
    nodeGroup
      .filter((d) => d.kind === 'category')
      .append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => d.radius + 14)
      .attr('fill', (d) => CATEGORY_COLORS[d.category || 'other'] || '#94a3b8')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('font-family', 'var(--font-family-body, system-ui)')
      .attr('pointer-events', 'none');

    // Labels for component nodes (only show on hover or when few)
    const compLabels = nodeGroup
      .filter((d) => d.kind === 'component')
      .append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => d.radius + 12)
      .attr('fill', '#94a3b8')
      .attr('font-size', '9px')
      .attr('font-family', 'var(--font-family-body, system-ui)')
      .attr('pointer-events', 'none')
      .attr('opacity', 0);

    // Hover interactions
    nodeGroup
      .on('mouseenter', (event, d) => {
        setHovered(d.id);

        const connected = connections.get(d.id) || new Set();

        // Fade unrelated nodes
        nodeGroup.select('circle').attr('opacity', (n: unknown) => {
          const node = n as GraphNode;
          if (node.id === d.id || connected.has(node.id)) return 1;
          return 0.08;
        });

        // Highlight connected links
        linkGroup
          .attr('stroke-opacity', (l) => {
            const s = (l.source as GraphNode).id;
            const t = (l.target as GraphNode).id;
            if (s === d.id || t === d.id) return 0.7;
            return 0.03;
          })
          .attr('stroke-width', (l) => {
            const s = (l.source as GraphNode).id;
            const t = (l.target as GraphNode).id;
            if (s === d.id || t === d.id) return 1.5;
            return 0.5;
          });

        // Show labels for this node and connected
        compLabels.attr('opacity', (n: unknown) => {
          const node = n as GraphNode;
          if (node.id === d.id || connected.has(node.id)) return 1;
          return 0;
        });

        // Glow the hovered node
        nodeGroup
          .filter((nd) => nd.id === d.id)
          .select('circle')
          .attr('filter', 'url(#glow-hover)');

        // Text labels fade for category nodes
        nodeGroup
          .filter((nd) => nd.kind === 'category')
          .select('text')
          .attr('opacity', (nd) => {
            if (nd.id === d.id || connected.has(nd.id)) return 1;
            return 0.1;
          });

        // Tooltip
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (svgRect) {
          let tip = d.label;
          if (d.kind === 'component') tip += ` — uses ${d.tokenCount || 0} tokens`;
          else if (d.kind === 'token') tip += ` — used by ${d.componentCount || 0} components`;
          else if (d.kind === 'category') tip = `${d.label} token category`;

          setTooltip({
            text: tip,
            x: event.clientX - svgRect.left,
            y: event.clientY - svgRect.top - 10,
          });
        }
      })
      .on('mousemove', (event) => {
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (svgRect) {
          setTooltip((prev) =>
            prev
              ? {
                  ...prev,
                  x: event.clientX - svgRect.left,
                  y: event.clientY - svgRect.top - 10,
                }
              : null,
          );
        }
      })
      .on('mouseleave', () => {
        setHovered(null);
        setTooltip(null);

        // Reset all
        nodeGroup.select('circle').attr('opacity', 1);
        linkGroup.attr('stroke-opacity', 0.12).attr('stroke-width', 0.5);
        compLabels.attr('opacity', 0);
        nodeGroup.selectAll('text').attr('opacity', null);

        // Reset filters
        nodeGroup.select('circle').attr('filter', (d: unknown) => {
          const node = d as GraphNode;
          return node.kind === 'category' ? 'url(#glow)' : 'none';
        });

        // Restore category label opacity
        nodeGroup
          .filter((d) => d.kind === 'category')
          .selectAll('text')
          .attr('opacity', 1);
      })
      .on('click', (_event, d) => {
        handleNodeClick(d);
      });

    // Tick
    simulation.on('tick', () => {
      linkGroup
        .attr('x1', (d) => (d.source as GraphNode).x || 0)
        .attr('y1', (d) => (d.source as GraphNode).y || 0)
        .attr('x2', (d) => (d.target as GraphNode).x || 0)
        .attr('y2', (d) => (d.target as GraphNode).y || 0);

      nodeGroup.attr('transform', (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Let the simulation settle, then reveal
    simulation.on('end', () => {
      setLoading(false);
    });

    // If simulation doesn't end quickly, reveal after a timeout
    const timer = setTimeout(() => setLoading(false), 2000);

    return () => {
      clearTimeout(timer);
      simulation.stop();
    };
  }, [dimensions, graphData, connections, handleNodeClick]);

  // Search focus effect — zoom to found node
  useEffect(() => {
    if (!searchMatch || !svgRef.current || !simulationRef.current) return;

    const svg = d3.select(svgRef.current);
    const node = simulationRef.current.nodes().find((n) => n.id === searchMatch.id);
    if (!node || node.x == null || node.y == null) return;

    const { width, height } = dimensions;
    const scale = 2;
    const tx = width / 2 - node.x * scale;
    const ty = height / 2 - node.y * scale;

    svg
      .transition()
      .duration(750)
      .call(
        d3.zoom<SVGSVGElement, unknown>().transform as unknown as (
          transition: d3.Transition<SVGSVGElement, unknown, null, undefined>,
          transform: d3.ZoomTransform,
        ) => void,
        d3.zoomIdentity.translate(tx, ty).scale(scale),
      );

    setHovered(searchMatch.id);
  }, [searchMatch, dimensions]);

  // Stats
  const stats = useMemo(
    () => ({
      components: graphData.nodes.filter((n) => n.kind === 'component').length,
      tokens: graphData.nodes.filter((n) => n.kind === 'token').length,
      categories: graphData.nodes.filter((n) => n.kind === 'category').length,
      links: graphData.links.length,
    }),
    [graphData],
  );

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Token–Component Relationship Graph</h1>
        <p className={styles.subtitle}>
          Interactive visualization of how {stats.components} components connect to {stats.tokens}{' '}
          tokens across {stats.categories} categories. Hover to explore, click to navigate. Drag
          nodes to rearrange.
        </p>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Input
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="sm"
          />
          {searchMatch && (
            <Badge size="sm" variant="default" className={styles.searchResult}>
              Found: {searchMatch.label} ({searchMatch.kind})
            </Badge>
          )}
          {search && !searchMatch && (
            <Badge size="sm" variant="warning" className={styles.searchResult}>
              No match
            </Badge>
          )}
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: COMPONENT_COLOR }} />
            Components
          </span>
          {Object.entries(CATEGORY_COLORS)
            .filter(([cat]) => cat !== 'other' && cat !== 'component')
            .map(([cat, color]) => (
              <span key={cat} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: color }} />
                {CATEGORY_LABELS[cat] || cat}
              </span>
            ))}
        </div>
      </div>

      {/* Mobile message */}
      <div className={styles.mobileMessage}>
        <p>Graph visualization is best viewed on desktop.</p>
        <p>
          {stats.components} components use {stats.tokens} shared tokens across {stats.categories}{' '}
          categories.
        </p>
      </div>

      {/* Graph container */}
      <div ref={containerRef} className={styles.graphContainer}>
        {loading && (
          <div className={styles.loadingOverlay}>
            <Spinner size="lg" />
            <span className={styles.loadingText}>Initializing force simulation...</span>
          </div>
        )}
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className={styles.svg}
        />

        {/* Tooltip */}
        {tooltip && (
          <div className={styles.tooltip} style={{ left: tooltip.x, top: tooltip.y }}>
            {tooltip.text}
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <Badge size="sm">{stats.components} components</Badge>
        <Badge size="sm">{stats.tokens} token nodes</Badge>
        <Badge size="sm">{stats.categories} categories</Badge>
        <Badge size="sm">{stats.links} connections</Badge>
      </div>
    </div>
  );
}
