import { Badge, ProgressBar } from '@arcana-ui/core';
import { bundleData } from '../data/metrics';

function BundleBarChart(): React.JSX.Element {
  const maxKB = Math.max(...bundleData.map((d) => d.totalKB));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {bundleData.map((d) => (
        <div key={d.category}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-fg-secondary)' }}>
              {d.category}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-fg-secondary)' }}>
              {d.totalKB.toFixed(1)} kB total · avg {d.avgKB.toFixed(1)} kB
            </span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '2px', height: '8px' }}>
            <div
              style={{
                width: `${(d.totalKB / maxKB) * 100}%`,
                height: '100%',
                background: d.totalKB > 60 ? '#f59e0b' : 'var(--color-action-primary)',
                borderRadius: '2px',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const treeShakingData = [
  { name: 'Button only', baseline: 4.2, actual: 4.2, status: 'pass' as const },
  { name: 'Button + Card', baseline: 8.0, actual: 8.1, status: 'pass' as const },
  { name: 'Dashboard set (8)', baseline: 52.1, actual: 53.4, status: 'pass' as const },
  { name: 'Full library', baseline: 323.0, actual: 323.0, status: 'info' as const },
];

export function Performance(): React.JSX.Element {
  const totalKB = bundleData.reduce((s, d) => s + d.totalKB, 0);

  return (
    <div>
      <div className="control-page-header">
        <div className="control-page-header__left">
          <h1 className="control-page-header__title">Performance</h1>
          <span className="control-page-header__subtitle">Bundle analysis &amp; tree-shaking</span>
        </div>
      </div>

      <div className="control-stats-grid">
        <div className="control-metric-card">
          <span className="control-metric-card__value">{totalKB.toFixed(0)} kB</span>
          <span className="control-metric-card__label">Total library (minified)</span>
        </div>
        <div className="control-metric-card">
          <span className="control-metric-card__value">4.2 kB</span>
          <span className="control-metric-card__label">Smallest component (Button)</span>
        </div>
        <div className="control-metric-card">
          <span className="control-metric-card__value">18.4 kB</span>
          <span className="control-metric-card__label">Largest component (DataTable)</span>
        </div>
        <div className="control-metric-card">
          <span className="control-metric-card__value">98%</span>
          <span className="control-metric-card__label">Tree-shaking efficiency</span>
        </div>
      </div>

      <div className="control-section">
        <div className="control-section__header">
          <h2 className="control-section__title">Bundle Size by Category</h2>
          <span style={{ fontSize: '12px', color: 'var(--color-fg-secondary)' }}>
            minified · gzip reduces by ~70%
          </span>
        </div>
        <BundleBarChart />
      </div>

      <div className="control-section">
        <div className="control-section__header">
          <h2 className="control-section__title">Tree-Shaking Analysis</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {treeShakingData.map((row) => (
            <div
              key={row.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                background: 'var(--color-bg-subtle)',
                borderRadius: '6px',
              }}
            >
              <span className="control-mono" style={{ fontSize: '12px', flex: 1 }}>
                {row.name}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--color-fg-secondary)',
                  width: '80px',
                  textAlign: 'right',
                }}
              >
                {row.actual} kB
              </span>
              <Badge variant={row.status === 'pass' ? 'success' : 'secondary'} size="sm">
                {row.status === 'pass' ? '✓ optimal' : 'full lib'}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="control-section">
        <div className="control-section__header">
          <h2 className="control-section__title">Build Times</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: '@arcana-ui/tokens', time: 1.2, threshold: 5 },
            { label: '@arcana-ui/core', time: 8.4, threshold: 15 },
            { label: 'demos/atelier', time: 0.9, threshold: 30 },
            { label: 'demos/control', time: 1.1, threshold: 30 },
            { label: 'demos/ecommerce', time: 34.2, threshold: 30 },
            { label: 'playground', time: 14.6, threshold: 30 },
          ].map((b) => (
            <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                className="control-mono"
                style={{ fontSize: '12px', width: '180px', flexShrink: 0 }}
              >
                {b.label}
              </span>
              <div style={{ flex: 1 }}>
                <ProgressBar
                  value={(b.time / b.threshold) * 100}
                  variant={b.time > b.threshold ? 'warning' : 'success'}
                  size="sm"
                />
              </div>
              <span
                style={{
                  fontSize: '12px',
                  color: b.time > b.threshold ? '#f59e0b' : 'var(--color-fg-secondary)',
                  width: '50px',
                  textAlign: 'right',
                }}
              >
                {b.time}s
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
