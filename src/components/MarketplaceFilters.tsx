
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const MarketplaceFilters = () => {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showOnlyRated, setShowOnlyRated] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Price Range</h3>
          <div>
            <Slider 
              defaultValue={[0, 500]} 
              max={1000} 
              step={10} 
              value={priceRange}
              onValueChange={setPriceRange}
              className="my-4"
            />
            <div className="flex justify-between">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Rating</h3>
          <div className="flex items-center space-x-2">
            <Checkbox id="4-stars" />
            <Label htmlFor="4-stars">4 stars & up</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="3-stars" />
            <Label htmlFor="3-stars">3 stars & up</Label>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Provider</h3>
          <div className="flex items-center space-x-2">
            <Checkbox id="certified" />
            <Label htmlFor="certified">Certified Providers</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="featured" />
            <Label htmlFor="featured">Featured Partners</Label>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="rated-only">Show only rated products</Label>
            <Switch 
              id="rated-only" 
              checked={showOnlyRated} 
              onCheckedChange={setShowOnlyRated} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceFilters;
