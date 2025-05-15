
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';

// Import all pages
import AdminLogin from './pages/auth/AdminLogin';
import CompanyProfile from './pages/admin/CompanyProfile';
import CompanySetup from './pages/company-setup/CompanySetup';
import Dashboard from './pages/admin/Dashboard';
import Index from './pages/Index';
import Inspection from './pages/inspector/Inspection';
import InspectionList from './pages/inspector/InspectionList';
import InspectionExecute from './pages/inspector/InspectionExecute';
import InspectorLogin from './pages/auth/InspectorLogin';
import Inspections from './pages/admin/Inspections';
import Inspectors from './pages/admin/Inspectors';
import InspectorList from './pages/admin/InspectorList';
import Landing from './pages/landing/Landing';
import Login from './pages/auth/Login';
import NotFound from './pages/NotFound';
import Profile from './pages/admin/Profile';
import Register from './pages/auth/Register';
import RegisterSuccess from './pages/auth/RegisterSuccess';
import UnderConstruction from './pages/admin/UnderConstruction';
import Vistorias from './pages/admin/Vistorias';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
