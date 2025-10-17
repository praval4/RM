import React, { useEffect, useState } from "react";
import "../styles/theme-toggle.css";

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <>
      {children}
      <button onClick={toggleTheme} className="theme-toggle-btn">
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </>
  );
};

export default ThemeProvider;