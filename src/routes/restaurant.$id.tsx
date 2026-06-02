import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/utils/format";

export default function RestaurantPage() {
  const { id = "" } = useParams();
  const { addItem } = useCart();

  const { data, isLoading } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const [{ data: restaurant }, { data: items }] = await Promise.all([
        supabase.from("restaurants").select("*").eq("id", id).maybeSingle(),
        supabase
          .from("menu_items")
          .select("*")
          .eq("restaurant_id", id)
          .order("category"),
      ]);
      return { restaurant, items: items ?? [] };
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.restaurant) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-muted-foreground">Restaurant not found.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/restaurants">Back to restaurants</Link>
        </Button>
      </div>
    );
  }

  const { restaurant, items } = data;
  const categories = Array.from(
    new Set(items.map((i) => i.category ?? "Other")),
  );

  return (
    <div>
      <div className="relative h-56 w-full overflow-hidden md:h-72">
        <img
          src={restaurant.image ?? "/images/hero.jpg"}
          alt={restaurant.name}
          width={1600}
          height={400}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="container-page absolute inset-x-0 bottom-0 pb-6">
          <Link
            to="/restaurants"
            className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All restaurants
          </Link>
          <h1 className="font-display text-3xl font-extrabold text-white md:text-4xl">
            {restaurant.name}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-white/85">
            {restaurant.description}
          </p>
        </div>
      </div>

      <div className="container-page py-10">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No menu items yet.
          </p>
        ) : (
          categories.map((cat) => (
            <div key={cat} className="mb-10">
              <h2 className="mb-4 text-xl font-bold">{cat}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items
                  .filter((i) => (i.category ?? "Other") === cat)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex overflow-hidden rounded-2xl border bg-card shadow-sm"
                    >
                      <img
                        src={item.image ?? "/images/rice.jpg"}
                        alt={item.name}
                        loading="lazy"
                        width={120}
                        height={120}
                        className="h-auto w-28 flex-none object-cover"
                      />
                      <div className="flex flex-1 flex-col p-3">
                        <h3 className="font-semibold leading-tight">
                          {item.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {item.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <span className="font-bold text-primary">
                            {formatNaira(Number(item.price))}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => {
                              addItem({
                                id: item.id,
                                name: item.name,
                                price: Number(item.price),
                                image: item.image,
                                restaurant_id: restaurant.id,
                                restaurant_name: restaurant.name,
                              });
                              toast.success(`${item.name} added to cart`);
                            }}
                          >
                            <Plus className="mr-1 h-4 w-4" /> Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
