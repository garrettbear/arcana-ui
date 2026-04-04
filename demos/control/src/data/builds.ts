export interface BuildEntry {
  id: number;
  trigger: string;
  status: 'success' | 'warning' | 'failed';
  duration: string;
  components: string;
  tests: string;
  date: string;
  logs: string;
}

export const buildData: BuildEntry[] = [
  {
    id: 41,
    trigger: 'push to develop',
    status: 'success',
    duration: '28s',
    components: '68',
    tests: '958/958',
    date: 'Today 9:17 PM',
    logs: `[09:17:01] Starting build #41...
[09:17:01] Installing dependencies...
[09:17:04] Building @arcana-ui/tokens...
[09:17:06] Generated 14 theme CSS files (2,614 variables each)
[09:17:06] Building @arcana-ui/core...
[09:17:12] Compiled 68 components
[09:17:12] Running type check...
[09:17:18] Type check passed (0 errors)
[09:17:18] Running tests...
[09:17:26] 958/958 tests passed
[09:17:26] Running linter...
[09:17:28] Lint passed (0 errors, 0 warnings)
[09:17:29] Build complete in 28s ✓`,
  },
  {
    id: 40,
    trigger: 'push to develop',
    status: 'success',
    duration: '34s',
    components: '68',
    tests: '958/958',
    date: 'Today 8:22 PM',
    logs: `[08:22:01] Starting build #40...
[08:22:05] Building @arcana-ui/tokens... done
[08:22:14] Building @arcana-ui/core... done (68 components)
[08:22:22] Type check passed
[08:22:30] 958/958 tests passed
[08:22:35] Build complete in 34s ✓`,
  },
  {
    id: 39,
    trigger: 'PR merge',
    status: 'success',
    duration: '31s',
    components: '67',
    tests: '952/952',
    date: 'Today 7:15 PM',
    logs: `[07:15:01] Starting build #39...
[07:15:04] Building @arcana-ui/tokens... done
[07:15:13] Building @arcana-ui/core... done (67 components)
[07:15:20] Type check passed
[07:15:28] 952/952 tests passed
[07:15:32] Build complete in 31s ✓`,
  },
  {
    id: 38,
    trigger: 'push to develop',
    status: 'warning',
    duration: '34s',
    components: '68',
    tests: '958/958',
    date: 'Today 4:33 PM',
    logs: `[04:33:01] Starting build #38...
[04:33:05] Building @arcana-ui/tokens... done
[04:33:15] Building @arcana-ui/core... done (68 components)
[04:33:23] Type check passed
[04:33:31] 958/958 tests passed
[04:33:35] Build complete in 34s ⚠ (above 30s threshold)`,
  },
  {
    id: 37,
    trigger: 'PR merge',
    status: 'success',
    duration: '29s',
    components: '67',
    tests: '945/945',
    date: 'Yesterday',
    logs: `[14:10:01] Starting build #37...
[14:10:30] Build complete in 29s ✓`,
  },
  {
    id: 36,
    trigger: 'scheduled',
    status: 'success',
    duration: '27s',
    components: '67',
    tests: '945/945',
    date: '2d ago',
    logs: `[03:00:01] Starting scheduled build #36...
[03:00:28] Build complete in 27s ✓`,
  },
  {
    id: 35,
    trigger: 'push to develop',
    status: 'failed',
    duration: '—',
    components: '—',
    tests: '12 failed',
    date: '3d ago',
    logs: `[11:44:01] Starting build #35...
[11:44:04] Building @arcana-ui/tokens... done
[11:44:13] Building @arcana-ui/core... done
[11:44:20] Type check passed
[11:44:20] Running tests...
[11:44:28] FAIL useTheme.test.tsx (12 failures)
  ✕ should persist theme to localStorage
  ✕ should read theme from localStorage on mount
  ✕ should clear stored theme on reset
  ... 9 more failures
[11:44:28] TypeError: localStorage.clear is not a function
[11:44:28] Build FAILED ✗`,
  },
  {
    id: 34,
    trigger: 'push to develop',
    status: 'success',
    duration: '26s',
    components: '66',
    tests: '938/938',
    date: '4d ago',
    logs: `[16:20:01] Starting build #34...
[16:20:27] Build complete in 26s ✓`,
  },
];
