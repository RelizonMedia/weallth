
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TagInputProps {
  placeholder: string;
  onAdd: (value: string) => void;
}

export function TagInput({ placeholder, onAdd }: TagInputProps) {
  const [value, setValue] = useState("");
  
  const handleAdd = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
  };
  
  return (
    <div className="flex gap-2">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
          }
        }}
      />
      <Button 
        type="button" 
        onClick={handleAdd}
        disabled={!value.trim()}
      >
        Add
      </Button>
    </div>
  );
}
