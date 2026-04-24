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

// ── Animation variants ──────────────────────────────────────────────────────
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
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 1.5-9.5 2.5A4 4 0 0013 9c1 0 2.5.5 2.5.5S15.5 7 17 8z" />
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
    {[{label: "−", action: onDec}, null, {label: "+", action: onInc}].map(
      (btn, i) =>
        btn === null ? (
          <span
            key="qty"
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
        ) : (
          <motion.button
            key={btn.label}
            whileTap={{scale: 0.85}}
            onClick={btn.action}
            style={{
              width: 34,
              height: 34,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: MUTED,
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.2s, background 0.2s",
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
            {btn.label}
          </motion.button>
        ),
    )}
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

// ── FIX 3 & 4: Safe helpers ──────────────────────────────────────────────────

/**
 * Resolves the product object regardless of whether the backend
 * returns a populated sub-document or a flat item.
 */
const resolveProduct = (item) =>
  item.product && typeof item.product === "object" ? item.product : item;

/**
 * Resolves a stable string ID from a cart item.
 */
const resolveId = (item) => {
  if (item._id) return String(item._id);
  if (item.product && typeof item.product === "object")
    return String(item.product._id);
  return String(item.product);
};

/**
 * Safely converts a Buffer/image data to a data URL.
 * Returns null on failure so we can fall back to the leaf placeholder.
 */
const safeBufferToDataURL = (imageData) => {
  if (!imageData) return null;
  try {
    return bufferToDataURL(imageData);
  } catch {
    return null;
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// CartPage
// ══════════════════════════════════════════════════════════════════════════════
const CartPage = () => {
  // FIX 1: destructure with a safe default so undefined isLoading never blocks render
  const {addedProduct, fetchCart, isLoading = false} = useAddToCartStore();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {once: true, margin: "-80px"});
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const [quantities, setQuantities] = useState({});
  const [removedIds, setRemovedIds] = useState([]);

  useEffect(() => {
    if (addedProduct && addedProduct.length) {
      setQuantities(
        Object.fromEntries(
          // FIX 2: use resolveId() for stable string keys
          addedProduct.map((i) => [resolveId(i), i.quantity || 1]),
        ),
      );
    } else {
      setQuantities({});
    }
  }, [addedProduct]);

  const visibleItems = (addedProduct || []).filter(
    // FIX 2: use resolveId() consistently
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
    const id = resolveId(item); // FIX 2
    const price = item.priceAtAdd || item.price || 0;
    return sum + price * (quantities[id] || 1);
  }, 0);
  const discount = subtotal * DISCOUNT;
  const total = subtotal - discount + (visibleItems.length > 0 ? DELIVERY : 0);

  // FIX 1: explicit === true check so undefined/null isLoading never traps us
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
          {/* Page header */}
          <motion.div
            initial={{opacity: 0, y: 32}}
            animate={isInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.85, ease: [0.16, 1, 0.3, 1]}}
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

          {/* Two-column grid */}
          <div
            className="cart-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 390px",
              gap: 36,
              alignItems: "start",
            }}
          >
            {/* LEFT – Cart items */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {visibleItems.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  style={{
                    background: "rgba(247,251,244,0.75)",
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${GREEN}25`,
                    borderRadius: 24,
                    padding: "96px 48px",
                    textAlign: "center",
                  }}
                >
                  <motion.div
                    animate={{y: [0, -10, 0], rotate: [-5, 5, -5]}}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: `${GREEN}14`,
                      border: `1px solid ${GREEN}35`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 28px",
                    }}
                  >
                    <LeafIcon size={32} color={GREEN} />
                  </motion.div>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 24,
                      fontWeight: 300,
                      color: DARK,
                      margin: "0 0 10px",
                    }}
                  >
                    Your cart is empty
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: MUTED,
                      margin: "0 0 36px",
                      lineHeight: 1.8,
                    }}
                  >
                    Discover our curated botanical collection —<br />
                    nature's finest, thoughtfully formulated.
                  </p>
                  <motion.button
                    whileHover={{scale: 1.04}}
                    whileTap={{scale: 0.96}}
                    onClick={() => navigate("/")}
                    style={{
                      background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_LIGHT} 100%)`,
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      padding: "13px 36px",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      boxShadow: `0 6px 24px ${GREEN}40`,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <motion.span
                      animate={{x: ["-100%", "200%"]}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1.2,
                      }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                        pointerEvents: "none",
                      }}
                    />
                    Shop Now
                  </motion.button>
                </motion.div>
              ) : (
                <div
                  style={{display: "flex", flexDirection: "column", gap: 18}}
                >
                  <AnimatePresence>
                    {visibleItems.map((item) => {
                      // FIX 2: stable string id
                      const id = resolveId(item);
                      const qty = quantities[id] || 1;
                      const price = item.priceAtAdd || item.price || 0;

                      // FIX 3: resolve the product sub-document safely
                      const prod = resolveProduct(item);

                      // FIX 4: safe image conversion
                      const imgSrc = safeBufferToDataURL(prod?.image);

                      return (
                        <motion.div
                          key={id}
                          variants={itemVariants}
                          exit={{
                            opacity: 0,
                            x: -60,
                            scale: 0.96,
                            transition: {duration: 0.4},
                          }}
                          layout
                          style={{
                            background: "rgba(247,251,244,0.72)",
                            backdropFilter: "blur(18px)",
                            WebkitBackdropFilter: "blur(18px)",
                            border: `1px solid ${GREEN}22`,
                            borderRadius: 22,
                            padding: "22px 24px",
                            display: "flex",
                            alignItems: "center",
                            gap: 22,
                            borderLeft: `3px solid ${GREEN}55`,
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <motion.div
                            initial={{opacity: 0}}
                            whileHover={{opacity: 1}}
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: `linear-gradient(135deg, ${GREEN}06 0%, transparent 60%)`,
                              pointerEvents: "none",
                            }}
                          />

                          {/* Image */}
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
                            {/* FIX 3 & 4: use prod and safeImg */}
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={prod?.name || "Product"}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
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

                          {/* Info — FIX 3: use prod fields */}
                          <div style={{flex: 1, minWidth: 0}}>
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
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
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
                              <span
                                style={{
                                  fontSize: 11,
                                  color: MUTED,
                                  letterSpacing: "0.05em",
                                }}
                              >
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

                          {/* Controls */}
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

                  <motion.div variants={itemVariants}>
                    <motion.button
                      whileHover={{x: -4}}
                      whileTap={{scale: 0.97}}
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
                        fontWeight: 500,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        padding: "8px 0",
                        transition: "color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = GREEN)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = MUTED)
                      }
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
                      </svg>
                      Continue Shopping
                    </motion.button>
                  </motion.div>
                </div>
              )}
            </motion.div>

            {/* RIGHT – Order summary */}
            <motion.div
              variants={slideIn}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              style={{position: "sticky", top: 100}}
            >
              <div
                style={{
                  background: `linear-gradient(160deg, ${GREEN_DARK} 0%, #1C3A10 60%, #0D2208 100%)`,
                  backdropFilter: "blur(20px)",
                  borderRadius: 24,
                  border: `1px solid ${GREEN}35`,
                  overflow: "hidden",
                  boxShadow: `0 32px 80px rgba(20,40,15,0.32), 0 8px 24px rgba(20,40,15,0.18)`,
                }}
              >
                <div
                  style={{
                    padding: "28px 30px 22px",
                    borderBottom: `1px solid ${GREEN}22`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      right: -20,
                      top: -20,
                      opacity: 0.07,
                      pointerEvents: "none",
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
                      letterSpacing: "-0.01em",
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
                      valueColor: "#fff",
                    },
                    {
                      label: "Delivery",
                      value:
                        visibleItems.length > 0
                          ? `$${DELIVERY.toFixed(2)}`
                          : "—",
                      valueColor: visibleItems.length > 0 ? "#fff" : MUTED,
                    },
                    {
                      label: "Discount",
                      value: promoApplied ? `-$${discount.toFixed(2)}` : "—",
                      valueColor: promoApplied ? GREEN_LIGHT : MUTED,
                    },
                  ].map(({label, value, valueColor}) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          color: MUTED,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {label}
                      </span>
                      <span
                        style={{
                          fontFamily:
                            label === "Subtotal"
                              ? "'Playfair Display', serif"
                              : "inherit",
                          fontSize: label === "Subtotal" ? 16 : 14,
                          fontWeight: 300,
                          color: valueColor,
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
                    <motion.span
                      key={total}
                      initial={{scale: 1.12, opacity: 0.7}}
                      animate={{scale: 1, opacity: 1}}
                      transition={{duration: 0.4}}
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 32,
                        fontWeight: 300,
                        color: GREEN_LIGHT,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      ${total.toFixed(2)}
                    </motion.span>
                  </div>
                </div>

                <div style={{padding: "0 30px 24px"}}>
                  <div
                    style={{
                      display: "flex",
                      gap: 0,
                      border: `1px solid ${GREEN}28`,
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      style={{
                        flex: 1,
                        background: "none",
                        border: "none",
                        outline: "none",
                        padding: "12px 16px",
                        fontSize: 12,
                        color: "#fff",
                        letterSpacing: "0.06em",
                      }}
                    />
                    <motion.button
                      whileTap={{scale: 0.96}}
                      onClick={() => {
                        if (promoCode.trim()) setPromoApplied(true);
                      }}
                      style={{
                        background: `${GREEN}28`,
                        border: "none",
                        padding: "10px 18px",
                        cursor: "pointer",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: GREEN_LIGHT,
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = `${GREEN}50`)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = `${GREEN}28`)
                      }
                    >
                      {promoApplied ? "✓ Applied" : "Apply"}
                    </motion.button>
                  </div>
                  {promoApplied && (
                    <motion.p
                      initial={{opacity: 0, y: -6}}
                      animate={{opacity: 1, y: 0}}
                      style={{
                        margin: "8px 0 0",
                        fontSize: 11,
                        color: GREEN_LIGHT,
                        letterSpacing: "0.05em",
                      }}
                    >
                      10% discount applied successfully
                    </motion.p>
                  )}
                </div>

                <div style={{padding: "0 30px 30px"}}>
                  <Link
                    to={
                      visibleItems.length > 0 ? "/cart-page/shipping-info" : "#"
                    }
                  >
                    <motion.button
                      whileHover={visibleItems.length > 0 ? {scale: 1.02} : {}}
                      whileTap={visibleItems.length > 0 ? {scale: 0.98} : {}}
                      disabled={visibleItems.length === 0}
                      style={{
                        width: "100%",
                        padding: "17px",
                        background:
                          visibleItems.length === 0
                            ? "rgba(255,255,255,0.07)"
                            : `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_LIGHT} 100%)`,
                        border: "none",
                        borderRadius: 14,
                        cursor:
                          visibleItems.length === 0 ? "not-allowed" : "pointer",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.32em",
                        textTransform: "uppercase",
                        color: visibleItems.length === 0 ? MUTED : "#fff",
                        boxShadow:
                          visibleItems.length > 0
                            ? `0 8px 28px ${GREEN}55`
                            : "none",
                        transition: "opacity 0.3s",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {visibleItems.length > 0 && (
                        <motion.span
                          animate={{x: ["-100%", "200%"]}}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            repeatDelay: 1.5,
                          }}
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      Proceed to Checkout →
                    </motion.button>
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

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 10,
                      marginTop: 22,
                      paddingTop: 18,
                      borderTop: `1px solid ${GREEN}18`,
                    }}
                  >
                    {["VISA", "M/C", "AMEX", "PayPal"].map((brand) => (
                      <div
                        key={brand}
                        style={{
                          padding: "4px 8px",
                          borderRadius: 6,
                          border: `1px solid ${GREEN}22`,
                          background: "rgba(255,255,255,0.05)",
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          color: MUTED,
                        }}
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                initial={{opacity: 0, y: 14}}
                animate={isInView ? {opacity: 1, y: 0} : {}}
                transition={{delay: 0.7, duration: 0.6}}
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
                <span style={{fontSize: 11, color: MUTED, lineHeight: 1.6}}>
                  100% natural ingredients · Eco-friendly packaging ·
                  Carbon-neutral shipping
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes shimmer-text {
          0%   { background-position: 0%   center }
          50%  { background-position: 100% center }
          100% { background-position: 0%   center }
        }
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
        input::placeholder { color: ${MUTED}; font-size: 12px; }
      `}</style>
    </main>
  );
};

export default CartPage;
