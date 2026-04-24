import React, {useState, useRef, useEffect} from "react";
import NavBar from "../components/navBar";
import {motion, AnimatePresence, useInView} from "framer-motion";
import {useAddToCartStore} from "../stores/addToCartStore.js";
import {bufferToDataURL} from "../utils/displayImage";
import {Link, useNavigate} from "react-router-dom";

// ── Mindful Living KE — Brand Palette ──────────────────────────────────────
const GREEN = "#4A8C2A";
const GREEN_LIGHT = "#72B84A";
const GREEN_DARK = "#14280F";
const GREEN_PALE = "#E8F5E0";
const MUTED = "#5A7A4A";
const CREAM = "#F7FBF4";
const DARK = "#1A1A1A";

// ── Animation variants (unchanged) ─────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {transition: {staggerChildren: 0.09, delayChildren: 0.12}},
};
const itemVariants = {
  hidden: {opacity: 0, y: 32, filter: "blur(5px)"},
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {duration: 0.75, ease: [0.16, 1, 0.3, 1]},
  },
};
const slideIn = {
  hidden: {opacity: 0, x: 48},
  visible: {
    opacity: 1,
    x: 0,
    transition: {duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.25},
  },
};

// ── Floating leaf SVG ───────────────────────────────────────────────────────
const LeafIcon = ({size = 16, color = GREEN, opacity = 1}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{opacity}}
  >
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 1.5-9.5 2.5A4.5 4.5 0 0013 9c1 0 2.5.5 2.5.5S15.5 7 17 8z" />
  </svg>
);

// ── Animated background orb ─────────────────────────────────────────────────
const FloatingOrb = ({style, animX, animY, duration, delay = 0}) => (
  <motion.div
    animate={{x: animX, y: animY}}
    transition={{duration, repeat: Infinity, ease: "easeInOut", delay}}
    style={{
      position: "fixed",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: 0,
      ...style,
    }}
  />
);

// ── Qty stepper ─────────────────────────────────────────────────────────────
const QtyControl = ({qty, onInc, onDec}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      border: `1px solid ${GREEN}35`,
      borderRadius: 50,
      overflow: "hidden",
      background: `${GREEN}08`,
    }}
  >
    <motion.button
      whileTap={{scale: 0.85}}
      onClick={onDec}
      style={{
        width: 34,
        height: 34,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: MUTED,
        fontSize: 18,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = GREEN;
        e.currentTarget.style.background = `${GREEN}14`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = MUTED;
        e.currentTarget.style.background = "none";
      }}
    >
      −
    </motion.button>
    <span
      style={{
        width: 32,
        textAlign: "center",
        fontSize: 13,
        fontWeight: 600,
        color: DARK,
        userSelect: "none",
      }}
    >
      {qty}
    </span>
    <motion.button
      whileTap={{scale: 0.85}}
      onClick={onInc}
      style={{
        width: 34,
        height: 34,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: MUTED,
        fontSize: 18,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = GREEN;
        e.currentTarget.style.background = `${GREEN}14`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = MUTED;
        e.currentTarget.style.background = "none";
      }}
    >
      +
    </motion.button>
  </div>
);

// ── Icon circle button ──────────────────────────────────────────────────────
const CircleBtn = ({
  onClick,
  title,
  borderColor,
  hoverBorder,
  hoverBg,
  children,
}) => (
  <motion.button
    whileHover={{scale: 1.08}}
    whileTap={{scale: 0.92}}
    title={title}
    onClick={onClick}
    style={{
      width: 36,
      height: 36,
      borderRadius: "50%",
      border: `1px solid ${borderColor}`,
      background: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "border-color 0.2s, background 0.2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = hoverBorder;
      e.currentTarget.style.background = hoverBg;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = borderColor;
      e.currentTarget.style.background = "none";
    }}
  >
    {children}
  </motion.button>
);

// ── Trust badge ─────────────────────────────────────────────────────────────
const TrustBadge = ({icon, label}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: `${GREEN}14`,
        border: `1px solid ${GREEN}30`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke={GREEN}
        strokeWidth="1.6"
      >
        <path d={icon} />
      </svg>
    </div>
    <span
      style={{
        fontSize: 9,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: MUTED,
      }}
    >
      {label}
    </span>
  </div>
);

// ── Safe helpers ───────────────────────────────────────────────────────────
const resolveProduct = (item) =>
  item.product && typeof item.product === "object" ? item.product : item;
const resolveId = (item) => {
  if (item._id) return String(item._id);
  if (item.product && typeof item.product === "object")
    return String(item.product._id);
  return String(item.product);
};
const safeBufferToDataURL = (imageData) => {
  if (!imageData) return null;
  try {
    return bufferToDataURL(imageData);
  } catch {
    return null;
  }
};

// ════════════════════════════════════════════════════════════════════════════
// CartPage – guaranteed visible
// ════════════════════════════════════════════════════════════════════════════
const CartPage = () => {
  const {addedProduct, fetchCart, isLoading = false} = useAddToCartStore();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {once: true, margin: "0px"});
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [removedIds, setRemovedIds] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (addedProduct && addedProduct.length) {
      setQuantities(
        Object.fromEntries(
          addedProduct.map((i) => [resolveId(i), i.quantity || 1]),
        ),
      );
    } else {
      setQuantities({});
    }
  }, [addedProduct]);

  const visibleItems = (addedProduct || []).filter(
    (item) => !removedIds.includes(resolveId(item)),
  );

  const handleQtyChange = (id, delta) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  const handleRemove = (id) => setRemovedIds((prev) => [...prev, id]);

  const DELIVERY = 12.99;
  const DISCOUNT = promoApplied ? 0.1 : 0;
  const subtotal = visibleItems.reduce((sum, item) => {
    const id = resolveId(item);
    const price = item.priceAtAdd || item.price || 0;
    return sum + price * (quantities[id] || 1);
  }, 0);
  const discount = subtotal * DISCOUNT;
  const total = subtotal - discount + (visibleItems.length > 0 ? DELIVERY : 0);

  if (isLoading === true) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${CREAM} 0%, ${GREEN_PALE} 50%, #C8E8A8 100%)`,
        }}
      >
        <NavBar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <motion.div
            animate={{rotate: 360}}
            transition={{duration: 2, repeat: Infinity, ease: "linear"}}
          >
            <LeafIcon size={32} color={GREEN} />
          </motion.div>
          <span
            style={{
              color: MUTED,
              fontSize: 11,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
            }}
          >
            Loading your cart…
          </span>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${CREAM} 0%, ${GREEN_PALE} 45%, #C5E4AC 100%)`,
        position: "relative",
      }}
    >
      <NavBar />

      {/* Floating orbs – design unchanged */}
      <FloatingOrb
        style={{
          width: 520,
          height: 520,
          background: `radial-gradient(circle, ${GREEN}16 0%, transparent 70%)`,
          top: "-8%",
          right: "8%",
        }}
        animX={[0, 28, 0]}
        animY={[0, -18, 0]}
        duration={14}
      />
      <FloatingOrb
        style={{
          width: 380,
          height: 380,
          background: `radial-gradient(circle, ${GREEN_LIGHT}12 0%, transparent 70%)`,
          bottom: "5%",
          left: "2%",
        }}
        animX={[0, -22, 0]}
        animY={[0, 26, 0]}
        duration={18}
        delay={3}
      />
      <FloatingOrb
        style={{
          width: 260,
          height: 260,
          background: `radial-gradient(circle, ${GREEN}10 0%, transparent 70%)`,
          top: "40%",
          left: "35%",
        }}
        animX={[0, 15, 0]}
        animY={[0, -20, 0]}
        duration={22}
        delay={6}
      />

      <div
        style={{
          position: "fixed",
          top: "15%",
          right: "3%",
          opacity: 0.06,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <LeafIcon size={180} color={GREEN} />
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "12%",
          left: "1%",
          opacity: 0.05,
          pointerEvents: "none",
          zIndex: 0,
          transform: "rotate(140deg)",
        }}
      >
        <LeafIcon size={140} color={GREEN} />
      </div>

      <section
        ref={sectionRef}
        style={{position: "relative", zIndex: 1, padding: "60px 0 110px"}}
      >
        <div style={{maxWidth: 1320, margin: "0 auto", padding: "0 24px"}}>
          {/* Page header – unchanged */}
          <motion.div
            initial={{opacity: 0, y: 32}}
            animate={isInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.85}}
            style={{marginBottom: 52}}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 18px",
                border: `1px solid ${GREEN}45`,
                background: `${GREEN}12`,
                borderRadius: 100,
                marginBottom: 18,
              }}
            >
              <motion.div
                animate={{scale: [1, 1.5, 1], opacity: [1, 0.4, 1]}}
                transition={{duration: 2, repeat: Infinity}}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: GREEN,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.38em",
                  textTransform: "uppercase",
                  color: GREEN,
                }}
              >
                Your Selection
              </span>
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "clamp(38px, 4.5vw, 68px)",
                fontWeight: 300,
                color: DARK,
                margin: 0,
                letterSpacing: "-0.01em",
                lineHeight: 1.08,
              }}
            >
              Shopping{" "}
              <em
                style={{
                  fontStyle: "italic",
                  background: `linear-gradient(90deg, ${GREEN} 0%, ${GREEN_LIGHT} 50%, ${GREEN} 100%)`,
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "shimmer-text 3s ease-in-out infinite",
                }}
              >
                Cart
              </em>
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 14,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 1.5,
                  background: `linear-gradient(90deg, ${GREEN}, ${GREEN_LIGHT})`,
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  color: MUTED,
                }}
              >
                {visibleItems.length}{" "}
                {visibleItems.length === 1 ? "Item" : "Items"} · The Natural Way
              </span>
            </div>
          </motion.div>

          {/* Two‑column grid */}
          <div
            className="cart-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 390px",
              gap: 36,
              alignItems: "start",
            }}
          >
            {/* LEFT column – cart items / empty state */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {visibleItems.length === 0 ? (
                // ✅ EMPTY STATE – SOLID WHITE CARD, FULLY VISIBLE
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: 24,
                    padding: "96px 48px",
                    textAlign: "center",
                    border: `2px solid ${GREEN}`,
                    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)",
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: GREEN_PALE,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 28px",
                    }}
                  >
                    <LeafIcon size={32} color={GREEN} />
                  </div>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 28,
                      fontWeight: 300,
                      color: DARK,
                      margin: "0 0 12px",
                    }}
                  >
                    Your cart is empty
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color: MUTED,
                      margin: "0 0 40px",
                      lineHeight: 1.8,
                      maxWidth: 400,
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    Discover our curated botanical collection —<br />
                    nature's finest, thoughtfully formulated.
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    style={{
                      background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
                      color: "#fff",
                      border: "none",
                      borderRadius: 50,
                      padding: "14px 44px",
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      cursor: "pointer",
                      boxShadow: `0 6px 20px ${GREEN}50`,
                    }}
                  >
                    SHOP NOW
                  </button>
                </div>
              ) : (
                <div
                  style={{display: "flex", flexDirection: "column", gap: 18}}
                >
                  <AnimatePresence>
                    {visibleItems.map((item) => {
                      const id = resolveId(item);
                      const qty = quantities[id] || 1;
                      const price = item.priceAtAdd || item.price || 0;
                      const prod = resolveProduct(item);
                      const imgSrc = safeBufferToDataURL(prod?.image);
                      return (
                        <motion.div
                          key={id}
                          variants={itemVariants}
                          exit={{opacity: 0, x: -60, scale: 0.96}}
                          layout
                          style={{
                            background: "rgba(247,251,244,0.92)",
                            backdropFilter: "blur(10px)",
                            border: `1px solid ${GREEN}22`,
                            borderRadius: 22,
                            padding: "22px 24px",
                            display: "flex",
                            alignItems: "center",
                            gap: 22,
                            borderLeft: `3px solid ${GREEN}55`,
                          }}
                        >
                          <div
                            style={{
                              width: 106,
                              height: 106,
                              borderRadius: 16,
                              overflow: "hidden",
                              flexShrink: 0,
                              background: `${GREEN}12`,
                              border: `1px solid ${GREEN}25`,
                              boxShadow: `0 8px 24px ${GREEN}18`,
                            }}
                          >
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={prod?.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  height: "100%",
                                }}
                              >
                                <LeafIcon
                                  size={32}
                                  color={GREEN}
                                  opacity={0.5}
                                />
                              </div>
                            )}
                          </div>
                          <div style={{flex: 1}}>
                            <p
                              style={{
                                fontSize: 9,
                                fontWeight: 600,
                                letterSpacing: "0.38em",
                                textTransform: "uppercase",
                                color: GREEN,
                                margin: "0 0 5px",
                              }}
                            >
                              {prod?.category || "Botanical"}
                            </p>
                            <p
                              style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 18,
                                fontWeight: 400,
                                color: DARK,
                                margin: "0 0 10px",
                              }}
                            >
                              {prod?.name || "Product"}
                            </p>
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "3px 10px",
                                background: `${GREEN}12`,
                                borderRadius: 100,
                                border: `1px solid ${GREEN}25`,
                                marginBottom: 10,
                              }}
                            >
                              <span style={{fontSize: 11, color: MUTED}}>
                                ${price.toFixed(2)} / unit
                              </span>
                            </div>
                            <p
                              style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 22,
                                fontWeight: 300,
                                color: DARK,
                                margin: 0,
                              }}
                            >
                              ${(price * qty).toFixed(2)}
                            </p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                              gap: 18,
                            }}
                          >
                            <QtyControl
                              qty={qty}
                              onInc={() => handleQtyChange(id, 1)}
                              onDec={() => handleQtyChange(id, -1)}
                            />
                            <div style={{display: "flex", gap: 10}}>
                              <CircleBtn
                                title="Save for later"
                                borderColor={`${GREEN}30`}
                                hoverBorder={GREEN}
                                hoverBg={`${GREEN}14`}
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke={GREEN}
                                  strokeWidth="1.8"
                                >
                                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                </svg>
                              </CircleBtn>
                              <CircleBtn
                                title="Remove item"
                                onClick={() => handleRemove(id)}
                                borderColor="#e0c8c8"
                                hoverBorder="#c0392b"
                                hoverBg="#fdf2f2"
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#c0392b"
                                  strokeWidth="1.8"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6l-1 14H6L5 6" />
                                  <path d="M10 11v6M14 11v6" />
                                  <path d="M9 6V4h6v2" />
                                </svg>
                              </CircleBtn>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <button
                    onClick={() => navigate("/")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: MUTED,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.22em",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = GREEN)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>{" "}
                    Continue Shopping
                  </button>
                </div>
              )}
            </motion.div>

            {/* RIGHT – Order summary (fully visible) */}
            <motion.div
              variants={slideIn}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              style={{position: "sticky", top: 100}}
            >
              <div
                style={{
                  background: `linear-gradient(160deg, ${GREEN_DARK} 0%, #1C3A10 60%, #0D2208 100%)`,
                  borderRadius: 24,
                  border: `1px solid ${GREEN}35`,
                  overflow: "hidden",
                  boxShadow: `0 32px 80px rgba(20,40,15,0.32)`,
                }}
              >
                <div
                  style={{
                    padding: "28px 30px 22px",
                    borderBottom: `1px solid ${GREEN}22`,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      right: -20,
                      top: -20,
                      opacity: 0.07,
                    }}
                  >
                    <LeafIcon size={120} color={GREEN_LIGHT} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 1.5,
                        background: `linear-gradient(90deg, ${GREEN}, ${GREEN_LIGHT})`,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: "0.4em",
                        textTransform: "uppercase",
                        color: GREEN_LIGHT,
                      }}
                    >
                      Summary
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 24,
                      fontWeight: 300,
                      color: GREEN_LIGHT,
                      margin: 0,
                    }}
                  >
                    Order Summary
                  </p>
                </div>
                <div
                  style={{
                    padding: "24px 30px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {[
                    {
                      label: "Subtotal",
                      value: `$${subtotal.toFixed(2)}`,
                      color: "#fff",
                    },
                    {
                      label: "Delivery",
                      value:
                        visibleItems.length > 0
                          ? `$${DELIVERY.toFixed(2)}`
                          : "—",
                      color: visibleItems.length > 0 ? "#fff" : MUTED,
                    },
                    {
                      label: "Discount",
                      value: promoApplied ? `-$${discount.toFixed(2)}` : "—",
                      color: promoApplied ? GREEN_LIGHT : MUTED,
                    },
                  ].map(({label, value, color}) => (
                    <div
                      key={label}
                      style={{display: "flex", justifyContent: "space-between"}}
                    >
                      <span style={{fontSize: 13, color: MUTED}}>{label}</span>
                      <span
                        style={{
                          fontFamily:
                            label === "Subtotal"
                              ? "'Playfair Display', serif"
                              : "inherit",
                          fontSize: label === "Subtotal" ? 16 : 14,
                          fontWeight: 300,
                          color,
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      height: 1,
                      background: `linear-gradient(90deg, transparent, ${GREEN}35, transparent)`,
                      margin: "4px 0",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        color: GREEN_LIGHT,
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 32,
                        fontWeight: 300,
                        color: "#fff",
                      }}
                    >
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Promo code – fully opaque button */}
                <div style={{padding: "0 30px 24px"}}>
                  <div
                    style={{
                      display: "flex",
                      gap: 0,
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.1)",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      style={{
                        flex: 1,
                        background: "rgba(0,0,0,0.4)",
                        border: "none",
                        outline: "none",
                        padding: "12px 16px",
                        fontSize: 12,
                        color: "#fff",
                      }}
                    />
                    <button
                      onClick={() => {
                        if (promoCode.trim()) setPromoApplied(true);
                      }}
                      style={{
                        background: GREEN_LIGHT,
                        border: "none",
                        padding: "10px 18px",
                        cursor: "pointer",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.28em",
                        color: "#fff",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = GREEN)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = GREEN_LIGHT)
                      }
                    >
                      {promoApplied ? "✓ Applied" : "Apply"}
                    </button>
                  </div>
                  {promoApplied && (
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 11,
                        color: GREEN_LIGHT,
                      }}
                    >
                      10% discount applied successfully
                    </p>
                  )}
                </div>

                {/* Checkout button – fully opaque */}
                <div style={{padding: "0 30px 30px"}}>
                  <Link
                    to={
                      visibleItems.length > 0 ? "/cart-page/shipping-info" : "#"
                    }
                  >
                    <button
                      disabled={visibleItems.length === 0}
                      style={{
                        width: "100%",
                        padding: "17px",
                        background:
                          visibleItems.length === 0
                            ? "#888"
                            : `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
                        border: "none",
                        borderRadius: 14,
                        cursor:
                          visibleItems.length === 0 ? "not-allowed" : "pointer",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.32em",
                        textTransform: "uppercase",
                        color: "#fff",
                      }}
                    >
                      Proceed to Checkout →
                    </button>
                  </Link>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      marginTop: 24,
                    }}
                  >
                    <TrustBadge
                      icon="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      label="Secure"
                    />
                    <TrustBadge
                      icon="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                      label="Free Returns"
                    />
                    <TrustBadge
                      icon="M5 12h14M12 5l7 7-7 7"
                      label="Fast Delivery"
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 18px",
                  background: `${GREEN}12`,
                  border: `1px solid ${GREEN}25`,
                  borderRadius: 12,
                }}
              >
                <LeafIcon size={15} color={GREEN} />
                <span style={{fontSize: 11, color: MUTED}}>
                  100% natural ingredients · Eco-friendly packaging ·
                  Carbon-neutral shipping
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes shimmer-text { 0% { background-position: 0% center; } 50% { background-position: 100% center; } 100% { background-position: 0% center; } }
        @media (max-width: 900px) { .cart-grid { grid-template-columns: 1fr !important; } }
        input::placeholder { color: #aaa; font-size: 12px; }
      `}</style>
    </main>
  );
};

export default CartPage;
