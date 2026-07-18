"use client";
import { useEffect, useState } from "react";

// One-time welcome. Shows until dismissed with the ×, then stays gone
// (remembered in localStorage). Renders on the server so first-time
// visitors see it immediately with no flash.
export default function WelcomeBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("fm-welcome-dismissed") === "1") setDismissed(true);
  }, []);

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
