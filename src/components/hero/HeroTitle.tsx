import { SERVICES } from "../../app/constants";

const ITEMS = ["SUPERSELF", "STUDIO", ...SERVICES];

function MarqueeContent() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span
          key={i}
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {item}
          <span style={{ margin: "0 0.4em", opacity: 0.25 }}>/</span>
        </span>
      ))}
    </>
  );
}

export default function HeroTitle() {
  return (
    <div
      style={{
        overflow: "hidden",
        fontFamily: "var(--font-display)",
        fontSize: "clamp(48px, 8vw, 140px)",
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: "-0.04em",
        textTransform: "uppercase",
        color: "#111",
      }}
    >
      <div className="animate-marquee-slow">
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  );
}
