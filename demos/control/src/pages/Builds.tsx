import {
  Badge,
  Modal,
  ProgressBar,
  ScrollArea,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@arcana-ui/core';
import { useState } from 'react';
import { buildData } from '../data/builds';
import type { BuildEntry } from '../data/builds';

function getBadgeVariant(status: string): 'success' | 'warning' | 'error' {
  if (status === 'success') return 'success';
  if (status === 'warning') return 'warning';
  return 'error';
}

function getTestPassRate(tests: string): number {
  if (tests === '—' || tests.includes('failed')) return 0;
  const match = tests.match(/^(\d+)\/(\d+)$/);
  if (match) return (Number(match[1]) / Number(match[2])) * 100;
  return 0;
}

export function Builds(): React.JSX.Element {
  const [selectedBuild, setSelectedBuild] = useState<BuildEntry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const handleRowClick = (build: BuildEntry): void => {
    setSelectedBuild(build);
    setModalOpen(true);
    setShowLogs(false);
    setTimeout(() => setShowLogs(true), 600);
  };

  return (
    <div>
      <div className="control-page-header">
        <div className="control-page-header__left">
          <h1 className="control-page-header__title">Build History</h1>
          <span className="control-page-header__subtitle">{buildData.length} builds tracked</span>
        </div>
      </div>

      <table className="control-props-table">
        <thead>
          <tr>
            <th>Build</th>
            <th>Trigger</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Components</th>
            <th>Tests</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {buildData.map((build) => (
            <tr
              key={build.id}
              className="control-row-clickable"
              onClick={() => handleRowClick(build)}
              style={{ cursor: 'pointer' }}
              tabIndex={0}
              aria-label={`View details for build #${build.id}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRowClick(build);
                }
              }}
            >
              <td style={{ fontFamily: 'var(--font-family-mono)' }}>#{build.id}</td>
              <td>{build.trigger}</td>
              <td>
                <Badge variant={getBadgeVariant(build.status)} size="sm" dot>
                  {build.status}
                </Badge>
              </td>
              <td style={{ fontFamily: 'var(--font-family-mono)' }}>{build.duration}</td>
              <td>{build.components}</td>
              <td>
                <span>{build.tests}</span>
                {build.status === 'failed' && build.tests.includes('failed') && (
                  <ProgressBar
                    value={0}
                    max={100}
                    size="sm"
                    color="error"
                    style={{ marginTop: 'var(--spacing-1, 4px)', maxWidth: '120px' }}
                  />
                )}
                {build.status !== 'failed' && getTestPassRate(build.tests) === 100 && (
                  <ProgressBar
                    value={100}
                    max={100}
                    size="sm"
                    color="success"
                    style={{ marginTop: 'var(--spacing-1, 4px)', maxWidth: '120px' }}
                  />
                )}
              </td>
              <td style={{ color: 'var(--color-fg-secondary)' }}>{build.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedBuild ? `Build #${selectedBuild.id}` : ''}
        size="lg"
      >
        {selectedBuild && (
          <div>
            <dl className="control-build-meta">
              <dt>Status</dt>
              <dd>
                <Badge variant={getBadgeVariant(selectedBuild.status)} size="sm" dot>
                  {selectedBuild.status}
                </Badge>
              </dd>
              <dt>Trigger</dt>
              <dd>{selectedBuild.trigger}</dd>
              <dt>Duration</dt>
              <dd style={{ fontFamily: 'var(--font-family-mono)' }}>{selectedBuild.duration}</dd>
              <dt>Components</dt>
              <dd>{selectedBuild.components}</dd>
              <dt>Tests</dt>
              <dd>{selectedBuild.tests}</dd>
              <dt>Date</dt>
              <dd>{selectedBuild.date}</dd>
            </dl>

            <Tabs defaultValue="summary" variant="line">
              <TabList>
                <Tab value="summary">Summary</Tab>
                <Tab value="logs">Logs</Tab>
                <Tab value="artifacts">Artifacts</Tab>
              </TabList>
              <TabPanels>
                <TabPanel value="summary">
                  <div style={{ marginTop: 'var(--spacing-4, 16px)' }}>
                    {selectedBuild.status !== 'failed' ? (
                      <div>
                        <p
                          style={{
                            color: 'var(--color-fg-secondary)',
                            fontSize: 'var(--font-size-sm, 0.875rem)',
                            marginBottom: 'var(--spacing-3, 12px)',
                          }}
                        >
                          Build completed in {selectedBuild.duration}. All {selectedBuild.tests}{' '}
                          tests passed.
                        </p>
                        <ProgressBar
                          value={100}
                          max={100}
                          color="success"
                          showValue
                          label="Test pass rate"
                        />
                      </div>
                    ) : (
                      <div>
                        <p
                          style={{
                            color: 'var(--color-fg-secondary)',
                            fontSize: 'var(--font-size-sm, 0.875rem)',
                            marginBottom: 'var(--spacing-3, 12px)',
                          }}
                        >
                          Build failed. {selectedBuild.tests}.
                        </p>
                        <ProgressBar
                          value={0}
                          max={100}
                          color="error"
                          showValue
                          label="Test pass rate"
                        />
                      </div>
                    )}
                  </div>
                </TabPanel>
                <TabPanel value="logs">
                  <div style={{ marginTop: 'var(--spacing-4, 16px)' }}>
                    {!showLogs ? (
                      <div>
                        <Skeleton variant="text" lines={8} />
                      </div>
                    ) : (
                      <ScrollArea maxHeight="400px">
                        <pre className="control-build-log">{selectedBuild.logs}</pre>
                      </ScrollArea>
                    )}
                  </div>
                </TabPanel>
                <TabPanel value="artifacts">
                  <div
                    style={{
                      marginTop: 'var(--spacing-4, 16px)',
                      color: 'var(--color-fg-secondary)',
                      fontSize: 'var(--font-size-sm, 0.875rem)',
                    }}
                  >
                    <p>Build artifacts:</p>
                    <ul
                      style={{
                        marginTop: 'var(--spacing-2, 8px)',
                        paddingLeft: 'var(--spacing-4, 16px)',
                      }}
                    >
                      <li
                        style={{
                          fontFamily: 'var(--font-family-mono)',
                          marginBottom: 'var(--spacing-1, 4px)',
                        }}
                      >
                        dist/arcana.css (42.3 KB)
                      </li>
                      <li
                        style={{
                          fontFamily: 'var(--font-family-mono)',
                          marginBottom: 'var(--spacing-1, 4px)',
                        }}
                      >
                        dist/themes/*.css (14 files)
                      </li>
                      <li
                        style={{
                          fontFamily: 'var(--font-family-mono)',
                          marginBottom: 'var(--spacing-1, 4px)',
                        }}
                      >
                        dist/index.js (128.7 KB)
                      </li>
                      <li style={{ fontFamily: 'var(--font-family-mono)' }}>
                        dist/index.d.ts (45.2 KB)
                      </li>
                    </ul>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        )}
      </Modal>
    </div>
  );
}
