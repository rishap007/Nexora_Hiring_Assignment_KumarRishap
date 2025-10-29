import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutFormSchema, type CheckoutForm, type Receipt, type CartItemWithProduct } from "@shared/schema";
import { Header } from "@/components/Header";
import { ReceiptModal } from "@/components/ReceiptModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const { toast } = useToast();

  const { data: cartData } = useQuery<{ items: CartItemWithProduct[]; total: string }>({
    queryKey: ['/api/cart'],
  });

  const cartItems = cartData?.items || [];
  const total = cartData?.total || "0.00";

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      const response = await apiRequest('POST', '/api/checkout', {
        customerName: data.name,
        customerEmail: data.email,
      });
      const receipt = await response.json();
      console.log('Checkout receipt:', receipt);
      return receipt as Receipt;
    },
    onSuccess: (data) => {
      setReceipt(data);
      setIsReceiptOpen(true);
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: CheckoutForm) => {
    checkoutMutation.mutate(data);
  };

  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
    setLocation("/");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={0} onCartClick={() => {}} />
        
        <div className="container mx-auto px-6 py-16">
          <div className="flex flex-col items-center justify-center py-24 text-center" data-testid="empty-checkout-state">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some products before checking out
            </p>
            <Link href="/">
              <Button className="gap-2" data-testid="button-back-to-products">
                <ArrowLeft className="w-4 h-4" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} onCartClick={() => {}} />

      <div className="container mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover-elevate active-elevate-2 rounded-lg px-3 py-2 -ml-3 mb-6" data-testid="link-back-to-products">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <h1 className="font-display text-4xl font-bold mb-8" data-testid="text-checkout-title">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              {...field}
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold uppercase tracking-wide"
                      disabled={checkoutMutation.isPending}
                      data-testid="button-place-order"
                    >
                      {checkoutMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="font-display">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3" data-testid={`summary-item-${item.id}`}>
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight line-clamp-2" data-testid={`summary-item-name-${item.id}`}>
                          {item.product.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-semibold text-sm" data-testid={`summary-item-price-${item.id}`}>
                            ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-2xl font-mono tabular-nums bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent" data-testid="text-order-total">
                    ${total}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={handleCloseReceipt}
        receipt={receipt}
      />
    </div>
  );
}
