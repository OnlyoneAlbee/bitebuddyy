import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Store, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { RequireAuth } from "@/components/auth/Guards";

export const Route = createFileRoute("/restaurants")({
  head: () => ({
    meta: [{ title: "Restaurants — BiteBuddy" }],
  }),
  component: () => (
    <RequireAuth>
      <RestaurantsPage />
    </RequireAuth>
  ),
});

function RestaurantsPage() {
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data } = await supabase
        .from("restaurants")
        .select("*")
        .order("name");
      return data ?? [];
    },
  });

  const filtered = (data ?? []).filter((r) =>
    r.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="container-page py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Restaurants</h1>
          <p className="mt-1 text-muted-foreground">
            Pick a spot and start building your order.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search restaurants"
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-16 text-center text-muted-foreground">
          <Store className="mx-auto h-10 w-10 opacity-40" />
          <p className="mt-3">No restaurants found.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <Link
              key={r.id}
              to="/restaurant/$id"
              params={{ id: r.id }}
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
      )}
    </div>
  );
}
