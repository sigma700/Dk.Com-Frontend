import React, {useState, useRef} from "react";
import {motion, useInView, AnimatePresence} from "framer-motion";
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

// ── Input Field Component ──────────────────────────────────────
const FloatingInput = ({
  label,
  type = "text",
  value,
  onChange,
  icon,
  error,
  hint,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const hasValue = value && value.length > 0;
  const isFloated = focused || hasValue;

  return (
    <div style={{position: "relative", marginBottom: 8}}>
      <div
        style={{
          position: "relative",
          borderRadius: 16,
          border: `1.5px solid ${error ? "#C41E3A" : focused ? GOLD : "rgba(74,140,42,0.22)"}`,
          background: focused
            ? "rgba(255,255,255,0.95)"
            : "rgba(255,255,255,0.72)",
          backdropFilter: "blur(12px)",
          transition: "all 0.25s ease",
          boxShadow: focused
            ? `0 0 0 4px rgba(74,140,42,0.08), 0 4px 20px -6px rgba(74,140,42,0.15)`
            : error
              ? `0 0 0 3px rgba(196,30,58,0.08)`
              : "none",
        }}
      >
        {/* Floating label */}
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
            transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {label}
        </label>

        {/* Icon */}
        {icon && (
          <div
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: focused ? GOLD : MUTED,
              transition: "color 0.2s",
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </div>
        )}

        <input
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
          }}
        />

        {/* Password toggle */}
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
      </div>

      {/* Error / hint */}
      <AnimatePresence>
        {(error || hint) && (
          <motion.p
            initial={{opacity: 0, y: -4, height: 0}}
            animate={{opacity: 1, y: 0, height: "auto"}}
            exit={{opacity: 0, y: -4, height: 0}}
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

// ── Password Strength Meter ────────────────────────────────────
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
      initial={{opacity: 0, y: -6}}
      animate={{opacity: 1, y: 0}}
      style={{marginBottom: 16}}
    >
      <div style={{display: "flex", gap: 4, marginBottom: 6}}>
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{
              background: i <= score ? colors[score] : "rgba(74,140,42,0.12)",
            }}
            transition={{duration: 0.3}}
            style={{flex: 1, height: 3, borderRadius: 100}}
          />
        ))}
      </div>
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
    </motion.div>
  );
};

// ── Social Auth Button ─────────────────────────────────────────
const SocialButton = ({icon, label, onClick}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      whileTap={{scale: 0.97}}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        border: `1.5px solid ${hovered ? "rgba(74,140,42,0.35)" : "rgba(74,140,42,0.15)"}`,
        borderRadius: 14,
        padding: "11px 16px",
        background: hovered ? "rgba(74,140,42,0.05)" : "rgba(255,255,255,0.6)",
        backdropFilter: "blur(8px)",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.1em",
        color: DARK,
        fontFamily: "inherit",
        transition: "all 0.22s ease",
      }}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
};

// ── Main Page ──────────────────────────────────────────────────
const CreateAccountPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, {once: true});

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
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main
      style={{
        background: CREAM,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        @keyframes shimmer-text {
          0%   { background-position: 0% center }
          50%  { background-position: 100% center }
          100% { background-position: 0% center }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .create-account-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }
        @media (max-width: 900px) {
          .create-account-grid {
            grid-template-columns: 1fr !important;
          }
          .sidebar-panel {
            display: none !important;
          }
          .form-panel {
            padding: 40px 24px 60px !important;
          }
          .name-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="create-account-grid">
        {/* ── Left Sidebar Panel ── */}
        <div
          className="sidebar-panel"
          style={{
            background: `linear-gradient(160deg, ${DARK_GREEN} 0%, #1E3A14 55%, #2C5218 100%)`,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 56px",
          }}
        >
          {/* Ambient orbs */}
          {[
            {w: 480, h: 480, top: "-20%", right: "-10%", op: 0.16},
            {w: 240, h: 240, bottom: "10%", left: "-5%", op: 0.12},
            {w: 160, h: 160, top: "40%", left: "25%", op: 0.08},
          ].map((o, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, i % 2 ? -18 : 18, 0],
                y: [0, i % 2 ? 18 : -14, 0],
              }}
              transition={{
                duration: 12 + i * 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
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

          {/* Dashed ring accent */}
          <div
            style={{
              position: "absolute",
              bottom: "8%",
              right: "-12%",
              width: 320,
              height: 320,
              borderRadius: "50%",
              border: `1px dashed rgba(114,184,74,0.2)`,
              pointerEvents: "none",
              animation: "spin-slow 40s linear infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "-8%",
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: `1px dashed rgba(114,184,74,0.15)`,
              pointerEvents: "none",
              animation: "spin-slow 28s linear infinite reverse",
            }}
          />

          {/* Logo / Brand */}
          <div style={{position: "relative", zIndex: 2}}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 52,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: `1.5px solid rgba(114,184,74,0.5)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={GOLD_LIGHT}
                  strokeWidth="1.5"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                  <path
                    d="M12 22C6.48 22 2 17.52 2 12 2 8.13 4.26 4.76 7.5 3.07"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <img
                className="w-[200px] rounded-[50%]"
                src="src/assets/logo.jpeg"
                alt="mindful living ke logo"
              />
            </div>

            <SectionLabel text="Join the community" />

            <h2
              style={{
                fontFamily: "'Playfair Display','Georgia',serif",
                fontSize: "clamp(30px, 2.8vw, 44px)",
                fontWeight: 300,
                color: CREAM,
                margin: "0 0 20px",
                lineHeight: 1.15,
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
            </h2>

            <p
              style={{
                fontSize: 13,
                color: "rgba(247,251,244,0.52)",
                fontWeight: 300,
                lineHeight: 1.9,
                maxWidth: 340,
                marginBottom: 48,
              }}
            >
              Join the vast community of thousands who trust our products
            </p>

            {[
              {
                icon: <FaRegMoneyBillAlt />,
                text: "Get informed of seasonal discounts",
              },
              {
                icon: <FaPersonCircleCheck />,
                text: "Personalised recommendations",
              },
              {
                icon: <TbHealthRecognition />,
                text: "Members-only wellness bundles & savings",
              },
              {
                icon: <FaTruck />,
                text: "Free shipping on orders above Ksh 2,500",
              },
            ].map(({icon, text}, i) => (
              <motion.div
                key={i}
                initial={{opacity: 0, x: -20}}
                animate={{opacity: 1, x: 0}}
                transition={{delay: 0.3 + i * 0.1, duration: 0.6}}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(74,140,42,0.2)",
                    border: `1px solid rgba(114,184,74,0.25)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(247,251,244,0.65)",
                    fontWeight: 300,
                    lineHeight: 1.5,
                  }}
                >
                  {text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Testimonial footer */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              paddingTop: 32,
              borderTop: `1px solid rgba(74,140,42,0.18)`,
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "rgba(247,251,244,0.45)",
                fontStyle: "italic",
                fontFamily: "'Playfair Display', serif",
                lineHeight: 1.75,
                marginBottom: 12,
              }}
            >
              "Mindful living Ke changed my entire morning routine. The
              frankincense oil is unlike anything I've tried before."
            </p>
            <div style={{display: "flex", alignItems: "center", gap: 10}}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#fff",
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
                    letterSpacing: "0.12em",
                  }}
                >
                  Amara K.
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(247,251,244,0.3)",
                    letterSpacing: "0.1em",
                  }}
                >
                  Nairobi · Member since 2025
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div
          className="form-panel"
          ref={heroRef}
          style={{
            padding: "52px 64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle background orbs */}
          {[
            {w: 300, h: 300, top: "-10%", right: "-5%", op: 0.06},
            {w: 180, h: 180, bottom: "5%", left: "-3%", op: 0.05},
          ].map((o, i) => (
            <div
              key={i}
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

          <AnimatePresence mode="wait">
            {submitted ? (
              /* ── Success State ── */
              <motion.div
                key="success"
                initial={{opacity: 0, scale: 0.95, y: 20}}
                animate={{opacity: 1, scale: 1, y: 0}}
                transition={{duration: 0.7, ease: [0.16, 1, 0.3, 1]}}
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <motion.div
                  initial={{scale: 0}}
                  animate={{scale: 1}}
                  transition={{delay: 0.2, type: "spring", stiffness: 200}}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: GOLD_PALE,
                    border: `2px solid ${GOLD}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 28px",
                    fontSize: 32,
                  }}
                >
                  <FaLeaf />
                </motion.div>
                <SectionLabel text="Welcome to the Family" />
                <h2
                  style={{
                    fontFamily: "'Playfair Display','Georgia',serif",
                    fontSize: 36,
                    fontWeight: 300,
                    color: DARK,
                    margin: "0 0 14px",
                    lineHeight: 1.2,
                  }}
                >
                  Your Journey{" "}
                  <em style={{fontStyle: "italic", color: GOLD}}>Awaits</em>
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: MUTED,
                    fontWeight: 300,
                    lineHeight: 1.85,
                    marginBottom: 36,
                  }}
                >
                  Welcome, {form.firstName}! We've sent a confirmation to{" "}
                  <strong style={{color: GOLD}}>{form.email}</strong>. Check
                  your inbox to activate your account.
                </p>
                <motion.button
                  whileTap={{scale: 0.96}}
                  onClick={() => navigate("/")}
                  style={{
                    background: GOLD,
                    border: "none",
                    borderRadius: 100,
                    padding: "13px 36px",
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "#fff",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Explore{" "}
                </motion.button>
              </motion.div>
            ) : (
              /* ── Form State ── */
              <motion.div
                key="form"
                initial={{opacity: 0, y: 30}}
                animate={isHeroInView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
                style={{
                  position: "relative",
                  zIndex: 1,
                  maxWidth: 480,
                  width: "100%",
                }}
              >
                {/* Back to shop link */}
                <Link
                  to="/"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: 10,
                    color: MUTED,
                    textDecoration: "none",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    marginBottom: 36,
                    opacity: 0.75,
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
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

                <SectionLabel text="Create Account" />

                <h1
                  style={{
                    fontFamily: "'Playfair Display','Georgia',serif",
                    fontSize: "clamp(28px, 3.5vw, 40px)",
                    fontWeight: 300,
                    color: DARK,
                    margin: "0 0 6px",
                    lineHeight: 1.12,
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
                    lineHeight: 1.7,
                  }}
                >
                  Create your account and discover Kenya's finest botanicals.
                </p>

                {/* Social Auth */}
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

                {/* Divider */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 28,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: "rgba(74,140,42,0.15)",
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
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: "rgba(74,140,42,0.15)",
                    }}
                  />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>
                  {/* Name row */}
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

                  {/* Email */}
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

                  {/* Password */}
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

                  {/* Confirm password */}
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

                  {/* Terms */}
                  <div style={{marginBottom: 24}}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        onClick={() => {
                          setAgreed((a) => !a);
                          if (errors.agreed)
                            setErrors((e) => ({...e, agreed: ""}));
                        }}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 6,
                          border: `1.5px solid ${errors.agreed ? "#C41E3A" : agreed ? GOLD : "rgba(74,140,42,0.3)"}`,
                          background: agreed ? GOLD : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 1,
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                        }}
                      >
                        <AnimatePresence>
                          {agreed && (
                            <motion.svg
                              initial={{scale: 0, opacity: 0}}
                              animate={{scale: 1, opacity: 1}}
                              exit={{scale: 0, opacity: 0}}
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
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          color: MUTED,
                          fontWeight: 300,
                          lineHeight: 1.65,
                        }}
                      >
                        I agree to Botanica's{" "}
                        <Link
                          to="/terms"
                          style={{
                            color: GOLD,
                            textDecoration: "none",
                            fontWeight: 500,
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
                          }}
                        >
                          Privacy Policy
                        </Link>
                        . I consent to receive wellness updates and exclusive
                        offers.
                      </span>
                    </label>
                    <AnimatePresence>
                      {errors.agreed && (
                        <motion.p
                          initial={{opacity: 0, y: -4}}
                          animate={{opacity: 1, y: 0}}
                          exit={{opacity: 0}}
                          style={{
                            fontSize: 10,
                            color: "#C41E3A",
                            marginTop: 6,
                            marginLeft: 32,
                            fontWeight: 500,
                            letterSpacing: "0.06em",
                          }}
                        >
                          {errors.agreed}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    whileTap={{scale: 0.97}}
                    disabled={loading}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      background: loading
                        ? MUTED
                        : `linear-gradient(135deg, ${GOLD} 0%, ${DARK_GREEN} 100%)`,
                      border: "none",
                      borderRadius: 16,
                      padding: "15px 28px",
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      color: "#fff",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.25s ease",
                      boxShadow: loading
                        ? "none"
                        : `0 8px 28px -8px rgba(74,140,42,0.45)`,
                      marginBottom: 20,
                    }}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{rotate: 360}}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          style={{
                            width: 14,
                            height: 14,
                            border: "2px solid rgba(255,255,255,0.3)",
                            borderTopColor: "#fff",
                            borderRadius: "50%",
                          }}
                        />
                        Creating your account…
                      </>
                    ) : (
                      <>
                        Create Account
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
                      </>
                    )}
                  </motion.button>

                  {/* Sign in link */}
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: 12,
                      color: MUTED,
                      fontWeight: 300,
                    }}
                  >
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      style={{
                        color: GOLD,
                        fontWeight: 500,
                        textDecoration: "none",
                        borderBottom: `1px solid transparent`,
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderBottomColor = GOLD)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderBottomColor =
                          "transparent")
                      }
                    >
                      Sign in
                    </Link>
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default CreateAccountPage;
