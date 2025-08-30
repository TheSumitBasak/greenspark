export function FrontFooter() {
  return (
    <footer id="contact" className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GreenSpark. Operated as a public good.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-sm font-medium text-secondary hover:underline underline-offset-4"
            >
              Governance
            </a>
            <a
              href="#"
              className="text-sm font-medium text-secondary hover:underline underline-offset-4"
            >
              Transparency
            </a>
            <a
              href="#"
              className="text-sm font-medium text-secondary hover:underline underline-offset-4"
            >
              Press
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
