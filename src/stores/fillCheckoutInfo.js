import {create} from "zustand";
import {persist} from "zustand/middleware";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const isValidKenyanPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\s/g, "");
  return /^(?:\+254|0)?([7-9][0-9]{8})$/.test(cleaned);
};

const KENYAN_COUNTIES = [
  "Mombasa",
  "Kwale",
  "Kilifi",
  "Tana River",
  "Lamu",
  "Taita-Taveta",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Tharaka-Nithi",
  "Embu",
  "Kitui",
  "Machakos",
  "Makueni",
  "Nyandarua",
  "Nyeri",
  "Kirinyaga",
  "Murang'a",
  "Kiambu",
  "Turkana",
  "West Pokot",
  "Samburu",
  "Trans Nzoia",
  "Uasin Gishu",
  "Elgeyo-Marakwet",
  "Nandi",
  "Baringo",
  "Laikipia",
  "Nakuru",
  "Narok",
  "Kajiado",
  "Kericho",
  "Bomet",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Busia",
  "Siaya",
  "Kisumu",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
  "Nairobi",
];

export const useCheckoutStore = create(
  persist(
    (set, get) => ({
      formData: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        county: "",
        subCounty: "",
        ward: "",
        estateOrArea: "",
        streetAddress: "",
        postalCode: "",
        deliveryInstructions: "",
        shippingMethod: "standard",
        paymentMethod: "CASH_ON_DELIVERY",
      },

      fieldErrors: {},
      isSubmitting: false,
      submitSuccess: false,
      serverError: null,

      shippingRates: null,
      ratesLoading: false,

      setField: (field, value) => {
        set((state) => ({
          formData: {...state.formData, [field]: value},
          fieldErrors: {...state.fieldErrors, [field]: undefined},
        }));
        if (field === "county" || field === "shippingMethod") {
          get().fetchShippingRates();
        }
      },

      setFormData: (newData) => {
        set((state) => ({
          formData: {...state.formData, ...newData},
        }));
        if (
          newData.county !== undefined ||
          newData.shippingMethod !== undefined
        ) {
          get().fetchShippingRates();
        }
      },

      resetForm: () => {
        set({
          formData: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            county: "",
            subCounty: "",
            ward: "",
            estateOrArea: "",
            streetAddress: "",
            postalCode: "",
            deliveryInstructions: "",
            shippingMethod: "standard",
            paymentMethod: "CASH_ON_DELIVERY",
          },
          fieldErrors: {},
          isSubmitting: false,
          submitSuccess: false,
          serverError: null,
          shippingRates: null,
          ratesLoading: false,
        });
      },

      validateStep: (step) => {
        const data = get().formData;
        const errors = {};
        if (step === 0) {
          if (!data.firstName.trim())
            errors.firstName = "First name is required";
          if (!data.lastName.trim()) errors.lastName = "Last name is required";
          if (!data.email.trim()) errors.email = "Email address is required";
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
            errors.email = "Please enter a valid email";
          if (!data.phoneNumber.trim())
            errors.phoneNumber = "Phone number is required";
          else if (!isValidKenyanPhone(data.phoneNumber))
            errors.phoneNumber =
              "Valid Kenyan phone required (e.g., 0712345678)";
        }
        if (step === 1) {
          if (!data.county) errors.county = "Please select your county";
          if (!data.subCounty.trim())
            errors.subCounty = "Sub-county is required";
          if (!data.ward.trim()) errors.ward = "Ward is required";
          if (!data.streetAddress.trim())
            errors.streetAddress = "Street address is required";
        }
        if (step === 2) {
          if (!data.shippingMethod)
            errors.shippingMethod = "Select a shipping method";
        }
        if (step === 3) {
          if (!data.paymentMethod)
            errors.paymentMethod = "Select a payment method";
        }
        set({fieldErrors: errors});
        return Object.keys(errors).length === 0;
      },

      validateFullForm: () => {
        const step0Valid = get().validateStep(0);
        const step1Valid = get().validateStep(1);
        const step2Valid = get().validateStep(2);
        const step3Valid = get().validateStep(3);
        return step0Valid && step1Valid && step2Valid && step3Valid;
      },

      fetchShippingRates: async () => {
        const {county, shippingMethod} = get().formData;
        if (!county) {
          set({shippingRates: null});
          return;
        }
        set({ratesLoading: true});
        try {
          const res = await fetch(
            `${API_URL}/store/shipping/rates?county=${encodeURIComponent(county)}&method=${shippingMethod}`,
            {credentials: "include"},
          );
          const data = await res.json();
          if (data.success) {
            set({shippingRates: data.methods, ratesLoading: false});
          } else {
            set({shippingRates: null, ratesLoading: false});
          }
        } catch (error) {
          console.error("Shipping rates error:", error);
          set({shippingRates: null, ratesLoading: false});
        }
      },

      submitOrder: async (cartTotal) => {
        console.log("🔵 submitOrder started, cartTotal:", cartTotal);

        if (!get().validateFullForm()) {
          console.log("🔴 Validation failed", get().fieldErrors);
          return {success: false, errors: get().fieldErrors};
        }

        set({isSubmitting: true, serverError: null, submitSuccess: false});

        try {
          const formData = get().formData;
          const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            county: formData.county,
            subCounty: formData.subCounty,
            ward: formData.ward,
            estateOrArea: formData.estateOrArea,
            streetAddress: formData.streetAddress,
            postalCode: formData.postalCode,
            deliveryInstructions: formData.deliveryInstructions,
            shippingMethod: formData.shippingMethod,
            paymentMethod:
              formData.paymentMethod === "CASH_ON_DELIVERY"
                ? "CASH ON DELIVERY"
                : "MobilePay",
          };

          console.log("🟢 Sending payload to backend:", payload);
          console.log("🟢 API_URL:", API_URL);
          console.log("🟢 Full URL:", `${API_URL}/store/cart/order`);

          const res = await fetch(`${API_URL}/store/cart/order`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
          });

          console.log("🟡 Response status:", res.status);
          console.log("🟡 Response headers:", res.headers);

          if (!res.ok) {
            const errorData = await res.json();
            console.error("🔴 Backend error response:", errorData);
            throw new Error(errorData.message || "Order creation failed");
          }

          const data = await res.json();
          console.log("🟢 Order creation success:", data);

          const order = data.data;
          const orderId = order._id;

          if (formData.paymentMethod !== "CASH_ON_DELIVERY") {
            console.log("🟣 Initiating M-Pesa for order:", orderId);
            const paymentRes = await fetch(
              `${API_URL}/payments/makePayment/${orderId}`,
              {
                method: "POST",
                credentials: "include",
              },
            );
            const paymentData = await paymentRes.json();
            console.log("🟣 Payment response:", paymentData);

            if (!paymentData.success) {
              console.error(
                "🔴 Payment initiation failed:",
                paymentData.message,
              );
              set({
                isSubmitting: false,
                serverError:
                  paymentData.message || "Failed to send payment prompt",
                submitSuccess: false,
              });
              return {success: false, error: paymentData.message};
            }
            console.log("🟢 STK push sent successfully");
          }

          set({isSubmitting: false, submitSuccess: true, serverError: null});
          return {success: true, order};
        } catch (error) {
          console.error("🔴 Catch block error:", error);
          set({
            isSubmitting: false,
            serverError: error.message,
            submitSuccess: false,
          });
          return {success: false, error: error.message};
        }
      },

      clearServerError: () => set({serverError: null}),
    }),
    {
      name: "checkout-storage",
      partialize: (state) => ({
        formData: state.formData,
      }),
    },
  ),
);
