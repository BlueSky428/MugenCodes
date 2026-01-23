"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-gray-300 bg-white text-ink transition-all duration-300 hover:bg-gray-50 hover:border-primary-500 hover:scale-110 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 dark:hover:border-primary-400"
    >
      {theme === "dark" ? (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 transition-transform duration-300 rotate-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 3v2M12 19v2M4.22 5.22l1.42 1.42M18.36 17.36l1.42 1.42M3 12h2M19 12h2M5.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 transition-transform duration-300 rotate-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};
