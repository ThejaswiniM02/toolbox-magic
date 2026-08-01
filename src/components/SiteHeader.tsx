import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { useCallback } from "react";

function GoEliteButton() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (location.pathname === "/") {
        document.getElementById("elite")?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate({ to: "/", hash: "elite" });
      }
    },
    [location.pathname, navigate]
  );

  return (
    <button
      onClick={handleClick}
      className="ml-2 rounded-md bg-foreground px-3 py-2 text-xs font-semibold text-background hover:opacity-90"
    >
      Go Elite
    </button>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-4 w-4" />
          </span>
          <span>
            Tool<span className="text-gradient-brand">belt</span>
            <span className="text-muted-foreground"> studio</span>
          </span>

        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            activeProps={{ className: "rounded-md px-3 py-2 bg-accent text-foreground" }}
          >
            Home
          </Link>
          <Link
            to="/qr"
            className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            activeProps={{ className: "rounded-md px-3 py-2 bg-accent text-foreground" }}
          >
            QR Code
          </Link>
          <Link
            to="/invoice"
            className="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            activeProps={{ className: "rounded-md px-3 py-2 bg-accent text-foreground" }}
          >
            Invoice
          </Link>
          <GoEliteButton />
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Toolbelt Studio — Free tools for Indian businesses.</p>
          <p>Made in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
