import React, {useState, useEffect, useRef} from "react";
import NavBar from "../components/navBar";
import {motion, AnimatePresence, useScroll, useTransform} from "framer-motion";
import {useViewProd} from "../stores/viewProdStore";
import {useAddToCartStore} from "../stores/addToCartStore";
import {bufferToDataURL} from "../utils/displayImage";
import {useNavigate, useParams} from "react-router-dom";

/* ─── Updated brand palette (matches LandingPage) ─── */
const GOLD = "#4A8C2A"; // primary green
const GOLD_LIGHT = "#72B84A"; // lighter green
const GOLD_PALE = "#E8F5E0"; // pale green tint
const DARK = "#1A1A1A"; // near-black
const MUTED = "#5A7A4A"; // muted green-grey
const CREAM = "#F7FBF4"; // off-white with green tint

/* ─── Motion presets (unchanged, but use new colours) ─── */
const fadeUp = (delay = 0) => ({
  hidden: {opacity: 0, y: 36, filter: "blur(6px)"},
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {duration: 0.85, ease: [0.16, 1, 0.3, 1], delay},
  },
});

const fadeRight = (delay = 0) => ({
  hidden: {opacity: 0, x: -50, filter: "blur(6px)"},
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {duration: 0.9, ease: [0.16, 1, 0.3, 1], delay},
  },
});

const stagger = {
  hidden: {},
  visible: {transition: {staggerChildren: 0.08, delayChildren: 0.2}},
};

/* ─── Sub-components (updated colours) ─── */
const GoldLine = ({width = 48, style}) => (
  <div
    style={{
      width,
      height: 1,
      background: `linear-gradient(90deg, ${GOLD}, transparent)`,
      ...style,
    }}
  />
);

const Badge = ({children}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "5px 14px",
      border: `1px solid ${GOLD}50`,
      background: `${GOLD}12`,
      borderRadius: 100,
    }}
  >
    <motion.div
      animate={{scale: [1, 1.5, 1], opacity: [1, 0.4, 1]}}
      transition={{duration: 2, repeat: Infinity}}
      style={{width: 5, height: 5, borderRadius: "50%", background: GOLD}}
    />
    <span
      style={{
        fontSize: 9,
        fontWeight: 500,
        letterSpacing: "0.4em",
        textTransform: "uppercase",
        color: GOLD,
      }}
    >
      {children}
    </span>
  </div>
);

const StarRating = ({rating = 4.5, count = 0}) => (
  <div style={{display: "flex", alignItems: "center", gap: 6}}>
    <div style={{display: "flex", gap: 2}}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? GOLD : "none"}
          stroke={GOLD}
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
    {count > 0 && (
      <span style={{fontSize: 11, color: MUTED, letterSpacing: "0.05em"}}>
        ({count} reviews)
      </span>
    )}
  </div>
);

const SkeletonPulse = ({style}) => (
  <motion.div
    animate={{opacity: [0.4, 0.8, 0.4]}}
    transition={{duration: 1.8, repeat: Infinity, ease: "easeInOut"}}
    style={{background: `${GOLD}20`, borderRadius: 8, ...style}}
  />
);

const AccordionRow = ({label, children}) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{borderBottom: `1px solid ${GOLD}20`}}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "none",
          border: "none",
          padding: "18px 0",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          {label}
        </span>
        <motion.div
          animate={{rotate: open ? 45 : 0}}
          transition={{duration: 0.3}}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={GOLD}
            strokeWidth="1.5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
            style={{overflow: "hidden"}}
          >
            <div
              style={{
                paddingBottom: 18,
                fontSize: 13,
                color: MUTED,
                lineHeight: 1.75,
                letterSpacing: "0.02em",
              }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   MAIN PAGE (Order)
══════════════════════════════════════════════════ */
const Order = () => {
  const {productId} = useParams();
  const navigate = useNavigate();
  const {isLoading, orderItem, viewProd} = useViewProd();
  const {addToCart} = useAddToCartStore();

  const imageWrapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [qty, setQty] = useState(1);
  const [addedPulse, setAddedPulse] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);
  const [wishListed, setWishListed] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [imgZoom, setImgZoom] = useState(false);

  const {scrollYProgress} = useScroll({
    target: imageWrapRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  useEffect(() => {
    if (productId) viewProd(productId);
  }, [productId]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleAddToCart = () => {
    if (!orderItem) return;
    addToCart(orderItem._id, qty);
    setAddedPulse(true);
    setToastVisible(true);
    setTimeout(() => setAddedPulse(false), 600);
    setTimeout(() => setToastVisible(false), 2800);
  };

  const thumbs = orderItem?.image
    ? [orderItem.image, null, null, null]
    : [null, null, null, null];

  const price = orderItem?.price ?? 0;
  const oldPrice = orderItem?.oldPrice ?? null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${CREAM} 0%, ${GOLD_PALE} 45%, #C5E4AC 100%)`,
        overflowX: "hidden",
      }}
    >
      <NavBar />

      {/* Ambient orbs (green tint) */}
      <motion.div
        animate={{x: [0, 30, 0], y: [0, -20, 0]}}
        transition={{duration: 16, repeat: Infinity, ease: "easeInOut"}}
        style={{
          position: "fixed",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GOLD}16 0%, transparent 70%)`,
          top: "-10%",
          right: "5%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{x: [0, -25, 0], y: [0, 30, 0]}}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        style={{
          position: "fixed",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GOLD}12 0%, transparent 70%)`,
          bottom: "5%",
          left: "2%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Toast notification (green accent) */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{opacity: 0, y: -20, x: "-50%"}}
            animate={{opacity: 1, y: 0, x: "-50%"}}
            exit={{opacity: 0, y: -20, x: "-50%"}}
            transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
            style={{
              position: "fixed",
              top: 90,
              left: "50%",
              zIndex: 1000,
              background: DARK,
              border: `1px solid ${GOLD}50`,
              borderRadius: 12,
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: `0 20px 60px ${DARK}80`,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={GOLD}
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: GOLD_LIGHT,
              }}
            >
              Added to Cart
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.2, duration: 0.6}}
        style={{
          position: "relative",
          zIndex: 1,
          padding: "28px 24px 0",
          maxWidth: 1300,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {["Home", "Shop", orderItem?.category ?? "Collection"].map(
          (crumb, i, arr) => (
            <React.Fragment key={crumb}>
              <button
                onClick={() => i === 0 && navigate("/")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: i < arr.length - 1 ? "pointer" : "default",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: i < arr.length - 1 ? MUTED : GOLD,
                  padding: 0,
                }}
              >
                {crumb}
              </button>
              {i < arr.length - 1 && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={MUTED}
                  strokeWidth="1.5"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
            </React.Fragment>
          ),
        )}
      </motion.div>

      {/* Main section */}
      <section
        style={{position: "relative", zIndex: 1, padding: "40px 0 120px"}}
      >
        <div style={{maxWidth: 1300, margin: "0 auto", padding: "0 24px"}}>
          {isLoading ? (
            <div
              style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64}}
            >
              <div style={{display: "flex", flexDirection: "column", gap: 16}}>
                <SkeletonPulse style={{height: 580, borderRadius: 24}} />
                <div style={{display: "flex", gap: 12}}>
                  {[0, 1, 2, 3].map((i) => (
                    <SkeletonPulse
                      key={i}
                      style={{flex: 1, height: 90, borderRadius: 12}}
                    />
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  paddingTop: 40,
                }}
              >
                {[140, 60, 80, 200, 60, 100].map((h, i) => (
                  <SkeletonPulse
                    key={i}
                    style={{
                      height: h,
                      width: i % 2 === 0 ? "80%" : "55%",
                      borderRadius: 8,
                    }}
                  />
                ))}
              </div>
            </div>
          ) : !orderItem ? (
            <motion.div
              initial={{opacity: 0, y: 30}}
              animate={{opacity: 1, y: 0}}
              style={{
                textAlign: "center",
                padding: "120px 40px",
                background: "rgba(247,251,244,0.7)",
                backdropFilter: "blur(16px)",
                borderRadius: 24,
                border: `1px solid ${GOLD}25`,
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 28,
                  fontWeight: 300,
                  color: DARK,
                  margin: "0 0 12px",
                }}
              >
                Product not found
              </p>
              <p style={{fontSize: 13, color: MUTED, margin: "0 0 32px"}}>
                This item may have been removed from our collection.
              </p>
              <button
                onClick={() => navigate("/")}
                style={{
                  background: DARK,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "13px 36px",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Return to Shop
              </button>
            </motion.div>
          ) : (
            <div
              className="prod-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "64px",
                alignItems: "start",
              }}
            >
              {/* LEFT — Gallery (with premium zoom) */}
              <motion.div
                variants={fadeRight(0.1)}
                initial="hidden"
                animate={ready ? "visible" : "hidden"}
                style={{position: "sticky", top: 100}}
              >
                <div
                  ref={imageWrapRef}
                  style={{
                    position: "relative",
                    borderRadius: 28,
                    overflow: "hidden",
                    background: `linear-gradient(145deg, ${GOLD}10 0%, ${CREAM} 100%)`,
                    border: `1px solid ${GOLD}25`,
                    aspectRatio: "4/5",
                    cursor: imgZoom ? "zoom-out" : "zoom-in",
                  }}
                  onClick={() => setImgZoom(!imgZoom)}
                >
                  <motion.div
                    style={{
                      y: imageY,
                      height: "100%",
                      scale: imgZoom ? 1.2 : 1,
                      transition: "scale 0.3s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    {orderItem.image ? (
                      <img
                        src={bufferToDataURL(orderItem.image)}
                        alt={orderItem.name}
                        style={{
                          width: "100%",
                          height: "105%",
                          objectFit: "cover",
                          display: "block",
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
                          background: `${GOLD}08`,
                        }}
                      >
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={`${GOLD}60`}
                          strokeWidth="1"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="3" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    )}
                  </motion.div>

                  {/* Corner ornaments */}
                  <div
                    style={{
                      position: "absolute",
                      top: 20,
                      left: 20,
                      width: 32,
                      height: 32,
                      borderTop: `1px solid ${GOLD}60`,
                      borderLeft: `1px solid ${GOLD}60`,
                      borderRadius: "4px 0 0 0",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 20,
                      right: 20,
                      width: 32,
                      height: 32,
                      borderBottom: `1px solid ${GOLD}60`,
                      borderRight: `1px solid ${GOLD}60`,
                      borderRadius: "0 0 4px 0",
                      pointerEvents: "none",
                    }}
                  />

                  {orderItem.isNew && (
                    <div
                      style={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        background: DARK,
                        border: `1px solid ${GOLD}50`,
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontSize: 8,
                        fontWeight: 600,
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        color: GOLD,
                      }}
                    >
                      New
                    </div>
                  )}

                  <motion.button
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    onClick={(e) => {
                      e.stopPropagation();
                      setWishListed((p) => !p);
                    }}
                    style={{
                      position: "absolute",
                      bottom: 20,
                      left: 20,
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: wishListed
                        ? `${GOLD}30`
                        : "rgba(247,251,244,0.7)",
                      backdropFilter: "blur(12px)",
                      border: `1px solid ${GOLD}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={wishListed ? GOLD : "none"}
                      stroke={GOLD}
                      strokeWidth="1.5"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </motion.button>
                </div>

                {/* Thumbnails */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 10,
                    marginTop: 12,
                  }}
                >
                  {thumbs.map((thumb, i) => (
                    <motion.button
                      key={i}
                      whileHover={{scale: 1.04}}
                      whileTap={{scale: 0.96}}
                      onClick={() => setActiveThumb(i)}
                      style={{
                        aspectRatio: "1",
                        borderRadius: 12,
                        overflow: "hidden",
                        border:
                          activeThumb === i
                            ? `2px solid ${GOLD}`
                            : `1px solid ${GOLD}25`,
                        background: `${GOLD}10`,
                        cursor: "pointer",
                        transition: "border-color 0.2s",
                        padding: 0,
                        position: "relative",
                      }}
                    >
                      {thumb ? (
                        <img
                          src={bufferToDataURL(thumb)}
                          alt=""
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
                            opacity: 0.4,
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={GOLD}
                            strokeWidth="1.2"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="3" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                          </svg>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* RIGHT — Info panel */}
              <motion.div
                variants={stagger}
                initial="hidden"
                animate={ready ? "visible" : "hidden"}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  paddingTop: 12,
                }}
              >
                <motion.div variants={fadeUp(0)} style={{marginBottom: 20}}>
                  <Badge>{orderItem.category ?? "Botanical"}</Badge>
                </motion.div>

                <motion.div variants={fadeUp(0.05)} style={{marginBottom: 12}}>
                  <h1
                    style={{
                      fontFamily: "'Playfair Display', 'Georgia', serif",
                      fontSize: "clamp(32px, 3.5vw, 52px)",
                      fontWeight: 300,
                      color: DARK,
                      margin: 0,
                      lineHeight: 1.15,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {orderItem.name ?? "Product Name"}
                  </h1>
                </motion.div>

                <motion.div variants={fadeUp(0.08)} style={{marginBottom: 24}}>
                  <StarRating
                    rating={orderItem.rating ?? 4.5}
                    count={orderItem.reviewCount ?? 0}
                  />
                </motion.div>

                <motion.div variants={fadeUp(0.1)} style={{marginBottom: 24}}>
                  <div style={{display: "flex", alignItems: "center", gap: 16}}>
                    <GoldLine width={36} />
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 500,
                        letterSpacing: "0.4em",
                        textTransform: "uppercase",
                        color: MUTED,
                      }}
                    >
                      {orderItem.sku
                        ? `SKU · ${orderItem.sku}`
                        : "Curated Collection"}
                    </span>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp(0.12)} style={{marginBottom: 32}}>
                  <div
                    style={{display: "flex", alignItems: "baseline", gap: 14}}
                  >
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(36px, 3vw, 52px)",
                        fontWeight: 300,
                        background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)`,
                        backgroundSize: "200% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        animation: "shimmer-text 3s ease-in-out infinite",
                      }}
                    >
                      ${price.toFixed(2)}
                    </span>
                    {oldPrice && (
                      <span
                        style={{
                          fontSize: 18,
                          fontWeight: 300,
                          color: MUTED,
                          textDecoration: "line-through",
                        }}
                      >
                        ${oldPrice.toFixed(2)}
                      </span>
                    )}
                    {oldPrice && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          letterSpacing: "0.25em",
                          textTransform: "uppercase",
                          color: GOLD_LIGHT,
                          border: `1px solid ${GOLD_LIGHT}50`,
                          padding: "3px 10px",
                          borderRadius: 100,
                        }}
                      >
                        Save {Math.round(100 - (price / oldPrice) * 100)}%
                      </span>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={fadeUp(0.14)} style={{marginBottom: 36}}>
                  <p
                    style={{
                      fontSize: 14,
                      color: MUTED,
                      lineHeight: 1.8,
                      letterSpacing: "0.02em",
                      margin: 0,
                      borderLeft: `2px solid ${GOLD}40`,
                      paddingLeft: 16,
                    }}
                  >
                    {orderItem.description ??
                      "A masterpiece of botanical craftsmanship — ethically sourced, lovingly curated, and finished with meticulous attention to detail."}
                  </p>
                </motion.div>

                {/* Qty + CTAs */}
                <motion.div variants={fadeUp(0.16)} style={{marginBottom: 24}}>
                  <div
                    style={{display: "flex", gap: 12, alignItems: "stretch"}}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        border: `1px solid ${GOLD}40`,
                        borderRadius: 14,
                        overflow: "hidden",
                        background: "rgba(247,251,244,0.6)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        style={{
                          width: 46,
                          height: 52,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: MUTED,
                          fontSize: 20,
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
                          width: 36,
                          textAlign: "center",
                          fontFamily: "'Playfair Display', serif",
                          fontSize: 16,
                          fontWeight: 400,
                          color: DARK,
                        }}
                      >
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty((q) => q + 1)}
                        style={{
                          width: 46,
                          height: 52,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: MUTED,
                          fontSize: 20,
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

                    <motion.button
                      whileHover={{scale: 1.02}}
                      whileTap={{scale: 0.97}}
                      onClick={handleAddToCart}
                      style={{
                        flex: 1,
                        background: addedPulse
                          ? GOLD_LIGHT
                          : `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
                        border: "none",
                        borderRadius: 14,
                        cursor: "pointer",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        color: DARK,
                        height: 52,
                        transition: "background 0.3s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={DARK}
                        strokeWidth="2"
                      >
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                      Add to Cart
                    </motion.button>

                    <motion.button
                      whileHover={{scale: 1.02}}
                      whileTap={{scale: 0.97}}
                      onClick={() => navigate("/checkout")}
                      style={{
                        flex: 1,
                        background: DARK,
                        border: `1px solid ${GOLD}40`,
                        borderRadius: 14,
                        cursor: "pointer",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        color: GOLD_LIGHT,
                        height: 52,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#2A2A2A";
                        e.currentTarget.style.borderColor = GOLD;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = DARK;
                        e.currentTarget.style.borderColor = `${GOLD}40`;
                      }}
                    >
                      Buy Now
                    </motion.button>
                  </div>
                </motion.div>

                {/* Shipping strip (green accents) */}
                <motion.div variants={fadeUp(0.18)} style={{marginBottom: 36}}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0,
                      background: "rgba(247,251,244,0.5)",
                      backdropFilter: "blur(12px)",
                      border: `1px solid ${GOLD}20`,
                      borderRadius: 14,
                      overflow: "hidden",
                    }}
                  >
                    {[
                      {
                        icon: "M5 12h14M12 5l7 7-7 7",
                        label: "Shipping within 2 working days",
                      },
                      {
                        icon: "M20 12V22H4V12M22 7H2v5h20V7z",
                        label: "Gift Box Available",
                      },
                      {
                        icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
                        label: "Secure & Authenticated",
                      },
                    ].map(({icon, label}, i, arr) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "14px 18px",
                          borderBottom:
                            i < arr.length - 1 ? `1px solid ${GOLD}15` : "none",
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: `${GOLD}14`,
                            border: `1px solid ${GOLD}30`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={GOLD}
                            strokeWidth="1.5"
                          >
                            <path d={icon} />
                          </svg>
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            color: MUTED,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Accordions (unchanged text, green borders) */}
                <motion.div variants={fadeUp(0.2)}>
                  <div style={{borderTop: `1px solid ${GOLD}20`}}>
                    <AccordionRow label="Details">
                      {orderItem.details ??
                        "Handcrafted from sustainably sourced materials. Each piece is unique and may feature natural variations in texture and tone."}
                    </AccordionRow>
                    <AccordionRow label="Shipping & Returns">
                      Orders dispatched within 2 working days via tracked
                      courier. Returns accepted within 30 days — no questions
                      asked.
                    </AccordionRow>
                    <AccordionRow label="Care Instructions">
                      {orderItem.care ??
                        "Handle with care. Avoid direct sunlight. Wipe gently with a dry cloth. Store in a cool, dry place."}
                    </AccordionRow>
                    <AccordionRow label="Good for the Planet">
                      Certified ethical suppliers. 100% biodegradable packaging.
                      A portion of every purchase funds reforestation.
                    </AccordionRow>
                  </div>
                </motion.div>

                {/* Trust badges (green) */}
                <motion.div variants={fadeUp(0.22)} style={{marginTop: 36}}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px 0",
                      borderTop: `1px solid ${GOLD}20`,
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
                      {
                        icon: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
                        label: "Ethically Made",
                      },
                    ].map(({icon, label}) => (
                      <div
                        key={label}
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
                            background: `${GOLD}12`,
                            border: `1px solid ${GOLD}30`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={GOLD}
                            strokeWidth="1.5"
                          >
                            <path d={icon} />
                          </svg>
                        </div>
                        <span
                          style={{
                            fontSize: 8,
                            letterSpacing: "0.25em",
                            textTransform: "uppercase",
                            color: MUTED,
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes shimmer-text {
          0%   { background-position: 0%   center }
          50%  { background-position: 100% center }
          100% { background-position: 0%   center }
        }
        @media (max-width: 860px) {
          .prod-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </main>
  );
};

export default Order;
