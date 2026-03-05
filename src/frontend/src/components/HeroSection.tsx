import { ChevronDown } from "lucide-react";
import { animeSiteConfig } from "../content/animeSiteConfig";

export function HeroSection() {
  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="hero"
      data-ocid="hero.section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "url(/assets/generated/anime-hero-bg-moon-waterfall-volcano-sun.dim_1920x1080.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay with midnight blue tint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.10 0.04 240 / 0.88) 0%, oklch(0.12 0.05 240 / 0.70) 50%, oklch(0.10 0.04 240 / 0.94) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
            style={{ color: "oklch(0.96 0.01 85)" }}
          >
            {animeSiteConfig.title}
          </h1>
          <p
            className="text-xl md:text-2xl lg:text-3xl font-medium"
            style={{ color: "oklch(0.85 0.02 85)" }}
          >
            {animeSiteConfig.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              type="button"
              data-ocid="hero.primary_button"
              onClick={scrollToAbout}
              className="px-8 py-4 font-bold text-lg rounded-lg transition-all transform hover:scale-105 shadow-lg"
              style={{
                backgroundColor: "oklch(0.65 0.18 220)",
                color: "oklch(0.98 0.005 85)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "oklch(0.72 0.18 220)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "oklch(0.65 0.18 220)";
              }}
            >
              {animeSiteConfig.ctaButtons.primary}
            </button>
            <button
              type="button"
              data-ocid="hero.secondary_button"
              onClick={() => {
                const element = document.getElementById("characters");
                if (element) {
                  const offset = 80;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition =
                    elementPosition + window.pageYOffset - offset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });
                }
              }}
              className="px-8 py-4 font-bold text-lg rounded-lg transition-all transform hover:scale-105 shadow-lg"
              style={{
                backgroundColor: "transparent",
                border: "2px solid oklch(0.65 0.18 220)",
                color: "oklch(0.90 0.01 85)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "oklch(0.65 0.18 220 / 0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
            >
              {animeSiteConfig.ctaButtons.secondary}
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          type="button"
          onClick={scrollToAbout}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce transition-colors focus:outline-none focus:ring-2 rounded-full p-2"
          style={{ color: "oklch(0.65 0.18 220)" }}
          aria-label="Scroll to content"
        >
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  );
}
