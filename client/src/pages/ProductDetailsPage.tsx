import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import type { Product, CartItemWithProduct, WishlistWithProduct } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailsPage() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  const { data: cartData } = useQuery<{ items: CartItemWithProduct[]; total: string }>({
    queryKey: ['/api/cart'],
  });

  const { data: wishlistItems = [] } = useQuery<WishlistWithProduct[]>({
    queryKey: ['/api/wishlist'],
  });

  const cartItems = cartData?.items || [];
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isInWishlist = wishlistItems.some(item => item.productId === productId);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/cart', { productId, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: async () => {
      if (isInWishlist) {
        const item = wishlistItems.find(item => item.productId === productId);
        if (item) {
          await apiRequest('DELETE', `/api/wishlist/${item.id}`);
        }
      } else {
        await apiRequest('POST', '/api/wishlist', { productId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      toast({
        title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
        description: isInWishlist ? "Item removed from your wishlist" : "Item added to your wishlist",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={totalItemCount} onCartClick={() => setIsCartOpen(true)} />
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={totalItemCount} onCartClick={() => setIsCartOpen(true)} />
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={totalItemCount} onCartClick={() => setIsCartOpen(true)} />

      <div className="container mx-auto px-6 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </Card>

          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">{product.category}</Badge>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-primary">${product.price}</p>
            </div>

            <p className="text-lg text-muted-foreground">{product.description}</p>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => addToCartMutation.mutate()}
                disabled={addToCartMutation.isPending}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
              </Button>

              <Button
                size="lg"
                variant={isInWishlist ? "default" : "outline"}
                onClick={() => toggleWishlistMutation.mutate()}
                disabled={toggleWishlistMutation.isPending}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
              </Button>
            </div>

            <div className="border-t pt-6 space-y-3">
              <h3 className="font-semibold text-lg">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Product ID</p>
                  <p className="font-medium">{product.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
