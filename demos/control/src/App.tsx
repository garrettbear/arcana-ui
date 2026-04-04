import { ToastProvider } from '@arcana-ui/core';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ControlMobileNav } from './components/ControlNavbar';
import { ControlSidebar } from './components/ControlSidebar';
import { Builds } from './pages/Builds';
import { Components } from './pages/Components';
import { Overview } from './pages/Overview';
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
              <Route path="/builds" element={<Builds />} />
            </Routes>
          </main>
          <ControlMobileNav />
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
