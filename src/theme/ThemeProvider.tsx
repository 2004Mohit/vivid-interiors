import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type Theme,
  type ThemeContextValue,
} from "./theme-context";

/** Theme that index.html's inline script already applied before first paint. */
function readInitialTheme(): Theme {
  const applied = document.documentElement.dataset.theme;

  if (applied === "light" || applied === "dark") {
    return applied;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;

    // brief class that enables the cross-fade transition in variables.css
    root.classList.add("theme-transition");
    root.dataset.theme = next;

    window.setTimeout(() => root.classList.remove("theme-transition"), 600);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage blocked (private mode): the theme still applies for the session */
    }

    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Follow the OS setting until the visitor makes an explicit choice.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = (event: MediaQueryListEvent) => {
      let stored: string | null = null;

      try {
        stored = localStorage.getItem(THEME_STORAGE_KEY);
      } catch {
        /* ignore */
      }

      if (stored) return;

      const next: Theme = event.matches ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      setThemeState(next);
    };

    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
  }, []);

  // keep <meta name="theme-color"> in sync with the page
  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#050505" : "#f1f1f1");
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
