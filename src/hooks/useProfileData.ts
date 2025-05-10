
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SocialLink } from "@/types/message";
import { Json } from "@/integrations/supabase/types";

interface ProfileData {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  interests: string[] | null;
  goals: string[] | null;
  dreams: string[] | null;
  social_links: SocialLink[] | null;
}

export function useProfileData(userId: string | undefined) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    username: null,
    full_name: null,
    avatar_url: null,
    bio: null,
    interests: [],
    goals: [],
    dreams: [],
    social_links: []
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        if (!userId) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url, bio, interests, goals, dreams, social_links')
          .eq('id', userId)
          .single();

        if (error) {
          throw error;
        }

        // Parse social_links from JSON to the expected format
        let parsedSocialLinks: SocialLink[] = [];
        
        if (data.social_links) {
          // Handle either a string or an array
          if (typeof data.social_links === 'string') {
            try {
              parsedSocialLinks = JSON.parse(data.social_links);
            } catch (e) {
              parsedSocialLinks = [];
            }
          } else if (Array.isArray(data.social_links)) {
            // It's already an array, ensure each element has platform and url
            parsedSocialLinks = (data.social_links as any[])
              .filter((link: any) => 
                typeof link === 'object' && 
                link !== null && 
                'platform' in link && 
                'url' in link
              ) as SocialLink[];
          }
        }

        setProfile({
          username: data.username,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          bio: data.bio,
          interests: data.interests || [],
          goals: data.goals || [],
          dreams: data.dreams || [],
          social_links: parsedSocialLinks
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: "Error loading profile",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId, toast]);

  const updateProfile = async () => {
    try {
      setLoading(true);
      if (!userId) return;

      // Convert SocialLinks array to a JSON structure for storage
      const updates = {
        id: userId,
        username: profile.username,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        interests: profile.interests,
        goals: profile.goals,
        dreams: profile.dreams,
        social_links: profile.social_links as unknown as Json,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated successfully",
        duration: 3000,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: [...(prev.interests || []), interest]
    }));
  };

  const removeInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: (prev.interests || []).filter(item => item !== interest)
    }));
  };

  const addGoal = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      goals: [...(prev.goals || []), goal]
    }));
  };

  const removeGoal = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      goals: (prev.goals || []).filter(item => item !== goal)
    }));
  };

  const addDream = (dream: string) => {
    setProfile(prev => ({
      ...prev,
      dreams: [...(prev.dreams || []), dream]
    }));
  };

  const removeDream = (dream: string) => {
    setProfile(prev => ({
      ...prev,
      dreams: (prev.dreams || []).filter(item => item !== dream)
    }));
  };

  const addSocialLink = (platform: string, url: string) => {
    // Ensure URL has protocol
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    
    setProfile(prev => ({
      ...prev,
      social_links: [...(prev.social_links || []), {
        platform: platform.trim(),
        url: formattedUrl
      }]
    }));
  };

  const removeSocialLink = (index: number) => {
    setProfile(prev => ({
      ...prev,
      social_links: (prev.social_links || []).filter((_, i) => i !== index)
    }));
  };

  const updateBasicInfo = {
    setUsername: (username: string) => setProfile(prev => ({ ...prev, username })),
    setFullName: (fullName: string) => setProfile(prev => ({ ...prev, full_name: fullName })),
    setBio: (bio: string) => setProfile(prev => ({ ...prev, bio }))
  };

  return {
    profile,
    loading,
    updateProfile,
    addInterest,
    removeInterest,
    addGoal,
    removeGoal,
    addDream,
    removeDream,
    addSocialLink,
    removeSocialLink,
    updateBasicInfo
  };
}
