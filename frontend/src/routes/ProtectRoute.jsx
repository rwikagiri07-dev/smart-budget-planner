import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
          textAlign: "center",
          padding: "0 20px",
          gap: "10px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
            fontWeight: 700,
          }}
        >
          Smart Budget Planner
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
            color: "#666",
          }}
        >
          Please wait, it's loading...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
