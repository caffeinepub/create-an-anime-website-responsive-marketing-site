import { animeSiteConfig } from "../content/animeSiteConfig";
import { SectionHeader } from "./SectionHeader";

export function AboutSection() {
  return (
    <section
      id="about"
      data-ocid="about.section"
      className="py-20"
      style={{ backgroundColor: "oklch(0.14 0.04 150)" }}
    >
      <div className="container mx-auto px-4">
        <SectionHeader
          title="About the Series"
          accentColor="oklch(0.65 0.14 150)"
        />
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-lg p-6 md:p-8"
            style={{
              backgroundColor: "oklch(0.17 0.04 150)",
              border: "1px solid oklch(0.65 0.14 150 / 0.20)",
            }}
          >
            <p
              className="text-lg md:text-xl leading-relaxed whitespace-pre-line"
              style={{ color: "oklch(0.85 0.02 85)" }}
            >
              {animeSiteConfig.synopsis}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
