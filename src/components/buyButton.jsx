import {useState, useRef, useEffect} from "react";
import {
  motion,
  useAnimationControls,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// BuyNowButton — Mindful Living KE · Overengineered Premium CTA
//
// USAGE:
//   import BuyNowButton from "./components/buyButton";
//   <BuyNowButton onClick={() => console.log("purchased!")} />
//
// PROPS:
//   label   — button text            (default: "Buy Now")
//   onClick — click handler
//   accent  — primary color override (default: Mindful Living green)
// ─────────────────────────────────────────────────────────────────────────────

// ── Brand palette ──
const GREEN = "#4A8C2A";
const GREEN_LIGHT = "#72B84A";
const GREEN_DARK = "#14280F";
const GREEN_PALE = "#E8F5E0";

export default function BuyNowButton({
  label = "Buy Now",
  onClick,
  accent = GREEN,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [particles, setParticles] = useState([]);
  const [leafTrail, setLeafTrail] = useState([]);
  const [magnetPos, setMagnetPos] = useState({x: 0, y: 0});
  const [glowPos, setGlowPos] = useState({x: "50%", y: "50%"});
  const [ripples, setRipples] = useState([]);
  const [orbiting, setOrbiting] = useState(false);

  const btnRef = useRef(null);
  const controls = useAnimationControls();
  const frameRef = useRef(null);
  const orbitAngle = useRef(0);
  const orbitRef = useRef(null);

  // ── Spring-physics magnetic pull ──
  const springX = useSpring(0, {stiffness: 180, damping: 18});
  const springY = useSpring(0, {stiffness: 180, damping: 18});

  // ── Orb glow that follows mouse inside button ──
  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();

    // Magnetic pull — button chases cursor slightly
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.14;
    const dy = (e.clientY - cy) * 0.14;
    springX.set(dx);
    springY.set(dy);

    // Inner glow follows exact cursor
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPos({x: `${px}%`, y: `${py}%`});
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
    setGlowPos({x: "50%", y: "50%"});
    setIsHovered(false);
  };

  // ── Orbiting dot animation ──
  useEffect(() => {
    if (!isHovered || hasClicked) {
      cancelAnimationFrame(frameRef.current);
      setOrbiting(false);
      return;
    }
    setOrbiting(true);
    const tick = () => {
      orbitAngle.current += 1.8;
      const rad = (orbitAngle.current * Math.PI) / 180;
      const rx = 88,
        ry = 22;
      if (orbitRef.current) {
        orbitRef.current.style.transform = `translate(${Math.cos(rad) * rx}px, ${Math.sin(rad) * ry}px)`;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isHovered, hasClicked]);

  // ── Leaf particle burst on click ──
  const spawnParticles = () => {
    // Gold-style circular burst
    const burst = Array.from({length: 16}, (_, i) => ({
      id: Date.now() + i,
      angle: (i / 16) * 360,
      distance: 52 + Math.random() * 36,
      size: 4 + Math.random() * 5,
      color: i % 2 === 0 ? GREEN : GREEN_LIGHT,
      duration: 0.55 + Math.random() * 0.35,
    }));

    // Organic leaf floaters
    const leaves = Array.from({length: 6}, (_, i) => ({
      id: Date.now() + 100 + i,
      x: (Math.random() - 0.5) * 120,
      y: -(40 + Math.random() * 60),
      rotate: (Math.random() - 0.5) * 180,
      delay: i * 0.06,
    }));

    setParticles(burst);
    setLeafTrail(leaves);
    setTimeout(() => {
      setParticles([]);
      setLeafTrail([]);
    }, 1000);
  };

  // ── Ripple on click ──
  const spawnRipple = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, {x, y, id}]);
    setTimeout(
      () => setRipples((prev) => prev.filter((r) => r.id !== id)),
      700,
    );
  };

  const handleClick = (e) => {
    setHasClicked(true);
    spawnParticles();
    spawnRipple(e);
    // Elastic wobble sequence
    controls.start({
      scale: [1, 0.88, 1.08, 0.96, 1.02, 1],
      transition: {duration: 0.6, ease: "easeInOut"},
    });
    setTimeout(() => setHasClicked(false), 2000);
    onClick?.();
  };

  // ─── Variants ───────────────────────────────────────────────────────────────

  // Shimmer sweep
  const shimmerVariants = {
    idle: {x: "-110%", opacity: 0},
    hovered: {
      x: ["-110%", "110%"],
      opacity: [0, 0.55, 0],
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 0.8,
      },
    },
  };

  // Double pulse rings
  const ring1 = {
    idle: {scale: 1, opacity: 0},
    hovered: {
      scale: [1, 1.2, 1.35],
      opacity: [0, 0.45, 0],
      transition: {
        duration: 1.3,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: 0.1,
      },
    },
  };
  const ring2 = {
    idle: {scale: 1, opacity: 0},
    hovered: {
      scale: [1, 1.35, 1.55],
      opacity: [0, 0.25, 0],
      transition: {
        duration: 1.3,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: 0.1,
        delay: 0.35,
      },
    },
  };
  // Third ultra-faint ring
  const ring3 = {
    idle: {scale: 1, opacity: 0},
    hovered: {
      scale: [1, 1.6, 1.85],
      opacity: [0, 0.12, 0],
      transition: {
        duration: 1.4,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: 0.1,
        delay: 0.65,
      },
    },
  };

  // Label swap
  const labelVariants = {
    idle: {y: 0, opacity: 1},
    hovered: {y: -2, opacity: 1},
    clicked: {y: -28, opacity: 0, transition: {duration: 0.2, ease: "easeIn"}},
  };
  const successVariants = {
    hidden: {y: 28, opacity: 0},
    visible: {
      y: 0,
      opacity: 1,
      transition: {duration: 0.32, ease: [0.16, 1, 0.3, 1]},
    },
    exit: {y: -28, opacity: 0, transition: {duration: 0.2}},
  };

  // Arrow
  const arrowVariants = {
    idle: {x: 0, opacity: 0.5},
    hovered: {
      x: 6,
      opacity: 1,
      transition: {duration: 0.35, ease: [0.16, 1, 0.3, 1]},
    },
    clicked: {x: 14, opacity: 0, transition: {duration: 0.18}},
  };

  // Leaf icon that bounces in on hover
  const leafIconVariants = {
    idle: {rotate: 0, scale: 0, opacity: 0},
    hovered: {
      rotate: -18,
      scale: 1,
      opacity: 1,
      transition: {type: "spring", stiffness: 300, damping: 14},
    },
    clicked: {rotate: 20, scale: 0, opacity: 0, transition: {duration: 0.15}},
  };

  const animState = hasClicked ? "clicked" : isHovered ? "hovered" : "idle";
  const ringState = isHovered && !hasClicked ? "hovered" : "idle";

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ── Triple pulse rings ── */}
      {[ring1, ring2, ring3].map((v, i) => (
        <motion.div
          key={i}
          variants={v}
          animate={ringState}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 16,
            border: `${1.5 - i * 0.4}px solid ${i === 0 ? GREEN : GREEN_LIGHT}`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── Orbiting dot (rAF-driven, zero re-render) ── */}
      {isHovered && !hasClicked && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 0,
            height: 0,
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          <div
            ref={orbitRef}
            style={{
              position: "absolute",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${GREEN_LIGHT}, ${GREEN})`,
              boxShadow: `0 0 8px ${GREEN}99`,
              transform: "translate(88px, 0)",
              marginLeft: -3.5,
              marginTop: -3.5,
            }}
          />
        </div>
      )}

      {/* ── Main button (magnetic spring) ── */}
      <motion.button
        ref={btnRef}
        animate={controls}
        style={{
          x: springX,
          y: springY,
          position: "relative",
          overflow: "hidden",
          padding: "17px 44px",
          borderRadius: 16,
          minWidth: 168,
          border: `1px solid ${isHovered ? GREEN + "99" : GREEN + "44"}`,
          // Gradient shifts on hover
          background: isHovered
            ? `linear-gradient(135deg, ${GREEN}1A 0%, ${GREEN_LIGHT}33 100%)`
            : `linear-gradient(135deg, ${GREEN_PALE} 0%, #C8E8A8 100%)`,
          cursor: "pointer",
          transition: "background 0.45s ease, border-color 0.45s ease",
          letterSpacing: "0.18em",
          fontWeight: 300,
          outline: "none",
          // Subtle inner shadow to give depth
          boxShadow: isHovered
            ? `0 10px 40px ${GREEN}44, 0 2px 10px ${GREEN}22, inset 0 1px 0 rgba(255,255,255,0.5)`
            : `0 2px 14px ${GREEN}1A, inset 0 1px 0 rgba(255,255,255,0.6)`,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onTapStart={() => setIsPressed(true)}
        onTap={() => setIsPressed(false)}
        onClick={handleClick}
        aria-label={label}
        whileTap={{scale: 0.94}}
      >
        {/* ── Radial glow that follows cursor ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 16,
            background: `radial-gradient(circle 60px at ${glowPos.x} ${glowPos.y}, ${GREEN}22, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        />

        {/* ── Shimmer sweep ── */}
        <motion.div
          variants={shimmerVariants}
          animate={isHovered && !hasClicked ? "hovered" : "idle"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "38%",
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${GREEN}55, transparent)`,
            transform: "skewX(-16deg)",
            pointerEvents: "none",
          }}
        />

        {/* ── Top edge glint ── */}
        <motion.div
          animate={
            isHovered
              ? {opacity: [0, 0.75, 0], x: ["0%", "100%"]}
              : {opacity: 0}
          }
          transition={
            isHovered
              ? {
                  duration: 1.2,
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
            width: "28%",
            height: 1,
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)`,
            pointerEvents: "none",
          }}
        />

        {/* ── Bottom edge glint (opposite direction, offset timing) ── */}
        <motion.div
          animate={
            isHovered ? {opacity: [0, 0.4, 0], x: ["100%", "0%"]} : {opacity: 0}
          }
          transition={
            isHovered
              ? {
                  duration: 1.2,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  ease: "easeInOut",
                  delay: 0.6,
                }
              : {}
          }
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "28%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${GREEN}80, transparent)`,
            pointerEvents: "none",
          }}
        />

        {/* ── Ripple waves ── */}
        {ripples.map(({x, y, id}) => (
          <motion.span
            key={id}
            initial={{width: 0, height: 0, opacity: 0.55, x, y}}
            animate={{
              width: 220,
              height: 220,
              opacity: 0,
              x: x - 110,
              y: y - 110,
            }}
            transition={{duration: 0.65, ease: "easeOut"}}
            style={{
              position: "absolute",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${GREEN}55, ${GREEN_LIGHT}22)`,
              pointerEvents: "none",
            }}
          />
        ))}

        {/* ── Label + icons row ── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            zIndex: 2,
          }}
        >
          {/* Leaf icon — bounces in from left on hover */}
          <motion.span
            variants={leafIconVariants}
            animate={animState}
            style={{display: "flex", alignItems: "center", color: GREEN}}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={GREEN}
              stroke={GREEN}
              strokeWidth="1"
            >
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 1.5-9.5 2.5A4 4 0 0013 9c1 0 2.5.5 2.5.5S15.5 7 17 8z" />
            </svg>
          </motion.span>

          {/* Text label */}
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
                    color: isHovered ? GREEN : "#1a1a1a",
                    fontWeight: 500,
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
                    color: GREEN,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  Added ✦
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Arrow */}
          {!hasClicked && (
            <motion.span
              variants={arrowVariants}
              animate={animState}
              style={{
                color: isHovered ? GREEN : "#1a1a1a",
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
                strokeWidth="1.6"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.span>
          )}
        </div>

        {/* ── Particle burst (circular) ── */}
        {particles.map(({id, angle, distance, size, color, duration}) => {
          const rad = (angle * Math.PI) / 180;
          const tx = Math.cos(rad) * distance;
          const ty = Math.sin(rad) * distance;
          return (
            <motion.div
              key={id}
              initial={{x: 0, y: 0, opacity: 1, scale: 1}}
              animate={{x: tx, y: ty, opacity: 0, scale: 0}}
              transition={{duration, ease: [0.16, 1, 0.3, 1]}}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: size,
                height: size,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 6px ${color}`,
                pointerEvents: "none",
                marginLeft: -size / 2,
                marginTop: -size / 2,
              }}
            />
          );
        })}

        {/* ── Leaf floaters (rise up on click) ── */}
        {leafTrail.map(({id, x, y, rotate, delay}) => (
          <motion.div
            key={id}
            initial={{x: 0, y: 0, opacity: 1, rotate: 0, scale: 1}}
            animate={{x, y, opacity: 0, rotate, scale: 0.4}}
            transition={{duration: 0.85, ease: [0.16, 1, 0.3, 1], delay}}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              pointerEvents: "none",
              color: GREEN_LIGHT,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill={GREEN_LIGHT}>
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 1.5-9.5 2.5A4 4 0 0013 9c1 0 2.5.5 2.5.5S15.5 7 17 8z" />
            </svg>
          </motion.div>
        ))}
      </motion.button>
    </div>
  );
}
