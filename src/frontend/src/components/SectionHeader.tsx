interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 relative inline-block">
        {title}
        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-accent rounded-full" />
      </h2>
    </div>
  );
}
