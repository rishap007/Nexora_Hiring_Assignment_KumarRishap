import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  isInWishlist: boolean;
}

export function ProductQuickView({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
}: ProductQuickViewProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick View</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
              <p className="text-2xl font-bold text-primary">${product.price}</p>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => {
                  onAddToCart(product.id);
                  onClose();
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>

              <Button
                size="lg"
                variant={isInWishlist ? "default" : "outline"}
                onClick={() => onToggleWishlist(product.id)}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
              </Button>
            </div>

            <Link href={`/product/${product.id}`}>
              <Button variant="ghost" className="w-full" onClick={onClose}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Full Details
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
