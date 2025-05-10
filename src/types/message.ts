
export interface MessageData {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  senderName?: string;
}

export interface MessageConversation {
  userId: string;
  userName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export interface ConversationResult {
  other_user_id: string;
  other_user_name: string | null;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number | null;
}

export interface MessageResult {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender_name?: string | null;
}

export interface SocialLink {
  platform: string;
  url: string;
}
