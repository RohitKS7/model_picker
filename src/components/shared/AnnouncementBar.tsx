import Link from "next/link";

interface AnnouncementBarProps {
  badge: string;
  message: string;
  linkLabel: string;
  linkHref: string;
  external?: boolean;
}

export function AnnouncementBar({
  badge,
  message,
  linkLabel,
  linkHref,
  external = false,
}: AnnouncementBarProps) {
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <div className="flex min-h-10 w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-1 border-b border-border bg-secondary px-4 py-2.5 text-center sm:px-6">
      <span className="shrink-0 rounded bg-primary px-2 py-0.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-primary-foreground">
        {badge}
      </span>
      <span className="font-sans text-sm font-normal leading-snug text-foreground">{message}</span>
      <span aria-hidden="true" className="font-sans text-sm text-muted-foreground">
        {"\u00B7"}
      </span>
      <Link
        href={linkHref}
        {...linkProps}
        className="font-sans text-sm font-medium text-accent no-underline transition-opacity duration-150 hover:opacity-80 hover:underline"
      >
        {linkLabel}
      </Link>
    </div>
  );
}
