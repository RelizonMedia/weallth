
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    tags: string[];
    provider: {
      name: string;
      verified: boolean;
    };
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <button 
          className={`absolute top-2 right-2 p-1.5 rounded-full ${
            isFavorite ? 'bg-primary text-primary-foreground' : 'bg-background/80'
          }`}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        {product.tags.includes("best-seller") && (
          <Badge className="absolute bottom-2 left-2 bg-primary">Best Seller</Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
          <span className="font-bold">${product.price}</span>
        </div>
        <div className="text-sm text-muted-foreground flex items-center">
          <span>{product.provider.name}</span>
          {product.provider.verified && (
            <Badge variant="outline" className="ml-1 px-1 py-0 h-4 text-xs">Verified</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            ({product.reviews} reviews)
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button size="sm" className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
