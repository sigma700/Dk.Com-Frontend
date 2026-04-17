// stores/useCheckoutStore.js
import {create} from "zustand";
import {persist} from "zustand/middleware";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Kenyan phone validation (no dependencies)
const isValidKenyanPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\s/g, "");
  return /^(?:\+254|0)?([7-9][0-9]{8})$/.test(cleaned);
};

// Kenyan counties list
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
      // ========== FORM DATA ==========
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

      // ========== UI STATE ==========
      fieldErrors: {}, // validation errors per field
      isSubmitting: false,
      submitSuccess: false,
      serverError: null,

      // ========== SHIPPING RATES ==========
      shippingRates: null,
      ratesLoading: false,

      // ========== ACTIONS ==========

      // Update a single field
      setField: (field, value) => {
        set((state) => ({
          formData: {...state.formData, [field]: value},
          fieldErrors: {...state.fieldErrors, [field]: undefined}, // clear error for this field
        }));
        // If county or shipping method changes, re‑fetch rates
        if (field === "county" || field === "shippingMethod") {
          get().fetchShippingRates();
        }
      },

      // Update multiple fields (e.g., from react‑hook‑form sync)
      setFormData: (newData) => {
        set((state) => ({
          formData: {...state.formData, ...newData},
        }));
        // Check if county or method changed
        if (
          newData.county !== undefined ||
          newData.shippingMethod !== undefined
        ) {
          get().fetchShippingRates();
        }
      },

      // Reset entire form to default values
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

      // Validate a specific step (0: contact, 1: address, 2: delivery, 3: payment)
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

      // Validate the entire form (all steps)
      validateFullForm: () => {
        const step0Valid = get().validateStep(0);
        const step1Valid = get().validateStep(1);
        const step2Valid = get().validateStep(2);
        const step3Valid = get().validateStep(3);
        return step0Valid && step1Valid && step2Valid && step3Valid;
      },

      // Fetch shipping rates from backend
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

      // Submit the order to backend
      submitOrder: async (cartTotal) => {
        if (!get().validateFullForm()) {
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

          const res = await fetch(`${API_URL}/store/order/create`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Order creation failed");

          set({isSubmitting: false, submitSuccess: true, serverError: null});
          return {success: true, order: data.data};
        } catch (error) {
          set({
            isSubmitting: false,
            serverError: error.message,
            submitSuccess: false,
          });
          return {success: false, error: error.message};
        }
      },

      // Clear server error manually
      clearServerError: () => set({serverError: null}),
    }),
    {
      name: "checkout-storage",
      partialize: (state) => ({
        // Only persist form data, not UI states (optional)
        formData: state.formData,
      }),
    },
  ),
);
