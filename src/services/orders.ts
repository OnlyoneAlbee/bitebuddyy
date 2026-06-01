import { supabase } from "@/integrations/supabase/client";
import type { CartItem } from "@/context/CartContext";

export const ORDER_STATUSES = ["pending", "preparing", "delivered"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderRecord {
  id: string;
  customer_id: string;
  restaurant_id: string | null;
  total_amount: number;
  delivery_address: string | null;
  phone_number: string | null;
  status: string;
  created_at: string;
}

interface CreateOrderArgs {
  customerId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  phoneNumber: string;
}

export async function createOrder(args: CreateOrderArgs) {
  const restaurantId = args.items[0]?.restaurant_id ?? null;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: args.customerId,
      restaurant_id: restaurantId,
      total_amount: args.totalAmount,
      delivery_address: args.deliveryAddress,
      phone_number: args.phoneNumber,
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "Could not create order");
  }

  const orderItems = args.items.map((i) => ({
    order_id: order.id,
    menu_item_id: i.id,
    quantity: i.quantity,
    price: i.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw new Error(itemsError.message);

  return order as OrderRecord;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
}
