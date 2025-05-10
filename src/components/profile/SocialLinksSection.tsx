
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { SocialLink } from "@/types/message";

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
  onAdd: (platform: string, url: string) => void;
  onRemove: (index: number) => void;
}

export function SocialLinksSection({ socialLinks, onAdd, onRemove }: SocialLinksSectionProps) {
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  
  const handleAdd = () => {
    if (!platform.trim() || !url.trim()) return;
    onAdd(platform.trim(), url.trim());
    setPlatform("");
    setUrl("");
  };
  
  return (
    <div className="space-y-2">
      <Label>Social Media Links</Label>
      <div className="space-y-2 mb-4">
        {socialLinks && socialLinks.map((link, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <p className="font-medium">{link.platform}</p>
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {link.url}
              </a>
            </div>
            <Button 
              type="button" 
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {(!socialLinks || socialLinks.length === 0) && (
          <p className="text-sm text-muted-foreground">Add your social media profiles to connect with others</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Input
            id="platform"
            placeholder="e.g. Instagram, Twitter, LinkedIn"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            placeholder="e.g. https://instagram.com/username"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      </div>
      <Button 
        type="button" 
        onClick={handleAdd}
        disabled={!platform.trim() || !url.trim()}
        className="w-full md:w-auto"
      >
        Add Social Link
      </Button>
    </div>
  );
}
