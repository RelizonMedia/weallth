
import { Card, CardContent } from "@/components/ui/card";

const EmptyStateCard = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground">No wellness data available for the selected date range.</p>
      </CardContent>
    </Card>
  );
};

export default EmptyStateCard;
