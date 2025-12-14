import { Badge } from "~/components/ui/badge";
import { X } from "lucide-react";

export function FilterChip({
  label,
  value,
  onClear,
}: {
  label: string;
  value: string;
  onClear: () => void;
}) {
  return (
    <Badge
      variant="secondary"
      className="gap-1 pr-1 hover:bg-secondary/80 transition-colors"
    >
      <span className="text-muted-foreground text-xs">{label}:</span>
      <span className="font-medium">{value}</span>
      <button
        type="button"
        onClick={onClear}
        className="ml-1 rounded-full p-0.5 hover:bg-background/50 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}
