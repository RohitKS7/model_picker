import Image from "next/image";
import Link from "next/link";

import { SOCIAL_LINKS } from "@/data/ecosystem";

export function Header() {
  return (
    <header className="relative z-40 bg-transparent sm:sticky sm:top-0 sm:border-b sm:border-border/70 sm:bg-background/85 sm:backdrop-blur-md">
      <div className="container-brand flex justify-between py-4 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/guardclaw-logo.png"
            alt="GuardClaw"
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="font-serif text-2xl font-bold">GuardClaw</span>
        </Link>

        <nav className="flex items-center justify-end gap-3 text-sm font-semibold text-muted-foreground sm:w-auto sm:gap-5">
          <a href={SOCIAL_LINKS.tool_calculator} target="_blank" className="hidden transition hover:text-foreground sm:inline">
            Calculator
          </a>
          <a href={SOCIAL_LINKS.tools} target="_blank" className="hidden transition hover:text-foreground sm:inline">
            Tools Hub
          </a>
          <Link
            href={SOCIAL_LINKS.github}
            target="_blank"
            className="hidden transition hover:text-foreground sm:inline"
          >
            GitHub
          </Link>
          <Link
            href={SOCIAL_LINKS.website}
            target="_blank"
            className="rounded-full bg-primary px-4 py-2 text-primary-foreground transition hover:brightness-105 sm:border sm:border-primary/30 sm:bg-primary sm:px-4 sm:text-primary-foreground sm:hover:bg-transparent sm:hover:text-foreground"
          >
            Ecosystem
          </Link>
        </nav>
      </div>
    </header>
  );
}
