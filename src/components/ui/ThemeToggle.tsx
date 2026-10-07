import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../theme/theme-context";
import "./theme-toggle.css";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="vivid-theme-toggle"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
    >
      <span className="vivid-theme-toggle__track" aria-hidden="true">
        <Sun className="vivid-theme-toggle__icon vivid-theme-toggle__icon--sun" />
        <Moon className="vivid-theme-toggle__icon vivid-theme-toggle__icon--moon" />
        <span className="vivid-theme-toggle__thumb" />
      </span>
    </button>
  );
}

export default ThemeToggle;
