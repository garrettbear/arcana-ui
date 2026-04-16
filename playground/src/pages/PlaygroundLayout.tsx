/**
 * PlaygroundLayout — shared layout wrapper for all /playground/* routes.
 * Provides the top navigation bar, theme persistence, and breadcrumb navigation.
 */

import { Breadcrumb, BreadcrumbItem, ToastProvider } from '@arcana-ui/core';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { GeneratedThemeChip } from '../components/GeneratedThemeChip';
import { Settings } from '../components/Settings';
import { clearActiveGeneratedName, getActiveGeneratedName } from '../utils/generateTheme';
import { PRESETS, type PresetId, applyPreset } from '../utils/presets';
import styles from './PlaygroundLayout.module.css';

const NAV_ITEMS = [
  { path: '/playground', label: 'Editor', exact: true },
  { path: '/playground/components', label: 'Components' },
  { path: '/playground/tokens', label: 'Tokens' },
  { path: '/playground/graph', label: 'Graph' },
];

function ThemeSwitcherBar({
  activePresetId,
  onPresetChange,
}: {
  activePresetId: PresetId;
  onPresetChange: (id: PresetId) => void;
}) {
  return (
    <div className={styles.themeSwitcher}>
      <span className={styles.themeSwitcherLabel}>Theme:</span>
      <div className={styles.themeChips}>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            className={`${styles.themeChip} ${activePresetId === p.id ? styles.themeChipActive : ''}`}
            onClick={() => onPresetChange(p.id)}
            title={p.label}
          >
            <span className={styles.themeChipEmoji}>{p.emoji}</span>
            <span className={styles.themeChipLabel}>{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function BreadcrumbNav() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs: Array<{ label: string; path: string }> = [];
  let currentPath = '';

  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;
    let label = segments[i];
    // Capitalize and format
    if (label === 'playground') label = 'Playground';
    else if (label === 'components') label = 'Components';
    else if (label === 'tokens') label = 'Tokens';
    else if (label === 'graph') label = 'Graph';
    else {
      // Component or token name — capitalize
      label = label
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    crumbs.push({ label, path: currentPath });
  }

  return (
    <div className={styles.breadcrumbBar}>
      <Breadcrumb>
        {crumbs.map((crumb, i) => (
          <BreadcrumbItem key={crumb.path} active={i === crumbs.length - 1}>
            {i < crumbs.length - 1 ? <Link to={crumb.path}>{crumb.label}</Link> : crumb.label}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </div>
  );
}

export default function PlaygroundLayout() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Theme state — persists across routes
  const initialTheme = (searchParams.get('theme') as PresetId) || 'light';
  const validPresetIds = PRESETS.map((p) => p.id);
  const [activePresetId, setActivePresetId] = useState<PresetId>(
    validPresetIds.includes(initialTheme) ? initialTheme : 'light',
  );
  const [generatedName, setGeneratedName] = useState<string | null>(() => getActiveGeneratedName());

  useEffect(() => {
    const themeParam = searchParams.get('theme') as PresetId | null;
    if (themeParam && validPresetIds.includes(themeParam)) {
      const preset = PRESETS.find((p) => p.id === themeParam);
      if (preset) {
        applyPreset(preset);
        setActivePresetId(themeParam);
      }
    } else {
      // Apply default theme
      const preset = PRESETS.find((p) => p.id === activePresetId);
      if (preset) applyPreset(preset);
    }
  }, []);

  const handlePresetChange = (id: PresetId) => {
    setActivePresetId(id);
    const preset = PRESETS.find((p) => p.id === id);
    if (preset) applyPreset(preset);
    // A named preset replaces any generated overlay, so the chip is no
    // longer accurate.
    if (generatedName) {
      clearActiveGeneratedName();
      setGeneratedName(null);
    }
    // Update URL param
    const newParams = new URLSearchParams(searchParams);
    newParams.set('theme', id);
    setSearchParams(newParams, { replace: true });
  };

  const handleClearGenerated = () => {
    clearActiveGeneratedName();
    setGeneratedName(null);
    const lightPreset = PRESETS.find((p) => p.id === 'light');
    if (lightPreset) applyPreset(lightPreset);
    setActivePresetId('light');
    const newParams = new URLSearchParams(searchParams);
    newParams.set('theme', 'light');
    setSearchParams(newParams, { replace: true });
  };

  // Determine if we're on the main editor route (exact /playground)
  const isEditorRoute = location.pathname === '/playground' || location.pathname === '/playground/';

  // Find active nav index
  const activeNavIndex = isEditorRoute
    ? 0
    : NAV_ITEMS.findIndex((item) => !item.exact && location.pathname.startsWith(item.path));

  return (
    <ToastProvider>
      <div className={styles.layout}>
        {/* Top navigation */}
        <header className={styles.topbar}>
          <Link to="/" className={styles.brand}>
            <span className={styles.brandLogo} role="img" aria-label="Arcana" />
            <span className={styles.brandVersion}>v0.1.0</span>
          </Link>

          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact
                ? isEditorRoute
                : !isEditorRoute && location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.topbarSpacer} />

          {generatedName && (
            <GeneratedThemeChip name={generatedName} onClear={handleClearGenerated} />
          )}

          <Settings />

          <ThemeSwitcherBar activePresetId={activePresetId} onPresetChange={handlePresetChange} />
        </header>

        {/* Breadcrumb — only show on detail pages */}
        {!isEditorRoute && <BreadcrumbNav />}

        {/* Page content */}
        <main className={styles.content}>
          <Outlet context={{ activePresetId, onPresetChange: handlePresetChange }} />
        </main>
      </div>
    </ToastProvider>
  );
}
