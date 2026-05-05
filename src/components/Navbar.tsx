import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Leaf, User as UserIcon, LogIn } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/anu-logo.png";

const Navbar = () => {
  const { count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Anu Natural Foods logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="/#about"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            About us
          </a>
          <a
            href="/#shop"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            Mangoes &amp; Oils
          </a>
          <a
            href="/#shop"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            Kaju &amp; Dates
          </a>
          <a
            href="/#testimonials"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            Happy Customers
          </a>
          <a
            href="/#contact"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <button
              type="button"
              onClick={() => navigate("/account")}
              aria-label="My account"
              title="My account"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <UserIcon className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="hidden h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary sm:inline-flex"
            >
              <LogIn className="h-4 w-4" /> Sign in
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/cart")}
            aria-label={`Cart with ${count} item${count === 1 ? "" : "s"}`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-secondary px-1 text-xs font-bold text-secondary-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
