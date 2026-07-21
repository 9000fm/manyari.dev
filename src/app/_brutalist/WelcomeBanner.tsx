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
      <p className="welcomeText">
        <b>Hello and welcome.</b> This is where I keep my{" "}
        <a href="#work">work</a>, the <a href="#tools">tools</a> I use, and how
        to <a href="#contact">reach me</a>. Take a look around.
      </p>
    </div>
  );
}
