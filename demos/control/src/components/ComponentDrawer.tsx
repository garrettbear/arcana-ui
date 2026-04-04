import { Badge, Button, CopyButton, Drawer } from '@arcana-ui/core';
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
      description={component.description}
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
          <code>{component.importPath}</code>
          <CopyButton value={component.importPath} variant="ghost" size="sm" />
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
          <Badge variant="info">{component.props} props</Badge>
          <Badge variant="info">
            {component.variants} variant{component.variants !== 1 ? 's' : ''}
          </Badge>
          {component.tests && <Badge variant="success">Tests ✓</Badge>}
          {component.manifest && <Badge variant="success">Manifest ✓</Badge>}
        </div>
        <div
          style={{ fontSize: 'var(--font-size-sm, 0.875rem)', color: 'var(--color-fg-secondary)' }}
        >
          Last updated: {component.lastUpdated}
        </div>
      </div>

      <div className="control-drawer-section">
        <div className="control-drawer-section__title">Props</div>
        <table className="control-props-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {component.propsList.map((prop) => (
              <tr key={prop.name}>
                <td>{prop.name}</td>
                <td>{prop.type}</td>
                <td
                  style={{
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: 'var(--font-size-xs, 0.75rem)',
                  }}
                >
                  {prop.default}
                </td>
                <td style={{ color: 'var(--color-fg-secondary)' }}>{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Drawer>
  );
}
