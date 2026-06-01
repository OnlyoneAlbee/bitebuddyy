import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, CreditCard, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequireAuth } from "@/components/auth/Guards";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatNaira } from "@/utils/format";
import { payWithPaystack, isPaystackConfigured } from "@/lib/paystack";
import { createOrder } from "@/services/orders";
import { IBADAN_AREAS, CITY, STATE } from "@/lib/locations";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — BiteBuddy" }] }),
  component: () => (
    <RequireAuth>
      <CheckoutPage />
    </RequireAuth>
  ),
});

const DELIVERY_FEE = 500;

const schema = z.object({
  area: z.string().trim().min(2, "Please select your delivery area").max(120),
  details: z
    .string()
    .trim()
    .min(5, "Enter your street, house number or landmark")
    .max(300),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s]+$/, "Phone number is invalid"),
});

function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [area, setArea] = useState("");

  const grandTotal = totalAmount + (items.length ? DELIVERY_FEE : 0);

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-4">
          <Link to="/restaurants">Browse restaurants</Link>
        </Button>
      </div>
    );
  }

  const handlePay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const form = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      area,
      details: String(form.get("details")),
      phone: String(form.get("phone")),
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    const deliveryAddress = `${parsed.data.details}, ${parsed.data.area}, ${CITY}, ${STATE}`;

    setSubmitting(true);
    try {
      await payWithPaystack({
        email: profile?.email ?? user.email ?? "customer@bitebuddy.app",
        amount: grandTotal,
        metadata: { customer_id: user.id },
      });

      await createOrder({
        customerId: user.id,
        items,
        totalAmount: grandTotal,
        deliveryAddress,
        phoneNumber: parsed.data.phone,
      });

      clearCart();
      toast.success("Payment successful! Your order is now pending.");
      navigate({ to: "/profile" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold">Checkout</h1>

      <form onSubmit={handlePay} className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-bold">Delivery details</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="address">Delivery address</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="House number, street, area, city"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="080 0000 0000"
                  required
                />
              </div>
            </div>
          </div>

          {!isPaystackConfigured && (
            <p className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-warning-foreground">
              Paystack is in test/simulation mode. Add your public key
              (VITE_PAYSTACK_PUBLIC_KEY) to take real payments. Orders are still
              created so you can test the full flow.
            </p>
          )}
        </div>

        <div className="h-fit rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-bold">Summary</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-2">
                <span className="truncate text-muted-foreground">
                  {i.quantity} × {i.name}
                </span>
                <span>{formatNaira(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatNaira(totalAmount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd>{formatNaira(DELIVERY_FEE)}</dd>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <dt>Total</dt>
              <dd className="text-primary">{formatNaira(grandTotal)}</dd>
            </div>
          </dl>
          <Button
            type="submit"
            className="mt-5 w-full"
            size="lg"
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-4 w-4" />
            )}
            Pay {formatNaira(grandTotal)}
          </Button>
        </div>
      </form>
    </div>
  );
}
