import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search, Clock, ShieldCheck, Bike } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { formatNaira } from "@/utils/format";
import heroImg from "/images/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BiteBuddy — Nigerian Food Delivery, Fast & Fresh" },
      {
        name: "description",
        content:
          "Order authentic Nigerian meals — jollof rice, swallow, soups, grills and more — delivered fast with BiteBuddy.",
      },
    ],
  }),
  component: LandingPage,
});

const CATEGORIES = [
  { name: "Rice", img: "/images/rice.jpg" },
  { name: "Soups", img: "/images/soup.jpg" },
  { name: "Swallow", img: "/images/swallow.jpg" },
  { name: "Protein", img: "/images/protein.jpg" },
  { name: "Fast Food", img: "/images/fastfood.jpg" },
  { name: "Drinks", img: "/images/drinks.jpg" },
];

function LandingPage() {
  const { user } = useAuth();

  const { data: restaurants } = useQuery({
    queryKey: ["restaurants", "featured"],
    queryFn: async () => {
      const { data } = await supabase
        .from("restaurants")
        .select("*")
        .limit(3);
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
              🍲 Authentic Nigerian flavours
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
              Your favourite meals, <span className="text-primary">delivered</span>{" "}
              fast.
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Discover restaurants, browse menus and order jollof, swallow,
              grills, fast food and drinks — all in one place.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={user ? "/restaurants" : "/login"}>
                  Order now <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/creators">Meet the creators</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Bike className="h-4 w-4 text-primary" /> Fast delivery
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
              src={heroImg}
              alt="A spread of colourful Nigerian dishes"
              width={1600}
              height={1024}
              className="w-full rounded-3xl object-cover shadow-float"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-14">
        <h2 className="text-2xl font-bold md:text-3xl">Browse by category</h2>
        <p className="mt-1 text-muted-foreground">
          Craving something specific? Start here.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to={user ? "/restaurants" : "/login"}
              className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:shadow-soft"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-3 text-center text-sm font-semibold">
                {c.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured restaurants */}
      {restaurants && restaurants.length > 0 && (
        <section className="container-page pb-16">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">
              Popular restaurants
            </h2>
            <Link
              to={user ? "/restaurants" : "/login"}
              className="text-sm font-semibold text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <Link
                key={r.id}
                to={user ? "/restaurants" : "/login"}
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
      )}

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="rounded-3xl bg-hero-gradient px-6 py-12 text-center text-primary-foreground shadow-float md:px-12">
          <h2 className="text-3xl font-extrabold">Hungry? Let's fix that.</h2>
          <p className="mx-auto mt-2 max-w-lg opacity-90">
            Create an account and place your first order in minutes. Delivery
            from {formatNaira(500)}.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="mt-6"
          >
            <Link to={user ? "/restaurants" : "/login"}>Get started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
