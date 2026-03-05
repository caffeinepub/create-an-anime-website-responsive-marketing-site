interface SectionHeaderProps {
  title: string;
  accentColor?: string;
}

export function SectionHeader({ title, accentColor }: SectionHeaderProps) {
  const lineColor = accentColor ?? "oklch(0.68 0.18 25)";
  return (
    <div className="text-center mb-12">
      <h2
        className="text-4xl md:text-5xl font-bold mb-4 relative inline-block"
        style={{ color: "oklch(0.94 0.01 85)" }}
      >
        {title}
        <div
          className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
          style={{ backgroundColor: lineColor }}
        />
      </h2>
    </div>
  );
}
