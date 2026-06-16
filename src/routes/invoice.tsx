import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Plus, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { AdSlot } from "@/components/AdSlot";

export const Route = createFileRoute("/invoice")({
  head: () => ({
    meta: [
      { title: "GST Invoice Generator — Free Indian Invoice PDF | Toolkart.in" },
      {
        name: "description",
        content:
          "Create GST-compliant invoices for India. Auto-calculate CGST/SGST, totals in ₹, and download PDF instantly. Free.",
      },
      { property: "og:title", content: "Free GST Invoice Generator — Toolkart.in" },
      {
        property: "og:description",
        content: "Indian GST invoice PDF generator. Free, fast, no signup.",
      },
    ],
  }),
  component: InvoicePage,
});

interface LineItem {
  id: string;
  name: string;
  qty: number;
  rate: number;
  gst: number;
}

function InvoicePage() {
  const today = new Date().toISOString().slice(0, 10);
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [invoiceDate, setInvoiceDate] = useState(today);

  const [seller, setSeller] = useState({
    name: "Your Business Pvt Ltd",
    address: "123 Business St, Mumbai, Maharashtra 400001",
    gstin: "27AAAAA0000A1Z5",
    email: "hello@business.in",
    phone: "+91 98765 43210",
  });

  const [buyer, setBuyer] = useState({
    name: "",
    address: "",
    gstin: "",
  });

  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), name: "Sample item", qty: 1, rate: 1000, gst: 18 },
  ]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let gstTotal = 0;
    items.forEach((i) => {
      const amt = i.qty * i.rate;
      subtotal += amt;
      gstTotal += (amt * i.gst) / 100;
    });
    return { subtotal, gstTotal, grand: subtotal + gstTotal };
  }, [items]);

  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const removeItem = (id: string) => setItems((p) => p.filter((i) => i.id !== id));
  const addItem = () =>
    setItems((p) => [...p, { id: crypto.randomUUID(), name: "", qty: 1, rate: 0, gst: 18 }]);

  const downloadPdf = () => generatePdf({ invoiceNo, invoiceDate, seller, buyer, items, totals });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">GST Invoice Generator</h1>
            <p className="mt-2 text-muted-foreground">
              India-format invoice with GSTIN, auto-calculated GST, and ₹ totals.
            </p>
          </div>
          <button onClick={downloadPdf} className="inv-btn-primary">
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Invoice meta */}
            <Section title="Invoice Details">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Invoice Number">
                  <input className="inv-input" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
                </Field>
                <Field label="Invoice Date">
                  <input type="date" className="inv-input" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                </Field>
              </div>
            </Section>

            <div className="grid gap-6 md:grid-cols-2">
              <Section title="Seller (From)">
                <div className="space-y-3">
                  <input className="inv-input" placeholder="Business name" value={seller.name} onChange={(e) => setSeller({ ...seller, name: e.target.value })} />
                  <textarea className="inv-input resize-none" rows={2} placeholder="Address" value={seller.address} onChange={(e) => setSeller({ ...seller, address: e.target.value })} />
                  <input className="inv-input" placeholder="GSTIN" value={seller.gstin} onChange={(e) => setSeller({ ...seller, gstin: e.target.value })} />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="inv-input" placeholder="Email" value={seller.email} onChange={(e) => setSeller({ ...seller, email: e.target.value })} />
                    <input className="inv-input" placeholder="Phone" value={seller.phone} onChange={(e) => setSeller({ ...seller, phone: e.target.value })} />
                  </div>
                </div>
              </Section>

              <Section title="Buyer (Bill To)">
                <div className="space-y-3">
                  <input className="inv-input" placeholder="Customer name" value={buyer.name} onChange={(e) => setBuyer({ ...buyer, name: e.target.value })} />
                  <textarea className="inv-input resize-none" rows={2} placeholder="Address" value={buyer.address} onChange={(e) => setBuyer({ ...buyer, address: e.target.value })} />
                  <input className="inv-input" placeholder="GSTIN (optional)" value={buyer.gstin} onChange={(e) => setBuyer({ ...buyer, gstin: e.target.value })} />
                </div>
              </Section>
            </div>

            {/* Line items */}
            <Section
              title="Line Items"
              action={
                <button onClick={addItem} className="inv-btn-secondary">
                  <Plus className="h-4 w-4" /> Add item
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="pb-3 pr-2 font-semibold">Item</th>
                      <th className="pb-3 px-2 font-semibold w-20">Qty</th>
                      <th className="pb-3 px-2 font-semibold w-28">Rate (₹)</th>
                      <th className="pb-3 px-2 font-semibold w-20">GST %</th>
                      <th className="pb-3 px-2 font-semibold w-28 text-right">Amount</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((i) => {
                      const amt = i.qty * i.rate * (1 + i.gst / 100);
                      return (
                        <tr key={i.id} className="border-t border-border">
                          <td className="py-2 pr-2"><input className="inv-input" value={i.name} onChange={(e) => updateItem(i.id, { name: e.target.value })} /></td>
                          <td className="py-2 px-2"><input type="number" min={0} className="inv-input" value={i.qty} onChange={(e) => updateItem(i.id, { qty: Number(e.target.value) })} /></td>
                          <td className="py-2 px-2"><input type="number" min={0} className="inv-input" value={i.rate} onChange={(e) => updateItem(i.id, { rate: Number(e.target.value) })} /></td>
                          <td className="py-2 px-2">
                            <select className="inv-input" value={i.gst} onChange={(e) => updateItem(i.id, { gst: Number(e.target.value) })}>
                              {[0, 5, 12, 18, 28].map((g) => <option key={g} value={g}>{g}%</option>)}
                            </select>
                          </td>
                          <td className="py-2 px-2 text-right font-medium tabular-nums">₹{amt.toFixed(2)}</td>
                          <td className="py-2 pl-2">
                            <button onClick={() => removeItem(i.id)} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Section>

            <AdSlot label="Advertisement — 728×90" />
          </div>

          {/* Summary */}
          <aside className="space-y-6">
            <div className="sticky top-20 rounded-2xl border border-border bg-card p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Summary</p>
              <dl className="space-y-3 text-sm">
                <Row label="Subtotal" value={`₹${totals.subtotal.toFixed(2)}`} />
                <Row label="GST" value={`₹${totals.gstTotal.toFixed(2)}`} />
                <div className="my-3 border-t border-border" />
                <Row label="Grand Total" value={`₹${totals.grand.toFixed(2)}`} bold />
              </dl>
              <button onClick={downloadPdf} className="inv-btn-primary mt-6 w-full">
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </div>

            <AdSlot label="Advertisement — 300×250" />
          </aside>
        </div>
      </main>
      <SiteFooter />

      <style>{`
        .inv-input { width: 100%; padding: 0.5rem 0.625rem; border-radius: 0.5rem; border: 1px solid var(--color-border); background: var(--color-background); font-size: 0.875rem; outline: none; }
        .inv-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px oklch(0.45 0.18 265 / 0.1); }
        .inv-btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.625rem 1rem; border-radius: 0.5rem; background: var(--color-primary); color: var(--color-primary-foreground); font-size: 0.875rem; font-weight: 600; cursor: pointer; }
        .inv-btn-primary:hover { opacity: 0.9; }
        .inv-btn-secondary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.875rem; border-radius: 0.5rem; border: 1px solid var(--color-border); background: var(--color-background); font-size: 0.8125rem; font-weight: 500; cursor: pointer; }
        .inv-btn-secondary:hover { background: var(--color-accent); }
      `}</style>
    </div>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${bold ? "text-base font-bold" : "text-muted-foreground"}`}>
      <dt>{label}</dt>
      <dd className={`tabular-nums ${bold ? "text-foreground" : "text-foreground"}`}>{value}</dd>
    </div>
  );
}

interface PdfData {
  invoiceNo: string;
  invoiceDate: string;
  seller: { name: string; address: string; gstin: string; email: string; phone: string };
  buyer: { name: string; address: string; gstin: string };
  items: LineItem[];
  totals: { subtotal: number; gstTotal: number; grand: number };
}

function generatePdf(d: PdfData) {
  const doc = new jsPDF();
  const w = doc.internal.pageSize.getWidth();
  const rupee = "Rs."; // jsPDF default fonts don't render ₹ reliably

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("TAX INVOICE", 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${d.invoiceNo}`, w - 14, 16, { align: "right" });
  doc.text(`Date: ${d.invoiceDate}`, w - 14, 22, { align: "right" });

  // Seller / Buyer
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("FROM", 14, 36);
  doc.text("BILL TO", w / 2 + 4, 36);

  doc.setFont("helvetica", "normal");
  const sellerLines = [
    d.seller.name,
    ...doc.splitTextToSize(d.seller.address, 80),
    d.seller.gstin ? `GSTIN: ${d.seller.gstin}` : "",
    d.seller.email,
    d.seller.phone,
  ].filter(Boolean);
  doc.text(sellerLines, 14, 42);

  const buyerLines = [
    d.buyer.name || "—",
    ...doc.splitTextToSize(d.buyer.address || "", 80),
    d.buyer.gstin ? `GSTIN: ${d.buyer.gstin}` : "",
  ].filter(Boolean);
  doc.text(buyerLines, w / 2 + 4, 42);

  const startY = Math.max(42 + sellerLines.length * 5, 42 + buyerLines.length * 5) + 8;

  // Items table
  autoTable(doc, {
    startY,
    head: [["#", "Item", "Qty", "Rate", "GST %", "Amount"]],
    body: d.items.map((i, idx) => [
      idx + 1,
      i.name,
      i.qty,
      `${rupee}${i.rate.toFixed(2)}`,
      `${i.gst}%`,
      `${rupee}${(i.qty * i.rate * (1 + i.gst / 100)).toFixed(2)}`,
    ]),
    headStyles: { fillColor: [26, 26, 46], textColor: 255 },
    styles: { fontSize: 9 },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // Totals
  doc.setFontSize(10);
  const labelX = w - 70;
  const valX = w - 14;
  doc.text("Subtotal:", labelX, finalY);
  doc.text(`${rupee}${d.totals.subtotal.toFixed(2)}`, valX, finalY, { align: "right" });
  doc.text("GST:", labelX, finalY + 6);
  doc.text(`${rupee}${d.totals.gstTotal.toFixed(2)}`, valX, finalY + 6, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Grand Total:", labelX, finalY + 16);
  doc.text(`${rupee}${d.totals.grand.toFixed(2)}`, valX, finalY + 16, { align: "right" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text("Generated with Toolkart.in", 14, doc.internal.pageSize.getHeight() - 10);

  doc.save(`${d.invoiceNo}.pdf`);
}
