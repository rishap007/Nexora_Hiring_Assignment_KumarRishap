import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Heart, Eye } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  onQuickView?: (product: Product) => void;
  isAdding?: boolean;
  isInWishlist?: boolean;
}

export function ProductCard({ product, onAddToCart, onToggleWishlist, onQuickView, isAdding, isInWishlist }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden hover-elevate transition-all duration-300 hover:-translate-y-1" data-testid={`card-product-${product.id}`}>
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            data-testid={`img-product-${product.id}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Wishlist and Quick View buttons */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {onToggleWishlist && (
              <Button
                size="icon"
                variant={isInWishlist ? "default" : "secondary"}
                onClick={(e) => {
                  e.preventDefault();
                  onToggleWishlist(product.id);
                }}
                className="h-8 w-8"
              >
                <Heart className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`} />
              </Button>
            )}
            {onQuickView && (
              <Button
                size="icon"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
                className="h-8 w-8"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Category badge */}
          <Badge variant="secondary" className="absolute top-2 left-2">
            {product.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-product-description-${product.id}`}>
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Price</span>
            <span className="text-2xl font-bold font-mono tabular-nums bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent" data-testid={`text-product-price-${product.id}`}>
              ${product.price}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          onClick={() => onAddToCart(product.id)}
          disabled={isAdding}
          className="flex-1 gap-2 font-medium uppercase tracking-wide"
          data-testid={`button-add-to-cart-${product.id}`}
        >
          <Plus className="w-4 h-4" />
          {isAdding ? "Adding..." : "Add to Cart"}
        </Button>
        <Link href={`/product/${product.id}`}>
          <Button variant="outline" size="icon">
            <Eye className="w-4 h-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
