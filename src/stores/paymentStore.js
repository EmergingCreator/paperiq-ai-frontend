
import { create } from "zustand";
import api from "../api/client";

const SUBSCRIPTION_URL = "/subscription";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

export const usePaymentStore = create((set, get) => ({
  subscription: null,
  loading: false,
  checkoutLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  // Get current subscription
  fetchSubscription: async () => {
    try {
      set({ loading: true, error: null });

      const { data } = await api.get(SUBSCRIPTION_URL);

      const subscription = data.subscription ?? data;

      set({
        subscription,
        loading: false,
      });

      return subscription;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to fetch subscription.";

      set({
        loading: false,
        error: message,
      });

      throw error;
    }
  },

  // Start Razorpay checkout
  startCheckout: async (user) => {
    try {
      set({
        checkoutLoading: true,
        error: null,
      });

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay Checkout.");
      }

      // Create subscription on backend
      const { data } = await api.post(
        `${SUBSCRIPTION_URL}/checkout`
      );

      if (!data.subscriptionId || !data.key) {
        throw new Error("Invalid checkout response from server.");
      }

      return await new Promise((resolve, reject) => {
        let settled = false;

        const finish = (result) => {
          if (settled) return;

          settled = true;
          set({ checkoutLoading: false });
          resolve(result);
        };

        const fail = (error) => {
          if (settled) return;

          settled = true;

          const message =
            error.response?.data?.message ||
            error.message ||
            "Payment could not be completed.";

          set({
            checkoutLoading: false,
            error: message,
          });

          reject(new Error(message));
        };

        const options = {
          key: data.key,
          subscription_id: data.subscriptionId,
          name: "AI PDF Assistant",
          description: "Pro Subscription",

          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },

          theme: {
            color: "#8b5cf6",
          },

          handler: async (response) => {
            try {
              const verification = await api.post(
                `${SUBSCRIPTION_URL}/verify`,
                response
              );

              finish({
                success: true,
                verified: verification.data.success,
                message:
                  verification.data.message ||
                  "Payment details verified.",
              });
            } catch (error) {
              fail(error);
            }
          },

          modal: {
            ondismiss: () => {
              finish({
                success: false,
                dismissed: true,
              });
            },
          },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on("payment.failed", (response) => {
          fail(
            new Error(
              response.error?.description ||
                "Payment failed. Please try again."
            )
          );
        });

        razorpay.open();
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to start checkout.";

      set({
        checkoutLoading: false,
        error: message,
      });

      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const { data } = await api.post(
        `${SUBSCRIPTION_URL}/cancel`
      );

      await get().fetchSubscription();

      set({ loading: false });

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to cancel subscription.";

      set({
        loading: false,
        error: message,
      });

      throw error;
    }
  },
}));
