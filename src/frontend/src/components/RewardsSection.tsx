import { animeSiteConfig } from "../content/animeSiteConfig";
import { SectionHeader } from "./SectionHeader";

const ORANGE_ACCENT = "oklch(0.70 0.18 50)";
const ORANGE_BG = "oklch(0.14 0.05 50)";
const ORANGE_CARD = "oklch(0.18 0.05 50)";

export function RewardsSection() {
  return (
    <section
      id="donations"
      data-ocid="donations.section"
      className="py-20"
      style={{ backgroundColor: ORANGE_BG }}
    >
      <div className="container mx-auto px-4">
        <SectionHeader title="Donation" accentColor={ORANGE_ACCENT} />

        <div className="mt-12 max-w-4xl mx-auto">
          {/* Intro Section */}
          <div className="text-center mb-12 space-y-4">
            <p
              className="text-3xl font-bold flex items-center justify-center gap-2"
              style={{ color: "oklch(0.94 0.01 85)" }}
            >
              <span>🌙</span>
              <span>Support Whispers Of The White Moon</span>
            </p>

            <p className="text-lg" style={{ color: "oklch(0.65 0.06 50)" }}>
              Help bring the story, animation, and characters to life.
            </p>

            <p className="text-lg" style={{ color: "oklch(0.65 0.06 50)" }}>
              Every donation helps support development, voice acting, art, and
              future episodes.
            </p>

            <div className="mt-8 space-y-2">
              <p className="text-lg" style={{ color: "oklch(0.82 0.02 85)" }}>
                Every supporter becomes part of the Whispers Of The White Moon
                journey.
              </p>
              <p className="text-lg" style={{ color: "oklch(0.82 0.02 85)" }}>
                Choose your tier and help shape the story.
              </p>
            </div>
          </div>

          {/* Cash App Donation Block */}
          <div
            className="rounded-lg p-8 shadow-lg mb-12 max-w-2xl mx-auto"
            style={{
              backgroundColor: ORANGE_CARD,
              border: `1px solid ${ORANGE_ACCENT}40`,
            }}
          >
            <div className="space-y-4 text-center">
              <p
                className="text-2xl font-bold flex items-center justify-center gap-2"
                style={{ color: "oklch(0.94 0.01 85)" }}
              >
                <span>🔥</span>
                <span>Donate Via Cash App</span>
              </p>

              <p className="text-lg" style={{ color: "oklch(0.65 0.06 50)" }}>
                Send support to:
              </p>

              <p
                className="text-3xl font-bold"
                style={{ color: ORANGE_ACCENT }}
              >
                $WOTWM
              </p>

              <p
                className="text-lg flex items-center justify-center gap-2"
                style={{ color: "oklch(0.82 0.02 85)" }}
              >
                <span>Thank you for your support!</span>
                <span>💙</span>
              </p>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="mt-16">
            <h3
              className="text-3xl font-bold text-center mb-8"
              style={{ color: "oklch(0.94 0.01 85)" }}
            >
              Rewards
            </h3>

            <div className="space-y-6">
              {animeSiteConfig.rewards.tiers.map((tier, idx) => (
                <div
                  key={tier.name}
                  data-ocid={`donations.item.${idx + 1}`}
                  className="rounded-lg p-6 shadow-md transition-shadow"
                  style={{
                    backgroundColor: ORANGE_CARD,
                    border: `1px solid ${ORANGE_ACCENT}30`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      `0 4px 24px ${ORANGE_ACCENT}25`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "none";
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">{tier.icon}</div>

                    <div className="flex-1">
                      <h4
                        className="text-xl font-bold mb-1"
                        style={{ color: "oklch(0.94 0.01 85)" }}
                      >
                        {tier.name}
                      </h4>

                      <p
                        className="text-lg font-semibold mb-3"
                        style={{ color: ORANGE_ACCENT }}
                      >
                        {tier.donationRange}
                      </p>

                      <ul className="space-y-2">
                        {tier.perks.map((perk) => (
                          <li
                            key={perk}
                            className="flex items-start gap-2"
                            style={{ color: "oklch(0.65 0.06 50)" }}
                          >
                            <span
                              style={{ color: ORANGE_ACCENT }}
                              className="mt-1"
                            >
                              •
                            </span>
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
