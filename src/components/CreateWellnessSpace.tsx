
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Globe, Lock, Image, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateWellnessSpaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (spaceData: any) => void;
}

const CreateWellnessSpace = ({ open, onOpenChange, onCreated }: CreateWellnessSpaceProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [allowInvites, setAllowInvites] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaType, setMediaType] = useState<"none" | "image" | "video">("none");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const fileType = file.type.split('/')[0];
    if ((mediaType === "image" && fileType !== "image") || 
        (mediaType === "video" && fileType !== "video")) {
      toast({
        title: "Invalid file type",
        description: `Please select a ${mediaType} file.`,
        variant: "destructive",
      });
      return;
    }
    
    setMediaFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setMediaPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be a call to your API/database
      // For now, we'll simulate the creation with a timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newSpace = {
        id: `space-${Date.now()}`,
        name,
        description,
        isPrivate: privacy === "private",
        allowInvites,
        members: 1,
        createdAt: new Date().toISOString(),
        // If we had real file storage, we'd upload the file and get a URL
        mediaUrl: mediaPreview,
        mediaType: mediaFile ? mediaType : "none",
      };
      
      toast({
        title: "Wellness space created!",
        description: `You've created "${name}" successfully.`,
      });
      
      if (onCreated) {
        onCreated(newSpace);
      }
      
      // Reset form and close dialog
      setName("");
      setDescription("");
      setPrivacy("public");
      setAllowInvites(true);
      setMediaType("none");
      setMediaFile(null);
      setMediaPreview(null);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Failed to create space",
        description: "An error occurred while creating your wellness space.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a Wellness Space</DialogTitle>
            <DialogDescription>
              Create a space where you and others can support each other on your wellness journeys.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Space Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Morning Runners Club"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this space about?"
                className="min-h-[80px]"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Privacy Setting</Label>
              <RadioGroup value={privacy} onValueChange={setPrivacy} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="flex items-center cursor-pointer">
                    <Globe className="h-4 w-4 mr-2 text-blue-500" />
                    Public
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="flex items-center cursor-pointer">
                    <Lock className="h-4 w-4 mr-2 text-purple-500" />
                    Private
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-sm text-muted-foreground mt-1">
                {privacy === "public" 
                  ? "Anyone can find and join this space" 
                  : "Only people you invite can join this space"}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="allow-invites" 
                checked={allowInvites} 
                onCheckedChange={setAllowInvites} 
              />
              <Label htmlFor="allow-invites">Allow members to invite others</Label>
            </div>

            {/* Media upload section */}
            <div className="grid gap-2">
              <Label>Add Media (Optional)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={mediaType === "image" ? "default" : "outline"}
                  className="flex items-center"
                  onClick={() => {
                    setMediaType("image");
                    clearMedia();
                  }}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Image
                </Button>
                <Button
                  type="button"
                  variant={mediaType === "video" ? "default" : "outline"}
                  className="flex items-center"
                  onClick={() => {
                    setMediaType("video");
                    clearMedia();
                  }}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Button>
                {mediaType !== "none" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setMediaType("none");
                      clearMedia();
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>

              {mediaType !== "none" && (
                <div className="mt-2">
                  <Input
                    type="file"
                    accept={mediaType === "image" ? "image/*" : "video/*"}
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {mediaType === "image" 
                      ? "Supported formats: JPG, PNG, GIF (max 5MB)" 
                      : "Supported formats: MP4, WebM (max 20MB)"}
                  </p>
                </div>
              )}

              {mediaPreview && (
                <div className="mt-2 border rounded-md p-2">
                  {mediaType === "image" && (
                    <img 
                      src={mediaPreview} 
                      alt="Preview" 
                      className="max-h-40 mx-auto rounded-md" 
                    />
                  )}
                  {mediaType === "video" && (
                    <video 
                      src={mediaPreview} 
                      controls 
                      className="max-h-40 w-full rounded-md" 
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Space"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWellnessSpace;
