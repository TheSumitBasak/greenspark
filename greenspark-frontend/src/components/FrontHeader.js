import { Logo } from "./brand/logo";

export default function FrontHeader() {
    return (
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:py-5">
          <a
            href="/"
            aria-label="GreenSpark Home"
            className="flex items-center gap-2"
          >
            <Logo />
          </a>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-6">
              <li>
                <a
                  href="#about"
                  className="text-sm font-medium text-foreground hover:underline underline-offset-4"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#how"
                  className="text-sm font-medium text-foreground hover:underline underline-offset-4"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  className="text-sm font-medium text-foreground hover:underline underline-offset-4"
                >
                  Reviews
                </a>
              </li>
              <li>
                <a
                  href="/leaderboards"
                  className="text-sm font-medium text-foreground hover:underline underline-offset-4"
                >
                  Leaderboards
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
}