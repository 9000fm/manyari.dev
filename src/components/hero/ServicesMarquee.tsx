import { SERVICES } from "../../app/constants";

function MarqueeContent() {
  return (
    <>
      {SERVICES.map((service, i) => (
        <span
          key={i}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(48px, 10vw, 180px)",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: "#ccc",
            whiteSpace: "nowrap",
          }}
        >
          {service}
          <span style={{ margin: "0 0.3em", opacity: 0.4 }}>&middot;</span>
        </span>
      ))}
    </>
  );
}

export default function ServicesMarquee() {
  return (
    <div
      style={{
        overflow: "hidden",
        margin: "2vh 0",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="animate-marquee">
        <MarqueeContent />
        <MarqueeContent />
      </div>
    </div>
  );
}
