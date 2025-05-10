
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
  
  return <div className="space-y-6 mb-6">
      {/* Internal Stars Section */}
      <div>
        <div className="flex items-center mb-2">
          <Star className="h-5 w-5 mr-2 text-amber-500 fill-amber-500" />
          <h2 className="text-lg font-semibold">Personal Stars Awarded</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Stars Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Trophy className="h-6 w-6 mr-2 text-amber-500" />
                <span className="text-3xl font-bold">{totalPoints}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Daily Tracking Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Check className="h-6 w-6 mr-2 text-green-500" />
                <span className="text-3xl font-bold">{totalDailyEntries}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Baby Steps Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Star className="h-6 w-6 mr-2 text-amber-500 fill-amber-500" />
                <span className="text-3xl font-bold">
                  {totalBabyStepsCompleted}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Separator />
      
      {/* External Stars Section */}
      <div>
        <div className="flex items-center mb-2">
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          <h2 className="text-lg font-semibold">Community Stars Awarded</h2>
          <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Total: {externalStars}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Wellness Tips Shared</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MessageCircle className="h-6 w-6 mr-2 text-blue-500" />
                <span className="text-3xl font-bold">{tipsShared}</span>
                <Star className="h-4 w-4 ml-2 text-amber-500 fill-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Celebrations Given</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <PartyPopper className="h-6 w-6 mr-2 text-purple-500" />
                <span className="text-3xl font-bold">{celebrationsGiven}</span>
                <Star className="h-4 w-4 ml-2 text-amber-500 fill-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Friends Invited</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-6 w-6 mr-2 text-green-500" />
                <span className="text-3xl font-bold">{friendsInvited}</span>
                <Star className="h-4 w-4 ml-2 text-amber-500 fill-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Wins Shared</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Share className="h-6 w-6 mr-2 text-indigo-500" />
                <span className="text-3xl font-bold">{winsShared}</span>
                <Star className="h-4 w-4 ml-2 text-amber-500 fill-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};

export default WellnessStatsCards;
