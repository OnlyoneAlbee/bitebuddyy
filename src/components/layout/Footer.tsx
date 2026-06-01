import { Link } from "@tanstack/react-router";
import { UtensilsCrossed } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground">
              <UtensilsCrossed className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-extrabold">
              Bite<span className="text-primary">Buddy</span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Modern Nigerian food delivery. Discover restaurants, browse menus and
            enjoy a seamless ordering experience.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/restaurants" className="hover:text-primary">
                Restaurants
              </Link>
            </li>
            <li>
              <Link to="/creators" className="hover:text-primary">
                Creators
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-primary">
                Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Built by</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            GROUP O CREATORS — a team project building a reliable, user-friendly
            food ordering platform.
          </p>
        </div>
      </div>
      <div className="border-t py-5">
        <p className="container-page text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} BiteBuddy by GROUP O CREATORS. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
