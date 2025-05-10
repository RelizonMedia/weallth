
import { Label } from "@/components/ui/label";
import { TagInput } from "./TagInput";
import { TagList } from "./TagList";

interface ProfileSectionProps {
  title: string;
  emptyMessage: string;
  items: string[] | null;
  inputPlaceholder: string;
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
}

export function ProfileTabSection({
  title,
  emptyMessage,
  items,
  inputPlaceholder,
  onAdd,
  onRemove,
}: ProfileSectionProps) {
  return (
    <div className="space-y-2">
      <Label>{title}</Label>
      <TagList 
        items={items || []} 
        emptyMessage={emptyMessage} 
        onRemove={onRemove} 
      />
      <TagInput 
        placeholder={inputPlaceholder} 
        onAdd={onAdd} 
      />
    </div>
  );
}
