import { SiGithub, SiX } from 'react-icons/si';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 border-t-4 border-accent">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-lg font-medium">
              © 2026
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:text-accent transition-colors"
              aria-label="Twitter"
            >
              <SiX size={24} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:text-accent transition-colors"
              aria-label="GitHub"
            >
              <SiGithub size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
