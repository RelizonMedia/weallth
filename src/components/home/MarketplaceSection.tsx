
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";

interface MarketplaceSectionProps {
  recommendedProducts: any[];
}

const MarketplaceSection = ({ recommendedProducts }: MarketplaceSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wellness Marketplace</CardTitle>
        <CardDescription>
          Discover products and services to enhance your wellness journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline">
            <Link to="/marketplace">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Visit Full Marketplace
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceSection;
