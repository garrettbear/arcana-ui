import { Badge, Button, Drawer, ProgressBar } from '@arcana-ui/core';
import type { ComponentEntry } from '../data/components';

interface ComponentDrawerProps {
  component: ComponentEntry | null;
  open: boolean;
  onClose: () => void;
}

export function ComponentDrawer({
  component,
  open,
  onClose,
}: ComponentDrawerProps): React.JSX.Element {
  if (!component) {
    return <Drawer open={false} onClose={onClose} side="right" size="md" />;
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="right"
      size="md"
      title={component.name}
      footer={
        <Button
          variant="ghost"
          onClick={() =>
            window.open(`/playground/components/${component.name.toLowerCase()}`, '_blank')
          }
        >
          View in Playground
        </Button>
      }
    >
      <div className="control-drawer-section">
        <div className="control-drawer-section__title">Import</div>
        <div className="control-code-block">
          <code>{`import { ${component.name} } from '@arcana-ui/core';`}</code>
        </div>
      </div>

      <div className="control-drawer-section">
        <div className="control-drawer-section__title">Details</div>
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-2, 8px)',
            flexWrap: 'wrap',
            marginBottom: 'var(--spacing-3, 12px)',
          }}
        >
          <Badge variant="secondary">{component.category}</Badge>
          <Badge variant="info">{component.tokenCount} tokens</Badge>
          <Badge variant="info">{component.bundleSize}</Badge>
        </div>
        <div
          style={{ fontSize: 'var(--font-size-sm, 0.875rem)', color: 'var(--color-fg-secondary)' }}
        >
          Last updated: {component.lastUpdated}
        </div>
      </div>

      <div className="control-drawer-section">
        <div className="control-drawer-section__title">Test Coverage</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <ProgressBar
              value={component.testCoverage}
              variant={component.testCoverage >= 95 ? 'striped' : 'default'}
              size="sm"
            />
          </div>
          <Badge
            variant={
              component.testCoverage >= 95
                ? 'success'
                : component.testCoverage >= 90
                  ? 'warning'
                  : 'error'
            }
            size="sm"
          >
            {component.testCoverage}%
          </Badge>
        </div>
      </div>

      <div className="control-drawer-section">
        <div className="control-drawer-section__title">WCAG Score</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <ProgressBar
              value={component.wcagScore}
              variant={component.wcagScore >= 95 ? 'striped' : 'default'}
              size="sm"
            />
          </div>
          <Badge
            variant={
              component.wcagScore >= 98
                ? 'success'
                : component.wcagScore >= 94
                  ? 'warning'
                  : 'error'
            }
            size="sm"
          >
            {component.wcagScore}%
          </Badge>
        </div>
      </div>
    </Drawer>
  );
}
