import { Fragment } from "react";

interface AccentProps {
  children: string;
  className?: string;
}

/**
 * Brand highlight: every word gets its FIRST letter in red and the remaining
 * letters in pista (dark theme). In the light theme the whole phrase keeps the
 * hero's pista colour, exactly like the original Hero heading.
 *
 * Styling lives in styles/typography.css (.vivid-accent*).
 */
function Accent({ children, className }: AccentProps) {
  const words = children.split(" ").filter(Boolean);

  return (
    <span className={`vivid-accent${className ? ` ${className}` : ""}`}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 ? " " : null}
          <span className="vivid-accent__word">
            <span className="vivid-accent__first">{word.charAt(0)}</span>
            <span className="vivid-accent__rest">{word.slice(1)}</span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}

export default Accent;
