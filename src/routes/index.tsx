import { createFileRoute, Link } from "@tanstack/react-router";
import { QrCode, FileText, Zap, IndianRupee, Lock, Sparkles } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { AdSlot } from "@/components/AdSlot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Toolbelt Studio — Free QR Code & GST Invoice Generator for India" },
      {
        name: "description",
        content:
          "Free online tools made for Indian businesses. Generate custom QR codes and GST-compliant invoices in seconds. No signup required.",
      },
      { property: "og:title", content: "Toolbelt Studio — Free QR & Invoice Tools" },
      {
        property: "og:description",
        content: "Generate QR codes & GST invoices instantly. Built for India.",
      },
      { property: "og:url", content: "https://toolbelt-studio.lovable.app/" },
      { name: "twitter:title", content: "Toolbelt Studio — Free QR & Invoice Tools" },
      {
        name: "twitter:description",
        content: "Generate QR codes & GST invoices instantly. Built for India.",
      },
    ],
    links: [{ rel: "canonical", href: "https://toolbelt-studio.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Toolbelt Studio",
          url: "https://toolbelt-studio.lovable.app/",
          description:
            "Free QR code and GST invoice generators built for Indian businesses.",
          publisher: {
            "@type": "Organization",
            name: "Toolbelt Studio",
            url: "https://toolbelt-studio.lovable.app/",
          },
        }),
      },
    ],
  }),
  component: Landing,
});


function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="bg-hero-gradient relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent-saffron" />
              Free tools for Indian businesses
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold sm:text-6xl">
              Tools that <span className="text-gradient-brand">just work</span>.<br />
              QR codes & GST invoices, instantly.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Built for shopkeepers, freelancers and startups across India. No signup. No watermarks.
              Just open and use.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/qr"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90"
              >
                <QrCode className="h-4 w-4" /> Generate QR Code
              </Link>
              <Link
                to="/invoice"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-semibold hover:bg-accent"
              >
                <FileText className="h-4 w-4" /> Create Invoice
              </Link>
            </div>
          </div>
        </section>

        {/* Tools grid */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ToolCard
              to="/qr"
              icon={<QrCode className="h-6 w-6" />}
              title="QR Code Generator"
              desc="Encode any URL, text or UPI ID into a custom-colored QR. Download as PNG or SVG."
              tags={["URL", "UPI", "Custom Colors", "PNG / SVG"]}
              accent="bg-primary text-primary-foreground"
            />
            <ToolCard
              to="/invoice"
              icon={<FileText className="h-6 w-6" />}
              title="GST Invoice Generator"
              desc="Fill seller, buyer & line items. Auto-calculates GST and totals. Export PDF."
              tags={["GST", "Rupee ₹", "PDF", "Indian Format"]}
              accent="bg-accent-saffron text-foreground"
            />
          </div>

          <AdSlot className="mt-10" label="Advertisement — 728×90" />
        </section>

        {/* Elite */}
        <section id="elite" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-foreground to-foreground/80 p-8 text-background sm:p-12">
            <div className="flex flex-wrap items-start justify-between gap-8">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-background/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-background">
                  <Lock className="h-3 w-3" /> Elite
                </span>
                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Unlock the power tools.</h2>
                <p className="mt-3 text-background/70">
                  For agencies, growing brands and busy accountants. One-time upgrade, no recurring nonsense.
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  <EliteItem>Bulk QR generation — upload CSV, get a ZIP</EliteItem>
                  <EliteItem>Upload your logo onto invoices & QR codes</EliteItem>
                  <EliteItem>No advertisements. Anywhere.</EliteItem>
                  <EliteItem>Save & re-use seller / buyer profiles</EliteItem>
                </ul>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest text-background/60">Launch price</p>
                  <p className="font-display text-5xl font-bold">
                    <IndianRupee className="inline h-8 w-8 -translate-y-1" />499
                  </p>
                  <p className="text-xs text-background/60">one-time, lifetime access</p>
                </div>
                <button className="rounded-lg bg-background px-6 py-3 text-sm font-semibold text-foreground hover:opacity-90">
                  Coming soon
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function ToolCard({
  to,
  icon,
  title,
  desc,
  tags,
  accent,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  tags: string[];
  accent: string;
}) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
    >
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
        {icon}
      </div>
      <h2 className="mt-5 text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{desc}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        Open tool <Zap className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function EliteItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent-saffron" />
      <span className="text-background/90">{children}</span>
    </li>
  );
}
