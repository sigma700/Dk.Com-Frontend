import React, {useState, useRef} from "react";
import {motion, AnimatePresence} from "framer-motion";
import Footer from "../components/Footer";
import NavBar from "../components/navBar";
import {FaLocationDot} from "react-icons/fa6";
import {CiTimer} from "react-icons/ci";
import {FaPhoneAlt} from "react-icons/fa";
// import NavBar from "../components/NavBar";
// import Footer from "../components/Footer";

/* ─────────────────────────────────────────────
   DESIGN TOKENS  (mirror your blog page vars)
───────────────────────────────────────────── */
const TOKEN = {
  GOLD: "#C9A96E",
  GOLD_LIGHT: "#E8D5B0",
  GOLD_PALE: "#F5EDD8",
  DARK: "#0D1F1A",
  DARK_MID: "#132920",
  GREEN_DEEP: "#1A3D2F",
  GREEN_MID: "#2A5C44",
  MUTED: "#8A9E96",
  CREAM: "#FAF6EF",
  CREAM_DARK: "#F0E8D8",
};

/* ─────────────────────────────────────────────
   INLINE GLOBAL STYLES  (keyframes + vars)
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --gold: ${TOKEN.GOLD};
      --gold-light: ${TOKEN.GOLD_LIGHT};
      --gold-pale: ${TOKEN.GOLD_PALE};
      --dark: ${TOKEN.DARK};
      --dark-mid: ${TOKEN.DARK_MID};
      --green-deep: ${TOKEN.GREEN_DEEP};
      --green-mid: ${TOKEN.GREEN_MID};
      --muted: ${TOKEN.MUTED};
      --cream: ${TOKEN.CREAM};
    }

    body { background: var(--dark); color: var(--cream); font-family: 'Jost', sans-serif; }

    @keyframes fadeDown {
      from { opacity: 0; transform: translateY(-18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(201,169,110,0.55); }
      50%       { box-shadow: 0 0 0 8px rgba(201,169,110,0); }
    }
    @keyframes leafDrift {
      0%   { transform: translateY(0)   rotate(0deg)   opacity: 0.18; }
      50%  { transform: translateY(-28px) rotate(12deg) opacity: 0.28; }
      100% { transform: translateY(0)   rotate(0deg)   opacity: 0.18; }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    @keyframes toastOut {
      from { opacity: 1; transform: translateY(0)    scale(1);    }
      to   { opacity: 0; transform: translateY(20px) scale(0.95); }
    }

    .pulse-dot {
      width: 9px; height: 9px; border-radius: 50%;
      background: #4ade80;
      animation: pulseGlow 2s ease-in-out infinite;
      display: inline-block;
    }

    /* Glass card */
    .glass {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(201,169,110,0.18);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    /* Gold input focus */
    .field-input {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(201,169,110,0.22);
      color: var(--cream);
      font-family: 'Jost', sans-serif;
      font-size: 0.95rem;
      transition: border-color 0.25s, box-shadow 0.25s;
      outline: none;
      width: 100%;
      border-radius: 6px;
      padding: 13px 16px;
    }
    .field-input::placeholder { color: rgba(138,158,150,0.7); }
    .field-input:focus {
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(201,169,110,0.18), inset 0 0 12px rgba(201,169,110,0.06);
    }
    .field-input option { background: #132920; color: var(--cream); }

    /* Checkbox custom */
    .check-wrap input[type="checkbox"] { accent-color: var(--gold); width:16px; height:16px; cursor:pointer; }

    /* Accordion */
    .faq-content {
      overflow: hidden;
      transition: max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.3s;
    }

    /* Leaf SVG particles */
    .leaf { position: absolute; pointer-events: none; animation: leafDrift 7s ease-in-out infinite; }

    /* Shimmer text */
    .shimmer-text {
      background: linear-gradient(90deg, var(--gold-light) 0%, #fff 40%, var(--gold) 60%, var(--gold-light) 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    /* Toast */
    .toast {
      position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
      z-index: 9999; animation: toastIn 0.38s ease forwards;
    }
    .toast.hiding { animation: toastOut 0.38s ease forwards; }

    /* Map embed */
    .map-frame { border: none; border-radius: 8px; width: 100%; height: 220px; filter: saturate(0.7) brightness(0.85) contrast(1.05); }

    @media (max-width: 900px) {
      .split-grid { grid-template-columns: 1fr !important; }
      .left-col { padding-bottom: 0 !important; }
    }
    @media (max-width: 600px) {
      .hero-headline { font-size: 2.2rem !important; }
      .page-wrap { padding: 0 16px !important; }
    }
  `}</style>
);

/* ─────────────────────────────────────────────
   LEAF PARTICLE  (decorative ambient)
───────────────────────────────────────────── */
const Leaf = ({style}) => (
  <svg
    className="leaf"
    style={style}
    width="28"
    height="38"
    viewBox="0 0 28 38"
    fill="none"
  >
    <path
      d="M14 2C14 2 2 10 2 22C2 30.837 7.373 36 14 36C20.627 36 26 30.837 26 22C26 10 14 2 14 2Z"
      fill="rgba(42,92,68,0.35)"
      stroke="rgba(201,169,110,0.22)"
      strokeWidth="0.8"
    />
    <path
      d="M14 4 Q14 20 14 35"
      stroke="rgba(201,169,110,0.3)"
      strokeWidth="0.7"
    />
  </svg>
);

/* ─────────────────────────────────────────────
   ARROW ICON  (reusable, mirrors blog)
───────────────────────────────────────────── */
const ArrowIcon = ({size = 18, color = TOKEN.GOLD}) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path
      d="M3 9H15M15 9L10 4M15 9L10 14"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─────────────────────────────────────────────
   INSTAGRAM / PINTEREST ICONS
───────────────────────────────────────────── */
const IconInstagram = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);
const IconPinterest = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.266.64 1.266 1.408 0 .858-.548 2.143-.831 3.335-.236.995.499 1.806 1.479 1.806 1.775 0 3.144-1.87 3.144-4.573 0-2.39-1.718-4.061-4.169-4.061-2.837 0-4.503 2.128-4.503 4.328 0 .856.33 1.774.741 2.276a.3.3 0 0 1 .069.284c-.076.313-.243.995-.276 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.445 2.962.445 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
  </svg>
);

/* ─────────────────────────────────────────────
   FAQ ACCORDION ITEM
───────────────────────────────────────────── */
const FaqItem = ({question, answer}) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{borderBottom: `1px solid rgba(201,169,110,0.15)`}}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Jost', sans-serif",
          fontSize: "0.97rem",
          fontWeight: 500,
          color: TOKEN.CREAM,
          textAlign: "left",
          gap: 12,
        }}
      >
        <span>{question}</span>
        <motion.span
          animate={{rotate: open ? 45 : 0}}
          transition={{duration: 0.25}}
          style={{
            color: TOKEN.GOLD,
            fontSize: "1.4rem",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.32, ease: [0.4, 0, 0.2, 1]}}
            style={{overflow: "hidden"}}
          >
            <p
              style={{
                paddingBottom: 18,
                color: TOKEN.MUTED,
                fontSize: "0.92rem",
                lineHeight: 1.75,
              }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────
   TOAST NOTIFICATION
───────────────────────────────────────────── */
const Toast = ({visible}) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        className="toast"
        initial={{opacity: 0, y: 20, scale: 0.95}}
        animate={{opacity: 1, y: 0, scale: 1}}
        exit={{opacity: 0, y: 20, scale: 0.95}}
        transition={{duration: 0.38}}
        style={{
          background: "linear-gradient(135deg, #1A3D2F 0%, #0D1F1A 100%)",
          border: `1px solid ${TOKEN.GOLD}`,
          borderRadius: 12,
          padding: "18px 28px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,169,110,0.15)`,
          minWidth: 320,
        }}
      >
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(201,169,110,0.15)",
            border: `1px solid ${TOKEN.GOLD}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            flexShrink: 0,
          }}
        >
          ✓
        </span>
        <div>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              color: TOKEN.GOLD_LIGHT,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            Message Received
          </p>
          <p style={{color: TOKEN.MUTED, fontSize: "0.82rem", marginTop: 2}}>
            We'll respond within 24 hours.
          </p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─────────────────────────────────────────────
   INLINE ERROR
───────────────────────────────────────────── */
const FieldError = ({msg}) =>
  msg ? (
    <p
      style={{
        color: "#F87171",
        fontSize: "0.78rem",
        marginTop: 5,
        fontFamily: "'Jost', sans-serif",
      }}
    >
      {msg}
    </p>
  ) : null;

/* ─────────────────────────────────────────────
   LABEL
───────────────────────────────────────────── */
const Label = ({children, required}) => (
  <label
    style={{
      display: "block",
      marginBottom: 7,
      fontFamily: "'Jost', sans-serif",
      fontSize: "0.78rem",
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: TOKEN.GOLD_LIGHT,
      opacity: 0.85,
    }}
  >
    {children}
    {required && <span style={{color: TOKEN.GOLD, marginLeft: 3}}>*</span>}
  </label>
);

/* ─────────────────────────────────────────────
   MAIN CONTACT PAGE
───────────────────────────────────────────── */
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    subscribe: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email.";
    if (!form.subject) e.subject = "Please select an enquiry type.";
    if (!form.message.trim()) e.message = "A message is required.";
    return e;
  };

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;
    setForm((f) => ({...f, [name]: type === "checkbox" ? checked : value}));
    if (errors[name]) setErrors((er) => ({...er, [name]: ""}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      subscribe: false,
    });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
  };

  /* stagger variants */
  const container = {hidden: {}, show: {transition: {staggerChildren: 0.12}}};
  const item = {
    hidden: {opacity: 0, y: 22},
    show: {
      opacity: 1,
      y: 0,
      transition: {duration: 0.55, ease: [0.22, 1, 0.36, 1]},
    },
  };

  return (
    <>
      <GlobalStyles />

      {/* SEO meta (works inside React if using react-helmet or Next <Head> — kept inline for portability) */}
      <title>Contact Us | Mindful Living KE – Luxury Botanical Skincare</title>
      <meta
        name="description"
        content="Reach out to Mindful Living KE for product consultations, wholesale enquiries, or press & media. Handcrafted botanical skincare rooted in the Kenyan highlands."
      />

      <NavBar />

      {/* ── HERO SECTION ── */}
      <motion.section
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.85}}
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          background: `radial-gradient(ellipse at 20% 50%, rgba(26,61,47,0.92) 0%, rgba(13,31,26,0.97) 60%, #0D1F1A 100%)`,
          padding: "0 0 80px",
        }}
      >
        {/* Ambient leaf particles */}
        {[
          {
            top: "8%",
            left: "6%",
            animationDelay: "0s",
            animationDuration: "8s",
          },
          {
            top: "22%",
            left: "2%",
            animationDelay: "1.2s",
            animationDuration: "10s",
          },
          {
            top: "55%",
            left: "4%",
            animationDelay: "2.5s",
            animationDuration: "7s",
          },
          {
            top: "75%",
            left: "8%",
            animationDelay: "0.8s",
            animationDuration: "9s",
          },
          {
            top: "12%",
            right: "5%",
            animationDelay: "1.8s",
            animationDuration: "11s",
          },
          {
            top: "40%",
            right: "3%",
            animationDelay: "3s",
            animationDuration: "8s",
          },
          {
            top: "68%",
            right: "6%",
            animationDelay: "0.3s",
            animationDuration: "10s",
          },
        ].map((s, i) => (
          <Leaf key={i} style={s} />
        ))}

        {/* Subtle radial vignette overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            padding: "28px 48px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className="page-wrap"
        >
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.35}}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.78rem",
              fontFamily: "'Jost', sans-serif",
              color: TOKEN.MUTED,
              letterSpacing: "0.06em",
            }}
          >
            <span className="pulse-dot" />
            <span>Live Support Available</span>
          </motion.div>
        </div>

        {/* ── SPLIT GRID ── */}
        <div
          className="split-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            maxWidth: 1200,
            margin: "60px auto 0",
            padding: "0 48px",
            alignItems: "start",
          }}
        >
          {/* ── LEFT COLUMN ── */}
          <motion.div
            className="left-col"
            variants={container}
            initial="hidden"
            animate="show"
            style={{paddingTop: 20}}
          >
            {/* Eyebrow */}
            <motion.p
              variants={item}
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: TOKEN.GOLD,
                marginBottom: 18,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 1,
                  background: TOKEN.GOLD,
                  display: "inline-block",
                }}
              />
              Get In Touch
            </motion.p>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="hero-headline"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "3.1rem",
                lineHeight: 1.15,
                fontWeight: 700,
                marginBottom: 24,
                color: TOKEN.CREAM,
              }}
            >
              Talk to us
              <br />
              <span className="shimmer-text">Now</span>
              <br />
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={item}
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "1.02rem",
                lineHeight: 1.8,
                color: TOKEN.MUTED,
                maxWidth: 420,
                marginBottom: 40,
              }}
            >
              Every conversation is a seed. Whether you seek a personalised
              ritual, wholesale partnership, or simply wish to learn we are
              here, present and unhurried.
            </motion.p>

            {/* Glass info card */}
            <motion.div
              variants={item}
              className="glass"
              style={{
                borderRadius: 16,
                padding: "28px 28px 24px",
                marginBottom: 36,
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.05rem",
                  color: TOKEN.GOLD_LIGHT,
                  marginBottom: 18,
                  fontStyle: "italic",
                }}
              >
                The Atelier
              </p>

              <div style={{display: "flex", flexDirection: "column", gap: 14}}>
                {[
                  {
                    icon: <FaLocationDot />,
                    label: "Location",
                    val: "Karen, Nairobi - Kenya",
                  },
                  {
                    icon: <CiTimer />,
                    label: "Hours",
                    val: "Mon-Sat · 9 AM – 6 PM EAT",
                  },
                  {
                    icon: <FaPhoneAlt />,
                    label: "Response",
                    val: "Within 24 hours",
                  },
                ].map(({icon, label, val}) => (
                  <div
                    key={label}
                    style={{display: "flex", gap: 14, alignItems: "flex-start"}}
                  >
                    <span style={{fontSize: "1rem", lineHeight: 1.5}}>
                      {icon}
                    </span>
                    <div>
                      <p
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: TOKEN.GOLD,
                          marginBottom: 2,
                        }}
                      >
                        {label}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          fontSize: "0.92rem",
                          color: TOKEN.CREAM,
                          opacity: 0.82,
                        }}
                      >
                        {val}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Map embed */}
            <motion.div
              variants={item}
              style={{
                borderRadius: 12,
                overflow: "hidden",
                border: `1px solid rgba(201,169,110,0.18)`,
                marginBottom: 32,
              }}
            >
              <iframe
                className="map-frame"
                title="Mindful Living KE Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7953!2d36.7085!3d-1.3356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1b4e7a3e1e1f%3A0x0!2sKaren%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>

            {/* Direct access row */}
            <motion.div
              variants={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <a
                href="mailto:hello@mindfullivingke.com"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.88rem",
                  color: TOKEN.GOLD_LIGHT,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = TOKEN.GOLD)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = TOKEN.GOLD_LIGHT)
                }
              >
                <ArrowIcon size={14} /> hello@mindfullivingke.com
              </a>
              <div style={{display: "flex", gap: 14, marginLeft: "auto"}}>
                {[
                  {href: "#", Icon: IconInstagram, label: "Instagram"},
                  {href: "#", Icon: IconPinterest, label: "Pinterest"},
                ].map(({href, Icon, label}) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    whileHover={{scale: 1.12, color: TOKEN.GOLD}}
                    style={{
                      color: TOKEN.MUTED,
                      transition: "color 0.2s",
                      display: "flex",
                    }}
                  >
                    <Icon />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN — FORM ── */}
          <motion.div
            initial={{opacity: 0, x: 30}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1]}}
          >
            <div
              className="glass"
              style={{borderRadius: 20, padding: "40px 36px 36px"}}
            >
              {/* Form header */}
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: TOKEN.GOLD,
                  marginBottom: 10,
                }}
              >
                Contact Form
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.7rem",
                  color: TOKEN.CREAM,
                  fontWeight: 600,
                  marginBottom: 28,
                  lineHeight: 1.25,
                }}
              >
                We'd love to hear
                <br />
                <span style={{fontStyle: "italic", color: TOKEN.GOLD_LIGHT}}>
                  from you.
                </span>
              </h2>

              <form
                onSubmit={handleSubmit}
                noValidate
                style={{display: "flex", flexDirection: "column", gap: 22}}
              >
                {/* Name */}
                <motion.div whileFocus={{scale: 1.01}}>
                  <Label required>Full Name</Label>
                  <input
                    className="field-input"
                    type="text"
                    name="name"
                    placeholder="e.g. Amara Ochieng"
                    value={form.name}
                    onChange={handleChange}
                  />
                  <FieldError msg={errors.name} />
                </motion.div>

                {/* Email */}
                <div>
                  <Label required>Email Address</Label>
                  <input
                    className="field-input"
                    type="email"
                    name="email"
                    placeholder="hello@youremail.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                  <FieldError msg={errors.email} />
                </div>

                {/* Phone */}
                <div>
                  <Label>
                    Phone Number{" "}
                    <span
                      style={{
                        color: TOKEN.MUTED,
                        fontSize: "0.75rem",
                        fontWeight: 400,
                        textTransform: "none",
                        letterSpacing: 0,
                      }}
                    >
                      (optional)
                    </span>
                  </Label>
                  <input
                    className="field-input"
                    type="tel"
                    name="phone"
                    placeholder="+254 700 000 000"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Subject */}
                <div>
                  <Label required>Enquiry Type</Label>
                  <select
                    className="field-input"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    style={{
                      appearance: "none",
                      cursor: "pointer",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%23C9A96E' strokeWidth='1.5' strokeLinecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: 36,
                    }}
                  >
                    <option value="" disabled>
                      Select a topic…
                    </option>
                    <option value="general">General Inquiry</option>
                    <option value="wholesale">Wholesale / B2B</option>
                    <option value="press">Press &amp; Media</option>
                    <option value="consultation">Product Consultation</option>
                  </select>
                  <FieldError msg={errors.subject} />
                </div>

                {/* Message */}
                <div>
                  <Label required>Message</Label>
                  <textarea
                    className="field-input"
                    name="message"
                    placeholder="Share your thoughts, questions, or vision with us…"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    style={{resize: "vertical", minHeight: 110}}
                  />
                  <FieldError msg={errors.message} />
                </div>

                {/* Newsletter opt-in */}
                <div
                  className="check-wrap"
                  style={{display: "flex", alignItems: "flex-start", gap: 12}}
                >
                  <input
                    type="checkbox"
                    name="subscribe"
                    id="subscribe"
                    checked={form.subscribe}
                    onChange={handleChange}
                    style={{marginTop: 2}}
                  />
                  <label
                    htmlFor="subscribe"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.87rem",
                      color: TOKEN.MUTED,
                      cursor: "pointer",
                      lineHeight: 1.6,
                    }}
                  >
                    Subscribe to{" "}
                    <span style={{color: TOKEN.GOLD_LIGHT}}>
                      The Mindful Letter
                    </span>{" "}
                    — botanical rituals, new arrivals &amp; seasonal stories.
                  </label>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileHover={{scale: 1.02}}
                  whileTap={{scale: 0.98}}
                  disabled={submitting}
                  style={{
                    marginTop: 6,
                    padding: "16px 32px",
                    background: submitting
                      ? "rgba(201,169,110,0.3)"
                      : `linear-gradient(135deg, ${TOKEN.GOLD} 0%, #A07840 100%)`,
                    border: "none",
                    borderRadius: 8,
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: submitting ? TOKEN.GOLD_LIGHT : TOKEN.DARK,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    boxShadow: submitting
                      ? "none"
                      : `0 4px 24px rgba(201,169,110,0.28)`,
                    transition: "background 0.3s, box-shadow 0.3s",
                  }}
                >
                  {submitting ? (
                    <>
                      <motion.span
                        animate={{rotate: 360}}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{
                          width: 16,
                          height: 16,
                          border: `2px solid ${TOKEN.GOLD}`,
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          display: "inline-block",
                        }}
                      />
                      Sending…
                    </>
                  ) : (
                    <>
                      {" "}
                      Send Message{" "}
                      <ArrowIcon size={16} color={TOKEN.DARK} />{" "}
                    </>
                  )}
                </motion.button>
              </form>

              {/* FAQ accordion */}
              <div
                style={{
                  marginTop: 40,
                  borderTop: `1px solid rgba(201,169,110,0.12)`,
                  paddingTop: 28,
                }}
              >
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: TOKEN.GOLD,
                    marginBottom: 4,
                  }}
                >
                  Quick Answers
                </p>
                <FaqItem
                  question="Do you offer international shipping?"
                  answer="Yes we ship to select countries across Africa, Europe, and North America. Shipping rates and estimated delivery times are calculated at checkout. All orders are carefully packed to preserve product integrity."
                />
                <FaqItem
                  question="Can I request a custom formula?"
                  answer="Absolutely. Our product consultation service is designed for exactly this. Select 'Product Consultation' in the enquiry form and describe your skin goals our botanical formulator will be in touch within 48 hours."
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Toast */}
      <Toast visible={toastVisible} />

      <Footer />
    </>
  );
}
