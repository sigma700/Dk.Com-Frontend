import {useState, useRef} from "react";
import {motion, useAnimationControls, AnimatePresence} from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// BuyNowButton — Premium luxury CTA button with complex Framer Motion animations
//
// USAGE:
//   import BuyNowButton from "./components/BuyNowButton";
//   <BuyNowButton onClick={() => console.log("purchased!")} />
//
// PROPS:
//   label     — button text (default: "Buy Now")
//   onClick   — click handler
//   accent    — primary gold color (default: "#C9A84C")
// ─────────────────────────────────────────────────────────────────────────────

export default function BuyNowButton({
  label = "Buy Now",
  onClick,
  accent = "#C9A84C",
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [particles, setParticles] = useState([]);
  const btnRef = useRef(null);

  // Spawn gold particle burst on click
  const spawnParticles = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const burst = Array.from({length: 12}, (_, i) => ({
      id: Date.now() + i,
      angle: (i / 12) * 360,
      distance: 48 + Math.random() * 32,
      size: 3 + Math.random() * 4,
    }));
    setParticles(burst);
    setTimeout(() => setParticles([]), 800);
  };

  const handleClick = (e) => {
    setHasClicked(true);
    spawnParticles(e);
    setTimeout(() => setHasClicked(false), 1800);
    onClick?.();
  };

  // Shimmer line position
  const shimmerVariants = {
    idle: {x: "-110%", opacity: 0},
    hovered: {
      x: ["−110%", "110%"],
      opacity: [0, 0.6, 0],
      transition: {
        duration: 0.75,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0.9,
      },
    },
  };

  // Outer ring pulse
  const ringVariants = {
    idle: {scale: 1, opacity: 0},
    hovered: {
      scale: [1, 1.18, 1.28],
      opacity: [0, 0.5, 0],
      transition: {
        duration: 1.2,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: 0.2,
      },
    },
  };

  // Second slower ring
  const ring2Variants = {
    idle: {scale: 1, opacity: 0},
    hovered: {
      scale: [1, 1.28, 1.44],
      opacity: [0, 0.3, 0],
      transition: {
        duration: 1.2,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: 0.2,
        delay: 0.3,
      },
    },
  };

  // Label slide up / success swap
  const labelVariants = {
    idle: {y: 0, opacity: 1},
    hovered: {y: -2, opacity: 1},
    clicked: {y: -24, opacity: 0, transition: {duration: 0.22, ease: "easeIn"}},
  };

  const successVariants = {
    hidden: {y: 24, opacity: 0},
    visible: {
      y: 0,
      opacity: 1,
      transition: {duration: 0.28, ease: [0.16, 1, 0.3, 1]},
    },
    exit: {y: -24, opacity: 0, transition: {duration: 0.22}},
  };

  // Arrow that slides right on hover
  const arrowVariants = {
    idle: {x: 0, opacity: 0.55},
    hovered: {
      x: 5,
      opacity: 1,
      transition: {duration: 0.35, ease: [0.16, 1, 0.3, 1]},
    },
    clicked: {x: 12, opacity: 0, transition: {duration: 0.2}},
  };

  const animState = hasClicked ? "clicked" : isHovered ? "hovered" : "idle";

  return (
    <div
      className="inline-flex items-center justify-center"
      style={{position: "relative"}}
    >
      {/* ── Outer pulse rings (appear on hover) ── */}
      <motion.div
        variants={ringVariants}
        animate={isHovered && !hasClicked ? "hovered" : "idle"}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 14,
          border: `1.5px solid ${accent}`,
          pointerEvents: "none",
        }}
      />
      <motion.div
        variants={ring2Variants}
        animate={isHovered && !hasClicked ? "hovered" : "idle"}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 14,
          border: `1px solid ${accent}`,
          pointerEvents: "none",
        }}
      />

      {/* ── Main button ── */}
      <motion.button
        ref={btnRef}
        className="relative overflow-hidden focus:outline-none"
        style={{
          padding: "18px 40px",
          borderRadius: 14,
          minWidth: 160,
          border: `1px solid ${isHovered ? accent : accent + "60"}`,
          background: isHovered
            ? `linear-gradient(135deg, ${accent}22 0%, ${accent}40 100%)`
            : `linear-gradient(135deg, #EDE5C8 0%, #D9C88A 100%)`,
          cursor: "pointer",
          transition: "background 0.4s ease, border-color 0.4s ease",
          letterSpacing: "0.18em",
          fontWeight: 300,
        }}
        // Scale & shadow spring on hover / press
        animate={{
          scale: hasClicked ? 0.95 : isHovered ? 1.04 : 1,
          boxShadow: hasClicked
            ? `0 0 0px ${accent}00`
            : isHovered
              ? `0 8px 32px ${accent}55, 0 2px 8px ${accent}33`
              : `0 2px 12px ${accent}22`,
        }}
        transition={{type: "spring", stiffness: 340, damping: 22}}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onTapStart={() => setIsPressed(true)}
        onTap={() => setIsPressed(false)}
        onClick={handleClick}
        aria-label={label}
      >
        {/* ── Shimmer sweep ── */}
        <motion.div
          variants={shimmerVariants}
          animate={isHovered && !hasClicked ? "hovered" : "idle"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "40%",
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
            transform: "skewX(-18deg)",
            pointerEvents: "none",
          }}
        />

        {/* ── Top edge glint ── */}
        <motion.div
          animate={
            isHovered ? {opacity: [0, 0.7, 0], x: ["0%", "100%"]} : {opacity: 0}
          }
          transition={
            isHovered
              ? {
                  duration: 1.1,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  ease: "easeInOut",
                }
              : {}
          }
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "30%",
            height: 1,
            background: `linear-gradient(90deg, transparent, #fff, transparent)`,
            pointerEvents: "none",
          }}
        />

        {/* ── Label + arrow row ── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {/* Text label — slides out on click, success slides in */}
          <div style={{position: "relative", overflow: "hidden", height: 22}}>
            <AnimatePresence mode="popLayout">
              {!hasClicked ? (
                <motion.span
                  key="label"
                  variants={labelVariants}
                  initial="idle"
                  animate={animState}
                  exit="clicked"
                  style={{
                    display: "block",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.28em",
                    color: isHovered ? accent : "#1A1410",
                    fontWeight: 400,
                    transition: "color 0.3s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </motion.span>
              ) : (
                <motion.span
                  key="success"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{
                    display: "block",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.28em",
                    color: accent,
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  Added ✦
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Arrow icon */}
          {!hasClicked && (
            <motion.span
              variants={arrowVariants}
              animate={animState}
              style={{
                color: isHovered ? accent : "#1A1410",
                display: "flex",
                alignItems: "center",
              }}
            >
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
            </motion.span>
          )}
        </div>

        {/* ── Particle burst ── */}
        {particles.map(({id, angle, distance, size}) => {
          const rad = (angle * Math.PI) / 180;
          const tx = Math.cos(rad) * distance;
          const ty = Math.sin(rad) * distance;
          return (
            <motion.div
              key={id}
              initial={{x: 0, y: 0, opacity: 1, scale: 1}}
              animate={{x: tx, y: ty, opacity: 0, scale: 0}}
              transition={{duration: 0.7, ease: [0.16, 1, 0.3, 1]}}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: size,
                height: size,
                borderRadius: "50%",
                background: accent,
                pointerEvents: "none",
                marginLeft: -size / 2,
                marginTop: -size / 2,
              }}
            />
          );
        })}
      </motion.button>
    </div>
  );
}
