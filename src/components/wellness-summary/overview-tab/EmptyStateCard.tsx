
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateCardProps {
  message?: string;
  showAction?: boolean;
}

const EmptyStateCard = ({ 
  message = "No wellness data available for the selected date range.",
  showAction = true 
}: EmptyStateCardProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10 px-6 text-center space-y-4">
        <Calendar className="h-12 w-12 text-muted-foreground opacity-40" />
        <p className="text-muted-foreground">{message}</p>
        {showAction && (
          <Button asChild variant="outline" className="mt-4">
            <Link to="/track?mode=new">Track Today's Wellness</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyStateCard;
