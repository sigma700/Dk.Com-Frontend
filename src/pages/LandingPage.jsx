import React, {useEffect, useRef, useState, useCallback} from "react";
// import HamburgerMenu from "../components/menu";
import {Search, ShoppingCart, SquareUserRound} from "lucide-react";
import {AppleSearchAnimation} from "../utils/searchAnimation";
import HamburgerMenu from "../components/menu";
import BuyNowButton from "../components/buyButton";
import {useInView, useScroll, useTransform, motion} from "framer-motion";
import {useProductsStore} from "../stores/productDisplayStore";
import {bufferToDataURL} from "../utils/displayImage";

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C97A";
const GOLD_PALE = "#F5EDD6";
const CREAM = "#FDFAF5";
const DARK = "#1A1410";
const MUTED = "#8A7560";

// Stagger container
const containerVariants = {
  hidden: {},
  visible: {transition: {staggerChildren: 0.13, delayChildren: 0.2}},
};

// Each text block
const itemVariants = {
  hidden: {opacity: 0, y: 40, filter: "blur(6px)"},
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {duration: 0.9, ease: [0.16, 1, 0.3, 1]},
  },
};

// Image entrance
const imageVariants = {
  hidden: {opacity: 0, scale: 0.88, x: 60},
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3},
  },
};

// Floating badge
const badgeVariants = {
  hidden: {opacity: 0, scale: 0.7, rotate: -15},
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.9},
  },
};

// Stat card
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

const tags = [
  {text: "Argan Oil · Morocco", pos: {bottom: 130, left: -30}, delay: 1.1},
  {text: "Tea Tree · Australia", pos: {top: 100, right: -20}, delay: 1.3},
];

const LandingPage = () => {
  const {showAllProducts, allProducts, isLoading} = useProductsStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await showAllProducts();
      } catch (e) {
        console.error(e);
      }
    };

    if (allProducts.length === 0) {
      fetchData();
    }
  }, []);
  const navLinks = [
    {label: "Home", href: "#"},
    {label: "Category", href: "#"},
    {label: "About Us", href: "#"},
    {label: "FAQs", href: "#"},
    {label: "Blog", href: "#"},
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {once: true, margin: "-100px"});

  // Parallax on image
  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Rotating shimmer angle for background
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  const navigators = ["Home", "About Us", "FAQs", "Blog", "Contacts"];
  return (
    <main className="w-full h-screen border-[2px]">
      {" "}
      {/* Removed flex centering */}
      <div className="main-container w-full h-full flex flex-col">
        {/* nav section */}
        <section className="p-[20px]">
          <nav className="lg:flex items-center justify-between hidden">
            <img src="" alt="logo-bs" />
            <ul className="flex gap-[40px] font-bold">
              {navigators.map((item, idx) => (
                <li
                  key={idx}
                  className="hover:text-amber-400 hover:cursor-pointer hover:duration-75 hover:transition-colors duration-[0.5s] active:text-black active:duration-100 active:transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className="icons-section flex gap-[20px] items-center">
              <AppleSearchAnimation />
              <ShoppingCart />
              <SquareUserRound />
            </div>
          </nav>
          <nav className="lg:hidden z-50 relative flex justify-end">
            <HamburgerMenu
              links={navLinks}
              onNav={(href) => console.log(href)}
            />
          </nav>
        </section>
        {/* header section */}
        <section
          ref={sectionRef}
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            background: `linear-gradient(120deg, #FDFAF5 0%, #F5ECD7 35%, #EDD9B8 70%, #E8CFA0 100%)`,
          }}
        >
          {/* ── Animated background orbs ── */}
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

          {/* ── Decorative gold line top ── */}
          <motion.div
            initial={{scaleX: 0}}
            animate={isInView ? {scaleX: 1} : {scaleX: 0}}
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
          {/* ── Decorative gold line bottom ── */}
          <motion.div
            initial={{scaleX: 0}}
            animate={isInView ? {scaleX: 1} : {scaleX: 0}}
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

          {/* ── Main grid ── */}
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
            {/* LEFT — Text panel */}
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
              animate={isInView ? "visible" : "hidden"}
            >
              {/* Eyebrow pill */}
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
                    Top Product of the Month
                  </span>
                </div>
              </motion.div>

              {/* Headline */}
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

              {/* Divider */}
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
                    Botanical Formula
                  </span>
                </div>
              </motion.div>

              {/* Body */}
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

              {/* CTA row */}
              <motion.div
                variants={itemVariants}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  marginBottom: 56,
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

              {/* Stats row */}
              <motion.div
                variants={itemVariants}
                style={{
                  display: "flex",
                  gap: 0,
                  paddingTop: 28,
                  borderTop: `1px solid ${GOLD}25`,
                }}
              >
                {stats.map(({num, label}, i) => (
                  <motion.div
                    key={label}
                    custom={i}
                    variants={statVariants}
                    style={{
                      flex: 1,
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

            {/* RIGHT — Image stage */}
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
              {/* Stage glow */}
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
              {/* Concentric rings */}
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

              {/* Spinning badge */}
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                style={{
                  position: "absolute",
                  top: 24,
                  right: 0,
                  zIndex: 20,
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  background: DARK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <motion.div
                  animate={{rotate: 360}}
                  transition={{duration: 14, repeat: Infinity, ease: "linear"}}
                  style={{position: "absolute", inset: 0}}
                >
                  <svg
                    viewBox="0 0 88 88"
                    style={{width: "100%", height: "100%"}}
                  >
                    <circle
                      cx="44"
                      cy="44"
                      r="38"
                      fill="none"
                      stroke={GOLD}
                      strokeWidth="0.7"
                      strokeDasharray="3 5"
                    />
                  </svg>
                </motion.div>
                <div style={{textAlign: "center", zIndex: 1}}>
                  <div
                    style={{
                      fontSize: 7,
                      fontWeight: 500,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: GOLD,
                    }}
                  >
                    Est.
                  </div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 22,
                      fontWeight: 300,
                      color: GOLD_LIGHT,
                      lineHeight: 1,
                    }}
                  >
                    2019
                  </div>
                  <div
                    style={{
                      fontSize: 7,
                      fontWeight: 300,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: GOLD,
                    }}
                  >
                    Luxe
                  </div>
                </div>
              </motion.div>
              {/* Price tag */}
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                transition={{
                  duration: 0.8,
                  delay: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  position: "absolute",
                  bottom: 24,
                  right: 0,
                  zIndex: 10,
                  background: "rgba(15,12,8,0.88)",
                  backdropFilter: "blur(14px)",
                  padding: "16px 22px",
                }}
              >
                <div
                  style={{
                    fontSize: 8,
                    fontWeight: 400,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: MUTED,
                  }}
                >
                  Full Size · 120g
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 26,
                    fontWeight: 300,
                    color: GOLD_LIGHT,
                    marginTop: 4,
                  }}
                >
                  $48.00
                </div>
                <div
                  style={{
                    fontSize: 8,
                    fontWeight: 300,
                    letterSpacing: "0.2em",
                    color: GOLD + "80",
                    marginTop: 2,
                  }}
                >
                  Free shipping over $85
                </div>
              </motion.div>
              {/* Product image — floating */}
              <motion.div
                variants={imageVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                style={{position: "relative", zIndex: 5}}
              >
                <motion.img
                  src="src/assets/saop-image.png"
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
                      "drop-shadow(0 50px 100px rgba(80,45,8,0.42)) drop-shadow(0 12px 28px rgba(80,45,8,0.2))",
                  }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Shimmer keyframe */}
          <style>{`
        @keyframes shimmer-text {
          0%   { background-position: 0%   center }
          50%  { background-position: 100% center }
          100% { background-position: 0%   center }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; padding: 60px 28px !important; }
        }
      `}</style>
        </section>
        {/* products section */}
        <section className="all products section">
          <h1 className="text-center font-extrabold lg:text-[40px]">
            Featured Products
          </h1>
          <div className="section grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {allProducts.map((product) => (
              <div className="" key={product._id}>
                <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-gray-100 aspect-square">
                    <img
                      src={bufferToDataURL(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Optional: Stock badge */}
                    {product.stock < 50 && (
                      <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Low Stock
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category */}
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {product.category}
                    </p>

                    {/* Name */}
                    <h3 className="mt-1 text-lg font-semibold text-gray-800 line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price?.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      disabled={product.stock === 0}
                      className={`mt-4 w-full font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        product.stock === 0
                          ? "bg-gray-300 cursor-not-allowed text-gray-500"
                          : "bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-500"
                      }`}
                    >
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default LandingPage;
