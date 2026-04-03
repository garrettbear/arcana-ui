#!/usr/bin/env node
/**
 * sync-notion.mjs
 *
 * Source of truth: PROGRESS.md + CLAUDE.md (Current State section)
 * Target: Notion Roadmap DB + Sage Sessions DB
 *
 * Run at end of every session (Workflow 3).
 * Never edit Notion manually — this script owns it.
 *
 * Usage:
 *   node scripts/sync-notion.mjs
 *   node scripts/sync-notion.mjs --session "Fixed useTheme tests (PR #85)" --prs "85"
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// --- Config ---
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const ROADMAP_DB_ID = '7c68a787-413a-404a-8fc9-e0d1a5e9b51e';
const ARCANA_PAGE_ID = '3315afc4-737b-81bf-91d6-d3f1af06d0ad';
const SESSIONS_DB_ID = process.env.NOTION_SESSIONS_DB_ID || null; // set after first run creates it

if (!NOTION_API_KEY) {
  console.error('NOTION_API_KEY not set');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${NOTION_API_KEY}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

async function notion(method, path, body) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion ${method} ${path} → ${res.status}: ${err}`);
  }
  return res.json();
}

// --- Parse CLAUDE.md Current State ---
function parseClaudeState() {
  const text = readFileSync(resolve(ROOT, 'CLAUDE.md'), 'utf8');

  // Extract phase completion table
  const tableMatch = text.match(/\| Phase \| Status \| Notes \|([\s\S]*?)\n\n/);
  const phases = {};
  if (tableMatch) {
    for (const line of tableMatch[1].split('\n')) {
      const cols = line.split('|').map((s) => s.trim()).filter(Boolean);
      if (cols.length >= 2 && !cols[0].startsWith('-')) {
        const [phase, status] = cols;
        phases[phase] = status.includes('✅') ? 'Done' : status.includes('🔄') ? 'In Progress' : 'Not Started';
      }
    }
  }

  // Extract remaining work section
  const remainingMatch = text.match(/### Remaining Work([\s\S]*?)### Blockers/);
  const remaining = remainingMatch ? remainingMatch[1].trim() : '';

  // Extract blockers
  const blockersMatch = text.match(/### Blockers\n([\s\S]*?)### What the Next Agent/);
  const blockers = blockersMatch ? blockersMatch[1].trim() : 'None';

  // Extract active phase
  const activeMatch = text.match(/### Active Phase\n(.*)/);
  const activePhase = activeMatch ? activeMatch[1].trim() : '';

  return { phases, remaining, blockers, activePhase };
}

// --- Parse PROGRESS.md ---
function parseProgress() {
  const text = readFileSync(resolve(ROOT, 'PROGRESS.md'), 'utf8');
  const tasks = [];
  const phaseMap = {};
  let currentPhase = '';

  for (const line of text.split('\n')) {
    const phaseMatch = line.match(/^## (Phase .+?)(?:\s*\(.*\))?$/);
    if (phaseMatch) {
      currentPhase = phaseMatch[1];
      phaseMap[currentPhase] = { done: 0, total: 0 };
    }
    const taskMatch = line.match(/^- \[(x| )\] ([\d.A-Za-z]+) — (.+)$/);
    if (taskMatch && currentPhase) {
      const done = taskMatch[1] === 'x';
      phaseMap[currentPhase].total++;
      if (done) phaseMap[currentPhase].done++;
      tasks.push({ phase: currentPhase, id: taskMatch[2], title: taskMatch[3], done });
    }
  }

  return { tasks, phaseMap };
}

// --- Notion status mapping ---
// Maps our phase completion to Notion Roadmap DB Status select values
const PHASE_TO_STATUS = {
  Done: 'Done',
  'In Progress': 'In Progress',
  'Not Started': 'To Do',
};

// Map Notion Roadmap task titles to their actual current status based on CLAUDE.md
// Key: substring to match in Notion task title, Value: status
const TASK_STATUS_MAP = {
  'Complete Phase 3': 'Done',
  'Dark premium landing page': 'Done',
  'Visual token editor': 'Done',
  'CI/CD pipeline': 'Done',
  'AI Override mode': 'To Do',
  'AI conversational theme generation': 'To Do',
  'GitHub/Google OAuth': 'To Do',
  'Theme save/load': 'To Do',
  'List on Clawmart': 'To Do',
  'React Native': 'Backlog',
  'MCP server improvements': 'Backlog',
  'Figma integration': 'Backlog',
  'manifest.ai.json': 'Backlog',
  'Theme Studio': 'Backlog',
};

// --- Sync Roadmap DB ---
async function syncRoadmap() {
  console.log('Syncing Roadmap DB...');
  const res = await notion('POST', `/databases/${ROADMAP_DB_ID}/query`, { page_size: 100 });

  let updated = 0;
  for (const page of res.results) {
    const titleProp = page.properties.Task?.title || [];
    const title = titleProp.map((t) => t.plain_text).join('');
    const currentStatus = page.properties.Status?.select?.name;

    // Find matching status
    let newStatus = null;
    for (const [key, status] of Object.entries(TASK_STATUS_MAP)) {
      if (title.toLowerCase().includes(key.toLowerCase())) {
        newStatus = status;
        break;
      }
    }

    if (newStatus && newStatus !== currentStatus) {
      await notion('PATCH', `/pages/${page.id}`, {
        properties: {
          Status: { select: { name: newStatus } },
        },
      });
      console.log(`  Updated: "${title}" → ${newStatus}`);
      updated++;
    }
  }
  console.log(`  ${updated} tasks updated, ${res.results.length - updated} already correct.`);
}

// --- Create or find Sessions DB ---
async function ensureSessionsDB() {
  if (SESSIONS_DB_ID) return SESSIONS_DB_ID;

  console.log('Creating Sage Sessions database...');
  const db = await notion('POST', '/databases', {
    parent: { type: 'page_id', page_id: ARCANA_PAGE_ID },
    title: [{ type: 'text', text: { content: 'Sage Sessions' } }],
    icon: { type: 'emoji', emoji: '🤖' },
    properties: {
      Session: { title: {} },
      Date: { date: {} },
      Status: {
        select: {
          options: [
            { name: 'Complete', color: 'green' },
            { name: 'In Progress', color: 'yellow' },
            { name: 'Blocked', color: 'red' },
          ],
        },
      },
      'PRs Merged': { rich_text: {} },
      'Tasks Completed': { rich_text: {} },
      Blockers: { rich_text: {} },
      'Next Up': { rich_text: {} },
    },
  });

  console.log(`  Created Sessions DB: ${db.id}`);
  console.log(`  Set NOTION_SESSIONS_DB_ID=${db.id} in your env to reuse.`);
  return db.id;
}

// --- Log a session ---
async function logSession(dbId, { title, date, status, prs, tasks, blockers, nextUp }) {
  console.log('Logging session...');
  await notion('POST', '/pages', {
    parent: { database_id: dbId },
    icon: { type: 'emoji', emoji: '🤖' },
    properties: {
      Session: { title: [{ text: { content: title } }] },
      Date: { date: { start: date } },
      Status: { select: { name: status } },
      'PRs Merged': { rich_text: [{ text: { content: prs || 'None' } }] },
      'Tasks Completed': { rich_text: [{ text: { content: tasks || 'None' } }] },
      Blockers: { rich_text: [{ text: { content: blockers || 'None' } }] },
      'Next Up': { rich_text: [{ text: { content: nextUp || '' } }] },
    },
  });
  console.log(`  Session logged: "${title}"`);
}

// --- Main ---
async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : null;
  };

  const sessionTitle = getArg('--session');
  const sessionPRs = getArg('--prs');
  const sessionTasks = getArg('--tasks');
  const sessionBlockers = getArg('--blockers');
  const sessionNext = getArg('--next');

  try {
    const { phases, remaining, blockers: repoBlockers } = parseClaudeState();

    await syncRoadmap();

    const dbId = await ensureSessionsDB();

    if (sessionTitle) {
      const today = new Date().toISOString().split('T')[0];
      await logSession(dbId, {
        title: sessionTitle,
        date: today,
        status: 'Complete',
        prs: sessionPRs,
        tasks: sessionTasks,
        blockers: sessionBlockers || repoBlockers,
        nextUp: sessionNext,
      });
    }

    console.log('\nSync complete.');
    if (!SESSIONS_DB_ID && dbId) {
      console.log(`\nIMPORTANT: Add to your env:\n  NOTION_SESSIONS_DB_ID=${dbId}`);
    }
  } catch (err) {
    console.error('Sync failed:', err.message);
    process.exit(1);
  }
}

main();
