
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface WellnessStreakProps {
  days: number;
}

const WellnessStreak = ({ days }: WellnessStreakProps) => {
  const getStreakMessage = (days: number) => {
    if (days === 0) return "Start your wellness streak today!";
    if (days === 1) return "You've started your wellness journey!";
    if (days < 5) return "Keep up the good work!";
    if (days < 10) return "You're building a healthy habit!";
    if (days < 30) return "Impressive dedication!";
    return "You're a wellness champion!";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Wellness Streak</CardTitle>
        <CardDescription>Consecutive days tracking wellness</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
            <Flame className="h-8 w-8 text-orange-500" />
          </div>
          <div>
            <div className="text-3xl font-bold">{days} {days === 1 ? 'day' : 'days'}</div>
            <p className="text-sm text-muted-foreground">{getStreakMessage(days)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessStreak;
