// Paystack inline integration (client-side, static SPA friendly).
// Add your public key as VITE_PAYSTACK_PUBLIC_KEY. While it is a placeholder,
// the checkout runs in "simulation" mode so the full order flow still works.

const PUBLIC_KEY =
  (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string | undefined) ??
  "pk_test_PLACEHOLDER";

export const isPaystackConfigured =
  !!PUBLIC_KEY && !PUBLIC_KEY.includes("PLACEHOLDER");

interface PaystackArgs {
  email: string;
  amount: number; // in Naira
  reference?: string;
  metadata?: Record<string, unknown>;
}

interface PaystackResult {
  reference: string;
  status: "success";
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (opts: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve();
    const existing = document.getElementById("paystack-js");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.id = "paystack-js";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack"));
    document.body.appendChild(script);
  });
}

export async function payWithPaystack(
  args: PaystackArgs,
): Promise<PaystackResult> {
  const reference =
    args.reference ?? `BB-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

  // Simulation mode for placeholder key — lets the full order flow run.
  if (!isPaystackConfigured) {
    await new Promise((r) => setTimeout(r, 1200));
    return { reference, status: "success" };
  }

  await loadScript();

  return new Promise((resolve, reject) => {
    if (!window.PaystackPop) {
      reject(new Error("Paystack not available"));
      return;
    }
    const handler = window.PaystackPop.setup({
      key: PUBLIC_KEY,
      email: args.email,
      amount: Math.round(args.amount * 100), // kobo
      currency: "NGN",
      ref: reference,
      metadata: args.metadata,
      callback: (response: { reference: string }) => {
        resolve({ reference: response.reference, status: "success" });
      },
      onClose: () => reject(new Error("Payment cancelled")),
    });
    handler.openIframe();
  });
}
