import React, {useEffect, useRef, useState} from "react";
import BuyNowButton from "../components/buyButton";
import {useScroll, useTransform, motion} from "framer-motion";
import {useProductsStore} from "../stores/productDisplayStore";
import {useAddToCartStore} from "../stores/addToCartStore";
import {bufferToDataURL} from "../utils/displayImage";
import {Link, useNavigate} from "react-router-dom";
import NavBar from "../components/navBar";
import PremiumLoader from "../components/loader";
import Footer from "../components/footer";
import {ShoppingCart} from "lucide-react"; // ← added for cart icon

// ─── Design Tokens ────────────────────────────────────────────────────────────
const GOLD = "#4A8C2A";
const GOLD_LIGHT = "#72B84A";
const GOLD_PALE = "#E8F5E0";
const CREAM = "#F7FBF4";
const DARK = "#1A1A1A";
const MUTED = "#5A7A4A";

// ─── Animation Variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {transition: {staggerChildren: 0.13, delayChildren: 0.2}},
};

const itemVariants = {
  hidden: {opacity: 0, y: 40, filter: "blur(6px)"},
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {duration: 0.9, ease: [0.16, 1, 0.3, 1]},
  },
};

const imageVariants = {
  hidden: {opacity: 0, scale: 0.88, x: 60},
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3},
  },
};

const statVariants = {
  hidden: {opacity: 0, y: 24},
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 + i * 0.12},
  }),
};

const productsContainerVariants = {
  hidden: {opacity: 0},
  visible: {opacity: 1, transition: {staggerChildren: 0.1, delayChildren: 0.2}},
};

const productCardVariants = {
  hidden: {opacity: 0, y: 30},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.6, ease: [0.16, 1, 0.3, 1]},
  },
};

// ─── Static Data ──────────────────────────────────────────────────────────────
const stats = [
  {num: "100%", label: "Natural"},
  {num: "14+", label: "Botanicals"},
  {num: "4.9★", label: "Rating"},
];

// ─── Component ────────────────────────────────────────────────────────────────
const LandingPage = () => {
  const {showAllProducts, allProducts} = useProductsStore();
  const {addToCart} = useAddToCartStore();
  const navigate = useNavigate();
  const [productsLoading, setProductsLoading] = useState(true);
  const [addedStates, setAddedStates] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);

  // Parallax
  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Fetch products once
  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductsLoading(true);
        if (allProducts.length === 0) await showAllProducts();
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    const product = allProducts.find((p) => p._id === productId);
    if (!product || product.stock === 0 || addedStates[productId]) return;

    try {
      await addToCart(productId, 1);
      setAddedStates((prev) => ({...prev, [productId]: true}));
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  return (
    <main className="w-full">
      {/* ── Global Styles ─────────────────────────────────────────────────── */}
      <style>{`
        @keyframes shimmer-text {
          0%   { background-position: 0%   center }
          50%  { background-position: 100% center }
          100% { background-position: 0%   center }
        }

        /* ── Hero responsive ── */
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
            padding: 60px 40px !important;
          }
          .hero-grid > div:first-child {
            padding-right: 0 !important;
            text-align: center;
          }
          .hero-stats {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .hero-grid {
            padding: 40px 24px !important;
            gap: 32px !important;
          }
          .hero-stats > div {
            flex: 0 0 100%;
            text-align: center;
            border-right: none !important;
            padding: 0 !important;
          }
          .products-section {
            padding: 60px 20px !important;
          }
          .products-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }

        @media (max-width: 480px) {
          .hero-grid   { padding: 32px 16px !important; }
          .products-section { padding: 48px 16px !important; }
        }

        /* ── Mobile‑only floating cart button ───────────────────────────── */
        .mobile-cart-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          display: none;  /* hidden by default, shown only on mobile */
        }

        @media (max-width: 768px) {
          .mobile-cart-fab {
            display: block;
          }
        }

        /* Optional: add a subtle shadow and transition */
        .mobile-cart-fab a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: ${GOLD};
          border-radius: 50%;
          color: white;
          box-shadow: 0 4px 20px rgba(74, 140, 42, 0.4);
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .mobile-cart-fab a:hover,
        .mobile-cart-fab a:active {
          transform: scale(0.96);
          background: ${GOLD_LIGHT};
        }
      `}</style>

      <div className="flex flex-col w-full">
        <NavBar />

        {/* ════════════════════════════════════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════════════════════════════════════ */}
        <section
          ref={sectionRef}
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            background: `linear-gradient(135deg, ${CREAM} 0%, ${GOLD_PALE} 45%, #C5E4AC 100%)`,
          }}
        >
          {/* Ambient orbs */}
          <motion.div
            animate={{x: [0, 30, 0], y: [0, -20, 0]}}
            transition={{duration: 12, repeat: Infinity, ease: "easeInOut"}}
            style={{
              position: "absolute",
              pointerEvents: "none",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${GOLD}22 0%, transparent 70%)`,
              top: "-10%",
              right: "20%",
            }}
          />
          <motion.div
            animate={{x: [0, -25, 0], y: [0, 30, 0]}}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            style={{
              position: "absolute",
              pointerEvents: "none",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${GOLD}18 0%, transparent 70%)`,
              bottom: "0%",
              left: "5%",
            }}
          />

          {/* Edge lines */}
          {[
            {top: 0, transformOrigin: "left"},
            {bottom: 0, transformOrigin: "right"},
          ].map((pos, i) => (
            <motion.div
              key={i}
              initial={{scaleX: 0}}
              animate={{scaleX: 1}}
              transition={{
                duration: 1.4,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.3,
              }}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                pointerEvents: "none",
                ...pos,
              }}
            />
          ))}

          {/* ── Hero grid ──────────────────────────────────────────────────── */}
          <div
            className="hero-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
              width: "100%",
              maxWidth: 1400,
              margin: "0 auto",
              padding: "80px 80px",
              alignItems: "center",
            }}
          >
            {/* Left — copy */}
            <motion.div
              style={{
                y: textY,
                display: "flex",
                flexDirection: "column",
                paddingRight: 48,
              }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Headline */}
              {["Naturally", "Medicated", "Face Soap"].map((word, i) => (
                <motion.div
                  key={word}
                  variants={itemVariants}
                  style={{marginBottom: i < 2 ? 8 : 36}}
                >
                  <h1
                    style={{
                      fontFamily: "'Playfair Display', 'Georgia', serif",
                      fontSize: "clamp(42px, 4.5vw, 80px)",
                      fontWeight: 300,
                      lineHeight: 1.08,
                      margin: 0,
                      letterSpacing: "-0.01em",
                      ...(i === 1 ? {} : {color: DARK}),
                    }}
                  >
                    {i === 1 ? (
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
                        {word}
                      </em>
                    ) : (
                      word
                    )}
                  </h1>
                </motion.div>
              ))}

              {/* Description */}
              <motion.p
                variants={itemVariants}
                style={{
                  fontSize: 15,
                  fontWeight: 300,
                  lineHeight: 1.95,
                  letterSpacing: "0.02em",
                  color: MUTED,
                  maxWidth: 420,
                  margin: "0 0 44px",
                }}
              >
                Carefully and thoughtfully engineered with fourteen rare
                botanical actives. A daily ritual that transforms, protects, and
                profoundly pampers your complexion from the very first use.
              </motion.p>

              {/* CTA */}
              <motion.div
                variants={itemVariants}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  marginBottom: 56,
                  flexWrap: "wrap",
                }}
              >
                <BuyNowButton />
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="hero-stats"
                style={{
                  display: "flex",
                  gap: 0,
                  paddingTop: 28,
                  borderTop: `1px solid ${GOLD}25`,
                  flexWrap: "wrap",
                }}
              >
                {stats.map(({num, label}, i) => (
                  <motion.div
                    key={label}
                    custom={i}
                    variants={statVariants}
                    style={{
                      flex: "1 1 auto",
                      paddingRight: i < 2 ? 24 : 0,
                      paddingLeft: i > 0 ? 24 : 0,
                      borderRight: i < 2 ? `1px solid ${GOLD}20` : "none",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Playfair Display', 'Georgia', serif",
                        fontSize: 34,
                        fontWeight: 300,
                        color: DARK,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {num}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 500,
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: MUTED,
                        marginTop: 4,
                      }}
                    >
                      {label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — product image */}
            <motion.div
              style={{
                y: imageY,
                opacity,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 560,
              }}
            >
              {/* Glow */}
              <div
                style={{
                  position: "absolute",
                  width: "85%",
                  height: "85%",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${GOLD}28 0%, transparent 70%)`,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
              />

              {/* Pulse rings */}
              {[260, 360, 460].map((size, i) => (
                <motion.div
                  key={size}
                  animate={{scale: [1, 1.04, 1], opacity: [0.2, 0.55, 0.2]}}
                  transition={{
                    duration: 3.5 + i * 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.7,
                  }}
                  style={{
                    position: "absolute",
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    border: `1px solid ${GOLD}40`,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                  }}
                />
              ))}

              <motion.div
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                style={{position: "relative", zIndex: 5}}
              >
                <motion.img
                  src="/saop-image.png"
                  alt="BF Suma Natural Medicinal Soap"
                  animate={{y: [0, -18, 0], rotate: [-1.5, 1.5, -1.5]}}
                  transition={{
                    duration: 6.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: "clamp(320px, 45vw, 600px)",
                    filter:
                      "drop-shadow(0 50px 100px rgba(30,70,10,0.38)) drop-shadow(0 12px 28px rgba(30,70,10,0.18))",
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            PRODUCTS SECTION
        ════════════════════════════════════════════════════════════════════ */}
        <section
          className="products-section"
          style={{
            padding: "100px 80px",
            background: CREAM,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top divider */}
          <motion.div
            initial={{scaleX: 0}}
            whileInView={{scaleX: 1}}
            viewport={{once: true}}
            transition={{duration: 1.2, ease: [0.16, 1, 0.3, 1]}}
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${GOLD}40, transparent)`,
            }}
          />

          {/* Section header */}
          <div style={{textAlign: "center", marginBottom: 64}}>
            <motion.div
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6}}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 20,
              }}
            >
              <div style={{width: 36, height: 1, background: GOLD}} />
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: MUTED,
                }}
              >
                Handcrafted Collection
              </span>
              <div style={{width: 36, height: 1, background: GOLD}} />
            </motion.div>

            <motion.h2
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6, delay: 0.1}}
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 300,
                color: DARK,
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              Featured Products
            </motion.h2>

            <motion.p
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.6, delay: 0.2}}
              style={{
                fontSize: 14,
                color: MUTED,
                maxWidth: 480,
                margin: "16px auto 0",
                fontWeight: 300,
                letterSpacing: "0.02em",
              }}
            >
              Pure botanicals, thoughtfully formulated for your daily ritual
            </motion.p>
          </div>

          {/* Products grid */}
          {productsLoading ? (
            <div
              style={{
                minHeight: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PremiumLoader fullPage={false} transparent />
            </div>
          ) : (
            <motion.div
              className="products-grid"
              variants={productsContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{once: true}}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 32,
                maxWidth: 1400,
                margin: "0 auto",
              }}
            >
              {allProducts.map((product) => {
                const isHovered = hoveredCard === product._id;
                const isAdded = addedStates[product._id];
                const isOutOfStock = product.stock === 0;

                return (
                  <motion.div
                    key={product._id}
                    variants={productCardVariants}
                    onHoverStart={() => setHoveredCard(product._id)}
                    onHoverEnd={() => setHoveredCard(null)}
                    style={{
                      background: "white",
                      borderRadius: 24,
                      overflow: "hidden",
                      transition: "box-shadow 0.4s ease, transform 0.3s ease",
                      boxShadow: isHovered
                        ? "0 25px 40px -12px rgba(0,0,0,0.15)"
                        : "0 8px 20px -6px rgba(0,0,0,0.05)",
                      transform: isHovered
                        ? "translateY(-4px)"
                        : "translateY(0)",
                    }}
                  >
                    {/* Image */}
                    <div style={{position: "relative", overflow: "hidden"}}>
                      <Link to={`/order/${product._id}`}>
                        <motion.img
                          src={bufferToDataURL(product.image)}
                          alt={product.name}
                          whileHover={{scale: 1.05}}
                          transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
                          style={{
                            width: "100%",
                            height: 320,
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </Link>

                      {/* Hover overlay */}
                      <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: isHovered ? 1 : 0}}
                        transition={{duration: 0.3}}
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: `linear-gradient(to top, ${DARK}CC, transparent)`,
                          display: "flex",
                          alignItems: "flex-end",
                          justifyContent: "center",
                          paddingBottom: 24,
                          pointerEvents: "none",
                        }}
                      >
                        <span
                          style={{
                            color: "white",
                            fontSize: 11,
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            borderBottom: `1px solid ${GOLD}`,
                            paddingBottom: 6,
                          }}
                        >
                          View Details
                        </span>
                      </motion.div>
                    </div>

                    {/* Card body */}
                    <div style={{padding: "24px 24px 28px"}}>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: GOLD,
                          marginBottom: 8,
                        }}
                      >
                        {product.category}
                      </div>

                      <h3
                        style={{
                          fontFamily: "'Playfair Display', 'Georgia', serif",
                          fontSize: 20,
                          fontWeight: 400,
                          color: DARK,
                          margin: "0 0 16px",
                          lineHeight: 1.3,
                        }}
                      >
                        {product.name}
                      </h3>

                      {/* Price + stock row */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 20,
                          paddingBottom: 16,
                          borderBottom: `1px solid ${GOLD}20`,
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 26,
                            fontWeight: 300,
                            fontFamily: "'Playfair Display', serif",
                            color: DARK,
                          }}
                        >
                          Ksh {product.price?.toFixed(2)}
                        </span>

                        <span
                          style={{
                            fontSize: 11,
                            color: isOutOfStock ? "#C41E3A" : GOLD,
                            letterSpacing: "0.04em",
                            fontWeight: 500,
                          }}
                        >
                          {isOutOfStock ? "Out of Stock" : "In Stock"}
                        </span>
                      </div>

                      {/* Add to cart */}
                      <form onSubmit={(e) => handleAddToCart(e, product._id)}>
                        <motion.button
                          type="submit"
                          disabled={isOutOfStock || isAdded}
                          whileTap={
                            !isOutOfStock && !isAdded ? {scale: 0.97} : {}
                          }
                          whileHover={
                            !isOutOfStock && !isAdded
                              ? {background: GOLD_LIGHT}
                              : {}
                          }
                          style={{
                            width: "100%",
                            background: isOutOfStock
                              ? "#E0E0E0"
                              : isAdded
                                ? GOLD_LIGHT
                                : GOLD,
                            border: "none",
                            borderRadius: 40,
                            padding: "13px 0",
                            color: isOutOfStock ? "#999" : "white",
                            fontSize: 12,
                            fontWeight: 500,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            cursor:
                              isOutOfStock || isAdded
                                ? "not-allowed"
                                : "pointer",
                            transition: "background 0.25s ease",
                          }}
                        >
                          {isOutOfStock
                            ? "Out of Stock"
                            : isAdded
                              ? "✓ Added to Cart"
                              : "Add to Cart"}
                        </motion.button>
                      </form>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>

        <Footer />
      </div>

      {/* ── MOBILE‑ONLY FLOATING CART BUTTON ───────────────────────────────── */}
      <div className="mobile-cart-fab">
        <Link to="/cart-page">
          <ShoppingCart size={24} strokeWidth={1.8} />
        </Link>
      </div>
    </main>
  );
};

export default LandingPage;
