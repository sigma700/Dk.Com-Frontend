import React, {useState, useRef} from "react";
import {motion, useInView, AnimatePresence} from "framer-motion";
import NavBar from "../components/navBar";
import Footer from "../components/Footer";
import {Link} from "react-router-dom";

const GOLD = "#4A8C2A";
const GOLD_LIGHT = "#72B84A";
const GOLD_PALE = "#E8F5E0";
const CREAM = "#F7FBF4";
const DARK = "#1A1A1A";
const MUTED = "#5A7A4A";
const DARK_GREEN = "#14280F";

const categories = [
  {
    id: 1,
    name: "Face Care",
    tagline: "Radiant skin, naturally",
    count: 12,
    emoji: "🌸",
    accent: "#4A8C2A",
    description:
      "Botanical face soaps, serums, and treatments formulated with Kenya's finest herbs.",
    bg: `linear-gradient(135deg, #E8F5E0 0%, #C5E4AC 100%)`,
  },
  {
    id: 2,
    name: "Body Care",
    tagline: "Head to toe nourishment",
    count: 8,
    emoji: "🌿",
    accent: "#2E6B1A",
    description:
      "Rich body butters, scrubs, and oils infused with baobab and shea for deep hydration.",
    bg: `linear-gradient(135deg, #F0F8E8 0%, #D4EDBC 100%)`,
  },
  {
    id: 3,
    name: "Hair & Scalp",
    tagline: "Roots of wellness",
    count: 6,
    emoji: "🌱",
    accent: "#72B84A",
    description:
      "Nourishing hair treatments with rosemary, aloe vera, and black seed oil.",
    bg: `linear-gradient(135deg, #FAFFF7 0%, #E0F2D0 100%)`,
  },
  {
    id: 4,
    name: "Wellness Teas",
    tagline: "Sip into serenity",
    count: 9,
    emoji: "🍃",
    accent: "#3A7A20",
    description:
      "Handpicked Kenyan herbal blends for immunity, calm, and vitality.",
    bg: `linear-gradient(135deg, #EBF7E2 0%, #C8E8A8 100%)`,
  },
  {
    id: 5,
    name: "Essential Oils",
    tagline: "Nature's essence, bottled",
    count: 14,
    emoji: "💧",
    accent: "#5A9E34",
    description:
      "Pure cold-pressed oils sourced from Kenyan farms — for skin, hair, and aromatherapy.",
    bg: `linear-gradient(135deg, #F4FBF0 0%, #D0EBB4 100%)`,
  },
  {
    id: 6,
    name: "Bundles",
    tagline: "Complete rituals",
    count: 4,
    emoji: "✨",
    accent: "#4A8C2A",
    description:
      "Curated gift sets and ritual bundles for the complete Mindful Living experience.",
    bg: `linear-gradient(135deg, #E8F5E0 0%, #B8DFA0 100%)`,
  },
];

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
        letterSpacing: "0.4em",
        textTransform: "uppercase",
        color: MUTED,
      }}
    >
      {text}
    </span>
    <div style={{width: 36, height: 1, background: GOLD}} />
  </div>
);

const CategoryCard = ({cat, index}) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, {once: true, margin: "-60px"});

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, y: 50}}
      animate={inView ? {opacity: 1, y: 0} : {}}
      transition={{duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1]}}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: cat.bg,
        borderRadius: 28,
        padding: "40px 36px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${GOLD}20`,
        transition: "box-shadow 0.4s ease, transform 0.3s ease",
        boxShadow: hovered
          ? `0 30px 60px -12px ${GOLD}25`
          : "0 4px 20px -8px rgba(0,0,0,0.08)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* Hover shimmer */}
      <motion.div
        animate={{x: hovered ? "200%" : "-100%"}}
        transition={{duration: 0.8, ease: "easeInOut"}}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Count badge */}
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          background: `${GOLD}18`,
          border: `1px solid ${GOLD}30`,
          borderRadius: 100,
          padding: "4px 12px",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.2em",
          color: GOLD,
          textTransform: "uppercase",
        }}
      >
        {cat.count} Products
      </div>

      {/* Emoji */}
      <motion.div
        animate={{
          scale: hovered ? 1.15 : 1,
          rotate: hovered ? [0, -8, 5, 0] : 0,
        }}
        transition={{duration: 0.5}}
        style={{fontSize: 52, marginBottom: 20, display: "inline-block"}}
      >
        {cat.emoji}
      </motion.div>

      <h3
        style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: 26,
          fontWeight: 400,
          color: DARK,
          margin: "0 0 6px",
          lineHeight: 1.2,
        }}
      >
        {cat.name}
      </h3>

      <p
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: MUTED,
          margin: "0 0 16px",
        }}
      >
        {cat.tagline}
      </p>

      <p
        style={{
          fontSize: 13,
          color: MUTED,
          lineHeight: 1.8,
          fontWeight: 300,
          margin: "0 0 28px",
        }}
      >
        {cat.description}
      </p>

      {/* CTA */}
      <motion.div
        animate={{x: hovered ? 4 : 0}}
        transition={{duration: 0.3}}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: GOLD,
        }}
      >
        Explore
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
      </motion.div>
    </motion.div>
  );
};

const CategoryPage = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, {once: true});

  return (
    <main style={{background: CREAM, minHeight: "100vh"}}>
      <NavBar />

      {/* Hero Banner */}
      <section
        ref={heroRef}
        style={{
          background: `linear-gradient(135deg, ${CREAM} 0%, ${GOLD_PALE} 50%, #C5E4AC 100%)`,
          padding: "100px 80px 80px",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Orbs */}
        <motion.div
          animate={{x: [0, 30, 0], y: [0, -20, 0]}}
          transition={{duration: 12, repeat: Infinity}}
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${GOLD}16 0%, transparent 70%)`,
            top: "-20%",
            right: "5%",
            pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{x: [0, -20, 0], y: [0, 25, 0]}}
          transition={{duration: 15, repeat: Infinity, delay: 2}}
          style={{
            position: "absolute",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${GOLD}12 0%, transparent 70%)`,
            bottom: "-10%",
            left: "5%",
            pointerEvents: "none",
          }}
        />

        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={isHeroInView ? {opacity: 1, y: 0} : {}}
          transition={{duration: 0.8}}
        >
          <SectionLabel text="Browse Collection" />
        </motion.div>

        <motion.h1
          initial={{opacity: 0, y: 40, filter: "blur(6px)"}}
          animate={isHeroInView ? {opacity: 1, y: 0, filter: "blur(0px)"} : {}}
          transition={{duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1]}}
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontSize: "clamp(40px, 5vw, 72px)",
            fontWeight: 300,
            color: DARK,
            margin: "0 0 20px",
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          Shop by{" "}
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
            Category
          </em>
        </motion.h1>

        <motion.p
          initial={{opacity: 0, y: 20}}
          animate={isHeroInView ? {opacity: 1, y: 0} : {}}
          transition={{duration: 0.7, delay: 0.25}}
          style={{
            fontSize: 15,
            color: MUTED,
            maxWidth: 480,
            margin: "0 auto",
            fontWeight: 300,
            lineHeight: 1.9,
          }}
        >
          Discover our full range of botanical wellness products, thoughtfully
          organised for your every need.
        </motion.p>
      </section>

      {/* Grid */}
      <section
        style={{padding: "80px 80px 100px", maxWidth: 1400, margin: "0 auto"}}
        className="category-section"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 28,
          }}
        >
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              style={{textDecoration: "none"}}
            >
              <CategoryCard cat={cat} index={i} />
            </Link>
          ))}
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes shimmer-text {
          0%   { background-position: 0% center }
          50%  { background-position: 100% center }
          100% { background-position: 0% center }
        }
        @media (max-width: 768px) {
          .category-section { padding: 48px 20px 60px !important; }
        }
      `}</style>
    </main>
  );
};

export default CategoryPage;
