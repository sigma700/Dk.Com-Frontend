import React, {useState, useRef, useEffect} from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {Link, useNavigate} from "react-router-dom";
import {FaRegMoneyBillAlt, FaTruck} from "react-icons/fa";
import {FaPersonCircleCheck} from "react-icons/fa6";
import {TbHealthRecognition} from "react-icons/tb";
import useAuthStore from "../stores/authStore";

// ── Brand Palette (same as CreateAccountPage) ─────────────────
const GOLD = "#4A8C2A";
const GOLD_LIGHT = "#72B84A";
const CREAM = "#F7FBF4";
const DARK = "#1A1A1A";
const MUTED = "#5A7A4A";
const DARK_GREEN = "#14280F";
const GOLD_WARM = "#5BA535";

// ── Floating Particle (unchanged) ─────────────────────────────
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

// ── SectionLabel (unchanged) ──────────────────────────────────
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

// ── FloatingInput (same as before, but without password toggle if not needed) ──
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
            type={type}
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
              padding: isFloated
                ? `26px 18px 10px ${icon ? 48 : 18}px`
                : `18px 18px 18px ${icon ? 48 : 18}px`,
              boxSizing: "border-box",
              transition: "padding 0.2s",
              lineHeight: 1.8,
            }}
          />
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

// ── SocialButton (unchanged) ──────────────────────────────────
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
        border: `1.5px solid ${
          hovered ? "rgba(74,140,42,0.4)" : "rgba(74,140,42,0.15)"
        }`,
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

// ── Three-dot loader (reused) ─────────────────────────────────
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

// ── Main Login Page ───────────────────────────────────────────
const LoginPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const sidebarRef = useRef(null);
  const isHeroInView = useInView(heroRef, {once: true});
  const isSidebarInView = useInView(sidebarRef, {once: true});

  const {login, isLoading, error: authError, clearError} = useAuthStore();

  const [form, setForm] = useState({email: "", password: ""});
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [generalError, setGeneralError] = useState("");

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

  useEffect(() => {
    if (authError) {
      setGeneralError(authError);
      const timer = setTimeout(() => {
        clearError();
        setGeneralError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [authError, clearError]);

  const setField = (field) => (e) => {
    setForm((f) => ({...f, [field]: e.target.value}));
    if (errors[field]) setErrors((err) => ({...err, [field]: ""}));
    if (generalError) setGeneralError("");
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const result = await login({
      email: form.email,
      password: form.password,
      rememberMe,
    });
    if (result.success) {
      navigate("/"); // or wherever you want after login
    } else {
      setGeneralError(result.error || "Login failed. Please try again.");
    }
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
        @keyframes pulse-ring { 0%,100%{opacity:0.14;transform:scale(1)} 50%{opacity:0.32;transform:scale(1.05)} }
        @keyframes grain {
          0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)} 20%{transform:translate(2%,2%)}
          30%{transform:translate(-1%,3%)} 40%{transform:translate(3%,-1%)} 50%{transform:translate(-2%,2%)}
          60%{transform:translate(1%,-3%)} 70%{transform:translate(-3%,1%)} 80%{transform:translate(2%,3%)} 90%{transform:translate(-1%,-2%)}
        }
        .login-grid { display:grid; grid-template-columns:1fr 1fr; min-height:100vh; }
        .page-grain::after {
          content:''; position:fixed; inset:-50%; width:200%; height:200%;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity:0.025; pointer-events:none; z-index:9998; animation:grain 8s steps(10) infinite;
        }
        @media (max-width:900px) {
          .login-grid { grid-template-columns:1fr !important; }
          .sidebar-panel { display:none !important; }
          .form-panel { padding:40px 24px 60px !important; }
        }
      `}</style>

      <div
        className="page-grain"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />

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

      <div className="login-grid">
        {/* LEFT SIDEBAR - same content as CreateAccountPage */}
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
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(rgba(114,184,74,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(114,184,74,0.03) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }}
          />
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
                animation: `spin-slow ${r.dur} linear infinite ${r.dir}, pulse-ring ${
                  6 + i * 2.5
                }s ease-in-out infinite`,
              }}
            />
          ))}
          {particles.map((p, i) => (
            <Particle key={i} {...p} />
          ))}
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

            <SectionLabel text="Welcome Back" />

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
              Continue your{" "}
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
                Wellness
              </em>{" "}
              Journey
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
              Access your account, track orders, and discover personalised
              wellness recommendations.
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

        {/* RIGHT FORM PANEL - Login specific */}
        <motion.div
          ref={heroRef}
          initial={{x: 80, opacity: 0, filter: "blur(10px)"}}
          animate={isHeroInView ? {x: 0, opacity: 1, filter: "blur(0px)"} : {}}
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

          <motion.div
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
            <motion.div whileHover={{x: -2}} style={{display: "inline-flex"}}>
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
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
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

            <SectionLabel text="Sign In" />

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
              Welcome{" "}
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
                Back
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
              Sign in to access your account and continue your wellness journey.
            </p>

            {generalError && (
              <motion.div
                initial={{opacity: 0, y: -8}}
                animate={{opacity: 1, y: 0}}
                style={{
                  background: "rgba(196,30,58,0.08)",
                  border: `1px solid #C41E3A55`,
                  borderRadius: 12,
                  padding: "12px 16px",
                  marginBottom: 24,
                  fontSize: 11,
                  color: "#C41E3A",
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                {generalError}
              </motion.div>
            )}

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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={DARK}>
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
              <div style={{marginBottom: 20}}>
                <FloatingInput
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={setField("email")}
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

              <div style={{marginBottom: 12}}>
                <FloatingInput
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={setField("password")}
                  error={errors.password}
                  icon={
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <motion.div
                    onClick={() => setRememberMe(!rememberMe)}
                    whileTap={{scale: 0.85}}
                    animate={{
                      background: rememberMe ? GOLD : "transparent",
                      borderColor: rememberMe ? GOLD : "rgba(74,140,42,0.3)",
                    }}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      border: "1.5px solid rgba(74,140,42,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <AnimatePresence>
                      {rememberMe && (
                        <motion.svg
                          initial={{scale: 0}}
                          animate={{scale: 1}}
                          exit={{scale: 0}}
                          width="10"
                          height="10"
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
                      fontSize: 11,
                      color: MUTED,
                      fontWeight: 400,
                    }}
                  >
                    Remember me
                  </span>
                </div>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: 11,
                    color: GOLD,
                    textDecoration: "none",
                    fontWeight: 500,
                    letterSpacing: "0.03em",
                    borderBottom: `1px solid ${GOLD}55`,
                  }}
                >
                  Forgot password?
                </Link>
              </div>

              <motion.button
                type="submit"
                whileTap={{scale: 0.96, y: 1}}
                whileHover={{
                  y: -2,
                  boxShadow: `0 16px 48px -12px rgba(74,140,42,0.55), 0 4px 16px -4px rgba(0,0,0,0.1)`,
                }}
                disabled={isLoading}
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
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  transition: "box-shadow 0.3s ease",
                  boxShadow: `0 8px 28px -8px rgba(74,140,42,0.42), inset 0 1px 0 rgba(255,255,255,0.18)`,
                  marginBottom: 20,
                  opacity: isLoading ? 0.85 : 1,
                  willChange: "transform",
                }}
              >
                {isLoading ? (
                  <ThreeDots />
                ) : (
                  <>
                    Sign In
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
                Don't have an account?{" "}
                <Link
                  to="/create-acc"
                  style={{
                    color: GOLD,
                    fontWeight: 500,
                    textDecoration: "none",
                    position: "relative",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = GOLD_LIGHT)
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = GOLD)}
                >
                  <motion.span style={{position: "relative"}}>
                    Create one
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
        </motion.div>
      </div>
    </main>
  );
};

export default LoginPage;
