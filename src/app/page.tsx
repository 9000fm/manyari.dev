import HeroSection from "../components/hero/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />

      {/* Sections placeholder — will be built in later phases */}
      <section className="h-screen flex items-center justify-center">
        <p className="text-body text-grey">— More coming —</p>
      </section>
    </main>
  );
}
