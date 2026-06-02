import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/utils/format";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const DELIVERY_FEE = 500;

export default function CartPage() {
  useDocumentTitle("Your Cart — BiteBuddy");
  const { items, updateQuantity, removeItem, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-40" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-1 text-muted-foreground">
          Add some delicious meals to get started.
        </p>
        <Button asChild className="mt-6">
          <Link to="/restaurants">Browse restaurants</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold">Your cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border bg-card p-3 shadow-sm"
            >
              <img
                src={item.image ?? "/images/rice.jpg"}
                alt={item.name}
                loading="lazy"
                width={80}
                height={80}
                className="h-20 w-20 flex-none rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold">{item.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {item.restaurant_name}
                </p>
                <p className="mt-1 font-bold text-primary">
                  {formatNaira(item.price)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-6 text-center font-semibold">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-bold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatNaira(totalAmount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery fee</dt>
              <dd>{formatNaira(DELIVERY_FEE)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd className="text-primary">
                {formatNaira(totalAmount + DELIVERY_FEE)}
              </dd>
            </div>
          </dl>
          <Button asChild className="mt-5 w-full" size="lg">
            <Link to="/checkout">Proceed to checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
