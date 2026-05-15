import {useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {Link, useLocation} from "react-router-dom";

// ─── Theme tokens (matched to LandingPage) ────────────────────────────────────
const GOLD = "#4A8C2A";
const GOLD_LIGHT = "#72B84A";
const GOLD_PALE = "#E8F5E0";
const CREAM = "#F7FBF4";
const DARK = "#1A1A1A";
const MUTED = "#5A7A4A";

// ─── Navigation config ────────────────────────────────────────────────────────
const NAV_LINKS = [
  {label: "Home", href: "/", index: "01"},
  {label: "Discover", href: "/discover-more", index: "02"},
  {label: "About Us", href: "/about", index: "03"},
  {label: "FAQs", href: "/faqs", index: "04"},
  {label: "Blog", href: "/blog", index: "05"},
];

// ─── Animation variants ───────────────────────────────────────────────────────
const panelVariants = {
  closed: {
    clipPath: "circle(0% at calc(100% - 52px) 52px)",
    transition: {duration: 0.6, ease: [0.76, 0, 0.24, 1]},
  },
  open: {
    clipPath: "circle(200% at calc(100% - 52px) 52px)",
    transition: {duration: 0.65, ease: [0.76, 0, 0.24, 1]},
  },
};

const backdropVariants = {
  hidden: {opacity: 0},
  visible: {opacity: 1, transition: {duration: 0.4}},
  exit: {opacity: 0, transition: {duration: 0.35, delay: 0.1}},
};

const listVariants = {
  closed: {transition: {staggerChildren: 0.035, staggerDirection: -1}},
  open: {transition: {staggerChildren: 0.1, delayChildren: 0.3}},
};

const itemVariants = {
  closed: {
    opacity: 0,
    x: -36,
    filter: "blur(8px)",
    transition: {duration: 0.3, ease: "easeIn"},
  },
  open: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {duration: 0.65, ease: [0.16, 1, 0.3, 1]},
  },
};

const metaVariants = {
  closed: {opacity: 0, y: 20, transition: {duration: 0.2}},
  open: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.5, delay: 0.6, ease: "easeOut"},
  },
};

const lineVariants = {
  closed: {scaleX: 0, transition: {duration: 0.3}},
  open: {
    scaleX: 1,
    transition: {duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1]},
  },
};

// ─── Hamburger icon ───────────────────────────────────────────────────────────
function HamburgerIcon({isOpen}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-end",
        gap: 5,
        width: 24,
        height: 20,
      }}
    >
      <motion.span
        style={{
          display: "block",
          height: 1,
          background: isOpen ? GOLD_LIGHT : DARK,
          transformOrigin: "right",
        }}
        animate={
          isOpen
            ? {width: "100%", rotate: -45, y: 3, x: 1}
            : {width: "100%", rotate: 0, y: 0, x: 0}
        }
        transition={{duration: 0.45, ease: [0.76, 0, 0.24, 1]}}
      />
      <motion.span
        style={{
          display: "block",
          height: 1,
          background: isOpen ? GOLD_LIGHT : DARK,
        }}
        animate={
          isOpen ? {width: "0%", opacity: 0} : {width: "65%", opacity: 1}
        }
        transition={{duration: 0.3, ease: "easeInOut"}}
      />
      <motion.span
        style={{
          display: "block",
          height: 1,
          background: isOpen ? GOLD_LIGHT : DARK,
          transformOrigin: "right",
        }}
        animate={
          isOpen
            ? {width: "100%", rotate: 45, y: -3, x: 1}
            : {width: "100%", rotate: 0, y: 0, x: 0}
        }
        transition={{duration: 0.45, ease: [0.76, 0, 0.24, 1]}}
      />
    </div>
  );
}

// ─── Organic leaf/sprig decorative SVG ───────────────────────────────────────
function LeafAccent({style}) {
  return (
    <svg
      viewBox="0 0 120 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M60 170 Q20 120 30 60 Q40 10 60 10 Q80 10 90 60 Q100 120 60 170Z"
        fill={`${GOLD}12`}
        stroke={`${GOLD}30`}
        strokeWidth="0.8"
      />
      <path d="M60 170 Q60 90 60 10" stroke={`${GOLD}40`} strokeWidth="0.6" />
      <path d="M60 140 Q40 110 30 90" stroke={`${GOLD}30`} strokeWidth="0.5" />
      <path d="M60 140 Q80 110 90 90" stroke={`${GOLD}30`} strokeWidth="0.5" />
      <path d="M60 110 Q45 85  38 68" stroke={`${GOLD}25`} strokeWidth="0.4" />
      <path d="M60 110 Q75 85  82 68" stroke={`${GOLD}25`} strokeWidth="0.4" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const location = useLocation();

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (href) =>
    href === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(href);

  return (
    <div style={{position: "relative", zIndex: 50}}>
      {/* ── Trigger button ──────────────────────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        whileTap={{scale: 0.9}}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: isOpen ? `${GOLD}18` : "transparent",
          border: `1px solid ${isOpen ? GOLD + "60" : "transparent"}`,
          cursor: "pointer",
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        <HamburgerIcon isOpen={isOpen} />
      </motion.button>

      {/* ── Backdrop ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
              backdropFilter: "blur(6px)",
              background: "rgba(247,251,244,0.3)",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Full-screen panel ────────────────────────────────────────────── */}
      <motion.div
        variants={panelVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          background: CREAM,
          pointerEvents: isOpen ? "auto" : "none",
          overflow: "hidden",
        }}
      >
        {/* Ambient gradient blob */}
        <motion.div
          animate={{x: [0, 20, 0], y: [0, -14, 0]}}
          transition={{duration: 10, repeat: Infinity, ease: "easeInOut"}}
          style={{
            position: "absolute",
            pointerEvents: "none",
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${GOLD}18 0%, transparent 70%)`,
            top: "-20%",
            right: "-20%",
          }}
        />
        <motion.div
          animate={{x: [0, -16, 0], y: [0, 20, 0]}}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          style={{
            position: "absolute",
            pointerEvents: "none",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${GOLD}12 0%, transparent 70%)`,
            bottom: "5%",
            left: "-10%",
          }}
        />

        {/* Decorative leaf */}
        <LeafAccent
          style={{
            position: "absolute",
            right: -10,
            bottom: 100,
            width: 90,
            height: 130,
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />

        {/* ── Panel header ──────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 28px 0",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Brand wordmark */}
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: 18,
                fontWeight: 400,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: DARK,
              }}
            >
              BF<span style={{color: GOLD}}>·</span>Suma
            </div>
            <div
              style={{
                fontSize: 8,
                fontWeight: 400,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: MUTED,
                marginTop: 3,
              }}
            >
              Kenya's Natural Choice
            </div>
          </div>

          {/* Close button */}
          <motion.button
            onClick={() => setIsOpen(false)}
            whileTap={{scale: 0.9}}
            aria-label="Close menu"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: `1px solid ${GOLD}40`,
              background: `${GOLD}0A`,
              cursor: "pointer",
            }}
          >
            <HamburgerIcon isOpen={true} />
          </motion.button>
        </div>

        {/* Divider */}
        <motion.div
          variants={lineVariants}
          style={{
            height: 1,
            marginTop: 24,
            marginLeft: 28,
            marginRight: 28,
            background: `linear-gradient(90deg, ${GOLD}50, ${GOLD_LIGHT}30, transparent)`,
            transformOrigin: "left",
            position: "relative",
            zIndex: 2,
          }}
        />

        {/* ── Nav links ─────────────────────────────────────────────────── */}
        <motion.nav
          variants={listVariants}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 28px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <ul style={{listStyle: "none", margin: 0, padding: 0}}>
            {NAV_LINKS.map(({label, href, index}, i) => {
              const active = isActive(href);
              const hovered = activeHover === i;

              return (
                <motion.li
                  key={href}
                  variants={itemVariants}
                  onHoverStart={() => setActiveHover(i)}
                  onHoverEnd={() => setActiveHover(null)}
                >
                  <Link
                    to={href}
                    onClick={() => setIsOpen(false)}
                    style={{
                      width: "100%",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "18px 0",
                      borderBottom: `1px solid ${GOLD}${active ? "40" : "18"}`,
                      position: "relative",
                    }}
                  >
                    {/* Active indicator bar */}
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          layoutId="activeBar"
                          initial={{scaleY: 0}}
                          animate={{scaleY: 1}}
                          exit={{scaleY: 0}}
                          style={{
                            position: "absolute",
                            left: -28,
                            top: 0,
                            bottom: 0,
                            width: 3,
                            background: GOLD,
                            borderRadius: "0 2px 2px 0",
                            transformOrigin: "top",
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <div
                      style={{display: "flex", alignItems: "baseline", gap: 18}}
                    >
                      {/* Index number */}
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 400,
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                          color: active ? GOLD : `${GOLD}60`,
                          transition: "color 0.3s",
                          fontFamily: "monospace",
                        }}
                      >
                        {index}
                      </span>

                      {/* Label */}
                      <motion.span
                        animate={{
                          color: active ? GOLD : hovered ? GOLD_LIGHT : DARK,
                        }}
                        transition={{duration: 0.25}}
                        style={{
                          fontFamily: "'Playfair Display', 'Georgia', serif",
                          fontSize: "clamp(30px, 8vw, 40px)",
                          fontWeight: active ? 400 : 300,
                          lineHeight: 1,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {label}
                      </motion.span>
                    </div>

                    {/* Arrow */}
                    <motion.div
                      animate={{
                        opacity: hovered || active ? 1 : 0,
                        x: hovered ? 0 : -10,
                      }}
                      transition={{duration: 0.3, ease: [0.16, 1, 0.3, 1]}}
                      style={{color: GOLD, flexShrink: 0}}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </motion.nav>

        {/* ── Footer meta ───────────────────────────────────────────────── */}
        <motion.div
          variants={metaVariants}
          style={{
            padding: "20px 28px 36px",
            borderTop: `1px solid ${GOLD}20`,
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {/* Stats row — mirrors landing page */}
            <div style={{display: "flex", gap: 20, alignItems: "center"}}>
              {[
                {num: "100%", label: "Natural"},
                {num: "14+", label: "Botanicals"},
                {num: "4.9★", label: "Rating"},
              ].map(({num, label}, i) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    paddingRight: i < 2 ? 20 : 0,
                    borderRight: i < 2 ? `1px solid ${GOLD}20` : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 16,
                      fontWeight: 300,
                      color: DARK,
                    }}
                  >
                    {num}
                  </span>
                  <span
                    style={{
                      fontSize: 7,
                      fontWeight: 500,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: MUTED,
                      marginTop: 1,
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Tagline */}
            <span
              style={{
                fontSize: 8,
                fontWeight: 400,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: `${MUTED}90`,
              }}
            >
              Pure · Natural · Luxe
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
