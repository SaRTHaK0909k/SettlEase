import React, { useEffect, useMemo } from "react";
import { Link, animateScroll as scroll } from "react-scroll";
import { useLocation, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import WelcomePage from "../components/landing/WelcomePage";
import AboutUsPage from "../components/landing/AboutUsPage";
import HowItWorksPage from "../components/landing/HowItWorksPage";
import SuccessPage from "../components/landing/SuccessPage";
import TryItOutPage from "../components/landing/TryItOutPage";
import SettlEaseLogo from "../assets/nested-logo.png";
import { Typography, Box } from "@mui/material";

interface SectionProps {
  id: string;
  title: string;
  content: React.ReactNode;
}

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = UserAuth();

  useEffect(() => {
    if (auth?.user) {
      navigate("/dashboard");
    }
  }, [auth, navigate]);

  const sectionStyles: Record<string, React.CSSProperties> = {
    hero: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "#1e1e1e",
      padding: "2rem",
      textAlign: "center",
    },
    "how-it-works": {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "4rem 2rem",
    },
    "about": {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "4rem 2rem",
    },
    "success": {
      minHeight: "100vh",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "4rem 2rem",
    },
    "try-it-out": {
      minHeight: "100vh",
      color: "black",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "4rem 2rem",
    },
  };

  const sections: SectionProps[] = useMemo(
    () => [
      {
        id: "hero",
        title: "Welcome to SettlEase",
        content: WelcomePage(),
      },
      {
        id: "how-it-works",
        title: "How It Works",
        content: HowItWorksPage(),
      },
      {
        id: "try-it-out",
        title: "Try It Out!",
        content: TryItOutPage(),
      },
    ],
    []
  );

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const element = document.getElementById(id);
      if (element && sections.some((section) => section.id === id)) {
        element.scrollIntoView();
      } else {
        scroll.scrollToTop();
        navigate("/");
      }
    } else {
      scroll.scrollToTop();
    }
  }, [location, navigate, sections]);

  return (
    <div style={{
      background: "linear-gradient(to right, #a8edea, #fed6e3)",
      minHeight: "100vh",
      width: "100%",
    }}>
      {/* Header */}
      <header
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backdropFilter: "blur(10px)",
    background: "rgba(255, 255, 255, 0.7)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  }}
>
  <nav
    style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0.8rem 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <img
      src={SettlEaseLogo}
      alt="SettlEase Logo"
      onClick={() => scroll.scrollToTop()}
      style={{
        width: "3.5rem",
        height: "3.5rem",
        cursor: "pointer",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    />

    <div style={{ display: "flex", gap: "1.5rem" }}>
      {sections.map((section) => (
        <Link
          key={section.id}
          to={section.id}
          spy={true}
          smooth={true}
          duration={500}
          style={{
            position: "relative",
            padding: "0.5rem",
            fontSize: "1rem",
            fontWeight: 500,
            color: "#333",
            cursor: "pointer",
            textDecoration: "none",
            transition: "color 0.3s",
          }}
          activeStyle={{
            color: "#63a757",
          }}
        >
          {section.title}
          <span
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              height: "2px",
              backgroundColor: "#63a757",
              transform: "scaleX(0)",
              transformOrigin: "bottom right",
              transition: "transform 0.3s ease",
            }}
            className="hover-underline"
          />
        </Link>
      ))}
    </div>
  </nav>
</header>


      {/* Main Sections */}
      <main style={{ paddingTop: "8vh" }}>
        {sections.map((section) => (
          <section key={section.id} id={section.id} style={sectionStyles[section.id]}>
            <Box sx={{ width: "100%", maxWidth: "1200px", mx: "auto" }}>
              {section.content}
            </Box>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer style={{
        padding: "1rem",
        textAlign: "center",
        fontSize: "0.9rem",
        color: "#555",
      }}>
        © 2025 SettlEase. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
