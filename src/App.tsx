import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth, RequireAdmin } from "@/components/auth/Guards";

import LandingPage from "@/routes/index";
import LoginPage from "@/routes/login";
import RestaurantsPage from "@/routes/restaurants";
import RestaurantPage from "@/routes/restaurant.$id";
import CartPage from "@/routes/cart";
import CheckoutPage from "@/routes/checkout";
import ProfilePage from "@/routes/profile";
import AdminPage from "@/routes/admin";
import CreatorsPage from "@/routes/creators";
import NotFoundPage from "@/routes/not-found";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            <Shell>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/creators" element={<CreatorsPage />} />
                <Route
                  path="/restaurants"
                  element={
                    <RequireAuth>
                      <RestaurantsPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/restaurant/:id"
                  element={
                    <RequireAuth>
                      <RestaurantPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <RequireAuth>
                      <CartPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <RequireAuth>
                      <CheckoutPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <RequireAuth>
                      <ProfilePage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <RequireAdmin>
                      <AdminPage />
                    </RequireAdmin>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Shell>
            <Toaster richColors position="top-center" />
            <Analytics />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
