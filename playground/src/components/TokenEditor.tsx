import React, { useState, useEffect, useCallback } from 'react'
import styles from './TokenEditor.module.css'
import { PRESETS, ThemePreset, PresetId, applyPreset, getCSSVar } from '../utils/presets'
import { toHex } from '../utils/contrast'

// ─── Token groups displayed in the editor ────────────────────────────────────

const TOKEN_GROUPS: Array<{
  label: string
  tokens: Array<{ label: string; var: string }>
}> = [
  {
    label: 'Surface',
    tokens: [
      { label: 'Background', var: '--arcana-surface-primary' },
      { label: 'Secondary', var: '--arcana-surface-secondary' },
      { label: 'Card / Elevated', var: '--arcana-surface-elevated' },
    ],
  },
  {
    label: 'Action',
    tokens: [
      { label: 'Primary', var: '--arcana-action-primary' },
      { label: 'Primary Hover', var: '--arcana-action-primary-hover' },
      { label: 'Danger', var: '--arcana-action-danger' },
    ],
  },
  {
    label: 'Text',
    tokens: [
      { label: 'Primary', var: '--arcana-text-primary' },
      { label: 'Secondary', var: '--arcana-text-secondary' },
      { label: 'Muted', var: '--arcana-text-muted' },
      { label: 'On Action', var: '--arcana-text-on-action' },
    ],
  },
  {
    label: 'Border',
    tokens: [
      { label: 'Default', var: '--arcana-border-default' },
      { label: 'Focus Ring', var: '--arcana-border-focus' },
    ],
  },
  {
    label: 'Feedback',
    tokens: [
      { label: 'Success', var: '--arcana-feedback-success' },
      { label: 'Warning', var: '--arcana-feedback-warning' },
      { label: 'Error', var: '--arcana-feedback-error' },
      { label: 'Info', var: '--arcana-feedback-info' },
    ],
  },
]

const ALL_EDITOR_VARS = TOKEN_GROUPS.flatMap((g) => g.tokens.map((t) => t.var))

const FONT_OPTIONS = [
  {
    label: 'Inter (default)',
    value: "Inter, system-ui, -apple-system, sans-serif",
  },
  {
    label: 'Monospace',
    value: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace",
  },
  {
    label: 'Serif',
    value: "Georgia, 'Times New Roman', Times, serif",
  },
  {
    label: 'System UI',
    value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  {
    label: 'Humanist',
    value: "'Gill Sans', 'Trebuchet MS', Verdana, Geneva, sans-serif",
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readCurrentValues(): Record<string, string> {
  const result: Record<string, string> = {}
  for (const varName of ALL_EDITOR_VARS) {
    result[varName] = getCSSVar(varName)
  }
  return result
}

function detectFontOption(currentSansFamily: string): string {
  const trimmed = currentSansFamily.trim().toLowerCase()
  for (const opt of FONT_OPTIONS) {
    if (opt.value.toLowerCase().startsWith(trimmed.slice(0, 6))) return opt.value
  }
  return FONT_OPTIONS[0].value
}

// ─── Component ───────────────────────────────────────────────────────────────

interface TokenEditorProps {
  activePresetId: PresetId
  onPresetChange: (id: PresetId) => void
}

export function TokenEditor({ activePresetId, onPresetChange }: TokenEditorProps) {
  const [tokenValues, setTokenValues] = useState<Record<string, string>>({})
  const [radius, setRadius] = useState(8)
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value)
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['Surface', 'Action', 'Text']))
  const [copied, setCopied] = useState(false)

  // Read values from CSS custom properties (computed style)
  const refreshValues = useCallback(() => {
    const values = readCurrentValues()
    setTokenValues(values)

    const r = getCSSVar('--arcana-component-radius')
    setRadius(parseInt(r) || 8)

    const sans = getCSSVar('--arcana-typography-font-family-sans')
    setFontFamily(detectFontOption(sans))
  }, [])

  useEffect(() => {
    // Small delay so the CSS has applied before we read it
    const timer = setTimeout(refreshValues, 50)
    return () => clearTimeout(timer)
  }, [activePresetId, refreshValues])

  const handlePresetSelect = (preset: ThemePreset) => {
    applyPreset(preset)
    onPresetChange(preset.id)
  }

  const handleColorChange = (varName: string, value: string) => {
    setTokenValues((prev) => ({ ...prev, [varName]: value }))
    document.documentElement.style.setProperty(varName, value)
  }

  const handleRadiusChange = (value: number) => {
    setRadius(value)
    document.documentElement.style.setProperty('--arcana-component-radius', `${value}px`)
  }

  const handleFontChange = (value: string) => {
    setFontFamily(value)
    document.documentElement.style.setProperty('--arcana-typography-font-family-sans', value)
  }

  const handleReset = () => {
    const lightPreset = PRESETS.find((p) => p.id === 'light')!
    applyPreset(lightPreset)
    onPresetChange('light')
  }

  const handleExport = async () => {
    const exportObj: Record<string, string> = {}
    for (const varName of ALL_EDITOR_VARS) {
      exportObj[varName] = getCSSVar(varName)
    }
    exportObj['--arcana-component-radius'] = `${radius}px`
    exportObj['--arcana-typography-font-family-sans'] = fontFamily

    const json = JSON.stringify(exportObj, null, 2)
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `arcana-theme-${activePresetId}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  return (
    <div className={styles.editor}>
      {/* Header */}
      <div className={styles.editorHeader}>
        <span className={styles.editorTitle}>Token Editor</span>
      </div>

      {/* Preset grid */}
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Theme Presets</p>
        <div className={styles.presetGrid}>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              className={`${styles.presetBtn} ${activePresetId === preset.id ? styles.presetActive : ''}`}
              onClick={() => handlePresetSelect(preset)}
              title={preset.description}
            >
              <span className={styles.presetEmoji}>{preset.emoji}</span>
              <span className={styles.presetLabel}>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color token groups */}
      {TOKEN_GROUPS.map((group) => (
        <div key={group.label} className={styles.section}>
          <button
            className={styles.groupHeader}
            onClick={() => toggleGroup(group.label)}
          >
            <span className={styles.groupToggle}>
              {openGroups.has(group.label) ? '▾' : '▸'}
            </span>
            <span className={styles.sectionLabel}>{group.label} Colors</span>
          </button>

          {openGroups.has(group.label) && (
            <div className={styles.tokenList}>
              {group.tokens.map((token) => {
                const currentVal = tokenValues[token.var] ?? '#000000'
                const hexVal = toHex(currentVal)
                return (
                  <div key={token.var} className={styles.tokenRow}>
                    <label className={styles.tokenLabel}>{token.label}</label>
                    <div className={styles.tokenInputs}>
                      <input
                        type="color"
                        className={styles.colorPicker}
                        value={hexVal}
                        onChange={(e) => handleColorChange(token.var, e.target.value)}
                      />
                      <span className={styles.colorValue}>{hexVal.toUpperCase()}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}

      {/* Shape & Typography */}
      <div className={styles.section}>
        <button className={styles.groupHeader} onClick={() => toggleGroup('shape')}>
          <span className={styles.groupToggle}>{openGroups.has('shape') ? '▾' : '▸'}</span>
          <span className={styles.sectionLabel}>Shape & Type</span>
        </button>

        {openGroups.has('shape') && (
          <div className={styles.tokenList}>
            <div className={styles.sliderRow}>
              <label className={styles.tokenLabel}>Border Radius</label>
              <div className={styles.sliderControl}>
                <input
                  type="range"
                  className={styles.slider}
                  min={0}
                  max={24}
                  step={1}
                  value={radius}
                  onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                />
                <span className={styles.sliderValue}>{radius}px</span>
              </div>
            </div>

            <div className={styles.tokenRow}>
              <label className={styles.tokenLabel}>Font Family</label>
              <select
                className={styles.fontSelect}
                value={fontFamily}
                onChange={(e) => handleFontChange(e.target.value)}
              >
                {FONT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={handleReset}>
          Reset
        </button>
        <button
          className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
          onClick={handleExport}
        >
          {copied ? '✓ Copied!' : 'Export JSON'}
        </button>
      </div>
    </div>
  )
}
