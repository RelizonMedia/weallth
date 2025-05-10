
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { marketplaceProducts } from "@/data/marketplaceData";
import ProductCard from "./ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MarketplaceRecommendations = () => {
  // Simulate personalized recommendations
  const personalizedProducts = marketplaceProducts
    .filter(product => product.tags.includes("recommended"))
    .slice(0, 3);

  // Get trending products
  const trendingProducts = marketplaceProducts
    .filter(product => product.tags.includes("trending"))
    .slice(0, 3);
    
  // Get highest rated products
  const highestRated = [...marketplaceProducts]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
        <CardDescription>
          Products and services tailored to your wellness journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personalized">
          <TabsList className="mb-4">
            <TabsTrigger value="personalized">For You</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="highest-rated">Highest Rated</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personalized">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {personalizedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trending">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trendingProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="highest-rated">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {highestRated.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketplaceRecommendations;
