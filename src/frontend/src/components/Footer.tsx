export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      data-ocid="footer.section"
      className="py-12"
      style={{
        backgroundColor: "oklch(0.09 0.015 240)",
        borderTop: "1px solid oklch(0.22 0.015 240)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p
              className="text-lg font-medium"
              style={{ color: "oklch(0.70 0.02 240)" }}
            >
              © {currentYear}
            </p>
          </div>

          <div className="text-center">
            <p className="text-base" style={{ color: "oklch(0.70 0.02 240)" }}>
              Subscribe to us on YouTube{" "}
              <a
                href="https://www.youtube.com/@WhispersOfTheMoon1"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium transition-all hover:underline"
                style={{ color: "oklch(0.68 0.16 195)" }}
              >
                (@WhispersOfTheMoon1)
              </a>
            </p>
          </div>

          <div className="text-center">
            <p className="text-base" style={{ color: "oklch(0.70 0.02 240)" }}>
              Donate: Cash App{" "}
              <span
                className="font-medium"
                style={{ color: "oklch(0.70 0.18 50)" }}
              >
                $WOTWM
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
