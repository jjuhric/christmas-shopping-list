import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import BugReportModal from './components/BugReportModal';
import Snowfall from './components/Snowfall';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import FaqPage from './components/FaqPage';
import InstructionsHome from './components/InstructionsHome';
import AdultInstructionsPage from './components/AdultInstructionsPage';
import ChildInstructionsPage from './components/ChildInstructionsPage';

// Custom wrapper for private routes
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

// Custom wrapper for admin-only routes
function AdminRoute({ children }) {
  const { currentUser, isAdmin } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Subtle, gentle background snowfall */}
        <Snowfall />

        {/* Global Floating Bug Report Tab & Modal */}
        <BugReportModal />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/instructions" element={<InstructionsHome />} />
          <Route path="/instructions/adults" element={<AdultInstructionsPage />} />
          <Route path="/instructions/kids" element={<ChildInstructionsPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Footer />
      </Router>
    </AuthProvider>
  );
}
