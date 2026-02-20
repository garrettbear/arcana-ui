import React, { useState, useEffect, useCallback } from 'react'
import styles from './AccessibilityPanel.module.css'
import { contrastRatio, wcagLevel, suggestFix } from '../utils/contrast'

function getCSSVar(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
}

// ─── Contrast pairs to evaluate ──────────────────────────────────────────────

interface ContrastPair {
  label: string
  fgVar: string
  bgVar: string
}

const CONTRAST_PAIRS: ContrastPair[] = [
  {
    label: 'Body text / Background',
    fgVar: '--arcana-text-primary',
    bgVar: '--arcana-surface-primary',
  },
  {
    label: 'Secondary text / Background',
    fgVar: '--arcana-text-secondary',
    bgVar: '--arcana-surface-primary',
  },
  {
    label: 'Muted text / Background',
    fgVar: '--arcana-text-muted',
    bgVar: '--arcana-surface-primary',
  },
  {
    label: 'Body text / Secondary surface',
    fgVar: '--arcana-text-primary',
    bgVar: '--arcana-surface-secondary',
  },
  {
    label: 'Body text / Card surface',
    fgVar: '--arcana-text-primary',
    bgVar: '--arcana-surface-elevated',
  },
  {
    label: 'Button label / Primary',
    fgVar: '--arcana-text-on-action',
    bgVar: '--arcana-action-primary',
  },
  {
    label: 'Button label / Danger',
    fgVar: '--arcana-text-on-danger',
    bgVar: '--arcana-action-danger',
  },
  {
    label: 'Success text / Success bg',
    fgVar: '--arcana-feedback-success-text',
    bgVar: '--arcana-feedback-success-bg',
  },
  {
    label: 'Warning text / Warning bg',
    fgVar: '--arcana-feedback-warning-text',
    bgVar: '--arcana-feedback-warning-bg',
  },
  {
    label: 'Error text / Error bg',
    fgVar: '--arcana-feedback-error-text',
    bgVar: '--arcana-feedback-error-bg',
  },
  {
    label: 'Info text / Info bg',
    fgVar: '--arcana-feedback-info-text',
    bgVar: '--arcana-feedback-info-bg',
  },
  {
    label: 'Border / Background',
    fgVar: '--arcana-border-default',
    bgVar: '--arcana-surface-primary',
  },
]

// ─── Color blindness filters ──────────────────────────────────────────────────

type CBFilter = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'

const CB_FILTERS: Array<{ id: CBFilter; label: string; matrix: string }> = [
  { id: 'none', label: 'Normal', matrix: '' },
  {
    id: 'protanopia',
    label: 'Protanopia',
    matrix:
      '0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0',
  },
  {
    id: 'deuteranopia',
    label: 'Deuteranopia',
    matrix:
      '0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0',
  },
  {
    id: 'tritanopia',
    label: 'Tritanopia',
    matrix:
      '0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0',
  },
  {
    id: 'achromatopsia',
    label: 'Achromat.',
    matrix:
      '0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0,0,0,1,0',
  },
]

// ─── Types ───────────────────────────────────────────────────────────────────

interface CheckResult {
  label: string
  fgColor: string
  bgColor: string
  ratio: number | null
  level: 'AAA' | 'AA' | 'Fail' | 'N/A'
  fixSuggestion: string | null
}

// ─── SVG filter injection ─────────────────────────────────────────────────────

function injectCBFilters() {
  if (document.getElementById('arcana-cb-svg-filters')) return

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('id', 'arcana-cb-svg-filters')
  svg.setAttribute(
    'style',
    'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none'
  )
  svg.setAttribute('aria-hidden', 'true')

  svg.innerHTML = `<defs>
    ${CB_FILTERS.filter((f) => f.id !== 'none')
      .map(
        (f) => `<filter id="cb-${f.id}">
      <feColorMatrix type="matrix" values="${f.matrix}"/>
    </filter>`
      )
      .join('\n')}
  </defs>`

  document.body.appendChild(svg)
}

function applyCBFilter(filterId: CBFilter) {
  const preview = document.getElementById('preview-area')
  if (!preview) return
  if (filterId === 'none') {
    preview.style.filter = ''
  } else {
    preview.style.filter = `url(#cb-${filterId})`
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AccessibilityPanel() {
  const [results, setResults] = useState<CheckResult[]>([])
  const [activeFilter, setActiveFilter] = useState<CBFilter>('none')
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['score', 'contrast', 'colorblind'])
  )

  const computeContrasts = useCallback(() => {
    const checks: CheckResult[] = CONTRAST_PAIRS.map((pair) => {
      const fg = getCSSVar(pair.fgVar)
      const bg = getCSSVar(pair.bgVar)
      const ratio = contrastRatio(fg, bg)
      const level = ratio !== null ? wcagLevel(ratio) : 'N/A'
      const fixSuggestion =
        ratio !== null && ratio < 4.5 ? suggestFix(fg, bg) : null

      return {
        label: pair.label,
        fgColor: fg,
        bgColor: bg,
        ratio,
        level,
        fixSuggestion,
      }
    })
    setResults(checks)
  }, [])

  // Inject SVG filters once
  useEffect(() => {
    injectCBFilters()
    return () => {
      // Clean up filter when panel unmounts
      applyCBFilter('none')
    }
  }, [])

  // Watch for CSS var changes via MutationObserver
  useEffect(() => {
    computeContrasts()

    const observer = new MutationObserver(() => {
      computeContrasts()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'data-theme'],
    })

    return () => observer.disconnect()
  }, [computeContrasts])

  const handleFilterChange = (filterId: CBFilter) => {
    setActiveFilter(filterId)
    applyCBFilter(filterId)
  }

  const handleApplyFix = (varName: string, color: string) => {
    document.documentElement.style.setProperty(varName, color)
    computeContrasts()
  }

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // Compute score
  const checkable = results.filter((r) => r.level !== 'N/A')
  const passing = checkable.filter((r) => r.level !== 'Fail')
  const aaaPassing = checkable.filter((r) => r.level === 'AAA')
  const failing = checkable.filter((r) => r.level === 'Fail')

  const overallGrade =
    checkable.length === 0
      ? 'N/A'
      : aaaPassing.length === checkable.length
      ? 'AAA'
      : passing.length === checkable.length
      ? 'AA'
      : failing.length === checkable.length
      ? 'Fail'
      : 'AA*'

  const gradeColor =
    overallGrade === 'AAA'
      ? 'var(--arcana-feedback-success)'
      : overallGrade === 'AA' || overallGrade === 'AA*'
      ? 'var(--arcana-feedback-warning)'
      : 'var(--arcana-feedback-error)'

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>A11y Panel</span>
      </div>

      {/* Score card */}
      <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => toggleSection('score')}>
          <span className={styles.toggle}>{openSections.has('score') ? '▾' : '▸'}</span>
          <span className={styles.sectionLabel}>A11y Score</span>
        </button>
        {openSections.has('score') && (
          <div className={styles.scoreCard}>
            <div className={styles.gradeDisplay} style={{ color: gradeColor }}>
              {overallGrade}
            </div>
            <div className={styles.scoreStats}>
              <div className={styles.scoreStat}>
                <span className={styles.scoreNum} style={{ color: 'var(--arcana-feedback-success)' }}>
                  {passing.length}
                </span>
                <span className={styles.scoreStatLabel}>Passing</span>
              </div>
              <div className={styles.scoreDivider} />
              <div className={styles.scoreStat}>
                <span className={styles.scoreNum} style={{ color: 'var(--arcana-feedback-error)' }}>
                  {failing.length}
                </span>
                <span className={styles.scoreStatLabel}>Failing</span>
              </div>
              <div className={styles.scoreDivider} />
              <div className={styles.scoreStat}>
                <span className={styles.scoreNum}>{checkable.length}</span>
                <span className={styles.scoreStatLabel}>Total</span>
              </div>
            </div>
            {checkable.length > 0 && (
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${(passing.length / checkable.length) * 100}%`,
                    background:
                      passing.length === checkable.length
                        ? 'var(--arcana-feedback-success)'
                        : 'var(--arcana-feedback-warning)',
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contrast checker */}
      <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => toggleSection('contrast')}>
          <span className={styles.toggle}>{openSections.has('contrast') ? '▾' : '▸'}</span>
          <span className={styles.sectionLabel}>Contrast Ratios</span>
        </button>
        {openSections.has('contrast') && (
          <div className={styles.contrastTable}>
            {results.map((result) => (
              <div key={result.label} className={styles.contrastRow}>
                <div className={styles.contrastSwatches}>
                  <div
                    className={styles.swatch}
                    style={{ background: result.bgColor, border: '1px solid var(--arcana-border-default)' }}
                    title={result.bgColor}
                  />
                  <div
                    className={styles.swatch}
                    style={{ background: result.fgColor, border: '1px solid var(--arcana-border-default)' }}
                    title={result.fgColor}
                  />
                </div>
                <div className={styles.contrastInfo}>
                  <span className={styles.contrastLabel}>{result.label}</span>
                  <div className={styles.contrastBadges}>
                    <span className={styles.ratioText}>
                      {result.ratio !== null ? `${result.ratio.toFixed(1)}:1` : '—'}
                    </span>
                    {result.level !== 'N/A' && (
                      <>
                        <span
                          className={`${styles.badge} ${
                            result.level !== 'Fail' ? styles.badgePass : styles.badgeFail
                          }`}
                        >
                          AA {result.level !== 'Fail' ? '✓' : '✗'}
                        </span>
                        <span
                          className={`${styles.badge} ${
                            result.level === 'AAA' ? styles.badgePass : styles.badgeFail
                          }`}
                        >
                          AAA {result.level === 'AAA' ? '✓' : '✗'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Color blindness simulator */}
      <div className={styles.section}>
        <button className={styles.sectionHeader} onClick={() => toggleSection('colorblind')}>
          <span className={styles.toggle}>{openSections.has('colorblind') ? '▾' : '▸'}</span>
          <span className={styles.sectionLabel}>Color Blindness</span>
        </button>
        {openSections.has('colorblind') && (
          <div className={styles.cbGrid}>
            {CB_FILTERS.map((filter) => (
              <button
                key={filter.id}
                className={`${styles.cbBtn} ${activeFilter === filter.id ? styles.cbActive : ''}`}
                onClick={() => handleFilterChange(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Auto-fix suggestions */}
      {failing.length > 0 && (
        <div className={styles.section}>
          <button className={styles.sectionHeader} onClick={() => toggleSection('fixes')}>
            <span className={styles.toggle}>{openSections.has('fixes') ? '▾' : '▸'}</span>
            <span className={styles.sectionLabel}>
              Auto-Fix ({failing.length} issue{failing.length !== 1 ? 's' : ''})
            </span>
          </button>
          {openSections.has('fixes') && (
            <div className={styles.fixList}>
              {results
                .filter((r) => r.level === 'Fail' && r.fixSuggestion)
                .map((result) => {
                  // Find the fg var name
                  const pair = CONTRAST_PAIRS.find((p) => p.label === result.label)
                  return (
                    <div key={result.label} className={styles.fixItem}>
                      <div className={styles.fixLabel}>{result.label}</div>
                      <div className={styles.fixDetails}>
                        <span className={styles.fixRatio}>
                          {result.ratio?.toFixed(1)}:1 → needs 4.5:1
                        </span>
                        {result.fixSuggestion && (
                          <div className={styles.fixSuggestion}>
                            <div
                              className={styles.fixSwatch}
                              style={{ background: result.fixSuggestion }}
                            />
                            <span className={styles.fixColor}>{result.fixSuggestion}</span>
                            {pair && (
                              <button
                                className={styles.fixApplyBtn}
                                onClick={() =>
                                  handleApplyFix(pair.fgVar, result.fixSuggestion!)
                                }
                              >
                                Apply
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
