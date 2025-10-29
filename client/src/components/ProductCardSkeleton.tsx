import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden" data-testid="skeleton-product-card">
      <CardHeader className="p-0">
        <div className="aspect-square bg-muted animate-pulse" />
      </CardHeader>
      
      <CardContent className="p-4 space-y-2">
        <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded animate-pulse w-full" />
        <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
        <div className="pt-2">
          <div className="h-8 bg-muted rounded animate-pulse w-24" />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="h-10 bg-muted rounded animate-pulse w-full" />
      </CardFooter>
    </Card>
  );
}
