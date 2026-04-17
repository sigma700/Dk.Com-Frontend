import React, {useState, useRef, useEffect} from "react";
import NavBar from "../components/navBar";
import {motion, AnimatePresence, useInView} from "framer-motion";
import {useAddToCartStore} from "../stores/addToCartStore.js";
import {bufferToDataURL} from "../utils/displayImage";
import {Link, useNavigate} from "react-router-dom";

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C97A";
const DARK = "#1A1410";
const MUTED = "#8A7560";
const CREAM = "#FDFAF5";

const containerVariants = {
  hidden: {},
  visible: {transition: {staggerChildren: 0.1, delayChildren: 0.15}},
};

const itemVariants = {
  hidden: {opacity: 0, y: 28, filter: "blur(4px)"},
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {duration: 0.7, ease: [0.16, 1, 0.3, 1]},
  },
};

const slideIn = {
  hidden: {opacity: 0, x: 40},
  visible: {
    opacity: 1,
    x: 0,
    transition: {duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3},
  },
};

const CartPage = () => {
  const {addedProduct, fetchCart, isLoading} = useAddToCartStore();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {once: true, margin: "-80px"});

  useEffect(() => {
    fetchCart();
  }, []);

  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(
      (addedProduct || []).map((item) => [
        item._id || item.product,
        item.quantity || 1,
      ]),
    ),
  );
  const [removedIds, setRemovedIds] = useState([]);

  useEffect(() => {
    setQuantities(
      Object.fromEntries(
        (addedProduct || []).map((item) => [
          item._id || item.product,
          item.quantity || 1,
        ]),
      ),
    );
  }, [addedProduct]);

  const visibleItems = (addedProduct || []).filter(
    (item) => !removedIds.includes(item._id || item.product),
  );

  const handleQtyChange = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleRemove = (id) => setRemovedIds((prev) => [...prev, id]);

  const DELIVERY = 12.99;
  const subtotal = visibleItems.reduce((sum, item) => {
    const id = item._id || item.product;
    const price = item.priceAtAdd || item.price || 0;
    return sum + price * (quantities[id] || 1);
  }, 0);
  const total = subtotal + (visibleItems.length > 0 ? DELIVERY : 0);

  if (isLoading && visibleItems.length === 0) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${CREAM} 0%, #F5ECD7 50%, #EDD9B8 100%)`,
        }}
      >
        <NavBar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <div style={{color: GOLD, fontSize: 14, letterSpacing: "0.2em"}}>
            Loading cart...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${CREAM} 0%, #F5ECD7 50%, #EDD9B8 100%)`,
      }}
    >
      <NavBar />

      <motion.div
        animate={{x: [0, 25, 0], y: [0, -15, 0]}}
        transition={{duration: 14, repeat: Infinity, ease: "easeInOut"}}
        style={{
          position: "fixed",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GOLD}18 0%, transparent 70%)`,
          top: "-8%",
          right: "10%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{x: [0, -20, 0], y: [0, 25, 0]}}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        style={{
          position: "fixed",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GOLD}14 0%, transparent 70%)`,
          bottom: "5%",
          left: "3%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <section
        ref={sectionRef}
        style={{position: "relative", zIndex: 1, padding: "60px 0 100px"}}
      >
        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <motion.div
            initial={{opacity: 0, y: 30}}
            animate={isInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
            style={{marginBottom: 48}}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 16px",
                border: `1px solid ${GOLD}50`,
                background: `${GOLD}14`,
                borderRadius: 100,
                marginBottom: 16,
              }}
            >
              <motion.div
                animate={{scale: [1, 1.4, 1], opacity: [1, 0.5, 1]}}
                transition={{duration: 2, repeat: Infinity}}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: GOLD,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.38em",
                  textTransform: "uppercase",
                  color: GOLD,
                }}
              >
                Your Selection
              </span>
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "clamp(36px, 4vw, 64px)",
                fontWeight: 300,
                color: DARK,
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Shopping{" "}
              <em
                style={{
                  fontStyle: "italic",
                  background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)`,
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
                marginTop: 12,
              }}
            >
              <div style={{width: 32, height: 1, background: GOLD}} />
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: MUTED,
                }}
              >
                {visibleItems.length}{" "}
                {visibleItems.length === 1 ? "Item" : "Items"}
              </span>
            </div>
          </motion.div>

          <div
            className="cart-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 380px",
              gap: 32,
              alignItems: "start",
            }}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {visibleItems.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  style={{
                    background: "rgba(253,250,245,0.7)",
                    backdropFilter: "blur(16px)",
                    border: `1px solid ${GOLD}30`,
                    borderRadius: 20,
                    padding: "80px 40px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: `${GOLD}18`,
                      border: `1px solid ${GOLD}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={GOLD}
                      strokeWidth="1.5"
                    >
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 22,
                      fontWeight: 300,
                      color: DARK,
                      margin: "0 0 8px",
                    }}
                  >
                    Your cart is empty
                  </p>
                  <p style={{fontSize: 13, color: MUTED, margin: "0 0 32px"}}>
                    Discover our curated botanical collection
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    style={{
                      background: DARK,
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      padding: "12px 32px",
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "background 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = `${GOLD}`)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = DARK)
                    }
                  >
                    Shop Now
                  </button>
                </motion.div>
              ) : (
                <div
                  style={{display: "flex", flexDirection: "column", gap: 16}}
                >
                  <AnimatePresence>
                    {visibleItems.map((item) => {
                      const id = item._id || item.product;
                      const qty = quantities[id] || 1;
                      const price = item.priceAtAdd || item.price || 0;
                      return (
                        <motion.div
                          key={id}
                          variants={itemVariants}
                          exit={{
                            opacity: 0,
                            x: -40,
                            transition: {duration: 0.4},
                          }}
                          style={{
                            background: "rgba(253,250,245,0.75)",
                            backdropFilter: "blur(16px)",
                            border: `1px solid ${GOLD}25`,
                            borderRadius: 20,
                            padding: "24px",
                            display: "flex",
                            alignItems: "center",
                            gap: 20,
                          }}
                        >
                          <div
                            style={{
                              width: 100,
                              height: 100,
                              borderRadius: 14,
                              overflow: "hidden",
                              flexShrink: 0,
                              background: `${GOLD}14`,
                              border: `1px solid ${GOLD}30`,
                            }}
                          >
                            {item.product?.image ? (
                              <img
                                src={bufferToDataURL(item.product.image)}
                                alt={item.product.name}
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
                                <svg
                                  width="28"
                                  height="28"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke={GOLD}
                                  strokeWidth="1.2"
                                >
                                  <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="3"
                                  />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                  <path d="M21 15l-5-5L5 21" />
                                </svg>
                              </div>
                            )}
                          </div>

                          <div style={{flex: 1, minWidth: 0}}>
                            <p
                              style={{
                                fontSize: 9,
                                fontWeight: 500,
                                letterSpacing: "0.35em",
                                textTransform: "uppercase",
                                color: GOLD,
                                margin: "0 0 4px",
                              }}
                            >
                              {item.product?.category || "Botanical"}
                            </p>
                            <p
                              style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 17,
                                fontWeight: 400,
                                color: DARK,
                                margin: "0 0 8px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.product?.name || "Product"}
                            </p>
                            <p
                              style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 20,
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
                              gap: 16,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0,
                                border: `1px solid ${GOLD}40`,
                                borderRadius: 50,
                                overflow: "hidden",
                                background: "rgba(253,250,245,0.6)",
                              }}
                            >
                              <button
                                onClick={() => handleQtyChange(id, -1)}
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
                                  transition: "color 0.2s",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.color = GOLD)
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.color = MUTED)
                                }
                              >
                                −
                              </button>
                              <span
                                style={{
                                  width: 28,
                                  textAlign: "center",
                                  fontSize: 13,
                                  fontWeight: 500,
                                  color: DARK,
                                }}
                              >
                                {qty}
                              </span>
                              <button
                                onClick={() => handleQtyChange(id, 1)}
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
                                  transition: "color 0.2s",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.color = GOLD)
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.color = MUTED)
                                }
                              >
                                +
                              </button>
                            </div>

                            <div style={{display: "flex", gap: 12}}>
                              <button
                                title="Save for later"
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: "50%",
                                  border: `1px solid ${GOLD}35`,
                                  background: "none",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  transition:
                                    "border-color 0.2s, background 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = GOLD;
                                  e.currentTarget.style.background = `${GOLD}14`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = `${GOLD}35`;
                                  e.currentTarget.style.background = "none";
                                }}
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke={GOLD}
                                  strokeWidth="1.8"
                                >
                                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                </svg>
                              </button>
                              <button
                                title="Remove item"
                                onClick={() => handleRemove(id)}
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: "50%",
                                  border: `1px solid #e5c5c5`,
                                  background: "none",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  transition:
                                    "border-color 0.2s, background 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = "#c0392b";
                                  e.currentTarget.style.background = "#fdf2f2";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = "#e5c5c5";
                                  e.currentTarget.style.background = "none";
                                }}
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
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  <motion.div variants={itemVariants}>
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
                        fontWeight: 400,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        padding: "8px 0",
                        transition: "color 0.3s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
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
                        strokeWidth="1.5"
                      >
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                      </svg>
                      Continue Shopping
                    </button>
                  </motion.div>
                </div>
              )}
            </motion.div>

            <motion.div
              variants={slideIn}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              style={{position: "sticky", top: 100}}
            >
              <div
                style={{
                  background: "rgba(26,20,16,0.92)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 20,
                  border: `1px solid ${GOLD}30`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "28px 28px 20px",
                    borderBottom: `1px solid ${GOLD}20`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 4,
                    }}
                  >
                    <div style={{width: 24, height: 1, background: GOLD}} />
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 500,
                        letterSpacing: "0.38em",
                        textTransform: "uppercase",
                        color: GOLD,
                      }}
                    >
                      Summary
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 22,
                      fontWeight: 300,
                      color: GOLD_LIGHT,
                      margin: 0,
                    }}
                  >
                    Order Summary
                  </p>
                </div>

                <div
                  style={{
                    padding: "24px 28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{fontSize: 13, color: MUTED}}>Subtotal</span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 16,
                        fontWeight: 300,
                        color: "#fff",
                      }}
                    >
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{fontSize: 13, color: MUTED}}>Delivery</span>
                    <span
                      style={{
                        fontSize: 14,
                        color: visibleItems.length > 0 ? "#fff" : MUTED,
                      }}
                    >
                      {visibleItems.length > 0
                        ? `$${DELIVERY.toFixed(2)}`
                        : "—"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{fontSize: 13, color: MUTED}}>Discount</span>
                    <span style={{fontSize: 13, color: MUTED}}>—</span>
                  </div>

                  <div
                    style={{
                      height: 1,
                      background: `${GOLD}20`,
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
                        fontWeight: 500,
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: GOLD,
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 28,
                        fontWeight: 300,
                        color: GOLD_LIGHT,
                      }}
                    >
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div style={{padding: "0 28px 24px"}}>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      border: `1px solid ${GOLD}25`,
                      borderRadius: 10,
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Promo code"
                      style={{
                        flex: 1,
                        background: "none",
                        border: "none",
                        outline: "none",
                        padding: "11px 14px",
                        fontSize: 12,
                        color: "#fff",
                        letterSpacing: "0.05em",
                      }}
                    />
                    <button
                      style={{
                        background: `${GOLD}22`,
                        border: "none",
                        padding: "10px 16px",
                        cursor: "pointer",
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: GOLD,
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = `${GOLD}40`)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = `${GOLD}22`)
                      }
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div style={{padding: "0 28px 28px"}}>
                  <Link to={"/cart-page/shipping-info"}>
                    <motion.button
                      whileHover={{scale: 1.02}}
                      whileTap={{scale: 0.98}}
                      onClick={() => navigate("/checkout")}
                      disabled={visibleItems.length === 0}
                      style={{
                        width: "100%",
                        padding: "16px",
                        background:
                          visibleItems.length === 0
                            ? "rgba(255,255,255,0.08)"
                            : `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
                        border: "none",
                        borderRadius: 12,
                        cursor:
                          visibleItems.length === 0 ? "not-allowed" : "pointer",
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: visibleItems.length === 0 ? MUTED : DARK,
                        transition: "opacity 0.3s",
                      }}
                    >
                      Proceed to Checkout
                    </motion.button>
                  </Link>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 20,
                      marginTop: 20,
                    }}
                  >
                    {[
                      {
                        icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
                        label: "Secure",
                      },
                      {
                        icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z",
                        label: "Free Returns",
                      },
                      {icon: "M5 12h14M12 5l7 7-7 7", label: "Fast Delivery"},
                    ].map(({icon, label}) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={GOLD}
                          strokeWidth="1.5"
                        >
                          <path d={icon} />
                        </svg>
                        <span
                          style={{
                            fontSize: 9,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: MUTED,
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
        input::placeholder { color: #8A7560; }
      `}</style>
    </main>
  );
};

export default CartPage;
