import { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { useSessionTimeout } from "./hooks/useSessionTimeout";
import { SessionWarningModal } from "./components/ui/SessionWarningModal";

// Import halaman-halaman
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import SetupBudget from "./components/budget/SetupBudget";
import Dashboard from "./components/dashboard/Dashboard";
import AddExpense from "./components/transactions/AddExpense";
import TransactionHistory from "./components/transactions/TransactionHistory";
import MonthlyReport from "./components/report/MonthlyReport";
import Settings from "./components/settings/Settings";

// Komponen ProtectedRoute harus dengan huruf besar (P)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  const handleExtend = useCallback(() => {
    setShowWarning(false);
    localStorage.setItem("lastActivity", Date.now().toString());
  }, []);

  const handleLogout = useCallback(() => {
    setShowWarning(false);
    logout();
    window.location.href = "/login";
  }, [logout]);

  useSessionTimeout({
    timeoutMinutes: 30,
    warningMinutes: 1,
    onWarning: () => {
      setShowWarning(true);
      let countdown = 60;
      const interval = setInterval(() => {
        countdown--;
        setSecondsLeft(countdown);
        if (countdown <= 0) {
          clearInterval(interval);
          setShowWarning(false);
        }
      }, 1000);
      return () => clearInterval(interval);
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {children}
      <SessionWarningModal
        open={showWarning}
        onExtend={handleExtend}
        onLogout={handleLogout}
        secondsLeft={secondsLeft}
      />
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/setup-budget"
            element={
              <ProtectedRoute>
                <SetupBudget />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-expense"
            element={
              <ProtectedRoute>
                <AddExpense />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <TransactionHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <MonthlyReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
