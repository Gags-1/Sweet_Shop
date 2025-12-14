import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Tag,
  Candy,
  PackageX,
  ShoppingCart,
  Plus,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "~/lib/utils";
// Assuming you have this type defined somewhere, if not, uncomment below
// export type Sweet = {
//   id: string | number;
//   name: string;
//   category: string;
//   price: number;
//   quantity: number;
// };
import type { Sweet } from "~/lib/types";

interface ProductCardProps {
  sweet: Sweet;
  inCart: number;
  onAddToCart: () => void;
  currency: (n: number) => string;
}

export function ProductCard({
  sweet,
  inCart,
  onAddToCart,
  currency,
}: ProductCardProps) {
  const outOfStock = sweet.quantity === 0;
  const maxed = inCart >= sweet.quantity && sweet.quantity > 0;
  // Define low stock threshold (e.g., 5 or less)
  const lowStockThreshold = 5;
  const lowStock =
    sweet.quantity > 0 && sweet.quantity <= lowStockThreshold;

  // Dynamic status rendering based on stock level
  const StockStatus = () => {
    if (outOfStock) {
      return (
        <div className="flex items-center text-destructive text-sm font-medium bg-destructive/10 px-2 py-1 rounded-md">
          <PackageX className="h-3.5 w-3.5 mr-1.5" />
          Out of Stock
        </div>
      );
    }

    if (lowStock) {
      return (
        <div className="flex items-center text-amber-600 text-sm font-medium bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded-md">
          <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
          Only {sweet.quantity} left!
        </div>
      );
    }

    return (
      <div className="flex items-center text-muted-foreground text-sm">
        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
        {sweet.quantity} in stock
      </div>
    );
  };

  return (
    <Card
      className={cn(
        "group h-full flex flex-col overflow-hidden transition-all duration-300 relative",
        "border-border/60 hover:border-primary/50 hover:shadow-md",
        outOfStock ? "bg-muted/30" : "bg-card"
      )}
    >
      {/* Header Image Placeholder & Category */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-accent/20 flex items-center justify-center">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent scale-150 group-hover:scale-125 transition-transform duration-500" />

        <Candy
          className={cn(
            "h-12 w-12 transition-all duration-300",
            outOfStock
              ? "text-muted-foreground/40"
              : "text-primary/40 group-hover:text-primary/60 group-hover:scale-110"
          )}
        />

        {/* Floating Category Badge */}
        <Badge
          variant="secondary"
          className="absolute bottom-2 left-4 bg-background/95 backdrop-blur-md shadow-sm border-primary/10 pl-2 pr-3 py-1 flex items-center gap-1 text-xs z-10 pointer-events-none"
        >
          <Tag className="h-3 w-3 text-primary" />
          {sweet.category}
        </Badge>
      </div>

      <CardHeader className="p-4 pb-2 flex-grow">
        {/* Product Name */}
        <h3
          className={cn(
            "font-bold text-lg leading-tight line-clamp-2 tracking-tight",
            outOfStock ? "text-muted-foreground" : "group-hover:text-primary transition-colors"
          )}
          title={sweet.name}
        >
          {sweet.name}
        </h3>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3">
        {/* Price and Stock Status Row */}
        <div className="flex items-end justify-between gap-2 flex-wrap">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Price</span>
            <span
              className={cn(
                "text-2xl font-extrabold tracking-tight",
                outOfStock ? "text-muted-foreground" : "text-primary"
              )}
            >
              {currency(sweet.price)}
            </span>
          </div>
          <StockStatus />
        </div>
      </CardContent>

      <CardFooter className={cn("p-4 pt-0 flex flex-col gap-2", outOfStock && "opacity-80")}>
        {/* In Cart Indicator placed above button for better context */}
        <div className="h-5 w-full flex items-center justify-center">
          {inCart > 0 && !outOfStock && (
            <span className="text-xs font-medium text-primary animate-in fade-in slide-in-from-bottom-1">
              You have {inCart} in cart
            </span>
          )}
        </div>

        {/* Main Action Button */}
        <Button
          size="lg"
          onClick={onAddToCart}
          disabled={outOfStock || maxed}
          className={cn(
            "w-full gap-2 font-semibold tracking-wide shadow-sm",
            // Only add hover scale if it's actually clickable
            !outOfStock && !maxed && "transition-transform hover:scale-[1.02] active:scale-[0.98]"
          )}
          variant={maxed ? "secondary" : outOfStock ? "ghost" : "default"}
        >
          {outOfStock ? (
            <>
              Sold Out
            </>
          ) : maxed ? (
            <>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              Limit Reached
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}