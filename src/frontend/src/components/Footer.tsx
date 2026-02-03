import { SiGithub, SiX } from 'react-icons/si';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 border-t-4 border-accent">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-lg font-medium flex items-center justify-center md:justify-start gap-2">
              © 2026. Built with <Heart size={18} className="text-accent fill-accent" /> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors underline"
              >
                caffeine.ai
              </a>
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
