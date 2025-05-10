
import { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketplaceFilters from "@/components/MarketplaceFilters";
import ProductCard from "@/components/ProductCard";
import MarketplaceRecommendations from "@/components/MarketplaceRecommendations";
import { Search } from "lucide-react";
import { marketplaceProducts } from "@/data/marketplaceData";

const MarketplacePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = marketplaceProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Wellness Marketplace</h1>
          <p className="text-muted-foreground">
            Discover wellness products, retreats, consultations, and services that can help you on your wellness journey.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products, services, or providers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>Advanced Search</Button>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="retreats">Retreats</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <MarketplaceFilters />
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              <MarketplaceRecommendations />
              
              <h2 className="text-xl font-semibold mb-4">
                {filteredProducts.length} results found
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MarketplacePage;
