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

const GOLD = "#4A8C2A";
const GOLD_LIGHT = "#72B84A";
const GOLD_PALE = "#E8F5E0";
const CREAM = "#F7FBF4";
const DARK = "#1A1A1A";
const MUTED = "#5A7A4A";

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
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.5 + i * 0.12,
    },
  }),
};

const stats = [
  {num: "100%", label: "Natural"},
  {num: "14+", label: "Botanicals"},
  {num: "4.9★", label: "Rating"},
];

const productsContainerVariants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {staggerChildren: 0.1, delayChildren: 0.2},
  },
};
const productCardVariants = {
  hidden: {opacity: 0, y: 30},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.6, ease: [0.16, 1, 0.3, 1]},
  },
};

const LandingPage = () => {
  const {showAllProducts, allProducts} = useProductsStore();
  const {addToCart} = useAddToCartStore();
  const navigate = useNavigate();
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductsLoading(true);
        if (allProducts.length === 0) {
          await showAllProducts();
        }
      } catch (e) {
        console.error(e);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchData();
  }, []);

  const [addedStates, setAddedStates] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);

  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const handleSubmit = async (e, productId) => {
    e.preventDefault();
    const product = allProducts.find((p) => p._id === productId);
    if (!product || product.stock === 0 || addedStates[productId]) return;

    try {
      await addToCart(productId, 1);
      setAddedStates((prev) => ({...prev, [productId]: true}));
      setTimeout(() => navigate("/cart-page"), 1200);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="w-full h-full border-[2px]">
      <div className="main-container w-full h-full flex flex-col">
        <NavBar />

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
          <motion.div
            animate={{x: [0, 30, 0], y: [0, -20, 0]}}
            transition={{duration: 12, repeat: Infinity, ease: "easeInOut"}}
            style={{
              position: "absolute",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${GOLD}22 0%, transparent 70%)`,
              top: "-10%",
              right: "20%",
              pointerEvents: "none",
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
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${GOLD}18 0%, transparent 70%)`,
              bottom: "0%",
              left: "5%",
              pointerEvents: "none",
            }}
          />
          <motion.div
            initial={{scaleX: 0}}
            animate={{scaleX: 1}}
            transition={{duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2}}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              transformOrigin: "left",
              pointerEvents: "none",
            }}
          />
          <motion.div
            initial={{scaleX: 0}}
            animate={{scaleX: 1}}
            transition={{duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.5}}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              transformOrigin: "right",
              pointerEvents: "none",
            }}
          />

          <div
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
            className="hero-grid"
          >
            <motion.div
              style={{
                y: textY,
                display: "flex",
                flexDirection: "column",
                gap: 0,
                paddingRight: 48,
              }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} style={{marginBottom: 28}}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 18px",
                    border: `1px solid ${GOLD}50`,
                    background: `${GOLD}14`,
                    borderRadius: 100,
                  }}
                >
                  <motion.div
                    animate={{scale: [1, 1.4, 1], opacity: [1, 0.5, 1]}}
                    transition={{duration: 2, repeat: Infinity}}
                    style={{
                      width: 6,
                      height: 6,
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
                    Kenya's Natural Choice
                  </span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} style={{marginBottom: 8}}>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', 'Georgia', serif",
                    fontSize: "clamp(42px, 4.5vw, 80px)",
                    fontWeight: 300,
                    lineHeight: 1.08,
                    color: DARK,
                    margin: 0,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Naturally
                </h2>
              </motion.div>

              <motion.div variants={itemVariants} style={{marginBottom: 8}}>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', 'Georgia', serif",
                    fontSize: "clamp(42px, 4.5vw, 80px)",
                    fontWeight: 300,
                    lineHeight: 1.08,
                    margin: 0,
                    letterSpacing: "-0.01em",
                  }}
                >
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
                    Medicated
                  </em>
                </h2>
              </motion.div>

              <motion.div variants={itemVariants} style={{marginBottom: 36}}>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', 'Georgia', serif",
                    fontSize: "clamp(42px, 4.5vw, 80px)",
                    fontWeight: 300,
                    lineHeight: 1.08,
                    color: DARK,
                    margin: 0,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Face Soap
                </h2>
              </motion.div>

              <motion.div variants={itemVariants} style={{marginBottom: 28}}>
                <div style={{display: "flex", alignItems: "center", gap: 14}}>
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
                    The Natural Way
                  </span>
                </div>
              </motion.div>

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
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 11,
                    fontWeight: 400,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: MUTED,
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
                >
                  Learn More
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </motion.div>

              <motion.div
                variants={itemVariants}
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

          <style>{`
            @keyframes shimmer-text {
              0%   { background-position: 0%   center }
              50%  { background-position: 100% center }
              100% { background-position: 0%   center }
            }
          `}</style>
        </section>

        <section
          style={{
            padding: "100px 80px",
            background: CREAM,
            position: "relative",
            overflow: "hidden",
          }}
          className="products-section"
        >
          <motion.div
            initial={{scaleX: 0}}
            animate={{scaleX: 1}}
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

          <div style={{textAlign: "center", marginBottom: 64}}>
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6}}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 24,
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
              animate={{opacity: 1, y: 0}}
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
              animate={{opacity: 1, y: 0}}
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
              variants={productsContainerVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "32px",
                maxWidth: 1400,
                margin: "0 auto",
              }}
              className="products-grid"
            >
              {allProducts.map((product) => (
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
                    boxShadow:
                      hoveredCard === product._id
                        ? "0 25px 40px -12px rgba(0,0,0,0.15)"
                        : "0 8px 20px -6px rgba(0,0,0,0.05)",
                    transform:
                      hoveredCard === product._id
                        ? "translateY(-4px)"
                        : "translateY(0)",
                  }}
                >
                  <div style={{position: "relative", overflow: "hidden"}}>
                    <Link to={`/order/${product._id}`}>
                      <motion.img
                        src={bufferToDataURL(product.image)}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: 320,
                          objectFit: "cover",
                          transition:
                            "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                        whileHover={{scale: 1.05}}
                      />
                    </Link>
                    <motion.div
                      initial={{opacity: 0}}
                      animate={{opacity: hoveredCard === product._id ? 1 : 0}}
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
                        View details
                      </span>
                    </motion.div>
                  </div>

                  <div style={{padding: "24px 20px 28px"}}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: "0.2em",
                        color: GOLD,
                        textTransform: "uppercase",
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
                        margin: "0 0 12px 0",
                        lineHeight: 1.3,
                      }}
                    >
                      {product.name}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        marginBottom: 20,
                        paddingBottom: 12,
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
                        Ksh{product.price?.toFixed(2)}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: product.stock > 0 ? GOLD : "#C41E3A",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {product.stock > 0
                          ? `Stock: ${product.stock}`
                          : "Out of Stock"}
                      </span>
                    </div>

                    <form onSubmit={(e) => handleSubmit(e, product._id)}>
                      <motion.button
                        type="submit"
                        disabled={
                          product.stock === 0 || addedStates[product._id]
                        }
                        whileTap={{scale: 0.97}}
                        style={{
                          width: "100%",
                          background:
                            product.stock === 0
                              ? "#E0E0E0"
                              : addedStates[product._id]
                                ? GOLD_LIGHT
                                : GOLD,
                          border: "none",
                          borderRadius: 40,
                          padding: "12px 0",
                          color: "white",
                          fontSize: 12,
                          fontWeight: 500,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          cursor:
                            product.stock === 0 || addedStates[product._id]
                              ? "not-allowed"
                              : "pointer",
                          transition: "background 0.2s ease",
                        }}
                        whileHover={{
                          background:
                            product.stock > 0 && !addedStates[product._id]
                              ? GOLD_LIGHT
                              : undefined,
                        }}
                      >
                        {product.stock === 0
                          ? "Out of Stock"
                          : addedStates[product._id]
                            ? "✓ Added"
                            : "Add to Cart"}
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div
            style={{
              position: "absolute",
              bottom: 40,
              right: 20,
              opacity: 0.08,
              pointerEvents: "none",
              fontSize: 200,
              fontFamily: "serif",
              transform: "rotate(15deg)",
            }}
          >
            ✿
          </div>
        </section>

        <Footer />
      </div>

      <style>{`
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
          .hero-grid .stats-wrapper {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .hero-grid {
            padding: 40px 24px !important;
            gap: 32px !important;
          }
          .hero-grid h2 {
            font-size: clamp(32px, 8vw, 44px) !important;
          }
          .hero-grid p {
            max-width: 100% !important;
          }
          .hero-grid .stats-wrapper {
            flex-wrap: wrap;
            gap: 16px;
          }
          .hero-grid .stats-wrapper > div {
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
          .products-grid img {
            height: 280px !important;
          }
          .products-grid h3 {
            fontSize: 18px !important;
          }
          .products-grid .price-block {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .hero-grid {
            padding: 32px 16px !important;
          }
          .products-section {
            padding: 48px 16px !important;
          }
          .products-grid img {
            height: 240px !important;
          }
          .products-grid .product-card {
            margin-bottom: 8px;
          }
        }
      `}</style>
    </main>
  );
};

export default LandingPage;
