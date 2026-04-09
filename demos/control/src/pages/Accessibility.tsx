import { Badge, ProgressBar } from '@arcana-ui/core';
import { a11yChecks, wcagData } from '../data/metrics';

export function Accessibility(): React.JSX.Element {
  const overallPass = a11yChecks.reduce((s, c) => s + c.pass, 0);
  const overallTotal = a11yChecks.reduce((s, c) => s + c.total, 0);
  const overallPct = Math.round((overallPass / overallTotal) * 100);

  const avgWcag = Math.round(wcagData.reduce((s, d) => s + d.score, 0) / wcagData.length);

  return (
    <div>
      <div className="control-page-header">
        <div className="control-page-header__left">
          <h1 className="control-page-header__title">Accessibility</h1>
          <span className="control-page-header__subtitle">
            WCAG 2.1 AA compliance across all components
          </span>
        </div>
      </div>

      <div className="control-stats-grid">
        <div className="control-metric-card">
          <span className="control-metric-card__value" style={{ color: '#22c55e' }}>
            {overallPct}%
          </span>
          <span className="control-metric-card__label">Overall WCAG pass rate</span>
        </div>
        <div className="control-metric-card">
          <span className="control-metric-card__value">{avgWcag}%</span>
          <span className="control-metric-card__label">Avg score by category</span>
        </div>
        <div className="control-metric-card">
          <span className="control-metric-card__value" style={{ color: '#22c55e' }}>
            63/63
          </span>
          <span className="control-metric-card__label">Color contrast AA</span>
        </div>
        <div className="control-metric-card">
          <span className="control-metric-card__value" style={{ color: '#22c55e' }}>
            63/63
          </span>
          <span className="control-metric-card__label">Focus indicators</span>
        </div>
      </div>

      {/* WCAG criterion breakdown */}
      <div className="control-section">
        <div className="control-section__header">
          <h2 className="control-section__title">WCAG Criteria</h2>
          <Badge variant="success" size="sm">
            {overallPass}/{overallTotal} passing
          </Badge>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {a11yChecks.map((check) => {
            const pct = Math.round((check.pass / check.total) * 100);
            const badgeVariant = pct === 100 ? 'success' : pct >= 95 ? 'warning' : 'error';
            return (
              <div key={check.criterion}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <span style={{ fontSize: '13px' }}>{check.criterion}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-fg-secondary)' }}>
                      {check.pass}/{check.total}
                    </span>
                    <Badge variant={badgeVariant} size="sm">
                      {pct}%
                    </Badge>
                  </div>
                </div>
                <ProgressBar value={pct} variant={pct >= 95 ? 'striped' : 'default'} size="sm" />
              </div>
            );
          })}
        </div>
      </div>

      {/* WCAG by component category */}
      <div className="control-section">
        <div className="control-section__header">
          <h2 className="control-section__title">Score by Category</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {wcagData.map((d) => {
            const badgeVariant = d.score >= 98 ? 'success' : d.score >= 94 ? 'warning' : 'error';
            return (
              <div key={d.category} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-fg-secondary)',
                    width: '100px',
                    flexShrink: 0,
                  }}
                >
                  {d.category}
                </span>
                <div style={{ flex: 1 }}>
                  <ProgressBar
                    value={d.score}
                    variant={d.score >= 94 ? 'striped' : 'default'}
                    size="sm"
                  />
                </div>
                <Badge variant={badgeVariant} size="sm">
                  {d.score}%
                </Badge>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contrast matrix note */}
      <div className="control-section">
        <div className="control-section__header">
          <h2 className="control-section__title">Contrast Coverage</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { pair: 'Text on page background', ratio: '9.4:1', grade: 'AAA' },
            { pair: 'Text on surface', ratio: '8.7:1', grade: 'AAA' },
            { pair: 'Secondary text on page', ratio: '4.8:1', grade: 'AA' },
            { pair: 'Primary action on page', ratio: '4.6:1', grade: 'AA' },
            { pair: 'Focus ring on background', ratio: '3.2:1', grade: 'AA UI' },
          ].map((row) => (
            <div
              key={row.pair}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                background: 'var(--color-bg-subtle)',
                borderRadius: '6px',
              }}
            >
              <span style={{ fontSize: '12px', flex: 1 }}>{row.pair}</span>
              <span
                className="control-mono"
                style={{ fontSize: '12px', color: 'var(--color-fg-secondary)' }}
              >
                {row.ratio}
              </span>
              <Badge variant="success" size="sm">
                {row.grade}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
