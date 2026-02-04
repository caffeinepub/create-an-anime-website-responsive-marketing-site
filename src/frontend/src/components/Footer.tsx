export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 border-t-4 border-accent">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-medium">
              © 2026
            </p>
          </div>

          <div className="text-center">
            <p className="text-base">
              Subscribe to us on YouTube{' '}
              <a
                href="https://www.youtube.com/@WhispersOfTheMoon1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-medium transition-all"
              >
                (@WhispersOfTheMoon1)
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
