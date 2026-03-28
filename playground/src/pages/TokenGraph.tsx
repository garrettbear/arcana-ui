/**
 * TokenGraph — /playground/graph
 * Interactive token-component relationship visualization using Canvas.
 * Shows components as nodes connected to token category clusters.
 */

import { Button, Input } from '@arcana-ui/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMPONENT_REGISTRY } from '../data/component-registry';
import type { TokenMapData } from '../data/token-map-types';
import tokenMapRaw from '../data/token-map.json';
import styles from './TokenGraph.module.css';

const tokenMapData = tokenMapRaw as unknown as TokenMapData;

// ─── Types ────────────────────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  type: 'component' | 'category' | 'token';
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  slug?: string;
  category?: string;
  tokenCount?: number;
  componentCount?: number;
}

interface GraphEdge {
  source: string;
  target: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  color: '#3b82f6',
  typography: '#8b5cf6',
  spacing: '#10b981',
  elevation: '#f59e0b',
  shape: '#ef4444',
  motion: '#ec4899',
  opacity: '#6b7280',
  layout: '#06b6d4',
  other: '#a3a3a3',
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
};

// ─── Graph Data ───────────────────────────────────────────────────────────────

function buildGraphData(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  // Count tokens per category for category nodes
  const categoryTokenCounts: Record<string, number> = {};
  const categoryComponentSets: Record<string, Set<string>> = {};

  for (const [_token, data] of Object.entries(tokenMapData.tokens)) {
    const cat = data.category;
    if (cat === 'component') continue; // Skip component tokens
    if (!categoryTokenCounts[cat]) categoryTokenCounts[cat] = 0;
    if (!categoryComponentSets[cat]) categoryComponentSets[cat] = new Set();
    categoryTokenCounts[cat]++;
    for (const comp of data.usedBy) {
      categoryComponentSets[cat].add(comp);
    }
  }

  // Create category nodes (center cluster)
  const categories = Object.keys(categoryTokenCounts).filter((c) => c !== 'other');
  const catAngleStep = (Math.PI * 2) / categories.length;

  categories.forEach((cat, i) => {
    const angle = catAngleStep * i - Math.PI / 2;
    nodes.push({
      id: `cat-${cat}`,
      type: 'category',
      label: CATEGORY_LABELS[cat] || cat,
      x: Math.cos(angle) * 120,
      y: Math.sin(angle) * 120,
      vx: 0,
      vy: 0,
      radius: 28 + Math.min(categoryTokenCounts[cat] / 10, 20),
      color: CATEGORY_COLORS[cat] || '#a3a3a3',
      category: cat,
      tokenCount: categoryTokenCounts[cat],
      componentCount: categoryComponentSets[cat]?.size || 0,
    });
  });

  // Create component nodes (outer ring)
  const components = Object.keys(tokenMapData.components);
  const compAngleStep = (Math.PI * 2) / components.length;

  components.forEach((comp, i) => {
    const angle = compAngleStep * i - Math.PI / 2;
    const meta = COMPONENT_REGISTRY.find((c) => c.tokenMapKey === comp);
    const tokenCount = tokenMapData.components[comp]?.allTokens?.length || 0;

    nodes.push({
      id: `comp-${comp}`,
      type: 'component',
      label: meta?.name || comp,
      x: Math.cos(angle) * 350,
      y: Math.sin(angle) * 350,
      vx: 0,
      vy: 0,
      radius: 8 + Math.min(tokenCount / 5, 12),
      color: '#e2e8f0',
      slug: meta?.slug || comp,
      tokenCount,
    });

    // Create edges from component to categories
    const compData = tokenMapData.components[comp];
    if (compData) {
      const usedCategories = new Set<string>();
      for (const token of compData.semanticTokens || []) {
        const td = tokenMapData.tokens[token];
        if (td) usedCategories.add(td.category);
      }
      for (const cat of usedCategories) {
        if (cat !== 'other' && cat !== 'component') {
          edges.push({ source: `comp-${comp}`, target: `cat-${cat}` });
        }
      }
    }
  });

  return { nodes, edges };
}

// ─── Canvas Renderer ──────────────────────────────────────────────────────────

export default function TokenGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [search, setSearch] = useState('');
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const animFrameRef = useRef<number>(0);

  // Build graph data
  useEffect(() => {
    const { nodes, edges } = buildGraphData();
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, []);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Simple force simulation
  useEffect(() => {
    const nodes = nodesRef.current;
    if (nodes.length === 0) return;

    let frameCount = 0;
    const maxFrames = 200; // Stop simulation after stabilizing

    function simulate() {
      if (frameCount > maxFrames) return;

      const alpha = 1 - frameCount / maxFrames;
      const repulsionStrength = 800 * alpha;
      const attractionStrength = 0.005 * alpha;

      // Repulsion between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsionStrength / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          nodes[i].vx -= fx;
          nodes[i].vy -= fy;
          nodes[j].vx += fx;
          nodes[j].vy += fy;
        }
      }

      // Attraction along edges
      for (const edge of edgesRef.current) {
        const source = nodes.find((n) => n.id === edge.source);
        const target = nodes.find((n) => n.id === edge.target);
        if (!source || !target) continue;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const idealDist = 250;
        const force = (dist - idealDist) * attractionStrength;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        source.vx += fx;
        source.vy += fy;
        target.vx -= fx;
        target.vy -= fy;
      }

      // Center gravity for category nodes
      for (const node of nodes) {
        if (node.type === 'category') {
          node.vx -= node.x * 0.01 * alpha;
          node.vy -= node.y * 0.01 * alpha;
        }
      }

      // Apply velocities with damping
      for (const node of nodes) {
        node.vx *= 0.6;
        node.vy *= 0.6;
        node.x += node.vx;
        node.y += node.vy;
      }

      frameCount++;
      if (frameCount <= maxFrames) {
        requestAnimationFrame(simulate);
      }
    }

    simulate();
  }, []);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width * window.devicePixelRatio;
    canvas.height = dimensions.height * window.devicePixelRatio;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    function render() {
      if (!ctx) return;
      const { width, height } = dimensions;
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      // Clear
      ctx.fillStyle = 'var(--color-bg-page)';
      ctx.clearRect(0, 0, width, height);

      // Get computed background color
      const bgColor =
        getComputedStyle(document.documentElement).getPropertyValue('--color-bg-page').trim() ||
        '#0a0a0a';
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2 + offset.x, height / 2 + offset.y);
      ctx.scale(zoom, zoom);

      // Determine highlighted connections
      const highlightedNodeIds = new Set<string>();
      const highlightedEdges = new Set<string>();

      if (hoveredNode) {
        highlightedNodeIds.add(hoveredNode.id);
        for (const edge of edges) {
          if (edge.source === hoveredNode.id || edge.target === hoveredNode.id) {
            highlightedNodeIds.add(edge.source);
            highlightedNodeIds.add(edge.target);
            highlightedEdges.add(`${edge.source}-${edge.target}`);
          }
        }
      }

      // Search highlighting
      const searchNodeIds = new Set<string>();
      if (search) {
        const term = search.toLowerCase();
        for (const node of nodes) {
          if (node.label.toLowerCase().includes(term)) {
            searchNodeIds.add(node.id);
          }
        }
      }

      // Draw edges
      for (const edge of edges) {
        const source = nodes.find((n) => n.id === edge.source);
        const target = nodes.find((n) => n.id === edge.target);
        if (!source || !target) continue;

        const isHighlighted = highlightedEdges.has(`${edge.source}-${edge.target}`);
        const isFaded = hoveredNode && !isHighlighted;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (isHighlighted) {
          const catNode = [source, target].find((n) => n.type === 'category');
          ctx.strokeStyle = catNode ? `${catNode.color}aa` : '#ffffff44';
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = isFaded ? '#ffffff08' : '#ffffff15';
          ctx.lineWidth = 0.5;
        }
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        const isHighlighted = highlightedNodeIds.has(node.id);
        const isSearchMatch = searchNodeIds.has(node.id);
        const isFaded = (hoveredNode && !isHighlighted) || (search && !isSearchMatch);

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        if (node.type === 'category') {
          // Category nodes — large, colored
          const alpha = isFaded ? '30' : 'cc';
          ctx.fillStyle = node.color + alpha;
          ctx.fill();

          // Glow
          if (isHighlighted || isSearchMatch) {
            ctx.shadowColor = node.color;
            ctx.shadowBlur = 20;
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Label
          ctx.fillStyle = isFaded ? '#ffffff30' : '#ffffffee';
          ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(node.label, node.x, node.y);
        } else {
          // Component nodes — smaller, lighter
          const alpha = isFaded ? '15' : '90';
          ctx.fillStyle = (isHighlighted ? '#ffffff' : '#94a3b8') + alpha;
          ctx.fill();

          if (isHighlighted || isSearchMatch) {
            ctx.strokeStyle = '#ffffffcc';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Label (only show for highlighted or non-faded)
          if (!isFaded || isHighlighted || isSearchMatch) {
            ctx.fillStyle = isFaded ? '#ffffff30' : '#ffffffbb';
            ctx.font = `${node.radius < 12 ? 9 : 10}px system-ui, -apple-system, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(node.label, node.x, node.y + node.radius + 4);
          }
        }
      }

      ctx.restore();

      // Tooltip
      if (hoveredNode) {
        const screenX = hoveredNode.x * zoom + dimensions.width / 2 + offset.x;
        const screenY = hoveredNode.y * zoom + dimensions.height / 2 + offset.y;

        ctx.fillStyle = '#1e293bee';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;

        const tooltipW = 180;
        const tooltipH = hoveredNode.type === 'category' ? 48 : 36;
        const tx = screenX + 15;
        const ty = screenY - tooltipH / 2;

        ctx.beginPath();
        ctx.roundRect(tx, ty, tooltipW, tooltipH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffffee';
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(hoveredNode.label, tx + 8, ty + 8);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px system-ui, -apple-system, sans-serif';
        if (hoveredNode.type === 'category') {
          ctx.fillText(
            `${hoveredNode.tokenCount} tokens · ${hoveredNode.componentCount} components`,
            tx + 8,
            ty + 26,
          );
        } else {
          ctx.fillText(`${hoveredNode.tokenCount} tokens`, tx + 8, ty + 24);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    }

    render();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [dimensions, hoveredNode, search, offset, zoom]);

  // Mouse interaction
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left - dimensions.width / 2 - offset.x) / zoom;
      const my = (e.clientY - rect.top - dimensions.height / 2 - offset.y) / zoom;

      if (isDragging) {
        setOffset((prev) => ({
          x: prev.x + e.movementX,
          y: prev.y + e.movementY,
        }));
        return;
      }

      // Hit test
      let found: GraphNode | null = null;
      for (const node of nodesRef.current) {
        const dx = node.x - mx;
        const dy = node.y - my;
        if (dx * dx + dy * dy < (node.radius + 5) * (node.radius + 5)) {
          found = node;
          break;
        }
      }
      setHoveredNode(found);
      canvas.style.cursor = found ? 'pointer' : isDragging ? 'grabbing' : 'grab';
    },
    [dimensions, offset, zoom, isDragging],
  );

  const handleClick = useCallback(() => {
    if (!hoveredNode) return;
    if (hoveredNode.type === 'component' && hoveredNode.slug) {
      navigate(`/playground/components/${hoveredNode.slug}`);
    } else if (hoveredNode.type === 'category' && hoveredNode.category) {
      navigate(`/playground/tokens?category=${hoveredNode.category}`);
    }
  }, [hoveredNode, navigate]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.3, Math.min(3, prev * delta)));
  }, []);

  const handleMouseDown = useCallback(() => setIsDragging(true), []);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <h1 className={styles.title}>Token-Component Graph</h1>
          <p className={styles.subtitle}>Hover over nodes to see connections. Click to navigate.</p>
        </div>
        <div className={styles.toolbarRight}>
          <Input
            size="sm"
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className={styles.zoomControls}>
            <Button size="sm" variant="ghost" onClick={() => setZoom((z) => Math.min(3, z * 1.2))}>
              +
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setZoom((z) => Math.max(0.3, z / 1.2))}
            >
              −
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        {Object.entries(CATEGORY_COLORS)
          .filter(([k]) => k !== 'other')
          .map(([cat, color]) => (
            <div key={cat} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: color }} />
              <span>{CATEGORY_LABELS[cat] || cat}</span>
            </div>
          ))}
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#94a3b8' }} />
          <span>Components</span>
        </div>
      </div>

      <div className={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setIsDragging(false);
            setHoveredNode(null);
          }}
        />
      </div>
    </div>
  );
}
