import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { appTheme } from './themes';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/common/Layout';
import Dashboard from './pages/Dashboard.js';
import Upload from './pages/Upload';
import Reports from './pages/Reports';
import Config from './pages/Config';
import { ROUTES } from './utils/constants';

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Layout>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.UPLOAD} element={<Upload />} />
                <Route path={ROUTES.REPORTS} element={<Reports />} />
                <Route path={ROUTES.CONFIG} element={<Config />} />
                <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              </Routes>
            </AnimatePresence>
          </Layout>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;