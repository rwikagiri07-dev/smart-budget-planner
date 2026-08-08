import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectRoute";

import Login from "../pages/Login/Login";
import Signup from "../pages/SignUp/SignUp";
import Dashboard from "../pages/Dashboard/Dashboard";
import BudgetPlanner from "../pages/BudgetPlanner/BudgetPlanner";
import Expenses from "../pages/Expenses/Expenses";
import Events from "../pages/Events/Events";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";
import NotFound from "../pages/NotFound/NotFound";

// import ProtectedRoute from "./components/auth/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/budgets"
        element={
          <ProtectedRoute>
            <BudgetPlanner />
          </ProtectedRoute>
        }
      />

      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;

