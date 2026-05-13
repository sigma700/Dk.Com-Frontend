import React, {useState, useEffect, useRef} from "react";
import {AppleSearchAnimation} from "../utils/searchAnimation";
import {Link, useLocation} from "react-router-dom";
import {ShoppingCart, SquareUserRound, Leaf} from "lucide-react";
import HamburgerMenu from "./menu";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";

// ── Mindful Living KE — Brand Palette ──
const GREEN = "#4A8C2A";
const GREEN_LIGHT = "#72B84A";
const GREEN_DARK = "#14280F";
const MUTED = "#5A7A4A";
const CREAM = "#F7FBF4";

// Realistic navigation paths – update as needed
const navLinks = [
  {label: "Home", href: "/"},
  {label: "Discover", href: "/discover-more"},
  {label: "About Us", href: "/about"},
  {label: "FAQs", href: "/faqs"},
  {label: "Blog", href: "/blog"},
];

/* ── Magnetic hover helper with navigation ── */
const MagneticLink = ({label, href}) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({x: 0, y: 0});
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({x: x * 0.22, y: y * 0.22});
  };

  const handleMouseLeave = () => {
    setPos({x: 0, y: 0});
    setHovered(false);
  };

  return (
    <motion.li
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{x: pos.x, y: pos.y}}
      transition={{type: "spring", stiffness: 300, damping: 20}}
      style={{listStyle: "none", position: "relative", cursor: "pointer"}}
      initial={{opacity: 0, y: -20}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
    >
      <Link to={href} style={{textDecoration: "none"}}>
        <span
          style={{
            position: "relative",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: hovered ? GREEN : "#2a2a2a",
            transition: "color 0.3s ease",
            paddingBottom: 4,
          }}
        >
          {label}
          <motion.span
            layoutId={`underline-${label}`}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 1.5,
              background: `linear-gradient(90deg, ${GREEN}, ${GREEN_LIGHT})`,
              borderRadius: 2,
              originX: 0,
            }}
            initial={{scaleX: 0}}
            animate={{scaleX: hovered ? 1 : 0}}
            transition={{duration: 0.35, ease: [0.16, 1, 0.3, 1]}}
          />
        </span>
      </Link>

      {/* Pollen dot that appears on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{opacity: 0, scale: 0, y: 6}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0, y: 6}}
            transition={{duration: 0.25}}
            style={{
              position: "absolute",
              bottom: -10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: GREEN,
            }}
          />
        )}
      </AnimatePresence>
    </motion.li>
  );
};

/* ── Icon button with ripple ── */
const IconButton = ({children, to}) => {
  const [ripples, setRipples] = useState([]);

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, {x, y, id}]);
    setTimeout(
      () => setRipples((prev) => prev.filter((r) => r.id !== id)),
      600,
    );
  };

  const inner = (
    <motion.div
      onClick={addRipple}
      whileHover={{scale: 1.12}}
      whileTap={{scale: 0.92}}
      transition={{type: "spring", stiffness: 400, damping: 20}}
      style={{
        position: "relative",
        width: 38,
        height: 38,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${GREEN}30`,
        background: `${GREEN}0a`,
        cursor: "pointer",
        overflow: "hidden",
        color: "#2a2a2a",
      }}
    >
      {children}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{width: 0, height: 0, opacity: 0.5, x: r.x, y: r.y}}
          animate={{
            width: 80,
            height: 80,
            opacity: 0,
            x: r.x - 40,
            y: r.y - 40,
          }}
          transition={{duration: 0.55, ease: "easeOut"}}
          style={{
            position: "absolute",
            borderRadius: "50%",
            background: GREEN,
            pointerEvents: "none",
          }}
        />
      ))}
    </motion.div>
  );

  return to ? <Link to={to}>{inner}</Link> : inner;
};

/* ── Animated logo leaf ── */
const LogoMark = () => (
  <motion.div
    initial={{opacity: 0, x: -24}}
    animate={{opacity: 1, x: 0}}
    transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
    style={{display: "flex", alignItems: "center", cursor: "pointer"}}
  >
    <div
      style={{
        background: "#F7FBF4",
        borderRadius: 60,
        padding: 8,
        boxShadow:
          "0 8px 24px -8px rgba(74,140,42,0.25), inset 0 1px 0 rgba(255,255,255,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src="/logo.jpeg"
        alt="Mindful Living KE"
        style={{
          height: 64,
          width: "auto",
          display: "block",
          borderRadius: 48,
          objectFit: "cover",
        }}
      />
    </div>
  </motion.div>
);

/* ── Main NavBar ── */
const NavBar = () => {
  const {scrollY} = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
    setVisible(y < lastY.current || y < 80);
    lastY.current = y;
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="navbar"
          initial={{y: -80, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          exit={{y: -80, opacity: 0}}
          transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: scrolled ? "rgba(247, 251, 244, 0.82)" : "transparent",
            backdropFilter: scrolled ? "blur(20px) saturate(1.6)" : "none",
            WebkitBackdropFilter: scrolled
              ? "blur(20px) saturate(1.6)"
              : "none",
            borderBottom: scrolled
              ? `1px solid ${GREEN}20`
              : "1px solid transparent",
            transition:
              "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, ${GREEN}, ${GREEN_LIGHT}, ${GREEN})`,
              backgroundSize: "200% auto",
              animation: "shimmer-bar 3s linear infinite",
              opacity: scrolled ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />

          <section style={{padding: "0 32px"}}>
            {/* Desktop nav */}
            <nav
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "space-between",
                height: 72,
              }}
              className="lg-nav"
            >
              <LogoMark />

              <motion.ul
                style={{
                  display: "flex",
                  gap: 44,
                  margin: 0,
                  padding: 0,
                  alignItems: "center",
                }}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {staggerChildren: 0.07, delayChildren: 0.2},
                  },
                }}
              >
                {navLinks.map((link) => (
                  <MagneticLink
                    key={link.label}
                    label={link.label}
                    href={link.href}
                  />
                ))}
              </motion.ul>

              <motion.div
                initial={{opacity: 0, x: 24}}
                animate={{opacity: 1, x: 0}}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.3,
                }}
                style={{display: "flex", alignItems: "center", gap: 10}}
              >
                <AppleSearchAnimation />
                <IconButton to="/cart-page">
                  <ShoppingCart size={17} strokeWidth={1.8} />
                </IconButton>
                <IconButton to={"/user-profile"}>
                  <SquareUserRound size={17} strokeWidth={1.8} />
                </IconButton>
                <Link to={"/discover-more"}>
                  <motion.button
                    whileHover={{scale: 1.04}}
                    whileTap={{scale: 0.96}}
                    transition={{type: "spring", stiffness: 400, damping: 18}}
                    style={{
                      marginLeft: 8,
                      padding: "9px 22px",
                      borderRadius: 100,
                      border: "none",
                      background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_LIGHT} 100%)`,
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      boxShadow: `0 4px 20px ${GREEN}45`,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <motion.span
                      animate={{x: ["-100%", "200%"]}}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        repeatDelay: 1.5,
                        ease: "easeInOut",
                      }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%)",
                        pointerEvents: "none",
                      }}
                    />
                    Shop Now
                  </motion.button>
                </Link>
              </motion.div>
            </nav>

            {/* Mobile nav */}
            <nav
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: 64,
              }}
              className="mobile-nav"
            >
              <LogoMark />
              <HamburgerMenu
                links={navLinks}
                onNav={(href) => console.log(href)}
              />
            </nav>
          </section>

          <style>{`
            @media (min-width: 1024px) {
              .lg-nav   { display: flex !important; }
              .mobile-nav { display: none !important; }
            }
            @keyframes shimmer-bar {
              0%   { background-position: 0%   center }
              100% { background-position: 200% center }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavBar;
