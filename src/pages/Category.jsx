import React, {useState, useRef, useEffect} from "react";
import {motion, useInView, AnimatePresence} from "framer-motion";
import {Link, useNavigate} from "react-router-dom";
import NavBar from "../components/navBar";
import Footer from "../components/Footer";
import {useProductsStore} from "../stores/productDisplayStore";
import {useAddToCartStore} from "../stores/addToCartStore";
import {bufferToDataURL} from "../utils/displayImage";
import {PiPlantBold} from "react-icons/pi";

// ── Brand Palette ──────────────────────────────────────────────
const GOLD = "#4A8C2A";
const GOLD_LIGHT = "#72B84A";
const GOLD_PALE = "#E8F5E0";
const CREAM = "#F7FBF4";
const DARK = "#1A1A1A";
const MUTED = "#5A7A4A";
const DARK_GREEN = "#14280F";

// ── Tag config ─────────────────────────────────────────────────
const TAG_STYLES = {
  Trending: {bg: "rgba(74,140,42,0.92)", color: "#fff", icon: "🔥"},
  New: {bg: "rgba(20,40,15,0.90)", color: "#72B84A", icon: "✦"},
  Hot: {bg: "rgba(190,40,20,0.88)", color: "#fff", icon: "★"},
  Bestseller: {
    bg: "rgba(232,245,224,0.96)",
    color: "#2E6B1A",
    icon: "★",
    border: "1px solid rgba(74,140,42,0.35)",
  },
};

// ── Mock data — replace with your store's allProducts ──────────
const MOCK_PRODUCTS = [
  {
    _id: "1",
    name: "Botanical Face Elixir",
    category: "Face Care",
    price: 2400,
    rating: 4.9,
    reviews: 128,
    tag: "Trending",
    emoji: "🌸",
    stock: 14,
    description:
      "Triple-action serum with moringa, baobab & rosehip for luminous skin.",
  },
  {
    _id: "2",
    name: "Healing Glow Soap",
    category: "Face Care",
    price: 850,
    rating: 4.8,
    reviews: 214,
    tag: "Bestseller",
    emoji: "🌼",
    stock: 32,
    description:
      "Fourteen rare botanical actives in a daily cleansing ritual bar.",
  },
  {
    _id: "3",
    name: "Vitamin C Brightener",
    category: "Face Care",
    price: 1800,
    rating: 4.7,
    reviews: 89,
    tag: "New",
    emoji: "🍋",
    stock: 8,
    description: "Kenyan kakadu plum extract for even-toned, luminous skin.",
  },
  {
    _id: "4",
    name: "Baobab Body Butter",
    category: "Body Care",
    price: 1200,
    rating: 4.9,
    reviews: 176,
    tag: "Bestseller",
    emoji: "🌿",
    stock: 21,
    description: "Ultra-rich shea & baobab fusion for deep 24-hour hydration.",
  },
  {
    _id: "5",
    name: "Arabica Coffee Scrub",
    category: "Body Care",
    price: 950,
    rating: 4.6,
    reviews: 93,
    tag: "Trending",
    emoji: "☕",
    stock: 17,
    description:
      "Energising full-body polish with Kenyan highland coffee grounds.",
  },
  {
    _id: "6",
    name: "Rosemary Hair Oil",
    category: "Hair & Scalp",
    price: 1100,
    rating: 4.8,
    reviews: 142,
    tag: "New",
    emoji: "🌱",
    stock: 19,
    description:
      "Scalp-stimulating blend with rosemary, black seed & aloe vera.",
  },
  {
    _id: "7",
    name: "Hibiscus Calm Tea",
    category: "Wellness Teas",
    price: 680,
    rating: 4.9,
    reviews: 201,
    tag: "Bestseller",
    emoji: "🍵",
    stock: 44,
    description:
      "Hand-harvested hibiscus, lemongrass & chamomile for deep calm.",
  },
  {
    _id: "8",
    name: "Immunity Boost Blend",
    category: "Wellness Teas",
    price: 720,
    rating: 4.7,
    reviews: 88,
    tag: "Trending",
    emoji: "🍃",
    stock: 36,
    description: "Ginger, turmeric & elderberry — your daily wellness shield.",
  },
  {
    _id: "9",
    name: "Frankincense Pure Oil",
    category: "Essential Oils",
    price: 2800,
    rating: 5.0,
    reviews: 64,
    tag: "New",
    emoji: "💧",
    stock: 6,
    description:
      "Steam-distilled Boswellia from the Kenyan highlands. Rare & potent.",
  },
  {
    _id: "10",
    name: "Lavender Sleep Oil",
    category: "Essential Oils",
    price: 1400,
    rating: 4.8,
    reviews: 119,
    tag: "Bestseller",
    emoji: "💜",
    stock: 23,
    description: "Cold-pressed Kenyan lavender for deep, restorative sleep.",
  },
  {
    _id: "11",
    name: "Ritual Glow Bundle",
    category: "Bundles",
    price: 4200,
    rating: 4.9,
    reviews: 47,
    tag: "Trending",
    emoji: "✨",
    stock: 9,
    description:
      "Face soap, serum & gua sha stone. The complete morning ritual.",
  },
  {
    _id: "12",
    name: "Strengthening Hair Kit",
    category: "Hair & Scalp",
    price: 2600,
    rating: 4.6,
    reviews: 33,
    tag: "New",
    emoji: "🌾",
    stock: 11,
    description:
      "Shampoo bar, scalp oil & deep conditioner for transformative hair.",
  },
];

const CATEGORIES = [
  "All",
  "Face Care",
  "Body Care",
  "Hair & Scalp",
  "Wellness Teas",
  "Essential Oils",
  "Bundles",
];
const TAG_FILTERS = ["Trending", "New", "Bestseller"];

// ── Helpers ────────────────────────────────────────────────────
const SectionLabel = ({text}) => (
  <div
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
        letterSpacing: "0.42em",
        textTransform: "uppercase",
        color: MUTED,
      }}
    >
      {text}
    </span>
    <div style={{width: 36, height: 1, background: GOLD}} />
  </div>
);

const StarRating = ({rating}) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{display: "inline-flex", alignItems: "center", gap: 2}}>
      {Array.from({length: 5}).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={i < full ? GOLD : i === full && half ? "url(#half)" : "none"}
            stroke={i < full || (i === full && half) ? GOLD : "#CBD5C4"}
            strokeWidth="1.5"
          />
        </svg>
      ))}
    </span>
  );
};

// ── Featured Banner (fixed image on side, responsive) ─────────
const FeaturedBanner = () => (
  <motion.div
    initial={{opacity: 0, y: 40}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.9, ease: [0.16, 1, 0.3, 1]}}
    className="featured-banner"
    style={{
      background: `linear-gradient(130deg, ${DARK_GREEN} 0%, #1E3A14 55%, #2C5218 100%)`,
      borderRadius: 32,
      padding: "52px 56px",
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: 48,
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
      border: `1px solid rgba(74,140,42,0.28)`,
      marginBottom: 28,
      cursor: "pointer",
    }}
  >
    {/* Ambient orbs */}
    {[
      {w: 420, h: 420, top: "-40%", right: "18%", op: 0.18},
      {w: 200, h: 200, bottom: "-20%", left: "30%", op: 0.1},
    ].map((o, i) => (
      <motion.div
        key={i}
        animate={{x: [0, i % 2 ? -20 : 20, 0], y: [0, i % 2 ? 20 : -15, 0]}}
        transition={{duration: 12 + i * 3, repeat: Infinity, ease: "easeInOut"}}
        style={{
          position: "absolute",
          width: o.w,
          height: o.h,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(74,140,42,${o.op}) 0%, transparent 70%)`,
          top: o.top,
          right: o.right,
          bottom: o.bottom,
          left: o.left,
          pointerEvents: "none",
        }}
      />
    ))}
    {/* Dashed ring */}
    <div
      style={{
        position: "absolute",
        top: "-30%",
        right: "8%",
        width: 280,
        height: 280,
        borderRadius: "50%",
        border: `1px dashed rgba(114,184,74,0.25)`,
        pointerEvents: "none",
      }}
    />

    <div style={{position: "relative", zIndex: 2}}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
          background: "rgba(74,140,42,0.18)",
          border: `1px solid rgba(74,140,42,0.35)`,
          borderRadius: 100,
          padding: "5px 16px",
        }}
      >
        <motion.div
          animate={{scale: [1, 1.5, 1], opacity: [1, 0.4, 1]}}
          transition={{duration: 2, repeat: Infinity}}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: GOLD_LIGHT,
          }}
        />
        <span
          style={{
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: GOLD_LIGHT,
          }}
        >
          Editor's Pick · This Week
        </span>
      </div>

      <h2
        style={{
          fontFamily: "'Playfair Display','Georgia',serif",
          fontSize: "clamp(24px,3vw,42px)",
          fontWeight: 300,
          color: "#F7FBF4",
          margin: "0 0 12px",
          lineHeight: 1.15,
        }}
      >
        The Complete{" "}
        <em
          style={{
            fontStyle: "italic",
            background: `linear-gradient(90deg, ${GOLD_LIGHT} 0%, #A8D878 50%, ${GOLD_LIGHT} 100%)`,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmer-text 3s ease-in-out infinite",
          }}
        >
          Ritual Glow
        </em>{" "}
        Bundle
      </h2>
      <p
        style={{
          fontSize: 13,
          color: "rgba(247,251,244,0.52)",
          fontWeight: 300,
          lineHeight: 1.85,
          maxWidth: 480,
          margin: "0 0 28px",
        }}
      >
        Face soap, botanical elixir & hand-carved gua sha stone, Kenya's finest
        botanicals curated into one seamless morning ritual.
      </p>
      <div style={{display: "flex", alignItems: "center", gap: 20}}>
        <Link
          to="/order/11"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: GOLD,
            border: "none",
            borderRadius: 100,
            padding: "11px 28px",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#fff",
            textDecoration: "none",
            transition: "background 0.25s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2E6B1A")}
          onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
        >
          Shop Bundle · Ksh 4,200
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
        <span
          style={{
            fontSize: 11,
            color: "rgba(247,251,244,0.35)",
            letterSpacing: "0.12em",
          }}
        >
          Save 15% vs individual
        </span>
      </div>
    </div>

    {/* Image container — fixed size, proper image */}
    <div
      className="banner-image"
      style={{
        width: "auto",
        maxWidth: 220,
        position: "relative",
        zIndex: 2,
        filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.35))",
      }}
    >
      <img
        src="/src/assets/Men's sexual pack.jpeg"
        alt="Men's Sexual Wellness Bundle"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          borderRadius: 16,
        }}
      />
    </div>
  </motion.div>
);

// ── Product Card ───────────────────────────────────────────────
const ProductCard = ({product, index, onAdd, added}) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, {once: true, margin: "-60px"});
  const ts = TAG_STYLES[product.tag] || {};

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, y: 44, filter: "blur(4px)"}}
      animate={inView ? {opacity: 1, y: 0, filter: "blur(0px)"} : {}}
      transition={{
        duration: 0.75,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 28,
        overflow: "hidden",
        border: `1px solid rgba(74,140,42,${hovered ? 0.2 : 0.07})`,
        transition:
          "box-shadow 0.4s ease, transform 0.35s cubic-bezier(.16,1,.3,1)",
        boxShadow: hovered
          ? `0 32px 64px -16px rgba(74,140,42,0.18), 0 8px 24px -8px rgba(0,0,0,0.07)`
          : "0 2px 16px -6px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-10px)" : "translateY(0)",
        cursor: "pointer",
      }}
    >
      {/* Image area */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          height: 252,
          background: `linear-gradient(135deg, ${GOLD_PALE}, #C5E4AC)`,
        }}
      >
        {product.image ? (
          <motion.img
            src={bufferToDataURL(product.image)}
            alt={product.name}
            animate={{scale: hovered ? 1.06 : 1}}
            transition={{duration: 0.55, ease: [0.16, 1, 0.3, 1]}}
            style={{width: "100%", height: "100%", objectFit: "cover"}}
          />
        ) : (
          <motion.div
            animate={{scale: hovered ? 1.08 : 1, y: hovered ? -4 : 0}}
            transition={{duration: 0.55, ease: [0.16, 1, 0.3, 1]}}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 60,
            }}
          >
            {product.emoji || "🌿"}
          </motion.div>
        )}

        {/* Tag */}
        {product.tag && (
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              background: ts.bg,
              color: ts.color,
              border: ts.border || "none",
              borderRadius: 100,
              padding: "4px 12px",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              backdropFilter: "blur(8px)",
            }}
          >
            {ts.icon} {product.tag}
          </div>
        )}

        {/* Stock warning */}
        {product.stock > 0 && product.stock <= 8 && (
          <div
            style={{
              position: "absolute",
              bottom: 14,
              left: 14,
              background: "rgba(20,40,15,0.85)",
              backdropFilter: "blur(8px)",
              borderRadius: 100,
              padding: "3px 10px",
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.18em",
              color: "#72B84A",
            }}
          >
            Only {product.stock} left
          </div>
        )}

        {/* Dark hover overlay */}
        <motion.div
          animate={{opacity: hovered ? 1 : 0}}
          transition={{duration: 0.3}}
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, rgba(20,40,15,0.78) 0%, transparent 55%)`,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 22,
            pointerEvents: "none",
          }}
        >
          <Link
            to={`/order/${product._id}`}
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#fff",
              borderBottom: `1px solid ${GOLD}`,
              paddingBottom: 5,
              textDecoration: "none",
              pointerEvents: hovered ? "auto" : "none",
            }}
          >
            View Details
          </Link>
        </motion.div>
      </div>

      {/* Body */}
      <div style={{padding: "22px 24px 26px"}}>
        <div
          style={{
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: GOLD,
            marginBottom: 6,
          }}
        >
          {product.category}
        </div>
        <h3
          style={{
            fontFamily: "'Playfair Display','Georgia',serif",
            fontSize: 19,
            fontWeight: 400,
            color: DARK,
            margin: "0 0 8px",
            lineHeight: 1.25,
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: 12,
            color: MUTED,
            fontWeight: 300,
            lineHeight: 1.8,
            margin: "0 0 16px",
          }}
        >
          {product.description}
        </p>

        {/* Rating */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 16,
          }}
        >
          <StarRating rating={product.rating} />
          <span style={{fontSize: 10, color: MUTED, letterSpacing: "0.05em"}}>
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 14,
            borderTop: `1px solid rgba(74,140,42,0.1)`,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 24,
                fontWeight: 300,
                color: DARK,
                lineHeight: 1,
              }}
            >
              <span
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 11,
                  fontWeight: 400,
                  color: MUTED,
                  marginRight: 1,
                }}
              >
                Ksh
              </span>
              {product.price?.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: 10,
                color: product.stock > 0 ? GOLD : "#C41E3A",
                marginTop: 3,
                letterSpacing: "0.06em",
              }}
            >
              {product.stock > 0 ? `In stock` : "Out of stock"}
            </div>
          </div>

          <motion.button
            whileTap={{scale: 0.93}}
            disabled={product.stock === 0 || added}
            onClick={(e) => {
              e.preventDefault();
              onAdd(product._id);
            }}
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: added
                ? GOLD_LIGHT
                : product.stock === 0
                  ? "#D0D0D0"
                  : GOLD,
              border: "none",
              cursor: product.stock === 0 || added ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.25s, transform 0.2s",
              boxShadow:
                added || product.stock === 0
                  ? "none"
                  : `0 6px 18px -4px rgba(74,140,42,0.45)`,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (product.stock > 0 && !added)
                e.currentTarget.style.background = "#2E6B1A";
            }}
            onMouseLeave={(e) => {
              if (product.stock > 0 && !added)
                e.currentTarget.style.background = GOLD;
            }}
          >
            {added ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Page ──────────────────────────────────────────────────
const DiscoveryPage = () => {
  const {showAllProducts, allProducts} = useProductsStore();
  const {addToCart} = useAddToCartStore();
  const navigate = useNavigate();

  const [addedStates, setAddedStates] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState(null);
  const [sortMode, setSortMode] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, {once: true});

  useEffect(() => {
    if (allProducts.length === 0) showAllProducts().catch(console.error);
  }, []);

  const handleAdd = async (productId) => {
    if (addedStates[productId]) return;
    try {
      await addToCart(productId, 1);
      setAddedStates((p) => ({...p, [productId]: true}));
      setTimeout(() => navigate("/cart-page"), 1200);
    } catch (e) {
      console.error(e);
    }
  };

  const source = allProducts.length > 0 ? allProducts : MOCK_PRODUCTS;

  let filtered = [...source];
  if (activeCategory !== "All")
    filtered = filtered.filter((p) => p.category === activeCategory);
  if (activeTag) filtered = filtered.filter((p) => p.tag === activeTag);
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }
  if (sortMode === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sortMode === "price-desc")
    filtered.sort((a, b) => b.price - a.price);
  else if (sortMode === "rating")
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else if (sortMode === "name")
    filtered.sort((a, b) => a.name.localeCompare(b.name));

  const toggleTag = (tag) =>
    setActiveTag((prev) => (prev === tag ? null : tag));

  return (
    <main style={{background: CREAM, minHeight: "100vh"}}>
      <NavBar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        @keyframes shimmer-text {
          0%   { background-position: 0% center }
          50%  { background-position: 100% center }
          100% { background-position: 0% center }
        }
        @keyframes float-orb {
          0%, 100% { transform: translate(0,0) }
          50%       { transform: translate(20px,-18px) }
        }
        .discover-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
          gap: 24px; 
        }
        
        /* Mobile & Tablet Responsive */
        @media (max-width: 900px) {
          .hero-inner { 
            padding: 70px 24px 48px !important; 
          }
          .filters-inner { 
            padding: 0 20px !important; 
          }
          .grid-section { 
            padding: 40px 20px 72px !important; 
          }
          .discover-grid { 
            grid-template-columns: 1fr !important; 
          }
          /* Featured banner: stack and hide image on small screens */
          .featured-banner {
            grid-template-columns: 1fr !important;
            text-align: center;
            padding: 36px 28px !important;
            gap: 32px !important;
          }
          .featured-banner .banner-image {
            max-width: 180px !important;
            margin: 0 auto !important;
            display: block !important;
          }
          .stats-row {
            flex-wrap: wrap !important;
            gap: 24px !important;
          }
          .stats-row > div {
            flex: 0 0 45% !important;
            border-right: none !important;
            padding: 0 !important;
          }
        }
        
        @media (max-width: 600px) {
          .featured-banner .banner-image {
            display: none !important;  /* hide image on very small phones */
          }
          .stats-row > div {
            flex: 0 0 100% !important;
          }
          .hero-inner h1 {
            font-size: clamp(32px, 8vw, 44px) !important;
          }
        }
      `}</style>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        style={{
          background: `linear-gradient(135deg, ${CREAM} 0%, ${GOLD_PALE} 48%, #C5E4AC 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {[
          {w: 560, h: 560, top: "-25%", right: "2%", duration: 14, delay: 0},
          {w: 320, h: 320, bottom: "-15%", left: "4%", duration: 17, delay: 2},
          {w: 200, h: 200, top: "20%", left: "35%", duration: 11, delay: 5},
        ].map((o, i) => (
          <motion.div
            key={i}
            animate={{x: [0, i % 2 ? 30 : -22, 0], y: [0, i % 2 ? -18 : 24, 0]}}
            transition={{
              duration: o.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: o.delay,
            }}
            style={{
              position: "absolute",
              width: o.w,
              height: o.h,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(74,140,42,0.14) 0%, transparent 70%)`,
              top: o.top,
              right: o.right,
              bottom: o.bottom,
              left: o.left,
              pointerEvents: "none",
            }}
          />
        ))}

        <motion.div
          initial={{scaleX: 0}}
          animate={isHeroInView ? {scaleX: 1} : {}}
          transition={{duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2}}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            transformOrigin: "left",
          }}
        />

        <div
          className="hero-inner"
          style={{
            padding: "90px 80px 72px",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={isHeroInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.7}}
          >
            <SectionLabel text="Botanical Wellness · Kenya" />
          </motion.div>

          <motion.h1
            initial={{opacity: 0, y: 40, filter: "blur(8px)"}}
            animate={
              isHeroInView ? {opacity: 1, y: 0, filter: "blur(0px)"} : {}
            }
            transition={{duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1]}}
            style={{
              fontFamily: "'Playfair Display','Georgia',serif",
              fontSize: "clamp(44px, 6vw, 80px)",
              fontWeight: 300,
              color: DARK,
              margin: "0 0 18px",
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
            }}
          >
            Explore &amp;{" "}
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
              Discover
            </em>
          </motion.h1>

          <motion.p
            initial={{opacity: 0, y: 20}}
            animate={isHeroInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.7, delay: 0.26}}
            style={{
              fontSize: 15,
              color: MUTED,
              maxWidth: 460,
              margin: "0 auto 36px",
              fontWeight: 300,
              lineHeight: 1.95,
            }}
          >
            Curated botanicals, trending rituals, and Kenya's finest wellness ,
            all in one place. Find your perfect ritual.
          </motion.p>

          <motion.div
            initial={{opacity: 0, y: 20, scale: 0.97}}
            animate={isHeroInView ? {opacity: 1, y: 0, scale: 1} : {}}
            transition={{duration: 0.7, delay: 0.36}}
            style={{display: "flex", justifyContent: "center"}}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(16px)",
                border: `1px solid rgba(74,140,42,0.22)`,
                borderRadius: 100,
                padding: "4px 4px 4px 22px",
                width: "100%",
                maxWidth: 460,
                boxShadow: "0 8px 32px -12px rgba(74,140,42,0.18)",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke={MUTED}
                strokeWidth="1.8"
                style={{marginRight: 10, flexShrink: 0}}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search botanicals, oils, teas…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: 13,
                  color: DARK,
                  fontFamily: "inherit",
                  letterSpacing: "0.02em",
                  padding: "8px 0",
                }}
              />
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  background: GOLD,
                  border: "none",
                  borderRadius: 100,
                  padding: "9px 22px",
                  cursor: "pointer",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#fff",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#2E6B1A")
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = GOLD)}
              >
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Sticky Filters ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 90,
          background: "rgba(247,251,244,0.94)",
          backdropFilter: "blur(18px)",
          borderBottom: `1px solid rgba(74,140,42,0.1)`,
        }}
      >
        <div
          className="filters-inner"
          style={{padding: "0 80px", overflowX: "auto"}}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              height: 58,
              whiteSpace: "nowrap",
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  border: `1px solid ${activeCategory === cat ? GOLD : "rgba(74,140,42,0.2)"}`,
                  borderRadius: 100,
                  padding: "5px 16px",
                  background: activeCategory === cat ? GOLD : "transparent",
                  color: activeCategory === cat ? "#fff" : MUTED,
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                  flexShrink: 0,
                }}
              >
                {cat}
              </button>
            ))}

            <div
              style={{
                width: 1,
                height: 22,
                background: "rgba(74,140,42,0.15)",
                flexShrink: 0,
                margin: "0 4px",
              }}
            />

            {TAG_FILTERS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  border: `1px solid ${activeTag === tag ? DARK_GREEN : "rgba(74,140,42,0.2)"}`,
                  borderRadius: 100,
                  padding: "5px 14px",
                  background: activeTag === tag ? DARK_GREEN : "transparent",
                  color: activeTag === tag ? GOLD_LIGHT : MUTED,
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                  flexShrink: 0,
                }}
              >
                {TAG_STYLES[tag]?.icon} {tag}
              </button>
            ))}

            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
              style={{
                marginLeft: "auto",
                flexShrink: 0,
                border: `1px solid rgba(74,140,42,0.2)`,
                borderRadius: 100,
                padding: "5px 16px",
                background: "transparent",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: MUTED,
                cursor: "pointer",
                fontFamily: "inherit",
                outline: "none",
              }}
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="rating">Top Rated</option>
              <option value="name">A → Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <section
        className="grid-section"
        style={{padding: "56px 80px 96px", maxWidth: 1440, margin: "0 auto"}}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 36,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Playfair Display','Georgia',serif",
                fontSize: "clamp(26px,3vw,36px)",
                fontWeight: 300,
                color: DARK,
                margin: "0 0 4px",
              }}
            >
              {activeCategory === "All" ? (
                <>
                  Discover{" "}
                  <em style={{fontStyle: "italic", color: GOLD}}>Everything</em>
                </>
              ) : (
                <>{activeCategory}</>
              )}
            </h2>
            <p
              style={{
                fontSize: 10,
                color: MUTED,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              {filtered.length} Product{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          {(activeCategory !== "All" || activeTag || searchQuery) && (
            <button
              onClick={() => {
                setActiveCategory("All");
                setActiveTag(null);
                setSearchQuery("");
                setSortMode("default");
              }}
              style={{
                background: "none",
                border: `1px solid rgba(74,140,42,0.25)`,
                borderRadius: 100,
                padding: "6px 16px",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: MUTED,
                cursor: "pointer",
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {activeCategory === "All" &&
          !activeTag &&
          !searchQuery &&
          sortMode === "default" && <FeaturedBanner />}

        {filtered.length > 0 ? (
          <div className="discover-grid">
            <AnimatePresence>
              {filtered.map((product, i) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={i}
                  onAdd={handleAdd}
                  added={!!addedStates[product._id]}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            style={{textAlign: "center", padding: "80px 20px"}}
          >
            <div style={{fontSize: 52, marginBottom: 16}}>
              <PiPlantBold />
            </div>
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                fontWeight: 300,
                fontSize: 24,
                color: DARK,
                marginBottom: 8,
              }}
            >
              No products found
            </h3>
            <p style={{fontSize: 13, color: MUTED, fontWeight: 300}}>
              Try a different category or clear your filters.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.8}}
          className="stats-row"
          style={{
            display: "flex",
            gap: 0,
            marginTop: 72,
            paddingTop: 40,
            borderTop: `1px solid rgba(74,140,42,0.12)`,
          }}
        >
          {[
            {num: "100%", label: "Natural Ingredients"},
            {num: "14+", label: "Botanical Actives"},
            {num: "4.9★", label: "Average Rating"},
            {num: "53", label: "Products"},
          ].map(({num, label}, i) => (
            <div
              key={label}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "0 20px",
                borderRight: i < 3 ? `1px solid rgba(74,140,42,0.12)` : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 34,
                  fontWeight: 300,
                  color: DARK,
                }}
              >
                {num}
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: MUTED,
                  marginTop: 6,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      <Footer />
    </main>
  );
};

export default DiscoveryPage;
