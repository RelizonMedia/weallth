
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
