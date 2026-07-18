"use client";
import { useState } from "react";

// Welcome banner. Shows on every load; the × dismisses it for the current
// view only (no persistence) - reloading brings it back.
export default function WelcomeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="welcome">
      <button
        className="welcomeX"
        aria-label="Dismiss welcome"
        onClick={() => {
          localStorage.setItem("fm-welcome-dismissed", "1");
          setDismissed(true);
        }}
      >
        ×
      </button>
      <b>Hello and welcome.</b> This is where I keep my work, the tools I use,
      and how to reach me. Take a look around.
    </div>
  );
}
