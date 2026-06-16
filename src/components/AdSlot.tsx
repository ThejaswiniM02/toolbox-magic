interface AdSlotProps {
  label?: string;
  className?: string;
}

export function AdSlot({ label = "Advertisement", className = "" }: AdSlotProps) {
  return (
    <div
      className={`flex min-h-[120px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground ${className}`}
    >
      {label}
      {/* TODO: Replace with Google AdSense <ins> tag once approved */}
    </div>
  );
}
