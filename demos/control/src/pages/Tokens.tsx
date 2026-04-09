import {
  Badge,
  Card,
  CardBody,
  StatsBar,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Timeline,
} from '@arcana-ui/core';
import { semanticTokens, themeList, tokenStats, tokenTimeline } from '../data/tokens';

export function Tokens(): React.JSX.Element {
  return (
    <div>
      <div className="control-page-header">
        <div className="control-page-header__left">
          <h1 className="control-page-header__title">Token System</h1>
          <span className="control-page-header__subtitle">
            Three-tier architecture: Primitive → Semantic → Component
          </span>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-6, 24px)' }}>
        <StatsBar
          variant="card"
          stats={[
            { label: 'Primitives', value: tokenStats.primitives },
            { label: 'Semantic', value: tokenStats.semantic },
            { label: 'Component', value: tokenStats.component },
            { label: 'Themes', value: tokenStats.themes },
          ]}
        />
      </div>

      <Tabs defaultValue="semantic" variant="line">
        <TabList>
          <Tab value="semantic">Semantic</Tab>
          <Tab value="component">Component</Tab>
          <Tab value="themes">Themes</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="semantic">
            <table className="control-props-table" style={{ marginTop: 'var(--spacing-4, 16px)' }}>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Category</th>
                  <th>Themes</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {semanticTokens.map((token) => (
                  <tr key={token.name}>
                    <td className="control-token-name">{token.name}</td>
                    <td>
                      <Badge variant="secondary" size="sm">
                        {token.category}
                      </Badge>
                    </td>
                    <td style={{ color: 'var(--color-fg-secondary)' }}>{token.themes}</td>
                    <td style={{ color: 'var(--color-fg-secondary)' }}>{token.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabPanel>

          <TabPanel value="component">
            <div style={{ marginTop: 'var(--spacing-4, 16px)' }}>
              <Card>
                <CardBody>
                  <p
                    style={{
                      color: 'var(--color-fg-secondary)',
                      fontSize: 'var(--font-size-sm, 0.875rem)',
                    }}
                  >
                    {tokenStats.component} component-level token overrides across{' '}
                    {tokenStats.themes} themes. Component tokens allow fine-grained control over
                    individual component styling without modifying semantic tokens.
                  </p>
                  <div style={{ marginTop: 'var(--spacing-4, 16px)' }}>
                    <div className="control-code-block">
                      <code>{'--button-bg: var(--color-action-primary);'}</code>
                    </div>
                    <div
                      className="control-code-block"
                      style={{ marginTop: 'var(--spacing-2, 8px)' }}
                    >
                      <code>{'--card-shadow: var(--shadow-md);'}</code>
                    </div>
                    <div
                      className="control-code-block"
                      style={{ marginTop: 'var(--spacing-2, 8px)' }}
                    >
                      <code>{'--input-border: var(--color-border-default);'}</code>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <div style={{ marginTop: 'var(--spacing-6, 24px)' }}>
                <h3
                  className="control-section__title"
                  style={{ marginBottom: 'var(--spacing-4, 16px)' }}
                >
                  Version History
                </h3>
                <Timeline
                  variant="standard"
                  items={tokenTimeline.map((item, i) => ({
                    title: item.version,
                    description: item.description,
                    date: item.date,
                    status:
                      i === tokenTimeline.length - 1 ? ('active' as const) : ('complete' as const),
                  }))}
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel value="themes">
            <div className="control-theme-grid" style={{ marginTop: 'var(--spacing-4, 16px)' }}>
              {themeList.map((theme) => (
                <div key={theme.name} className="control-theme-card">
                  <div className="control-theme-card__swatches">
                    {theme.colors.map((color, i) => (
                      <div
                        key={`${theme.name}-${i}`}
                        className="control-theme-card__swatch"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                  <div className="control-theme-card__footer">
                    <Badge variant="secondary" size="sm">
                      {theme.name}
                    </Badge>
                    <Badge variant="success" size="sm">
                      Active
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
