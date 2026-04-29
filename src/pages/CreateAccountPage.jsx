import React, {useState, useRef, useEffect} from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import {Link, useNavigate} from "react-router-dom";
import {FaLeaf, FaRegMoneyBillAlt, FaTruck} from "react-icons/fa";
import {FaPersonCircleCheck} from "react-icons/fa6";
import {TbHealthRecognition} from "react-icons/tb";

// ── Brand Palette ──────────────────────────────────────────────
const GOLD = "#4A8C2A";
const GOLD_LIGHT = "#72B84A";
const GOLD_PALE = "#E8F5E0";
const CREAM = "#F7FBF4";
const DARK = "#1A1A1A";
const MUTED = "#5A7A4A";
const DARK_GREEN = "#14280F";
const GOLD_WARM = "#5BA535";

// ── Cursor Follower ────────────────────────────────────────────
const CursorFollower = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isOverInteractive, setIsOverInteractive] = useState(false);
  const springConfig = {damping: 28, stiffness: 180, mass: 0.6};
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
    };
    const over = (e) =>
      setIsOverInteractive(
        !!e.target.closest("button, a, input, [data-interactive]"),
      );
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: smoothX,
        top: smoothY,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: isOverInteractive
          ? `radial-gradient(circle, rgba(74,140,42,0.38) 0%, transparent 70%)`
          : `radial-gradient(circle, rgba(74,140,42,0.18) 0%, transparent 70%)`,
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "multiply",
        filter: "blur(2px)",
        scale: isOverInteractive ? 1.9 : 1,
        transition: "scale 0.3s ease, background 0.3s ease",
      }}
    />
  );
};

// ── Floating Particle ──────────────────────────────────────────
const Particle = ({delay, size, startX, startY, color}) => (
  <motion.div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      filter: `blur(${size / 3}px)`,
      pointerEvents: "none",
      left: `${startX}%`,
      top: `${startY}%`,
      zIndex: 0,
    }}
    animate={{
      x: [0, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60, 0],
      y: [0, -40 - Math.random() * 60, -80 - Math.random() * 40, 0],
      opacity: [0, 0.7, 0.4, 0],
      scale: [0.5, 1, 0.8, 0.3],
    }}
    transition={{
      duration: 8 + Math.random() * 6,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// ── Animated SectionLabel ──────────────────────────────────────
const SectionLabel = ({text}) => {
  const ref = useRef(null);
  const inView = useInView(ref, {once: true});
  return (
    <div
      ref={ref}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 24,
      }}
    >
      <motion.div
        initial={{scaleX: 0}}
        animate={inView ? {scaleX: 1} : {}}
        transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
        style={{
          width: 36,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${GOLD})`,
          transformOrigin: "left",
        }}
      />
      <motion.span
        initial={{opacity: 0}}
        animate={inView ? {opacity: 1} : {}}
        transition={{duration: 0.7, delay: 0.3}}
        style={{
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: MUTED,
        }}
      >
        {text}
      </motion.span>
      <motion.div
        initial={{scaleX: 0}}
        animate={inView ? {scaleX: 1} : {}}
        transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15}}
        style={{
          width: 36,
          height: 1,
          background: `linear-gradient(90deg, ${GOLD}, transparent)`,
          transformOrigin: "right",
        }}
      />
    </div>
  );
};

// ── Floating Input ─────────────────────────────────────────────
const FloatingInput = ({
  label,
  type = "text",
  value,
  onChange,
  icon,
  error,
  hint,
  inputRef,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const hasValue = value && value.length > 0;
  const isFloated = focused || hasValue;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [-30, 30], [1, -1]);
  const rotateY = useTransform(mx, [-30, 30], [-1, 1]);
  const fieldRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!fieldRef.current) return;
    const rect = fieldRef.current.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <div style={{position: "relative", marginBottom: 8}}>
      <motion.div
        ref={fieldRef}
        style={{rotateX, rotateY, transformStyle: "preserve-3d"}}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
      >
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{opacity: 0, scale: 0.9}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0}}
              style={{
                position: "absolute",
                inset: -5,
                borderRadius: 20,
                background: `radial-gradient(ellipse, rgba(74,140,42,0.14) 0%, transparent 70%)`,
                filter: "blur(8px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          )}
        </AnimatePresence>
        <motion.div
          animate={{
            borderColor: error
              ? "#C41E3A"
              : focused
                ? GOLD
                : "rgba(74,140,42,0.18)",
            background: focused
              ? "rgba(255,255,255,0.97)"
              : "rgba(255,255,255,0.65)",
            boxShadow: focused
              ? `0 0 0 4px rgba(74,140,42,0.1), 0 8px 32px -8px rgba(74,140,42,0.25), inset 0 1px 0 rgba(255,255,255,0.9)`
              : error
                ? `0 0 0 3px rgba(196,30,58,0.09)`
                : `0 2px 12px -4px rgba(74,140,42,0.08), inset 0 1px 0 rgba(255,255,255,0.7)`,
          }}
          transition={{duration: 0.25}}
          style={{
            position: "relative",
            borderRadius: 16,
            border: `1.5px solid rgba(74,140,42,0.18)`,
            backdropFilter: "blur(16px)",
            zIndex: 1,
          }}
        >
          <label
            style={{
              position: "absolute",
              left: icon ? 48 : 18,
              top: isFloated ? 9 : "50%",
              transform: isFloated ? "none" : "translateY(-50%)",
              fontSize: isFloated ? 9 : 13,
              fontWeight: isFloated ? 600 : 300,
              letterSpacing: isFloated ? "0.28em" : "0.02em",
              textTransform: isFloated ? "uppercase" : "none",
              color: error ? "#C41E3A" : isFloated ? GOLD : MUTED,
              transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            {label}
          </label>
          {icon && (
            <motion.div
              animate={{
                color: focused ? GOLD : MUTED,
                scale: focused ? 1.1 : 1,
              }}
              transition={{duration: 0.2}}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {icon}
            </motion.div>
          )}
          <input
            ref={inputRef}
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: "100%",
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: 14,
              color: DARK,
              fontFamily: "inherit",
              padding:
                isFloated || hasValue
                  ? `26px ${isPassword ? 48 : 18}px 10px ${icon ? 48 : 18}px`
                  : `18px ${isPassword ? 48 : 18}px 18px ${icon ? 48 : 18}px`,
              letterSpacing:
                isPassword && !showPassword && hasValue ? "0.18em" : "0.02em",
              boxSizing: "border-box",
              transition: "padding 0.2s",
              lineHeight: 1.8,
            }}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: MUTED,
                display: "flex",
                padding: 4,
              }}
            >
              {showPassword ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {(error || hint) && (
          <motion.p
            initial={{opacity: 0, y: -6, height: 0}}
            animate={{
              opacity: 1,
              y: 0,
              height: "auto",
              x: error ? [0, -4, 4, -3, 3, 0] : 0,
            }}
            exit={{opacity: 0, y: -4, height: 0}}
            transition={{duration: 0.35, x: {duration: 0.4, delay: 0.05}}}
            style={{
              fontSize: 10,
              color: error ? "#C41E3A" : MUTED,
              letterSpacing: "0.06em",
              margin: "6px 0 0 4px",
              fontWeight: error ? 500 : 300,
            }}
          >
            {error || hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Password Strength ──────────────────────────────────────────
const PasswordStrength = ({password}) => {
  const score = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#C41E3A", "#F5A623", GOLD, GOLD_LIGHT];
  if (!password) return null;
  return (
    <motion.div
      initial={{opacity: 0, y: -8}}
      animate={{opacity: 1, y: 0}}
      style={{marginBottom: 16}}
    >
      <div style={{display: "flex", gap: 5, marginBottom: 7}}>
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{scaleX: 0}}
            animate={{
              scaleX: 1,
              background: i <= score ? colors[score] : "rgba(74,140,42,0.1)",
              boxShadow: i <= score ? `0 0 8px ${colors[score]}55` : "none",
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.07,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            style={{
              flex: 1,
              height: 3.5,
              borderRadius: 100,
              transformOrigin: "left",
            }}
          />
        ))}
      </div>
      <div style={{display: "flex", alignItems: "center", gap: 8}}>
        <span
          style={{
            fontSize: 9,
            color: colors[score],
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          {labels[score]}
        </span>
        <AnimatePresence>
          {score === 4 && (
            <motion.svg
              initial={{scale: 0, rotate: -180, opacity: 0}}
              animate={{scale: 1, rotate: 0, opacity: 1}}
              exit={{scale: 0}}
              transition={{type: "spring", stiffness: 400, damping: 15}}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke={GOLD_LIGHT}
              strokeWidth="2.5"
            >
              <path d="M20 6L9 17l-5-5" />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ── Social Button ──────────────────────────────────────────────
const SocialButton = ({icon, label, onClick}) => {
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState([]);
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [
      ...r,
      {id, x: e.clientX - rect.left, y: e.clientY - rect.top},
    ]);
    setTimeout(() => setRipples((r) => r.filter((rip) => rip.id !== id)), 700);
    onClick?.();
  };
  return (
    <motion.button
      whileTap={{scale: 0.95, y: 1}}
      whileHover={{y: -2}}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleClick}
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        border: `1.5px solid ${hovered ? "rgba(74,140,42,0.4)" : "rgba(74,140,42,0.15)"}`,
        borderRadius: 14,
        padding: "12px 16px",
        background: hovered
          ? `linear-gradient(135deg, rgba(74,140,42,0.08) 0%, rgba(114,184,74,0.05) 100%)`
          : "rgba(255,255,255,0.65)",
        backdropFilter: "blur(12px)",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.1em",
        color: DARK,
        fontFamily: "inherit",
        transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: hovered
          ? `0 8px 24px -8px rgba(74,140,42,0.2), inset 0 1px 0 rgba(255,255,255,0.9)`
          : `0 2px 10px -4px rgba(74,140,42,0.08), inset 0 1px 0 rgba(255,255,255,0.8)`,
      }}
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{scale: 0, opacity: 0.4, x: r.x - 20, y: r.y - 20}}
          animate={{scale: 5, opacity: 0}}
          transition={{duration: 0.65, ease: "easeOut"}}
          style={{
            position: "absolute",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${GOLD_LIGHT}33, transparent)`,
            pointerEvents: "none",
          }}
        />
      ))}
      {icon}
      <span>{label}</span>
    </motion.button>
  );
};

// ── Confetti Leaf ──────────────────────────────────────────────
const ConfettiLeaf = ({x, angle, delay, color}) => (
  <motion.div
    initial={{y: 0, x: 0, opacity: 1, rotate: 0, scale: 1}}
    animate={{
      y: -160 - Math.random() * 100,
      x,
      opacity: 0,
      rotate: angle,
      scale: 0.3,
    }}
    transition={{
      duration: 1.4 + Math.random() * 0.5,
      delay,
      ease: [0.16, 1, 0.3, 1],
    }}
    style={{
      position: "absolute",
      width: 10,
      height: 10,
      borderRadius: "0 50% 50% 0",
      background: color,
      transformOrigin: "left center",
      pointerEvents: "none",
    }}
  />
);

// ── Char-by-char text ──────────────────────────────────────────
const AnimatedText = ({text, stagger = 0.035}) => (
  <span style={{display: "inline-flex", flexWrap: "wrap"}}>
    {text.split("").map((char, i) => (
      <motion.span
        key={i}
        initial={{opacity: 0, y: 18, filter: "blur(4px)"}}
        animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
        transition={{
          duration: 0.45,
          delay: i * stagger,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          display: "inline-block",
          whiteSpace: char === " " ? "pre" : "normal",
        }}
      >
        {char}
      </motion.span>
    ))}
  </span>
);

// ── Three-dot loader ───────────────────────────────────────────
const ThreeDots = () => (
  <span style={{display: "inline-flex", gap: 5, alignItems: "center"}}>
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        animate={{y: [0, -6, 0], opacity: [0.5, 1, 0.5]}}
        transition={{
          duration: 0.7,
          repeat: Infinity,
          delay: i * 0.15,
          ease: "easeInOut",
        }}
        style={{
          display: "inline-block",
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#fff",
        }}
      />
    ))}
  </span>
);

// ── Main ───────────────────────────────────────────────────────
const CreateAccountPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const sidebarRef = useRef(null);
  const isHeroInView = useInView(heroRef, {once: true});
  const isSidebarInView = useInView(sidebarRef, {once: true});

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const orb1X = useTransform(mouseX, [0, 1], [-22, 22]);
  const orb1Y = useTransform(mouseY, [0, 1], [-16, 16]);
  const orb2X = useTransform(mouseX, [0, 1], [16, -16]);
  const orb2Y = useTransform(mouseY, [0, 1], [12, -12]);

  useEffect(() => {
    const fn = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const set = (field) => (e) => {
    setForm((f) => ({...f, [field]: e.target.value}));
    if (errors[field]) setErrors((err) => ({...err, [field]: ""}));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (!form.confirmPassword)
      e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords don't match";
    if (!agreed) e.agreed = "Please accept the terms to continue";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setShowConfetti(true);
    setTimeout(() => {
      setSubmitted(true);
      setShowConfetti(false);
    }, 600);
  };

  const particles = Array.from({length: 10}, (_, i) => ({
    delay: i * 0.5,
    size: 3 + Math.random() * 5,
    startX: Math.random() * 100,
    startY: 20 + Math.random() * 75,
    color: [
      "rgba(74,140,42,0.55)",
      "rgba(114,184,74,0.45)",
      "rgba(168,216,120,0.4)",
    ][i % 3],
  }));

  const confettiPieces = Array.from({length: 18}, (_, i) => ({
    x: (Math.random() - 0.5) * 280,
    angle: Math.random() * 720 - 360,
    delay: i * 0.04,
    color: [GOLD, GOLD_LIGHT, "#A8D878", GOLD_PALE, "#C5E4AC"][i % 5],
  }));

  const benefitVariants = {
    hidden: {},
    visible: {transition: {staggerChildren: 0.11, delayChildren: 0.55}},
  };
  const benefitItem = {
    hidden: {opacity: 0, x: -28, filter: "blur(4px)"},
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {duration: 0.65, ease: [0.16, 1, 0.3, 1]},
    },
  };

  return (
    <>
      <CursorFollower />
      <main
        style={{
          background: CREAM,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&display=swap');
          @keyframes shimmer-text { 0%,100%{background-position:0% center} 50%{background-position:100% center} }
          @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes bg-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
          @keyframes pulse-ring { 0%,100%{opacity:0.14;transform:scale(1)} 50%{opacity:0.32;transform:scale(1.05)} }
          @keyframes grain {
            0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)} 20%{transform:translate(2%,2%)}
            30%{transform:translate(-1%,3%)} 40%{transform:translate(3%,-1%)} 50%{transform:translate(-2%,2%)}
            60%{transform:translate(1%,-3%)} 70%{transform:translate(-3%,1%)} 80%{transform:translate(2%,3%)} 90%{transform:translate(-1%,-2%)}
          }
          * { cursor: none !important; }
          .create-account-grid { display:grid; grid-template-columns:1fr 1fr; min-height:100vh; }
          .page-grain::after {
            content:''; position:fixed; inset:-50%; width:200%; height:200%;
            background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            opacity:0.025; pointer-events:none; z-index:9998; animation:grain 8s steps(10) infinite;
          }
          @media (max-width:900px) {
            .create-account-grid { grid-template-columns:1fr !important; }
            .sidebar-panel { display:none !important; }
            .form-panel { padding:40px 24px 60px !important; }
            .name-row { grid-template-columns:1fr !important; }
          }
        `}</style>

        {/* Grain overlay */}
        <div
          className="page-grain"
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 9998,
          }}
        />

        {/* Center seam glow */}
        <div
          style={{
            position: "fixed",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 1,
            background: `linear-gradient(to bottom, transparent 0%, ${GOLD}44 30%, ${GOLD_LIGHT}33 55%, ${GOLD}33 75%, transparent 100%)`,
            zIndex: 10,
            pointerEvents: "none",
            filter: "blur(1px)",
          }}
        />

        <div className="create-account-grid">
          {/* ── LEFT SIDEBAR ── */}
          <motion.div
            ref={sidebarRef}
            initial={{x: -80, opacity: 0, filter: "blur(10px)"}}
            animate={
              isSidebarInView ? {x: 0, opacity: 1, filter: "blur(0px)"} : {}
            }
            transition={{duration: 1.05, ease: [0.16, 1, 0.3, 1]}}
            className="sidebar-panel"
            style={{
              background: `radial-gradient(circle at 70% 25%, #1A4012 0%, ${DARK_GREEN} 48%, #0D1F0A 100%)`,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "52px 56px",
            }}
          >
            {/* Grid texture */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `linear-gradient(rgba(114,184,74,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(114,184,74,0.03) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
                pointerEvents: "none",
              }}
            />

            {/* Parallax orbs */}
            <motion.div
              style={{
                x: orb1X,
                y: orb1Y,
                position: "absolute",
                top: "-22%",
                right: "-12%",
                width: 520,
                height: 520,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(74,140,42,0.22) 0%, transparent 68%)",
                pointerEvents: "none",
              }}
            />
            <motion.div
              style={{
                x: orb2X,
                y: orb2Y,
                position: "absolute",
                bottom: "6%",
                left: "-10%",
                width: 280,
                height: 280,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(114,184,74,0.16) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* Dashed rings */}
            {[
              {
                size: 320,
                pos: {bottom: "5%", right: "-15%"},
                dur: "48s",
                op: 0.22,
                dir: "normal",
              },
              {
                size: 180,
                pos: {top: "12%", left: "-10%"},
                dur: "32s",
                op: 0.15,
                dir: "reverse",
              },
              {
                size: 90,
                pos: {top: "54%", right: "14%"},
                dur: "20s",
                op: 0.11,
                dir: "normal",
              },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: r.size,
                  height: r.size,
                  borderRadius: "50%",
                  border: `1px dashed rgba(114,184,74,${r.op})`,
                  ...r.pos,
                  pointerEvents: "none",
                  animation: `spin-slow ${r.dur} linear infinite ${r.dir}, pulse-ring ${6 + i * 2.5}s ease-in-out infinite`,
                }}
              />
            ))}

            {/* Sidebar particles */}
            {particles.map((p, i) => (
              <Particle key={i} {...p} />
            ))}

            {/* Content */}
            <div style={{position: "relative", zIndex: 2}}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 56,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: `1.5px solid rgba(114,184,74,0.5)`,
                    background: "rgba(74,140,42,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={GOLD_LIGHT}
                    strokeWidth="1.4"
                  >
                    <path d="M12 3C8 3 4 6 4 11c0 3.5 2 6.5 5 8v2h6v-2c3-1.5 5-4.5 5-8 0-5-4-8-8-8z" />
                    <path d="M9 21h6M12 3v4M8 5l2 3M16 5l-2 3" />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 18,
                    fontWeight: 400,
                    color: CREAM,
                    letterSpacing: "0.05em",
                  }}
                >
                  Mindful Living Ke
                </span>
              </div>

              <SectionLabel text="Join the Community" />

              <motion.h2
                initial={{opacity: 0, y: 28, filter: "blur(8px)"}}
                animate={
                  isSidebarInView ? {opacity: 1, y: 0, filter: "blur(0px)"} : {}
                }
                transition={{duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1]}}
                style={{
                  fontFamily: "'Playfair Display','Georgia',serif",
                  fontSize: "clamp(28px, 2.6vw, 42px)",
                  fontWeight: 300,
                  color: CREAM,
                  margin: "0 0 18px",
                  lineHeight: 1.18,
                  letterSpacing: "-0.01em",
                }}
              >
                Take your{" "}
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
                  Health
                </em>{" "}
                seriously
              </motion.h2>

              <motion.p
                initial={{opacity: 0}}
                animate={isSidebarInView ? {opacity: 1} : {}}
                transition={{duration: 0.8, delay: 0.4}}
                style={{
                  fontSize: 13,
                  color: "rgba(247,251,244,0.5)",
                  fontWeight: 300,
                  lineHeight: 1.95,
                  maxWidth: 340,
                  marginBottom: 52,
                }}
              >
                Join the vast community of thousands who trust our products for
                a healthier, more intentional life.
              </motion.p>

              <motion.div
                variants={benefitVariants}
                initial="hidden"
                animate={isSidebarInView ? "visible" : "hidden"}
              >
                {[
                  {
                    icon: <FaRegMoneyBillAlt />,
                    text: "Get informed of seasonal discounts",
                  },
                  {
                    icon: <FaPersonCircleCheck />,
                    text: "Personalised wellness recommendations",
                  },
                  {
                    icon: <TbHealthRecognition />,
                    text: "Members-only bundles & savings",
                  },
                  {
                    icon: <FaTruck />,
                    text: "Free shipping on orders above Ksh 2,500",
                  },
                ].map(({icon, text}, i) => (
                  <motion.div
                    key={i}
                    variants={benefitItem}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "rgba(74,140,42,0.18)",
                        border: `1px solid rgba(114,184,74,0.28)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        color: GOLD_LIGHT,
                        flexShrink: 0,
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {icon}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: "rgba(247,251,244,0.62)",
                        fontWeight: 300,
                        lineHeight: 1.55,
                      }}
                    >
                      {text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Testimonial – 3D flip card */}
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={isSidebarInView ? {opacity: 1, y: 0} : {}}
              transition={{duration: 0.8, delay: 0.9}}
              style={{position: "relative", zIndex: 2, perspective: 900}}
            >
              <motion.div
                whileHover={{rotateY: 8, rotateX: -4, scale: 1.018}}
                transition={{type: "spring", stiffness: 200, damping: 20}}
                style={{
                  background: "rgba(20,40,15,0.38)",
                  backdropFilter: "blur(14px)",
                  borderRadius: 20,
                  padding: "24px 24px 20px",
                  border: `1px solid rgba(114,184,74,0.12)`,
                  boxShadow:
                    "0 8px 32px -8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    color: GOLD_LIGHT,
                    marginBottom: 10,
                    opacity: 0.55,
                  }}
                >
                  "
                </div>
                <p
                  style={{
                    fontSize: 12.5,
                    color: "rgba(247,251,244,0.48)",
                    fontStyle: "italic",
                    fontFamily: "'Playfair Display', serif",
                    lineHeight: 1.8,
                    marginBottom: 16,
                  }}
                >
                  Mindful Living Ke changed my entire morning routine. The
                  frankincense oil is unlike anything I've tried before.
                </p>
                <div style={{display: "flex", alignItems: "center", gap: 12}}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#fff",
                      boxShadow: `0 4px 12px ${GOLD}55`,
                    }}
                  >
                    A
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: GOLD_LIGHT,
                        letterSpacing: "0.14em",
                      }}
                    >
                      Amara K.
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "rgba(247,251,244,0.28)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Nairobi · Member since 2025
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT FORM PANEL ── */}
          <motion.div
            ref={heroRef}
            initial={{x: 80, opacity: 0, filter: "blur(10px)"}}
            animate={
              isHeroInView ? {x: 0, opacity: 1, filter: "blur(0px)"} : {}
            }
            transition={{duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.1}}
            className="form-panel"
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "52px 64px",
              overflow: "hidden",
              background: `radial-gradient(ellipse at 80% 20%, rgba(114,184,74,0.08) 0%, transparent 58%), radial-gradient(ellipse at 20% 80%, rgba(74,140,42,0.06) 0%, transparent 52%), ${CREAM}`,
            }}
          >
            {/* Glass card */}
            <div
              style={{
                position: "absolute",
                inset: "20px",
                borderRadius: 32,
                background: "rgba(247,251,244,0.52)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.72)",
                borderBottom: "1px solid rgba(74,140,42,0.1)",
                borderRight: "1px solid rgba(74,140,42,0.08)",
                boxShadow: `0 32px 80px -24px rgba(74,140,42,0.13), 0 8px 32px -8px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(74,140,42,0.07)`,
                pointerEvents: "none",
              }}
            />

            {/* Right panel particles */}
            {particles.slice(0, 5).map((p, i) => (
              <Particle
                key={`r${i}`}
                {...p}
                size={p.size * 0.65}
                delay={p.delay + 1.5}
                startX={8 + i * 18}
                startY={5 + i * 18}
              />
            ))}

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{
                    opacity: 0,
                    scale: 0.88,
                    y: 32,
                    filter: "blur(10px)",
                  }}
                  animate={{opacity: 1, scale: 1, y: 0, filter: "blur(0px)"}}
                  transition={{duration: 0.85, ease: [0.16, 1, 0.3, 1]}}
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginBottom: 32,
                    }}
                  >
                    <motion.div
                      initial={{scale: 0, rotate: -45}}
                      animate={{scale: 1, rotate: 0}}
                      transition={{
                        delay: 0.15,
                        type: "spring",
                        stiffness: 250,
                        damping: 18,
                      }}
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${GOLD_PALE} 0%, rgba(114,184,74,0.2) 100%)`,
                        border: `2px solid ${GOLD}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 34,
                        color: GOLD,
                        margin: "0 auto",
                        boxShadow: `0 0 0 8px rgba(74,140,42,0.08), 0 0 0 16px rgba(74,140,42,0.04), 0 16px 48px -16px rgba(74,140,42,0.35)`,
                      }}
                    >
                      <motion.div
                        animate={{rotate: [0, 9, -9, 0], scale: [1, 1.12, 1]}}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <FaLeaf />
                      </motion.div>
                    </motion.div>
                    {showConfetti &&
                      confettiPieces.map((c, i) => (
                        <ConfettiLeaf key={i} {...c} />
                      ))}
                    {[1, 2, 3].map((n) => (
                      <motion.div
                        key={n}
                        initial={{scale: 1, opacity: 0.55}}
                        animate={{scale: 1 + n * 0.5, opacity: 0}}
                        transition={{
                          duration: 1.5,
                          delay: n * 0.25,
                          repeat: Infinity,
                        }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          border: `1px solid ${GOLD}`,
                          pointerEvents: "none",
                        }}
                      />
                    ))}
                  </div>

                  <h2
                    style={{
                      fontFamily: "'Playfair Display','Georgia',serif",
                      fontSize: 34,
                      fontWeight: 300,
                      color: DARK,
                      margin: "0 0 14px",
                      lineHeight: 1.2,
                    }}
                  >
                    <AnimatedText text="Your Journey " />
                    <em style={{fontStyle: "italic", color: GOLD}}>
                      <AnimatedText text="Awaits" stagger={0.065} />
                    </em>
                  </h2>
                  <motion.p
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.85}}
                    style={{
                      fontSize: 13,
                      color: MUTED,
                      fontWeight: 300,
                      lineHeight: 1.9,
                      marginBottom: 40,
                    }}
                  >
                    Welcome, {form.firstName}! We've sent a confirmation to{" "}
                    <strong style={{color: GOLD}}>{form.email}</strong>. Check
                    your inbox to activate your account.
                  </motion.p>
                  <motion.button
                    whileTap={{scale: 0.95}}
                    whileHover={{
                      y: -2,
                      boxShadow: `0 0 0 6px rgba(74,140,42,0.12), 0 12px 36px -8px rgba(74,140,42,0.5)`,
                    }}
                    initial={{opacity: 0, y: 16}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 1.05}}
                    onClick={() => navigate("/")}
                    style={{
                      background: `linear-gradient(135deg, ${GOLD} 0%, ${DARK_GREEN} 100%)`,
                      border: "none",
                      borderRadius: 100,
                      padding: "14px 40px",
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      color: "#fff",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      boxShadow: `0 8px 32px -8px rgba(74,140,42,0.45)`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    Explore
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{opacity: 0, y: 24}}
                  animate={isHeroInView ? {opacity: 1, y: 0} : {}}
                  transition={{
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.2,
                  }}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    maxWidth: 480,
                    width: "100%",
                  }}
                >
                  <motion.div
                    whileHover={{x: -2}}
                    style={{display: "inline-flex"}}
                  >
                    <Link
                      to="/"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 10,
                        color: MUTED,
                        textDecoration: "none",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                        marginBottom: 36,
                        opacity: 0.7,
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "0.7")
                      }
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Back to Shop
                    </Link>
                  </motion.div>

                  <SectionLabel text="Create Account" />

                  <h1
                    style={{
                      fontFamily: "'Playfair Display','Georgia',serif",
                      fontSize: "clamp(28px, 3vw, 38px)",
                      fontWeight: 300,
                      color: DARK,
                      margin: "0 0 8px",
                      lineHeight: 1.12,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Begin Your{" "}
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
                      Ritual
                    </em>
                  </h1>
                  <p
                    style={{
                      fontSize: 13,
                      color: MUTED,
                      fontWeight: 300,
                      marginBottom: 32,
                      lineHeight: 1.85,
                    }}
                  >
                    Create your account and discover Kenya's finest botanicals.
                  </p>

                  <div style={{display: "flex", gap: 10, marginBottom: 28}}>
                    <SocialButton
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                      }
                      label="Google"
                    />
                    <SocialButton
                      icon={
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={DARK}
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      }
                      label="Facebook"
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 28,
                    }}
                  >
                    <motion.div
                      initial={{scaleX: 0}}
                      animate={{scaleX: 1}}
                      transition={{duration: 0.8, delay: 0.5}}
                      style={{
                        flex: 1,
                        height: 1,
                        background: `linear-gradient(90deg, transparent, rgba(74,140,42,0.2))`,
                        transformOrigin: "left",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 9,
                        color: MUTED,
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      or with email
                    </span>
                    <motion.div
                      initial={{scaleX: 0}}
                      animate={{scaleX: 1}}
                      transition={{duration: 0.8, delay: 0.5}}
                      style={{
                        flex: 1,
                        height: 1,
                        background: `linear-gradient(90deg, rgba(74,140,42,0.2), transparent)`,
                        transformOrigin: "right",
                      }}
                    />
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    <div
                      className="name-row"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        marginBottom: 6,
                      }}
                    >
                      <FloatingInput
                        label="First Name"
                        value={form.firstName}
                        onChange={set("firstName")}
                        error={errors.firstName}
                        icon={
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        }
                      />
                      <FloatingInput
                        label="Last Name"
                        value={form.lastName}
                        onChange={set("lastName")}
                        error={errors.lastName}
                      />
                    </div>

                    <div style={{marginBottom: 6}}>
                      <FloatingInput
                        label="Email Address"
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        error={errors.email}
                        icon={
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        }
                      />
                    </div>

                    <div style={{marginBottom: 4}}>
                      <FloatingInput
                        label="Password"
                        type="password"
                        value={form.password}
                        onChange={set("password")}
                        error={errors.password}
                        hint={
                          !errors.password && !form.password
                            ? "At least 8 characters"
                            : ""
                        }
                        icon={
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <rect
                              x="3"
                              y="11"
                              width="18"
                              height="11"
                              rx="2"
                              ry="2"
                            />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        }
                      />
                    </div>

                    <PasswordStrength password={form.password} />

                    <div style={{marginBottom: 20}}>
                      <FloatingInput
                        label="Confirm Password"
                        type="password"
                        value={form.confirmPassword}
                        onChange={set("confirmPassword")}
                        error={errors.confirmPassword}
                        icon={
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                        }
                      />
                    </div>

                    <div style={{marginBottom: 24}}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                        }}
                      >
                        <motion.div
                          data-interactive
                          onClick={() => {
                            setAgreed((a) => !a);
                            if (errors.agreed)
                              setErrors((e) => ({...e, agreed: ""}));
                          }}
                          whileTap={{scale: 0.85}}
                          animate={{
                            background: agreed ? GOLD : "transparent",
                            borderColor: errors.agreed
                              ? "#C41E3A"
                              : agreed
                                ? GOLD
                                : "rgba(74,140,42,0.3)",
                            boxShadow: agreed
                              ? `0 4px 14px -4px ${GOLD}66`
                              : "none",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                          }}
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 7,
                            border: "1.5px solid rgba(74,140,42,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: 1,
                            cursor: "pointer",
                          }}
                        >
                          <AnimatePresence>
                            {agreed && (
                              <motion.svg
                                initial={{scale: 0, rotate: -90, opacity: 0}}
                                animate={{scale: 1, rotate: 0, opacity: 1}}
                                exit={{scale: 0, rotate: 90, opacity: 0}}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 20,
                                }}
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="3"
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </motion.svg>
                            )}
                          </AnimatePresence>
                        </motion.div>
                        <span
                          style={{
                            fontSize: 12,
                            color: MUTED,
                            fontWeight: 300,
                            lineHeight: 1.7,
                          }}
                        >
                          I agree to Mindful Living Ke's{" "}
                          <Link
                            to="/terms"
                            style={{
                              color: GOLD,
                              textDecoration: "none",
                              fontWeight: 500,
                              borderBottom: `1px solid ${GOLD}55`,
                            }}
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            to="/privacy"
                            style={{
                              color: GOLD,
                              textDecoration: "none",
                              fontWeight: 500,
                              borderBottom: `1px solid ${GOLD}55`,
                            }}
                          >
                            Privacy Policy
                          </Link>
                          . I consent to receive wellness updates and exclusive
                          offers.
                        </span>
                      </div>
                      <AnimatePresence>
                        {errors.agreed && (
                          <motion.p
                            initial={{opacity: 0, y: -6, height: 0}}
                            animate={{opacity: 1, y: 0, height: "auto"}}
                            exit={{opacity: 0, y: -4, height: 0}}
                            style={{
                              fontSize: 10,
                              color: "#C41E3A",
                              marginTop: 7,
                              marginLeft: 34,
                              fontWeight: 500,
                              letterSpacing: "0.06em",
                            }}
                          >
                            {errors.agreed}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.button
                      type="submit"
                      whileTap={{scale: 0.96, y: 1}}
                      whileHover={{
                        y: -2,
                        boxShadow: `0 16px 48px -12px rgba(74,140,42,0.55), 0 4px 16px -4px rgba(0,0,0,0.1)`,
                      }}
                      disabled={loading}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        background: `linear-gradient(135deg, ${GOLD_WARM} 0%, ${GOLD} 40%, ${DARK_GREEN} 100%)`,
                        border: "none",
                        borderRadius: 16,
                        padding: "16px 28px",
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: "0.32em",
                        textTransform: "uppercase",
                        color: "#fff",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                        transition: "box-shadow 0.3s ease",
                        boxShadow: `0 8px 28px -8px rgba(74,140,42,0.42), inset 0 1px 0 rgba(255,255,255,0.18)`,
                        marginBottom: 20,
                        opacity: loading ? 0.85 : 1,
                        willChange: "transform",
                      }}
                    >
                      {loading ? (
                        <ThreeDots />
                      ) : (
                        <>
                          Create Account
                          <motion.svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            animate={{x: [0, 3, 0]}}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </motion.svg>
                        </>
                      )}
                    </motion.button>

                    <p
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        color: MUTED,
                        fontWeight: 300,
                        lineHeight: 1.8,
                      }}
                    >
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        style={{
                          color: GOLD,
                          fontWeight: 500,
                          textDecoration: "none",
                          position: "relative",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = GOLD_LIGHT)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = GOLD)
                        }
                      >
                        <motion.span style={{position: "relative"}}>
                          Sign in
                          <motion.span
                            initial={{scaleX: 0}}
                            whileHover={{scaleX: 1}}
                            style={{
                              position: "absolute",
                              bottom: -1,
                              left: 0,
                              right: 0,
                              height: 1,
                              background: GOLD_LIGHT,
                              transformOrigin: "left",
                              display: "block",
                            }}
                          />
                        </motion.span>
                      </Link>
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default CreateAccountPage;
