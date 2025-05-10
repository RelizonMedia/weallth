
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoFormProps {
  email: string;
  username: string | null;
  fullName: string | null;
  bio: string | null;
  onUsernameChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
  onBioChange: (value: string) => void;
}

export function BasicInfoForm({
  email,
  username,
  fullName,
  bio,
  onUsernameChange,
  onFullNameChange,
  onBioChange,
}: BasicInfoFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email || ''} disabled />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input 
          id="username" 
          value={username || ''} 
          onChange={(e) => onUsernameChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input 
          id="fullName" 
          value={fullName || ''} 
          onChange={(e) => onFullNameChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio" 
          placeholder="Tell others about yourself..."
          value={bio || ''} 
          onChange={(e) => onBioChange(e.target.value)}
          className="min-h-[120px]"
        />
      </div>
    </div>
  );
}
