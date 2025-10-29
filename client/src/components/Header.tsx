import { ShoppingCart, Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "wouter";
import type { CartItemWithProduct } from "@shared/schema";

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  cartItems?: CartItemWithProduct[];
  cartTotal?: string;
}

export function Header({ cartItemCount, onCartClick, searchQuery = "", onSearchChange, cartItems = [], cartTotal = "0.00" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-lg px-4 py-2 -ml-4" data-testid="link-home">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent whitespace-nowrap">
            VIBE COMMERCE
          </h1>
        </Link>

        {onSearchChange && (
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 w-full"
              data-testid="input-search"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Package className="w-4 h-4 mr-2" />
              Orders
            </Button>
          </Link>
          <ThemeToggle />

          {cartItemCount > 0 ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onCartClick}
                  className="relative"
                  data-testid="button-cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <Badge
                    variant="default"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold animate-in zoom-in-50"
                    data-testid="badge-cart-count"
                  >
                    {cartItemCount}
                  </Badge>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80" align="end">
                <div className="space-y-3">
                  <h4 className="font-semibold">Shopping Cart</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {cartItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex gap-3 text-sm">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium line-clamp-1">{item.product.name}</p>
                          <p className="text-muted-foreground">
                            {item.quantity} x ${item.product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                    {cartItems.length > 3 && (
                      <p className="text-sm text-muted-foreground text-center">
                        +{cartItems.length - 3} more items
                      </p>
                    )}
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between font-semibold mb-3">
                      <span>Total:</span>
                      <span>${cartTotal}</span>
                    </div>
                    <Button className="w-full" onClick={onCartClick}>
                      View Cart
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={onCartClick}
              className="relative"
              data-testid="button-cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
