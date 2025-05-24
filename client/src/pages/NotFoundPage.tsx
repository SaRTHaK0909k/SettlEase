import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f8f9fa",
      padding: 24,
      textAlign: "center" as const,
    },
    heading: {
      fontSize: "3rem",
      color: "#343a40",
      marginBottom: 16,
    },
    message: {
      fontSize: "1.2rem",
      color: "#6c757d",
      maxWidth: 500,
      marginBottom: 24,
    },
    button: {
      padding: "12px 24px",
      borderRadius: 6,
      border: "none",
      backgroundColor: "#007bff",
      color: "#fff",
      cursor: "pointer",
      fontSize: "1rem",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p style={styles.message}>
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <button
        style={styles.button}
        onClick={() => navigate("/", { replace: true })}
        aria-label="Go back to the homepage"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFoundPage;
