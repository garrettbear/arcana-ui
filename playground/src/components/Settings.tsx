/**
 * Settings — BYOK (Bring Your Own Key) control for the playground topbar.
 *
 * Renders a gear button that opens a Popover with an input for the user's
 * Anthropic API key, plus Test and Clear actions. When a key is stored, a
 * small "Your key" Badge appears next to the gear so the state is visible
 * at a glance.
 *
 * The key lives only in localStorage (`arcana-user-anthropic-key`) and is
 * forwarded to /api/generate-theme via the X-User-API-Key header, which
 * bypasses the shared-key origin gate and rate limits.
 */

import { Badge, Button, Input, useToast } from '@arcana-ui/core';
import { Popover } from '@arcana-ui/core';
import { useState } from 'react';
import {
  clearStoredApiKey,
  generateTheme,
  getStoredApiKey,
  setStoredApiKey,
} from '../utils/generateTheme';
import styles from './Settings.module.css';

function GearIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function EyeIcon({ off = false }: { off?: boolean }) {
  if (off) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </svg>
    );
  }
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SettingsPanel({
  initialKey,
  onSaved,
  onCleared,
}: {
  initialKey: string;
  onSaved: () => void;
  onCleared: () => void;
}) {
  const { toast } = useToast();
  const [value, setValue] = useState(initialKey);
  const [reveal, setReveal] = useState(false);
  const [testing, setTesting] = useState(false);

  const trimmed = value.trim();
  const isDirty = trimmed !== initialKey.trim();
  const canTest = trimmed.length > 0 && !testing;

  async function handleTest() {
    if (!canTest) return;
    setTesting(true);
    try {
      await generateTheme(
        { description: 'quiet minimal test theme', count: 1, model: 'haiku' },
        { apiKey: trimmed },
      );
      // Success path persists the key, since we know it works.
      setStoredApiKey(trimmed);
      toast({
        title: 'Key saved',
        description: 'Your Anthropic key works. It will be used for future generations.',
        variant: 'success',
      });
      onSaved();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: 'Key did not work',
        description: message,
        variant: 'error',
        duration: 7000,
      });
    } finally {
      setTesting(false);
    }
  }

  function handleClear() {
    clearStoredApiKey();
    setValue('');
    toast({
      title: 'Key cleared',
      description: 'Shared rate limits will apply again.',
      variant: 'default',
    });
    onCleared();
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Anthropic API key</h3>
        <p className={styles.subtitle}>
          Stored only in this browser. Using your own key skips the shared rate limit.
        </p>
      </div>

      <div className={styles.field}>
        <Input
          type={reveal ? 'text' : 'password'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="sk-ant-..."
          autoComplete="off"
          spellCheck={false}
          fullWidth
          aria-label="Anthropic API key"
          suffix={
            <button
              type="button"
              onClick={() => setReveal((r) => !r)}
              className={styles.revealButton}
              aria-label={reveal ? 'Hide key' : 'Show key'}
              aria-pressed={reveal}
            >
              <EyeIcon off={reveal} />
            </button>
          }
        />
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          size="sm"
          onClick={handleTest}
          loading={testing}
          disabled={!canTest}
        >
          {isDirty || !initialKey ? 'Test and save' : 'Re-test key'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          disabled={testing || (!initialKey && !value)}
        >
          Clear key
        </Button>
      </div>

      <p className={styles.hint}>
        Get a key at{' '}
        <a
          href="https://console.anthropic.com/settings/keys"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          console.anthropic.com
        </a>
        . Your key never leaves your browser except when forwarded to our edge function for a
        generation request.
      </p>
    </div>
  );
}

export function Settings() {
  // Read once on mount. hasKey is a coarse signal for the badge next to the
  // gear; the panel owns its own editable draft so typing does not change
  // the badge until a Save or Clear action resolves.
  const [hasKey, setHasKey] = useState<boolean>(() => Boolean(getStoredApiKey()));
  const [open, setOpen] = useState(false);

  const handleSaved = () => setHasKey(true);
  const handleCleared = () => setHasKey(false);

  const trigger = (
    <div className={styles.triggerRow}>
      <Button
        size="icon"
        variant="ghost"
        aria-label="Settings"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={styles.gearButton}
      >
        <GearIcon />
      </Button>
      {hasKey && (
        <Badge variant="success" size="sm" dot>
          Your key
        </Badge>
      )}
    </div>
  );

  return (
    <Popover
      trigger={trigger}
      content={
        <SettingsPanel
          // Remount when hasKey flips so the panel reads the fresh storage
          // value without reaching across the boundary with a ref.
          key={hasKey ? 'with-key' : 'no-key'}
          initialKey={getStoredApiKey() ?? ''}
          onSaved={handleSaved}
          onCleared={handleCleared}
        />
      }
      side="bottom"
      align="end"
      open={open}
      onOpenChange={setOpen}
      className={styles.popover}
    />
  );
}
