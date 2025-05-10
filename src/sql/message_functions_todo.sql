
-- These functions would need to be added to Supabase for the Messages component to work fully
-- Currently using mock data, but these SQL functions would replace that

-- Function to get a user's conversations with most recent message
CREATE OR REPLACE FUNCTION public.get_user_conversations(user_id UUID)
RETURNS TABLE (
  other_user_id UUID,
  other_user_name TEXT,
  last_message TEXT,
  last_message_time TIMESTAMPTZ,
  unread_count BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
WITH conversation_participants AS (
  -- Get all users the current user has exchanged messages with
  SELECT DISTINCT
    CASE 
      WHEN sender_id = user_id THEN recipient_id
      ELSE sender_id
    END AS other_user_id
  FROM messages
  WHERE sender_id = user_id OR recipient_id = user_id
),
last_messages AS (
  -- Get the most recent message for each conversation
  SELECT DISTINCT ON (conversation_id) 
    conversation_id,
    id,
    content,
    created_at,
    sender_id
  FROM (
    SELECT 
      CASE 
        WHEN sender_id = user_id THEN recipient_id
        ELSE sender_id
      END AS conversation_id,
      id,
      content,
      created_at,
      sender_id
    FROM messages
    WHERE sender_id = user_id OR recipient_id = user_id
  ) AS subquery
  ORDER BY conversation_id, created_at DESC
),
unread_counts AS (
  -- Count unread messages for each conversation where user is recipient
  SELECT 
    sender_id AS conversation_id, 
    COUNT(*) AS unread_count
  FROM messages
  WHERE recipient_id = user_id AND is_read = FALSE
  GROUP BY sender_id
)

-- Join everything together with profile info
SELECT
  p.id AS other_user_id,
  p.full_name AS other_user_name,
  lm.content AS last_message,
  lm.created_at AS last_message_time,
  COALESCE(uc.unread_count, 0) AS unread_count
FROM conversation_participants cp
LEFT JOIN profiles p ON cp.other_user_id = p.id
LEFT JOIN last_messages lm ON cp.other_user_id = lm.conversation_id
LEFT JOIN unread_counts uc ON cp.other_user_id = uc.conversation_id
ORDER BY lm.created_at DESC NULLS LAST;
$$;

-- Function to get all messages between two users
CREATE OR REPLACE FUNCTION public.get_conversation_messages(user1_id UUID, user2_id UUID)
RETURNS TABLE (
  id UUID,
  sender_id UUID,
  recipient_id UUID,
  content TEXT,
  is_read BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  sender_name TEXT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
SELECT 
  m.id,
  m.sender_id,
  m.recipient_id,
  m.content,
  m.is_read,
  m.created_at,
  m.updated_at,
  p.full_name AS sender_name
FROM messages m
LEFT JOIN profiles p ON m.sender_id = p.id
WHERE (m.sender_id = user1_id AND m.recipient_id = user2_id) OR
      (m.sender_id = user2_id AND m.recipient_id = user1_id)
ORDER BY m.created_at ASC;
$$;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(reader_id UUID, sender_id UUID)
RETURNS void
LANGUAGE SQL
SECURITY DEFINER
AS $$
UPDATE messages
SET is_read = TRUE
WHERE recipient_id = reader_id AND sender_id = sender_id AND is_read = FALSE;
$$;
