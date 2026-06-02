import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  Bike,
  Lock,
  GraduationCap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { formatNaira } from "@/utils/format";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function LandingPage() {
  useDocumentTitle(
    "BiteBuddy — Food Delivery at Lead City University, Ibadan",
    "Order authentic Nigerian meals delivered fast around Lead City University and across Ibadan, Oyo State, with BiteBuddy.",
  );
  const { user } = useAuth();

  const { data: restaurants } = useQuery({
    queryKey: ["restaurants", "featured"],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("restaurants").select("*").limit(3);
      return data ?? [];
    },
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-warm-gradient">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              <GraduationCap className="h-4 w-4" /> Now serving Lead City
              University, Ibadan
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
              Campus meals,{" "}
              <span className="text-primary">delivered</span> fast.
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Order jollof, swallow, grills, fast food and drinks from
              restaurants right around Lead City University campus — and across
              Ibadan, Oyo State.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={user ? "/restaurants" : "/login"}>
                  {user ? "Order now" : "Login to order"}{" "}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/creators">Meet the creators</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Bike className="h-4 w-4 text-primary" /> Fast campus delivery
              </span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" /> Real-time tracking
              </span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" /> Secure payments
              </span>
            </div>
          </div>
          <div className="relative animate-fade-up">
            <img
              src="/images/hero.jpg"
              alt="A spread of colourful Nigerian dishes"
              width={1600}
              height={1024}
              className="w-full rounded-3xl object-cover shadow-float"
            />
          </div>
        </div>
      </section>

      {/* Login gate / Featured restaurants */}
      {!user ? (
        <section className="container-page py-16">
          <div className="mx-auto max-w-2xl rounded-3xl border bg-card p-8 text-center shadow-soft md:p-12">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Lock className="h-7 w-7" />
            </span>
            <h2 className="mt-5 text-2xl font-bold md:text-3xl">
              Login to see restaurants near you
            </h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Create a free account or sign in to browse restaurants around Lead
              City University and place your first order.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/login">
                  Login or sign up <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      ) : (
        restaurants &&
        restaurants.length > 0 && (
          <section className="container-page py-16">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold md:text-3xl">
                Restaurants around campus
              </h2>
              <Link
                to="/restaurants"
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((r) => (
                <Link
                  key={r.id}
                  to={`/restaurant/${r.id}`}
                  className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-soft"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={r.image ?? "/images/hero.jpg"}
                      alt={r.name}
                      loading="lazy"
                      width={800}
                      height={450}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{r.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {r.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      )}

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="rounded-3xl bg-hero-gradient px-6 py-12 text-center text-primary-foreground shadow-float md:px-12">
          <h2 className="text-3xl font-extrabold">Hungry on campus? Let's fix that.</h2>
          <p className="mx-auto mt-2 max-w-lg opacity-90">
            Create an account and get food delivered around Lead City University
            in minutes. Delivery from {formatNaira(500)}.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to={user ? "/restaurants" : "/login"}>Get started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
