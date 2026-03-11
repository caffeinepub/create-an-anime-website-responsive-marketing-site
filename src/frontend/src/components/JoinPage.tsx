import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";

export function JoinPage() {
  return (
    <div
      data-ocid="join.section"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.08 0.04 240) 0%, oklch(0.10 0.06 260) 40%, oklch(0.09 0.05 220) 100%)",
      }}
    >
      {/* Atmospheric glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.20 50 / 0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.60 0.18 220 / 0.10) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Back button */}
      <button
        type="button"
        data-ocid="join.back.button"
        onClick={() => {
          window.location.href = "/";
        }}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 focus:outline-none focus:ring-2"
        style={{
          color: "oklch(0.75 0.10 220)",
          border: "1px solid oklch(0.65 0.18 220 / 0.40)",
          backgroundColor: "oklch(0.12 0.04 240 / 0.60)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "oklch(0.65 0.18 220 / 0.20)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "oklch(0.12 0.04 240 / 0.60)";
        }}
      >
        <ArrowLeft size={18} />
        <span>Back to site</span>
      </button>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
        {/* Sparkle accent */}
        <div
          className="flex gap-3 mb-6"
          style={{ color: "oklch(0.75 0.20 55)" }}
        >
          <Sparkles size={28} />
          <Sparkles size={22} style={{ marginTop: "4px" }} />
          <Sparkles size={28} />
        </div>

        {/* Main heading */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          style={{
            color: "oklch(0.96 0.01 85)",
            textShadow:
              "0 0 40px oklch(0.75 0.20 55 / 0.60), 0 0 80px oklch(0.65 0.18 55 / 0.30), 0 0 120px oklch(0.55 0.15 55 / 0.20)",
          }}
        >
          Click the link to join the team
        </h1>

        {/* Join link button */}
        <a
          href="https://forms.gle/DtbxV3CZzxC96QEw5"
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="join.primary_button"
          className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-semibold text-lg mt-4 mb-6 transition-all hover:scale-105 focus:outline-none focus:ring-2"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.22 50), oklch(0.50 0.20 30))",
            color: "oklch(0.97 0.01 85)",
            boxShadow:
              "0 0 24px oklch(0.65 0.22 50 / 0.55), 0 0 48px oklch(0.55 0.20 50 / 0.30), 0 4px 16px oklch(0.10 0.02 240 / 0.60)",
            border: "1px solid oklch(0.70 0.22 55 / 0.40)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 0 36px oklch(0.70 0.24 50 / 0.70), 0 0 72px oklch(0.60 0.22 50 / 0.40), 0 4px 16px oklch(0.10 0.02 240 / 0.60)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.boxShadow =
              "0 0 24px oklch(0.65 0.22 50 / 0.55), 0 0 48px oklch(0.55 0.20 50 / 0.30), 0 4px 16px oklch(0.10 0.02 240 / 0.60)";
          }}
        >
          <ExternalLink size={20} />
          Apply Now
        </a>

        {/* Notice */}
        <p
          className="text-sm md:text-base font-medium tracking-wider uppercase mt-2"
          style={{
            color: "oklch(0.55 0.08 85)",
            letterSpacing: "0.12em",
          }}
        >
          * Responses are not garanteed
        </p>
      </div>
    </div>
  );
}
