import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export function TopNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Intro', id: 'intro' },
    { label: 'Video', id: 'video' },
    { label: 'About', id: 'about' },
    { label: 'Characters', id: 'characters' },
    { label: 'Character Match', id: 'character-match' },
    { label: 'Worldbuilding', id: 'worldbuilding' },
    { label: 'Clans', id: 'clans' },
    { label: 'Episodes', id: 'episodes' },
    { label: 'Updates', id: 'content' },
    { label: 'Donations', id: 'donations' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-4 py-2 text-foreground hover:text-accent transition-colors font-medium rounded hover:bg-accent/10"
              >
                {link.label}
              </button>
            ))}
            {/* Admin Dashboard link - only for authenticated admins */}
            {identity && isAdmin && (
              <a
                href="/admin"
                className="ml-2 flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors border border-accent/20"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded ml-auto"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="px-4 py-3 text-left text-foreground hover:text-accent hover:bg-accent/10 transition-colors font-medium rounded"
                >
                  {link.label}
                </button>
              ))}
              {/* Admin Dashboard link for mobile */}
              {identity && isAdmin && (
                <a
                  href="/admin"
                  className="flex items-center gap-2 px-4 py-3 text-accent hover:bg-accent/10 transition-colors font-medium rounded"
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
