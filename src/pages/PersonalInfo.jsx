// pages/Checkout.jsx
import React, {useState, useEffect, useRef} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import {useAddToCartStore} from "../stores/addToCartStore";
import NavBar from "../components/navBar";
import {bufferToDataURL} from "../utils/displayImage";
import {GiPadlock} from "react-icons/gi";
import {SiEasyeda} from "react-icons/si";
import {FaBoltLightning} from "react-icons/fa6";
import {IoCashOutline} from "react-icons/io5";
import {CiMobile1} from "react-icons/ci";
import {useCheckoutStore} from "../stores/fillCheckoutInfo"; // ✅ fixed import

/* ─── Brand Palette (green – matches LandingPage & Order) ─── */
const GREEN = "#4A8C2A";
const GREEN_LIGHT = "#72B84A";
const GREEN_PALE = "#E8F5E0";
const DARK = "#1A1A1A";
const MUTED = "#5A7A4A";
const CREAM = "#F7FBF4";
const BORDER = "#D4E2C8";

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

const isValidKenyanPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\s/g, "");
  return /^(?:\+254|0)?([7-9][0-9]{8})$/.test(cleaned);
};

const STEPS = ["Contact", "Address", "Delivery", "Payment"];

/* ─── Motion variants ────────────────────────────────────────────── */
const fadeInUp = (delay = 0) => ({
  hidden: {opacity: 0, y: 20, filter: "blur(4px)"},
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {duration: 0.6, ease: [0.16, 1, 0.3, 1], delay},
  },
});

const slideIn = (direction = "right") => ({
  hidden: {opacity: 0, x: direction === "right" ? 40 : -40},
  visible: {
    opacity: 1,
    x: 0,
    transition: {duration: 0.5, ease: [0.16, 1, 0.3, 1]},
  },
  exit: {
    opacity: 0,
    x: direction === "right" ? -20 : 20,
    transition: {duration: 0.3},
  },
});

/* ─── Helper Components ──────────────────────────────────────────── */
const FieldWrapper = ({label, error, children, optional}) => (
  <motion.div variants={fadeInUp()} style={{marginBottom: "1.5rem"}}>
    <label style={styles.label}>
      {label}
      {optional && <span style={styles.optional}> — optional</span>}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{opacity: 0, y: -6}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0}}
          style={styles.errorText}
        >
          <span style={{marginRight: 6}}>⚠</span>
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

const InputField = React.forwardRef(
  ({error, style: extraStyle, ...props}, ref) => (
    <motion.input
      ref={ref}
      {...props}
      whileFocus={{scale: 1.01}}
      transition={{duration: 0.2}}
      style={{
        ...styles.input,
        ...(error ? styles.inputError : {}),
        ...extraStyle,
      }}
    />
  ),
);

const SelectField = React.forwardRef(({error, children, ...props}, ref) => (
  <motion.select
    ref={ref}
    {...props}
    whileFocus={{scale: 1.01}}
    style={{
      ...styles.input,
      ...styles.select,
      ...(error ? styles.inputError : {}),
    }}
  >
    {children}
  </motion.select>
));

const SectionCard = ({title, icon, children}) => (
  <motion.div
    variants={fadeInUp()}
    initial="hidden"
    animate="visible"
    style={styles.sectionCard}
  >
    <div style={styles.sectionHeader}>
      <span style={styles.sectionIcon}>{icon}</span>
      <h2 style={styles.sectionTitle}>{title}</h2>
    </div>
    <div style={styles.sectionBody}>{children}</div>
  </motion.div>
);

const DeliveryOption = ({
  id,
  value,
  name,
  register,
  checked,
  title,
  subtitle,
  cost,
}) => (
  <motion.label
    htmlFor={id}
    whileHover={{scale: 1.01, backgroundColor: "#FEFCF8"}}
    transition={{duration: 0.2}}
    style={{...styles.radioCard, ...(checked ? styles.radioCardActive : {})}}
  >
    <input
      type="radio"
      id={id}
      value={value}
      {...register(name)}
      style={{display: "none"}}
    />
    <div
      style={{
        ...styles.radioCircle,
        ...(checked ? styles.radioCircleActive : {}),
      }}
    >
      {checked && <div style={styles.radioDot} />}
    </div>
    <div style={{flex: 1}}>
      <p style={styles.radioTitle}>{title}</p>
      <p style={styles.radioSubtitle}>{subtitle}</p>
    </div>
    <span style={styles.radioCost}>{cost}</span>
  </motion.label>
);

const PaymentOption = ({
  id,
  value,
  name,
  register,
  checked,
  icon,
  title,
  subtitle,
}) => (
  <motion.label
    htmlFor={id}
    whileHover={{scale: 1.01, backgroundColor: "#FEFCF8"}}
    style={{...styles.radioCard, ...(checked ? styles.radioCardActive : {})}}
  >
    <input
      type="radio"
      id={id}
      value={value}
      {...register(name)}
      style={{display: "none"}}
    />
    <div style={styles.payIcon}>{icon}</div>
    <div style={{flex: 1}}>
      <p style={styles.radioTitle}>{title}</p>
      <p style={styles.radioSubtitle}>{subtitle}</p>
    </div>
    <div
      style={{
        ...styles.radioCircle,
        ...(checked ? styles.radioCircleActive : {}),
      }}
    >
      {checked && <div style={styles.radioDot} />}
    </div>
  </motion.label>
);

const ShimmerCard = () => (
  <div style={styles.shimmerCard}>
    <div style={styles.shimmerBar} />
    <div style={{...styles.shimmerBar, width: "70%", marginTop: 8}} />
  </div>
);

const NavButtons = ({onNext, onBack, isFirst, isLast}) => (
  <div
    style={{
      display: "flex",
      gap: "1rem",
      marginTop: "1.5rem",
      marginBottom: "2.5rem",
    }}
  >
    {!isFirst && (
      <motion.button
        type="button"
        onClick={onBack}
        whileHover={{borderColor: GREEN, color: GREEN}}
        style={styles.backBtn}
      >
        ← Back
      </motion.button>
    )}
    {!isLast && (
      <motion.button
        type="button"
        onClick={onNext}
        whileHover={{scale: 1.02, boxShadow: `0 6px 20px ${GREEN}40`}}
        whileTap={{scale: 0.98}}
        style={styles.nextBtn}
      >
        Continue →
      </motion.button>
    )}
  </div>
);

/* ─── Icons (SVG) ───────────────────────────────────────────────── */
const iconPerson = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const iconPin = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
  >
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const iconTruck = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const iconCard = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

/* ─── Main Checkout Component ────────────────────────────────────── */
const Checkout = () => {
  const navigate = useNavigate();
  const {addedProduct, fetchCart} = useAddToCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingRates, setShippingRates] = useState(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [focusedField, setFocusedField] = useState(null);
  const formRef = useRef(null);

  const {register, handleSubmit, watch, getValues} = useForm({
    defaultValues: {
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
    mode: "onBlur",
  });

  const selectedCounty = watch("county");
  const selectedMethod = watch("shippingMethod");
  const selectedPayment = watch("paymentMethod");

  const subtotal = (addedProduct || []).reduce(
    (sum, item) => sum + (item.priceAtAdd || 0) * (item.quantity || 1),
    0,
  );
  const shippingCost = shippingRates?.[selectedMethod]?.cost || 0;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (!selectedCounty) return;
    setLoadingRates(true);
    const fetchRates = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/store/shipping/rates?county=${encodeURIComponent(selectedCounty)}&method=${selectedMethod}`,
          {credentials: "include"},
        );
        const data = await res.json();
        if (data.success) setShippingRates(data.methods);
      } catch (err) {
        console.error("Shipping rates error:", err);
      } finally {
        setLoadingRates(false);
      }
    };
    fetchRates();
  }, [selectedCounty, selectedMethod]);

  const validateStep = (step) => {
    const data = getValues();
    const errors = {};
    if (step === 0) {
      if (!data.firstName.trim()) errors.firstName = "First name is required";
      if (!data.lastName.trim()) errors.lastName = "Last name is required";
      if (!data.email.trim()) errors.email = "Email address is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        errors.email = "Please enter a valid email";
      if (!data.phoneNumber.trim())
        errors.phoneNumber = "Phone number is required";
      else if (!isValidKenyanPhone(data.phoneNumber))
        errors.phoneNumber = "Enter a valid Kenyan number (e.g. 0712 345 678)";
    }
    if (step === 1) {
      if (!data.county) errors.county = "Please select your county";
      if (!data.subCounty.trim()) errors.subCounty = "Sub-county is required";
      if (!data.ward.trim()) errors.ward = "Ward is required";
      if (!data.streetAddress.trim())
        errors.streetAddress = "Street address is required";
    }
    return errors;
  };

  const nextStep = () => {
    const errors = validateStep(activeStep);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstKey = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstKey}"]`);
      if (el) el.scrollIntoView({behavior: "smooth", block: "center"});
      return;
    }
    setFieldErrors({});
    setActiveStep((s) => Math.min(s + 1, 3));
    window.scrollTo({top: 0, behavior: "smooth"});
  };

  const validateForm = (data) => {
    const e0 = validateStep(0);
    const e1 = validateStep(1);
    const errors = {...e0, ...e1};
    if (!data.shippingMethod)
      errors.shippingMethod = "Please select a shipping method";
    if (!data.paymentMethod)
      errors.paymentMethod = "Please select a payment method";
    console.log("🔍 validateForm errors:", errors);
    return errors;
  };

  const onSubmit = async (data) => {
    console.log("👉 onSubmit triggered with data:", data);
    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      console.log("❌ Form has errors, not submitting");
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    setServerError("");

    // ✅ Sync react-hook-form data to the store
    useCheckoutStore.getState().setFormData(data);

    console.log("👉 Calling submitOrder from store...");
    const {submitOrder} = useCheckoutStore.getState();
    const result = await submitOrder(subtotal + shippingCost);
    console.log("👉 result from store:", result);

    if (result.success) {
      await fetchCart();
      navigate(`/order-confirmation/${result.order._id}`);
    } else {
      setServerError(
        result.error || "Order creation failed. Please try again.",
      );
    }
    setIsSubmitting(false);
  };

  const inputProps = (name) => ({
    ...register(name),
    onFocus: () => setFocusedField(name),
    onBlur: () => setFocusedField(null),
    style: {
      ...styles.input,
      ...(fieldErrors[name] ? styles.inputError : {}),
      ...(focusedField === name ? styles.inputFocused : {}),
    },
  });

  const stepContent = [
    // Step 0: Contact
    <motion.div
      key="step0"
      variants={slideIn("right")}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <SectionCard title="Contact Information" icon={iconPerson}>
        <div style={styles.twoCol}>
          <FieldWrapper label="First Name" error={fieldErrors.firstName}>
            <InputField {...inputProps("firstName")} placeholder="Amara" />
          </FieldWrapper>
          <FieldWrapper label="Last Name" error={fieldErrors.lastName}>
            <InputField {...inputProps("lastName")} placeholder="Odhiambo" />
          </FieldWrapper>
        </div>
        <FieldWrapper label="Email Address" error={fieldErrors.email}>
          <InputField
            {...inputProps("email")}
            type="email"
            placeholder="amara@example.com"
          />
        </FieldWrapper>
        <FieldWrapper label="Phone Number" error={fieldErrors.phoneNumber}>
          <div style={{position: "relative"}}>
            <span style={styles.phonePrefix}>🇰🇪 +254</span>
            <InputField
              {...inputProps("phoneNumber")}
              placeholder="0712 345 678"
              style={{...styles.input, paddingLeft: "5.5rem"}}
            />
          </div>
        </FieldWrapper>
      </SectionCard>
      <NavButtons onNext={nextStep} isFirst />
    </motion.div>,

    // Step 1: Address
    <motion.div
      key="step1"
      variants={slideIn("right")}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <SectionCard title="Shipping Address" icon={iconPin}>
        <FieldWrapper label="County" error={fieldErrors.county}>
          <SelectField {...register("county")} error={fieldErrors.county}>
            <option value="">— Select your county —</option>
            {KENYAN_COUNTIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </SelectField>
        </FieldWrapper>
        <div style={styles.twoCol}>
          <FieldWrapper label="Sub-County" error={fieldErrors.subCounty}>
            <InputField
              {...inputProps("subCounty")}
              placeholder="e.g. Westlands"
            />
          </FieldWrapper>
          <FieldWrapper label="Ward" error={fieldErrors.ward}>
            <InputField {...inputProps("ward")} placeholder="e.g. Kitisuru" />
          </FieldWrapper>
        </div>
        <FieldWrapper label="Estate / Area" optional>
          <InputField
            {...inputProps("estateOrArea")}
            placeholder="e.g. Lavington, Karen"
          />
        </FieldWrapper>
        <FieldWrapper label="Street Address" error={fieldErrors.streetAddress}>
          <InputField
            {...inputProps("streetAddress")}
            placeholder="Building name, street, door number"
          />
        </FieldWrapper>
        <div style={styles.twoCol}>
          <FieldWrapper label="Postal Code" optional>
            <InputField {...inputProps("postalCode")} placeholder="00100" />
          </FieldWrapper>
          <div />
        </div>
        <FieldWrapper label="Delivery Instructions" optional>
          <textarea
            {...register("deliveryInstructions")}
            rows={3}
            placeholder="Gate code, call before arrival, leave at reception…"
            style={{...styles.input, resize: "vertical", minHeight: 80}}
          />
        </FieldWrapper>
      </SectionCard>
      <NavButtons onNext={nextStep} onBack={() => setActiveStep(0)} />
    </motion.div>,

    // Step 2: Delivery
    <motion.div
      key="step2"
      variants={slideIn("right")}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <SectionCard title="Delivery Method" icon={iconTruck}>
        {!selectedCounty ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📍</div>
            <p style={styles.emptyText}>
              Please complete your address first to see delivery options.
            </p>
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              style={styles.ghostBtn}
            >
              Go back to address
            </button>
          </div>
        ) : loadingRates ? (
          <>
            {[0, 1].map((i) => (
              <ShimmerCard key={i} />
            ))}
          </>
        ) : shippingRates ? (
          Object.entries(shippingRates).map(([key, method]) => (
            <DeliveryOption
              key={key}
              id={key}
              value={key}
              name="shippingMethod"
              register={register}
              checked={selectedMethod === key}
              title={method.name}
              subtitle={method.days}
              cost={`KES ${method.cost.toFixed(2)}`}
            />
          ))
        ) : (
          <p style={styles.emptyText}>
            No delivery options found for {selectedCounty}.
          </p>
        )}
        {fieldErrors.shippingMethod && (
          <p style={styles.errorText}>{fieldErrors.shippingMethod}</p>
        )}
      </SectionCard>
      <NavButtons onNext={nextStep} onBack={() => setActiveStep(1)} />
    </motion.div>,

    // Step 3: Payment
    <motion.div
      key="step3"
      variants={slideIn("right")}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <SectionCard title="Payment Method" icon={iconCard}>
        <PaymentOption
          id="cod"
          value="CASH_ON_DELIVERY"
          name="paymentMethod"
          register={register}
          checked={selectedPayment === "CASH_ON_DELIVERY"}
          icon={<IoCashOutline />}
          title="Cash on Delivery"
          subtitle="Pay when your order arrives"
        />
        <PaymentOption
          id="mpesa"
          value="MobilePay"
          name="paymentMethod"
          register={register}
          checked={selectedPayment === "MobilePay"}
          icon={<CiMobile1 />}
          title="M-Pesa"
          subtitle="Pay securely via mobile money"
        />
        {fieldErrors.paymentMethod && (
          <p style={styles.errorText}>{fieldErrors.paymentMethod}</p>
        )}
      </SectionCard>

      {serverError && (
        <motion.div
          initial={{opacity: 0, y: -10}}
          animate={{opacity: 1, y: 0}}
          style={styles.errorBox}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {serverError}
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{scale: 1.01, boxShadow: "0 8px 28px rgba(26,20,16,0.2)"}}
        whileTap={{scale: 0.98}}
        style={{
          ...styles.submitBtn,
          ...(isSubmitting ? styles.submitBtnDisabled : {}),
        }}
      >
        {isSubmitting ? (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <span className="spinner" />
            Placing your order…
          </span>
        ) : (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Place Order · KES{" "}
            {total.toLocaleString("en-KE", {minimumFractionDigits: 2})}
          </span>
        )}
      </motion.button>

      <p style={styles.secureNote}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>{" "}
        Your order is protected by SSL encryption.
      </p>

      <NavButtons onBack={() => setActiveStep(2)} isLast />
    </motion.div>,
  ];

  return (
    <>
      <style>{injectCSS}</style>
      <main style={styles.page}>
        <NavBar />

        {/* Hero Header with motion */}
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
          style={styles.header}
        >
          <div style={styles.headerInner}>
            <p style={styles.headerEyebrow}>Secure Checkout</p>
            <h1 style={styles.headerTitle}>Complete Your Order</h1>
            <div style={styles.securityBadge}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>256-bit SSL encrypted · Your data is safe</span>
            </div>
          </div>
        </motion.div>

        {/* Step Bar with animated indicators */}
        <div style={styles.stepBar}>
          <div style={styles.stepBarInner}>
            {STEPS.map((label, i) => (
              <div key={label} style={styles.stepItem}>
                <motion.div
                  animate={{
                    borderColor: i <= activeStep ? GREEN : BORDER,
                    backgroundColor: i < activeStep ? GREEN : "#fff",
                  }}
                  transition={{duration: 0.3}}
                  style={{
                    ...styles.stepDot,
                    ...(i <= activeStep ? styles.stepDotActive : {}),
                  }}
                >
                  {i < activeStep ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span style={styles.stepNum}>{i + 1}</span>
                  )}
                </motion.div>
                <motion.span
                  animate={{
                    color: i === activeStep ? DARK : MUTED,
                    fontWeight: i === activeStep ? 600 : 400,
                  }}
                  style={{...styles.stepLabel}}
                >
                  {label}
                </motion.span>
                {i < STEPS.length - 1 && (
                  <motion.div
                    animate={{background: i < activeStep ? GREEN : BORDER}}
                    style={{...styles.connector}}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div style={styles.grid}>
          <form
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            style={styles.formCol}
          >
            <AnimatePresence mode="wait">
              {stepContent[activeStep]}
            </AnimatePresence>
          </form>

          {/* Order Summary Sidebar */}
          <motion.aside
            initial={{opacity: 0, x: 30}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.6, delay: 0.2}}
            style={styles.sidebar}
          >
            <div style={styles.sidebarCard}>
              <h3 style={styles.sidebarTitle}>Order Summary</h3>
              <div style={styles.sidebarDivider} />

              {(addedProduct || []).length === 0 ? (
                <p style={styles.emptyText}>Your cart is empty.</p>
              ) : (
                (addedProduct || []).map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: i * 0.05}}
                    style={styles.cartItem}
                  >
                    <div style={styles.cartItemImg}>
                      {item.product?.image?.data ? (
                        <img
                          src={bufferToDataURL(item.product.image)}
                          alt={item.product.name}
                          style={styles.cartImg}
                        />
                      ) : (
                        <div style={styles.cartImgPlaceholder}>
                          {(item.product?.name || "?")[0]}
                        </div>
                      )}
                      <span style={styles.cartQtyBadge}>
                        {item.quantity || 1}
                      </span>
                    </div>
                    <div style={{flex: 1}}>
                      <p style={styles.cartItemName}>
                        {item.product.name || "Product"}
                      </p>
                      {item.variant && (
                        <p style={styles.cartItemVariant}>{item.variant}</p>
                      )}
                    </div>
                    <span style={styles.cartItemPrice}>
                      KES{" "}
                      {(
                        (item.priceAtAdd || 0) * (item.quantity || 1)
                      ).toLocaleString("en-KE", {minimumFractionDigits: 2})}
                    </span>
                  </motion.div>
                ))
              )}

              <div style={styles.sidebarDivider} />

              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Subtotal</span>
                <span style={styles.summaryValue}>
                  KES{" "}
                  {subtotal.toLocaleString("en-KE", {minimumFractionDigits: 2})}
                </span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Shipping</span>
                <span style={styles.summaryValue}>
                  {shippingCost > 0
                    ? `KES ${shippingCost.toLocaleString("en-KE", {minimumFractionDigits: 2})}`
                    : "—"}
                </span>
              </div>

              <div style={styles.sidebarDivider} />

              <div style={{...styles.summaryRow, marginBottom: 0}}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalValue}>
                  KES{" "}
                  {total.toLocaleString("en-KE", {minimumFractionDigits: 2})}
                </span>
              </div>

              <motion.button
                type="button"
                onClick={() => navigate("/cart-page")}
                whileHover={{borderColor: GREEN, color: GREEN}}
                style={styles.editCartBtn}
              >
                ← Edit Cart
              </motion.button>

              {/* Trust badges */}
              <div style={styles.trustRow}>
                {[
                  {icon: <GiPadlock />, label: "Secure Payment"},
                  {icon: <FaBoltLightning />, label: "Fast Delivery"},
                  {icon: <SiEasyeda />, label: "Easy Returns"},
                ].map(({icon, label}) => (
                  <motion.div
                    key={label}
                    whileHover={{y: -2}}
                    style={styles.trustBadge}
                  >
                    <span style={{fontSize: 18}}>{icon}</span>
                    <span style={styles.trustLabel}>{label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </main>
    </>
  );
};

/* ─── Styles (green palette + refined shadows) ─── */
const styles = {
  page: {
    minHeight: "100vh",
    background: CREAM,
    fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
    color: DARK,
  },
  header: {
    background: `linear-gradient(135deg, #1A1A1A 0%, #2D2A24 50%, #1A1A1A 100%)`,
    padding: "3.5rem 1.5rem 3rem",
    textAlign: "center",
  },
  headerInner: {maxWidth: 700, margin: "0 auto"},
  headerEyebrow: {
    fontFamily: "'Montserrat', 'Helvetica Neue', sans-serif",
    fontSize: "0.65rem",
    letterSpacing: "0.25em",
    color: GREEN_LIGHT,
    textTransform: "uppercase",
    marginBottom: "0.75rem",
    fontWeight: 500,
  },
  headerTitle: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: 300,
    color: "#F5EDD8",
    letterSpacing: "0.02em",
    margin: "0 0 1rem",
    lineHeight: 1.15,
  },
  securityBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(74,140,42,0.15)",
    border: `1px solid rgba(74,140,42,0.3)`,
    borderRadius: 999,
    padding: "0.4rem 1.1rem",
    color: GREEN_LIGHT,
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.7rem",
    letterSpacing: "0.08em",
  },
  stepBar: {
    background: "#fff",
    borderBottom: `1px solid ${BORDER}`,
    padding: "1.25rem 1.5rem",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
  },
  stepBarInner: {
    maxWidth: 700,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: `2px solid ${BORDER}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    flexShrink: 0,
    transition: "all 0.3s ease",
  },
  stepDotActive: {
    border: `2px solid ${GREEN}`,
    background: GREEN,
    color: "#fff",
  },
  stepNum: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.7rem",
    fontWeight: 600,
    color: MUTED,
  },
  stepLabel: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.68rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: MUTED,
    marginLeft: 8,
    whiteSpace: "nowrap",
    fontWeight: 400,
  },
  connector: {
    flex: 1,
    height: 1,
    background: BORDER,
    marginLeft: 8,
    transition: "background 0.4s ease",
  },
  grid: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "2.5rem 1.5rem 4rem",
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "2.5rem",
    alignItems: "start",
  },
  formCol: {minWidth: 0},
  sectionCard: {
    background: "#fff",
    borderRadius: 16,
    border: `1px solid ${BORDER}`,
    marginBottom: "1.5rem",
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(26,20,16,0.04)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "1.5rem 2rem 1.25rem",
    borderBottom: `1px solid ${BORDER}`,
    color: GREEN,
  },
  sectionIcon: {display: "flex", color: GREEN},
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "1.25rem",
    fontWeight: 600,
    color: DARK,
    margin: 0,
    letterSpacing: "0.01em",
  },
  sectionBody: {padding: "2rem"},
  label: {
    display: "block",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.68rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: MUTED,
    marginBottom: "0.5rem",
  },
  optional: {
    fontWeight: 400,
    textTransform: "none",
    letterSpacing: 0,
    color: "#B0A090",
    fontSize: "0.65rem",
  },
  input: {
    width: "100%",
    padding: "0.85rem 1rem",
    border: `1.5px solid ${BORDER}`,
    borderRadius: 10,
    fontSize: "0.95rem",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 400,
    color: DARK,
    background: "#FDFBF8",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  },
  inputFocused: {
    borderColor: GREEN,
    boxShadow: `0 0 0 3px rgba(74,140,42,0.12)`,
    background: "#fff",
  },
  inputError: {
    borderColor: "#C0392B",
    boxShadow: `0 0 0 3px rgba(192,57,43,0.08)`,
  },
  select: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235A7A4A' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 1rem center",
    paddingRight: "2.5rem",
    cursor: "pointer",
  },
  twoCol: {display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem"},
  phonePrefix: {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.85rem",
    color: MUTED,
    pointerEvents: "none",
    zIndex: 1,
  },
  errorText: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.72rem",
    color: "#C0392B",
    marginTop: "0.4rem",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#FDF0EE",
    border: "1px solid #F5C6BC",
    borderRadius: 10,
    padding: "0.85rem 1rem",
    marginBottom: "1rem",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.82rem",
    color: "#922B21",
  },
  radioCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "1.1rem 1.25rem",
    border: `1.5px solid ${BORDER}`,
    borderRadius: 12,
    marginBottom: "0.75rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: "#FDFBF8",
  },
  radioCardActive: {
    borderColor: GREEN,
    background: "#FEFCF6",
    boxShadow: `0 0 0 3px rgba(74,140,42,0.1)`,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    border: `2px solid ${BORDER}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "border-color 0.2s",
  },
  radioCircleActive: {borderColor: GREEN},
  radioDot: {width: 10, height: 10, borderRadius: "50%", background: GREEN},
  radioTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 600,
    fontSize: "0.88rem",
    color: DARK,
    margin: "0 0 2px",
  },
  radioSubtitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.75rem",
    color: MUTED,
    margin: 0,
  },
  radioCost: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "1.05rem",
    fontWeight: 600,
    color: GREEN,
    whiteSpace: "nowrap",
  },
  payIcon: {fontSize: 22, flexShrink: 0},
  nextBtn: {
    flex: 1,
    padding: "0.95rem 2rem",
    background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_LIGHT} 100%)`,
    border: "none",
    borderRadius: 10,
    fontSize: "0.8rem",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
  backBtn: {
    padding: "0.95rem 1.75rem",
    background: "transparent",
    border: `1.5px solid ${BORDER}`,
    borderRadius: 10,
    fontSize: "0.8rem",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 500,
    color: MUTED,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  submitBtn: {
    width: "100%",
    padding: "1.05rem",
    background: `linear-gradient(135deg, ${DARK} 0%, #2D2A24 100%)`,
    border: "none",
    borderRadius: 12,
    fontSize: "0.85rem",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#F5EDD8",
    cursor: "pointer",
    transition: "all 0.25s ease",
    marginBottom: "1rem",
  },
  submitBtnDisabled: {opacity: 0.65, cursor: "not-allowed"},
  secureNote: {
    textAlign: "center",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.7rem",
    color: "#B0A090",
    marginBottom: "1.5rem",
    letterSpacing: "0.03em",
  },
  ghostBtn: {
    background: "none",
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: "0.6rem 1.2rem",
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.78rem",
    color: MUTED,
    marginTop: "0.75rem",
  },
  emptyState: {textAlign: "center", padding: "2rem 1rem"},
  emptyIcon: {fontSize: 36, marginBottom: "0.75rem"},
  emptyText: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.85rem",
    color: MUTED,
    margin: 0,
    lineHeight: 1.6,
  },
  shimmerCard: {
    background: "#F5F0E8",
    borderRadius: 12,
    padding: "1rem 1.25rem",
    marginBottom: "0.75rem",
    animation: "shimmer 1.4s ease-in-out infinite",
  },
  shimmerBar: {
    height: 14,
    borderRadius: 6,
    background: "#EDE7D9",
    width: "55%",
  },
  sidebar: {position: "sticky", top: 80},
  sidebarCard: {
    background: "#fff",
    borderRadius: 16,
    border: `1px solid ${BORDER}`,
    padding: "2rem",
    boxShadow: "0 4px 32px rgba(26,20,16,0.06)",
  },
  sidebarTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "1.3rem",
    fontWeight: 600,
    color: DARK,
    margin: "0 0 1.25rem",
    letterSpacing: "0.01em",
  },
  sidebarDivider: {height: 1, background: BORDER, margin: "1.25rem 0"},
  cartItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: "1rem",
  },
  cartItemImg: {position: "relative", flexShrink: 0},
  cartImg: {
    width: 52,
    height: 52,
    borderRadius: 8,
    objectFit: "cover",
    border: `1px solid ${BORDER}`,
  },
  cartImgPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 8,
    background: "#F0EAE0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "1.2rem",
    color: MUTED,
    border: `1px solid ${BORDER}`,
  },
  cartQtyBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: GREEN,
    color: "#fff",
    fontSize: "0.62rem",
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cartItemName: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.82rem",
    fontWeight: 500,
    color: DARK,
    margin: "0 0 2px",
    lineHeight: 1.3,
  },
  cartItemVariant: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.72rem",
    color: MUTED,
    margin: 0,
  },
  cartItemPrice: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "1rem",
    fontWeight: 600,
    color: DARK,
    whiteSpace: "nowrap",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.6rem",
  },
  summaryLabel: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.78rem",
    color: MUTED,
    letterSpacing: "0.04em",
  },
  summaryValue: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.85rem",
    color: DARK,
    fontWeight: 500,
  },
  totalLabel: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "1.1rem",
    fontWeight: 600,
    color: DARK,
  },
  totalValue: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "1.4rem",
    fontWeight: 700,
    color: GREEN,
  },
  editCartBtn: {
    width: "100%",
    marginTop: "1.25rem",
    padding: "0.7rem",
    background: "transparent",
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.75rem",
    letterSpacing: "0.06em",
    color: MUTED,
    transition: "all 0.2s",
  },
  trustRow: {display: "flex", gap: 8, marginTop: "1.5rem"},
  trustBadge: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    background: "#FDFBF8",
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: "0.75rem 0.5rem",
  },
  trustLabel: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.6rem",
    letterSpacing: "0.06em",
    textAlign: "center",
    color: MUTED,
    textTransform: "uppercase",
    fontWeight: 500,
  },
};

const injectCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  textarea { font-family: 'Montserrat', sans-serif; font-size: 0.9rem; }
  @keyframes shimmer { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    display: inline-block;
    width: 16px; height: 16px;
    border: 2px solid rgba(245,237,216,0.35);
    border-top-color: #F5EDD8;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @media (max-width: 860px) {
    .checkout-grid { grid-template-columns: 1fr !important; }
    .step-label { display: none; }
  }
  @media (max-width: 540px) {
    .two-col { grid-template-columns: 1fr !important; }
  }
  input::placeholder, textarea::placeholder { color: #C8BBAA; }
  select option { color: #1A1410; }
`;

export default Checkout;
