
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TagListProps {
  items: string[];
  emptyMessage: string;
  onRemove: (item: string) => void;
}

export function TagList({ items, emptyMessage, onRemove }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {items && items.map((item, index) => (
        <Badge key={index} variant="secondary" className="flex items-center gap-1">
          {item}
          <button 
            type="button" 
            onClick={() => onRemove(item)}
            className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {(!items || items.length === 0) && (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </div>
  );
}
