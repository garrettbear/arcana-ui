import { ToastProvider } from '@arcana-ui/core';
import { ThemeSwitcher } from '@arcana-ui/demo-shared/theme-switcher';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ControlMobileNav } from './components/ControlNavbar';
import { ControlSidebar } from './components/ControlSidebar';
import { Accessibility } from './pages/Accessibility';
import { Builds } from './pages/Builds';
import { Components } from './pages/Components';
import { Overview } from './pages/Overview';
import { Performance } from './pages/Performance';
import { Tokens } from './pages/Tokens';

export function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="control-layout">
          <ControlSidebar />
          <main className="control-main">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/components" element={<Components />} />
              <Route path="/tokens" element={<Tokens />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/builds" element={<Builds />} />
            </Routes>
          </main>
          <ControlMobileNav />
        </div>
        <ThemeSwitcher defaultTheme="dark" />
      </ToastProvider>
    </BrowserRouter>
  );
}
