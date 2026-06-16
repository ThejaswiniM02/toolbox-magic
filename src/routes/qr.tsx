import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, QrCode as QrIcon, Link as LinkIcon, Type, Smartphone } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { AdSlot } from "@/components/AdSlot";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "QR Code Generator — Free Custom QR with UPI Support | Toolkart.in" },
      {
        name: "description",
        content:
          "Generate free QR codes for URLs, text, or UPI payments. Customize colors and download as PNG or SVG. No signup.",
      },
      { property: "og:title", content: "Free QR Code Generator — Toolkart.in" },
      { property: "og:description", content: "Custom colored QR codes. UPI ready. PNG & SVG download." },
    ],
  }),
  component: QrPage,
});

type Mode = "url" | "text" | "upi";

function QrPage() {
  const [mode, setMode] = useState<Mode>("url");
  const [value, setValue] = useState("https://toolkart.in");
  const [upiId, setUpiId] = useState("yourname@upi");
  const [upiName, setUpiName] = useState("");
  const [upiAmount, setUpiAmount] = useState("");
  const [fg, setFg] = useState("#1a1a2e");
  const [bg, setBg] = useState("#ffffff");
  const [size, setSize] = useState(320);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [svgString, setSvgString] = useState("");

  const payload =
    mode === "upi"
      ? buildUpi(upiId, upiName, upiAmount)
      : value;

  useEffect(() => {
    if (!payload) return;
    const renderSize = Math.max(300, size);
    const opts = {
      width: renderSize,
      margin: 2,
      errorCorrectionLevel: "H" as const,
      color: { dark: fg, light: bg },
    };
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, payload, opts).catch(() => {});
    }
    QRCode.toString(payload, { ...opts, type: "svg" })
      .then(setSvgString)
      .catch(() => setSvgString(""));
  }, [payload, fg, bg, size, mode]);

  const downloadPng = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    triggerDownload(url, "qr-code.png");
  };

  const downloadSvg = () => {
    if (!svgString) return;
    const url = URL.createObjectURL(new Blob([svgString], { type: "image/svg+xml" }));
    triggerDownload(url, "qr-code.svg");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">QR Code Generator</h1>
          <p className="mt-2 text-muted-foreground">
            Encode any link, text, or UPI ID into a beautiful, custom-colored QR.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main tool */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              {/* Mode tabs */}
              <div className="mb-6 inline-flex rounded-lg bg-muted p-1">
                <ModeButton active={mode === "url"} onClick={() => setMode("url")} icon={<LinkIcon className="h-3.5 w-3.5" />}>
                  URL
                </ModeButton>
                <ModeButton active={mode === "text"} onClick={() => setMode("text")} icon={<Type className="h-3.5 w-3.5" />}>
                  Text
                </ModeButton>
                <ModeButton active={mode === "upi"} onClick={() => setMode("upi")} icon={<Smartphone className="h-3.5 w-3.5" />}>
                  UPI Pay
                </ModeButton>
              </div>

              {mode === "upi" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="UPI ID *">
                    <input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="name@bank"
                      className="input"
                    />
                  </Field>
                  <Field label="Payee Name">
                    <input
                      value={upiName}
                      onChange={(e) => setUpiName(e.target.value)}
                      placeholder="Your Shop"
                      className="input"
                    />
                  </Field>
                  <Field label="Amount (₹, optional)">
                    <input
                      type="number"
                      value={upiAmount}
                      onChange={(e) => setUpiAmount(e.target.value)}
                      placeholder="Leave blank for any amount"
                      className="input"
                    />
                  </Field>
                </div>
              ) : (
                <Field label={mode === "url" ? "Website URL" : "Text content"}>
                  {mode === "text" ? (
                    <textarea
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      rows={4}
                      className="input resize-none"
                      placeholder="Enter any text..."
                    />
                  ) : (
                    <input
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="https://example.com"
                      className="input"
                    />
                  )}
                </Field>
              )}

              {/* Customization */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Field label="QR Color">
                  <div className="flex items-center gap-2">
                    <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-12 cursor-pointer rounded-md border border-border bg-transparent" />
                    <input value={fg} onChange={(e) => setFg(e.target.value)} className="input flex-1" />
                  </div>
                </Field>
                <Field label="Background">
                  <div className="flex items-center gap-2">
                    <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-12 cursor-pointer rounded-md border border-border bg-transparent" />
                    <input value={bg} onChange={(e) => setBg(e.target.value)} className="input flex-1" />
                  </div>
                </Field>
                <Field label={`Size: ${size}px`}>
                  <input
                    type="range"
                    min={160}
                    max={640}
                    step={20}
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="h-10 w-full"
                  />
                </Field>
              </div>
            </div>

            <AdSlot label="Advertisement — 728×90" />
          </div>

          {/* Preview */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Live Preview
              </p>
              <div
                className="mx-auto flex aspect-square w-full max-w-[320px] items-center justify-center rounded-xl p-4"
                style={{ backgroundColor: bg }}
              >
                {payload ? (
                  <canvas ref={canvasRef} className="h-full w-full" />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <QrIcon className="mx-auto h-10 w-10 opacity-40" />
                    <p className="mt-2 text-sm">Enter content to generate</p>
                  </div>
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button onClick={downloadPng} className="btn-primary">
                  <Download className="h-4 w-4" /> PNG
                </button>
                <button onClick={downloadSvg} className="btn-secondary">
                  <Download className="h-4 w-4" /> SVG
                </button>
              </div>
            </div>

            <AdSlot label="Advertisement — 300×250" />
          </aside>
        </div>
      </main>
      <SiteFooter />

      <style>{`
        .input {
          width: 100%;
          padding: 0.625rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px oklch(0.45 0.18 265 / 0.1); }
        .btn-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
          padding: 0.625rem 1rem; border-radius: 0.5rem;
          background: var(--color-primary); color: var(--color-primary-foreground);
          font-size: 0.875rem; font-weight: 600; cursor: pointer;
        }
        .btn-primary:hover { opacity: 0.9; }
        .btn-secondary {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
          padding: 0.625rem 1rem; border-radius: 0.5rem;
          background: var(--color-secondary); color: var(--color-secondary-foreground);
          font-size: 0.875rem; font-weight: 600; cursor: pointer;
          border: 1px solid var(--color-border);
        }
        .btn-secondary:hover { background: var(--color-accent); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function buildUpi(pa: string, pn: string, am: string) {
  if (!pa) return "";
  const params = new URLSearchParams();
  params.set("pa", pa);
  if (pn) params.set("pn", pn);
  if (am) params.set("am", am);
  params.set("cu", "INR");
  return `upi://pay?${params.toString()}`;
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
