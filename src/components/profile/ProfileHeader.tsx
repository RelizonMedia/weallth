
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  avatarUrl: string | null;
  username: string | null;
  email: string | null;
}

export function ProfileHeader({ avatarUrl, username, email }: ProfileHeaderProps) {
  return (
    <div className="flex justify-center mb-6">
      <Avatar className="w-24 h-24">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>
          {username?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
