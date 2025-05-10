
import { MessageCircle, PartyPopper, Star, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WellnessRating } from "@/types/wellness";

interface WellnessStatsCardsProps {
  totalPoints: number;
  tipsShared: number;
  celebrationsGiven: number;
  allRatings: WellnessRating[];
}

const WellnessStatsCards = ({ 
  totalPoints,
  tipsShared,
  celebrationsGiven,
  allRatings
}: WellnessStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Wellness Stars</CardTitle>
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
          <CardTitle className="text-sm font-medium">Baby Steps Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Star className="h-6 w-6 mr-2 text-amber-500 fill-amber-500" />
            <span className="text-3xl font-bold">
              {allRatings.filter(rating => rating.completed).length}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WellnessStatsCards;
