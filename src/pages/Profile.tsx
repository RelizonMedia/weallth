
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfileData } from "@/hooks/useProfileData";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { BasicInfoForm } from "@/components/profile/BasicInfoForm";
import { ProfileTabSection } from "@/components/profile/ProfileTabSection";
import { SocialLinksSection } from "@/components/profile/SocialLinksSection";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  
  const {
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
  } = useProfileData(user?.id);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile();
  };

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Complete your profile to help others connect with you
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleUpdateProfile}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mx-6 mt-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="interests">Interests & Goals</TabsTrigger>
                <TabsTrigger value="dreams">Dreams</TabsTrigger>
                <TabsTrigger value="social">Social Links</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <CardContent className="space-y-6">
                  <ProfileHeader 
                    avatarUrl={profile.avatar_url} 
                    username={profile.username} 
                    email={user?.email} 
                  />
                  
                  <BasicInfoForm
                    email={user?.email || ''}
                    username={profile.username}
                    fullName={profile.full_name}
                    bio={profile.bio}
                    onUsernameChange={updateBasicInfo.setUsername}
                    onFullNameChange={updateBasicInfo.setFullName}
                    onBioChange={updateBasicInfo.setBio}
                  />
                </CardContent>
              </TabsContent>
              
              <TabsContent value="interests">
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <ProfileTabSection
                      title="Interests"
                      emptyMessage="Add some interests to help connect with like-minded individuals"
                      items={profile.interests}
                      inputPlaceholder="Add an interest..."
                      onAdd={addInterest}
                      onRemove={removeInterest}
                    />
                    
                    <ProfileTabSection
                      title="Wellness Goals"
                      emptyMessage="Add some wellness goals to share your journey"
                      items={profile.goals}
                      inputPlaceholder="Add a wellness goal..."
                      onAdd={addGoal}
                      onRemove={removeGoal}
                    />
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="dreams">
                <CardContent className="space-y-6">
                  <ProfileTabSection
                    title="Personal Dreams"
                    emptyMessage="Add some personal dreams you'd like to achieve"
                    items={profile.dreams}
                    inputPlaceholder="Add a personal dream..."
                    onAdd={addDream}
                    onRemove={removeDream}
                  />
                </CardContent>
              </TabsContent>
              
              <TabsContent value="social">
                <CardContent className="space-y-6">
                  <SocialLinksSection 
                    socialLinks={profile.social_links || []} 
                    onAdd={addSocialLink} 
                    onRemove={removeSocialLink} 
                  />
                </CardContent>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="flex justify-between border-t p-6">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  const tabs = ["basic", "interests", "dreams", "social"];
                  const currentIndex = tabs.indexOf(activeTab);
                  const nextIndex = (currentIndex + 1) % tabs.length;
                  setActiveTab(tabs[nextIndex]);
                }}
              >
                {activeTab === "basic" ? "Next: Interests" : 
                 activeTab === "interests" ? "Next: Dreams" : 
                 activeTab === "dreams" ? "Next: Social" : "Back to Basics"}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
