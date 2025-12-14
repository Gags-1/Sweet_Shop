import React from "react";
import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import {
  getSweets,
  searchSweets,
  getToken,
  getUsernameFromToken,
  getTokenFromCookieHeader,
  isAdmin as checkAdmin,
  purchaseSweet,
} from "~/lib/api";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  ShoppingCart,
  PackageX,
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { FilterChip } from "~/components/filter-chip";
import { ProductCard } from "~/components/product-card";
import { SiteHeader } from "~/components/site-header";
import type { Sweet } from "~/lib/types";
import CartSheet from "~/components/cart";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sweet Shop - Delicious Treats Await" },
    { name: "description", content: "Browse and buy the finest sweets" },
  ];
}

// Active filter chip component


export default function Home() {
  const data = useLoaderData<typeof loader>() as {
    sweets: Sweet[];
    username: string | null;
    isAdmin: boolean;
    filters?: {
      name?: string;
      category?: string;
      min_price?: string;
      max_price?: string;
    };
    isAuthenticated: boolean;
  };

  const [cart, setCart] = React.useState<Record<string, number>>({});
  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const currency = (n: number) => `$${n.toFixed(2)}`;

  const hasActiveFilters = !!(
    data.filters?.name ||
    data.filters?.category ||
    data.filters?.min_price ||
    data.filters?.max_price
  );

  const activeFilterCount = [
    data.filters?.name,
    data.filters?.category,
    data.filters?.min_price,
    data.filters?.max_price,
  ].filter(Boolean).length;

  // Get unique categories for quick filters
  const categories = React.useMemo(() => {
    const cats = new Set(data.sweets.map((s) => s.category));
    return Array.from(cats).sort();
  }, [data.sweets]);

  const handleAddToCart = (s: Sweet) => {
    const id = String(s.id);
    setCart((curr) => {
      const qtyInCart = curr[id] ?? 0;
      const next = Math.min(qtyInCart + 1, s.quantity);
      if (next === qtyInCart) return curr;
      return { ...curr, [id]: next };
    });
  };

  const handleIncrement = (id: string) => {
    const sweet = data.sweets.find((sw) => String(sw.id) === id);
    if (!sweet) return;
    setCart((curr) => {
      const nextQty = Math.min((curr[id] ?? 0) + 1, sweet.quantity);
      return { ...curr, [id]: nextQty };
    });
  };

  const handleDecrement = (id: string) => {
    setCart((curr) => {
      const nextQty = (curr[id] ?? 0) - 1;
      const copy = { ...curr };
      if (nextQty <= 0) {
        delete copy[id];
      } else {
        copy[id] = nextQty;
      }
      return copy;
    });
  };

  const handleRemove = (id: string) => {
    setCart((curr) => {
      const copy = { ...curr };
      delete copy[id];
      return copy;
    });
  };

  const cartItems = React.useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const sweet = data.sweets.find((s) => String(s.id) === id)!;
      return {
        id,
        name: sweet.name,
        price: sweet.price,
        quantity: qty,
        available: sweet.quantity,
      };
    });
  }, [cart, data.sweets]);

  const totalCount = React.useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart],
  );

  const totalPrice = React.useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const handlePurchase = async () => {
    if (cartItems.length === 0) return;
    setIsPurchasing(true);
    try {
      let token = getToken();
      if (!token) {
        token = getTokenFromCookieHeader(
          typeof document !== "undefined" ? document.cookie : null,
        );
      }
      if (!token) {
        location.href = "/login";
        return;
      }
      for (const it of cartItems) {
        await purchaseSweet(token, it.id, it.quantity);
      }
      setCart({});
      setCartOpen(false);
      location.reload();
    } catch (e: any) {
      const status = e?.status;
      const message = e?.message || "Purchase failed";
      if (status === 401) {
        location.href = "/login";
        return;
      }
      alert(message);
    } finally {
      setIsPurchasing(false);
    }
  };

  const clearFilter = (filterName: string) => {
    const url = new URL(window.location.href);
    url.searchParams.delete(filterName);
    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <SiteHeader
        isAuthenticated={data.isAuthenticated}
        username={data.username}
        isAdmin={data.isAdmin}
        cartCount={totalCount}
        onCartClick={() => setCartOpen(true)}
        searchValue={data.filters?.name}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border p-6 md:p-8">
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Discover Delicious Sweets
            </h1>
            <p className="mt-2 text-muted-foreground max-w-lg">
              Browse our collection of handcrafted treats and find your next
              favorite indulgence.
            </p>

            {/* Mobile search */}
            <form method="get" className="mt-4 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  name="name"
                  placeholder="Search sweets..."
                  defaultValue={data.filters?.name ?? ""}
                  className="pl-10 h-11"
                />
              </div>
            </form>
          </div>

          {/* Decorative elements */}
          <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-20">
            <Sparkles className="h-48 w-48 text-primary" />
          </div>
        </section>

        {/* Filters section */}
        <section className="space-y-4">
          {/* Category quick filters */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-sm text-muted-foreground shrink-0">
                Categories:
              </span>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={
                      data.filters?.category === cat ? "default" : "outline"
                    }
                    size="sm"
                    className="shrink-0"
                    onClick={() => {
                      const url = new URL(window.location.href);
                      if (data.filters?.category === cat) {
                        url.searchParams.delete("category");
                      } else {
                        url.searchParams.set("category", cat);
                      }
                      window.location.href = url.toString();
                    }}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Advanced filters */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <div className="flex items-center justify-between">
              <CollapsibleTrigger>
                <Button variant="ghost" size="sm" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Advanced Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFilterCount}
                    </Badge>
                  )}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      filtersOpen && "rotate-180",
                    )}
                  />
                </Button>
              </CollapsibleTrigger>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (location.href = "/")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>

            <CollapsibleContent className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <form
                    ref={formRef}
                    method="get"
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Search by name..."
                        defaultValue={data.filters?.name ?? ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm">
                        Category
                      </Label>
                      <Input
                        id="category"
                        name="category"
                        placeholder="e.g., Chocolate"
                        defaultValue={data.filters?.category ?? ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="min_price" className="text-sm">
                        Min Price
                      </Label>
                      <Input
                        id="min_price"
                        type="number"
                        name="min_price"
                        step="0.01"
                        min="0"
                        placeholder="$0.00"
                        defaultValue={data.filters?.min_price ?? ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_price" className="text-sm">
                        Max Price
                      </Label>
                      <Input
                        id="max_price"
                        type="number"
                        name="max_price"
                        step="0.01"
                        min="0"
                        placeholder="$100.00"
                        defaultValue={data.filters?.max_price ?? ""}
                      />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2 pt-2">
                      <Button type="submit">
                        <Search className="h-4 w-4 mr-2" />
                        Apply Filters
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {data.filters?.name && (
                <FilterChip
                  label="Name"
                  value={data.filters.name}
                  onClear={() => clearFilter("name")}
                />
              )}
              {data.filters?.category && (
                <FilterChip
                  label="Category"
                  value={data.filters.category}
                  onClear={() => clearFilter("category")}
                />
              )}
              {data.filters?.min_price && (
                <FilterChip
                  label="Min"
                  value={`$${data.filters.min_price}`}
                  onClear={() => clearFilter("min_price")}
                />
              )}
              {data.filters?.max_price && (
                <FilterChip
                  label="Max"
                  value={`$${data.filters.max_price}`}
                  onClear={() => clearFilter("max_price")}
                />
              )}
            </div>
          )}
        </section>

        {/* Products section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {hasActiveFilters ? "Search Results" : "All Sweets"}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {data.sweets.length}{" "}
                {data.sweets.length === 1 ? "item" : "items"} found
              </p>
            </div>

            {totalCount > 0 && (
              <div className="hidden sm:flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">
                  Cart total:{" "}
                  <strong className="text-foreground">
                    {currency(totalPrice)}
                  </strong>
                </span>
                <Button size="sm" onClick={() => setCartOpen(true)}>
                  View Cart ({totalCount})
                </Button>
              </div>
            )}
          </div>

          {data.sweets.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <PackageX className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg">No sweets found</h3>
                <p className="text-muted-foreground mt-1 max-w-sm">
                  {hasActiveFilters
                    ? "Try adjusting your filters or search terms."
                    : "Check back later for new arrivals!"}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => (location.href = "/")}
                  >
                    Clear filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.sweets.map((sweet) => (
                <ProductCard
                  key={String(sweet.id)}
                  sweet={sweet}
                  inCart={cart[String(sweet.id)] ?? 0}
                  onAddToCart={() => handleAddToCart(sweet)}
                  currency={currency}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating cart button - mobile */}
      {totalCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-40">
          <Button
            size="lg"
            className="w-full shadow-lg gap-2"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            View Cart ({totalCount})
            <span className="ml-auto">{currency(totalPrice)}</span>
          </Button>
        </div>
      )}

      {/* Cart Sheet */}
      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cartItems}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
        onPurchase={handlePurchase}
        isPurchasing={isPurchasing}
      />
    </div>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("cookie");
  const tokenFromCookie = getTokenFromCookieHeader(cookieHeader);
  const token = tokenFromCookie ?? getToken();
  try {
    const url = new URL(request.url);
    const name = url.searchParams.get("name") || undefined;
    const category = url.searchParams.get("category") || undefined;
    const min_price = url.searchParams.get("min_price") || undefined;
    const max_price = url.searchParams.get("max_price") || undefined;
    const hasFilters = name || category || min_price || max_price;
    const sweets = hasFilters
      ? await searchSweets(token || undefined, {
          name,
          category,
          min_price: min_price ? Number(min_price) : undefined,
          max_price: max_price ? Number(max_price) : undefined,
        })
      : await getSweets(token || undefined);
    const username = getUsernameFromToken(token);
    const isAdmin = token ? await checkAdmin(token) : false;
    return {
      sweets,
      username,
      isAdmin,
      filters: { name, category, min_price, max_price },
      isAuthenticated: !!token,
    };
  } catch (e) {
    return {
      sweets: [],
      username: null,
      isAdmin: false,
      filters: {
        name: undefined,
        category: undefined,
        min_price: undefined,
        max_price: undefined,
      },
      isAuthenticated: false,
    };
  }
}
