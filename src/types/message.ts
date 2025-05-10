
export type MessageData = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  senderName?: string;
  recipientName?: string;
};

export type MessageConversation = {
  userId: string;
  userName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
};

// For RPC function results
export type ConversationResult = {
  other_user_id: string;
  other_user_name: string | null;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
};

export type MessageResult = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender_name: string | null;
};

export type SocialLink = {
  platform: string;
  url: string;
};

export type WellnessSpaceData = {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  members: number;
  createdAt: string;
  isCreator: boolean;
  mediaUrl: string | null;
  mediaType: 'none' | 'image' | 'video';
  ownerId?: string;
};

export type PrivacyLevel = 'private' | 'friends' | 'spaces' | 'public';

export type MetricPrivacySetting = {
  metricId: string;
  privacyLevel: PrivacyLevel;
  allowedSpaceIds?: string[];
  allowedUserIds?: string[];
};
