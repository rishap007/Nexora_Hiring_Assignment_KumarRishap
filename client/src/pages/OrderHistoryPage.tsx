import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import type { Order, CartItemWithProduct } from "@shared/schema";
import { format } from "date-fns";

export default function OrderHistoryPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });

  const { data: cartData } = useQuery<{ items: CartItemWithProduct[]; total: string }>({
    queryKey: ['/api/cart'],
  });

  const cartItems = cartData?.items || [];
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Order History</h1>
          <p className="text-muted-foreground">View your past orders and receipts</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-16">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
            <Link href="/">
              <Button>Start Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderItems = JSON.parse(order.items);
              return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">
                          Order #{order.id.split('-')[0].toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(order.createdAt), "PPP 'at' p")}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-lg font-bold">
                        ${order.total}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Customer Name</p>
                          <p className="font-medium">{order.customerName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium">{order.customerEmail}</p>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <p className="text-sm font-semibold mb-2">Items Ordered:</p>
                        <div className="space-y-2">
                          {orderItems.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>
                                {item.productName} x {item.quantity}
                              </span>
                              <span className="font-medium">${item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
