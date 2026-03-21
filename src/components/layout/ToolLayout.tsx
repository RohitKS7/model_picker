import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

interface ToolLayoutProps {
  fieldNote: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  banner?: React.ReactNode;
}

export function ToolLayout({ fieldNote, title, subtitle, children, banner }: ToolLayoutProps) {
  return (
    <div className="min-h-screen">
      <Header />
      {banner}
      <main>
        <section className="container-brand py-10 md:py-14">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{fieldNote}</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{subtitle}</p>
          <hr className="hand-drawn-divider mt-8" />
        </section>

        <div className="container-brand">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
