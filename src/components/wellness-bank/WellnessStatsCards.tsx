
import { MessageCircle, PartyPopper, Star, Trophy, Check, Users, Share } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WellnessRating } from "@/types/wellness";
import { Separator } from "@/components/ui/separator";

interface WellnessStatsCardsProps {
  totalPoints: number;
  tipsShared: number;
  celebrationsGiven: number;
  allRatings: WellnessRating[];
  communityMembers?: number;
  friendsInvited?: number;
  winsShared?: number;
}

const WellnessStatsCards = ({
  totalPoints,
  tipsShared,
  celebrationsGiven,
  allRatings,
  communityMembers = 0,
  friendsInvited = 0,
  winsShared = 0
}: WellnessStatsCardsProps) => {
  // Calculate total completed baby steps
  const totalBabyStepsCompleted = allRatings.filter(rating => rating.completed).length;

  // Calculate total daily wellness entries
  const uniqueDates = new Set(allRatings.map(rating => rating.date));
  const totalDailyEntries = uniqueDates.size;

  // Calculate external stars (tips + celebrations + invites + wins shared)
  const externalStars = tipsShared + celebrationsGiven + friendsInvited + winsShared;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-10">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-amber-500" /> 
            Personal Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Baby Steps Completed</span>
              <span className="font-medium">{totalBabyStepsCompleted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Daily Entries</span>
              <span className="font-medium">{totalDailyEntries}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Personal Stars</span>
              <span className="font-bold">{totalPoints}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Community Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tips Shared</span>
              <span className="font-medium">{tipsShared}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Celebrations Given</span>
              <span className="font-medium">{celebrationsGiven}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Friends Invited</span>
              <span className="font-medium">{friendsInvited}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Wins Shared</span>
              <span className="font-medium">{winsShared}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t">
              <span className="text-sm text-muted-foreground">Total Community Stars</span>
              <span className="font-bold">{externalStars}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Star className="h-5 w-5 mr-2 text-amber-500 fill-amber-500" />
            Overall Wellness Bank
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Personal Stars</span>
              <span className="font-medium">{totalPoints}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Community Stars</span>
              <span className="font-medium">{externalStars}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t">
              <span className="text-sm text-muted-foreground">Total Wellness Stars</span>
              <span className="font-bold">{totalPoints + externalStars}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WellnessStatsCards;
