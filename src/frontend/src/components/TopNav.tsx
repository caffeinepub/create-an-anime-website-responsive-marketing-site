import { LayoutDashboard, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../hooks/useQueries";

export function TopNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Home", id: "hero" },
    { label: "Intro", id: "intro" },
    { label: "Video", id: "video" },
    { label: "About", id: "about" },
    { label: "Characters", id: "characters" },
    { label: "Character Match", id: "character-match" },
    { label: "Worldbuilding", id: "worldbuilding" },
    { label: "Clans", id: "clans" },
    { label: "Episodes", id: "episodes" },
    { label: "Updates", id: "content" },
    { label: "Donations", id: "donations" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav
      data-ocid="nav.section"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={
        isScrolled
          ? {
              backgroundColor: "oklch(0.10 0.02 240 / 0.97)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid oklch(0.25 0.015 240)",
              boxShadow: "0 2px 20px oklch(0.05 0.01 240 / 0.6)",
            }
          : { backgroundColor: "transparent" }
      }
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                data-ocid={`nav.${link.id}.link`}
                onClick={() => scrollToSection(link.id)}
                className="px-3 py-2 text-sm font-medium rounded transition-colors"
                style={{ color: "oklch(0.80 0.01 85)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.96 0.01 85)";
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "oklch(0.65 0.18 220 / 0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.80 0.01 85)";
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "transparent";
                }}
              >
                {link.label}
              </button>
            ))}
            {/* Admin Dashboard link - only for authenticated admins */}
            {identity && isAdmin && (
              <a
                href="/admin"
                data-ocid="nav.admin.link"
                className="ml-2 flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: "oklch(0.65 0.18 220 / 0.12)",
                  color: "oklch(0.72 0.14 195)",
                  border: "1px solid oklch(0.65 0.18 220 / 0.25)",
                }}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            data-ocid="nav.toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 transition-colors focus:outline-none focus:ring-2 rounded ml-auto"
            style={{ color: "oklch(0.80 0.01 85)" }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden py-4 border-t"
            style={{
              borderColor: "oklch(0.25 0.015 240)",
              backgroundColor: "oklch(0.10 0.02 240 / 0.98)",
            }}
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  data-ocid={`nav.mobile.${link.id}.link`}
                  onClick={() => scrollToSection(link.id)}
                  className="px-4 py-3 text-left font-medium rounded transition-colors"
                  style={{ color: "oklch(0.80 0.01 85)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "oklch(0.96 0.01 85)";
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "oklch(0.65 0.18 220 / 0.10)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "oklch(0.80 0.01 85)";
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "transparent";
                  }}
                >
                  {link.label}
                </button>
              ))}
              {/* Admin Dashboard link for mobile */}
              {identity && isAdmin && (
                <a
                  href="/admin"
                  data-ocid="nav.mobile.admin.link"
                  className="flex items-center gap-2 px-4 py-3 font-medium rounded transition-colors"
                  style={{ color: "oklch(0.72 0.14 195)" }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
