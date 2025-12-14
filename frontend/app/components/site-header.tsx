import { Link } from "react-router";
import {
  User as UserIcon,
  Shield,
  LogOut,
  ShoppingCart,
  Store,
  Search,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { clearToken, clearAuthCookie } from "~/lib/api";

interface SiteHeaderProps {
  isAuthenticated: boolean;
  username: string | null;
  isAdmin: boolean;
  cartCount: number;
  onCartClick: () => void;
  searchValue?: string;
}

export function SiteHeader({
  isAuthenticated,
  username,
  isAdmin,
  cartCount,
  onCartClick,
  searchValue,
}: SiteHeaderProps) {
  const handleLogout = () => {
    clearToken();
    clearAuthCookie();
    location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Store className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline">Sweet Shop</span>
        </Link>

        {/* Desktop Search */}
        {/* <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form method="get" className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                name="name"
                placeholder="Search sweets..."
                defaultValue={searchValue ?? ""}
                className="pl-10 pr-4 h-10 w-full bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-colors"
              />
            </div>
          </form>
        </div> */}

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* User info - desktop */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground mr-2">
            <UserIcon className="h-4 w-4" />
            {isAuthenticated ? (
              <span>
                Hi,{" "}
                <strong className="text-foreground">
                  {username ?? "User"}
                </strong>
              </span>
            ) : (
              <span>Guest</span>
            )}
          </div>

          {/* Admin button */}
          {isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Shield />
                Admin
              </Button>
            </Link>
          )}

          {/* Auth button */}
          {isAuthenticated ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:flex"
            >
              <LogOut />
              Logout
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Link to="/login">Login</Link>
            </Button>
          )}

          {/* Cart button */}
          {/* <Button
            variant="default"
            size="sm"
            onClick={onCartClick}
            className="relative gap-2 pl-3 pr-4"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <Badge
                variant="secondary"
                className={cn(
                  "ml-1 min-w-[1.25rem] justify-center bg-primary-foreground text-primary",
                  "animate-in zoom-in-50 duration-200"
                )}
              >
                {cartCount}
              </Badge>
            )}
          </Button> */}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <UserIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {isAuthenticated ? username : "Guest"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isAuthenticated ? "Logged in" : "Not logged in"}
                    </p>
                  </div>
                </div>

                <Separator />

                <nav className="space-y-1">
                  {isAdmin && (
                    <Button variant="ghost" className="w-full justify-start">
                      <Link to="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </Button>
                  )}

                  {isAuthenticated ? (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  ) : (
                    <Button variant="ghost" className="w-full justify-start">
                      <Link to="/login">Login</Link>
                    </Button>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
