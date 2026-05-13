import React, {useRef, useState, useEffect} from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import NavBar from "../components/navBar";
import Footer from "../components/footer";
import {RiPlantFill, RiPlantLine, RiRecycleFill} from "react-icons/ri";
import {FaPeopleLine} from "react-icons/fa6";
import {MdScience} from "react-icons/md";
import {Link} from "react-router-dom";
import {FaExchangeAlt} from "react-icons/fa";
import {GiMicroscope} from "react-icons/gi";

// ── Palette ──
const GOLD = "#4A8C2A";
const GOLD_LIGHT = "#72B84A";
const GOLD_PALE = "#E8F5E0";
const CREAM = "#F7FBF4";
const DARK = "#1A1A1A";
const MUTED = "#5A7A4A";
const FOREST = "#14280F";

// ── Data ──
const values = [
  {
    icon: <RiPlantLine />,
    title: "100% Natural",
    body: "Every ingredient is sourced from natural sources , free from harmful synthetics and harsh chemicals that may be hazardous to your body.",
  },
  {
    icon: <FaPeopleLine />,
    title: "Community First",
    body: "We partner with other bf suma distributors to get informed insights about market trends and what consumers need at the moment to ensure maximum customer satisfaction.",
  },
  {
    icon: <MdScience />,
    title: "Science-Backed",
    body: "Our medical products , especially skin products are carefully analysed in the laboratory and tested thoroughly before sale to our trusty customers.",
  },
  {
    icon: <RiRecycleFill />,
    title: "Earth-Kind",
    body: "We highly campaign for recycling of used containers. We also give discounts for those with proof of recycling.",
  },
];

const milestones = [
  {
    year: "2020",
    event:
      "Founded in Nairobi's Westlands district with a single botanical soap recipe and a dream too big for the kitchen it was born in.",
  },
  {
    year: "2021",
    event:
      "Partnered with 12 Rift Valley farms. Launched 8 products. Crossed our first 1,000 loyal customers who became our community.",
  },
  {
    year: "2022",
    event:
      "Won the Kenya Beauty Awards – Best Natural Brand. Expanded operations to Mombasa & Kisumu. Hired our first dermatologist.",
  },
  {
    year: "2023",
    event:
      "Crossed 10,000 loyal customers. Launched the Wellness Tea Collection. Featured in Vogue Africa and Business Daily.",
  },
  {
    year: "2024",
    event:
      "Entered Uganda & Tanzania markets. 40+ farm partnerships. 30+ products. Named East Africa's Fastest-Growing Wellness Brand.",
  },
  {
    year: "2025",
    event:
      "Launched online store. Crossed 50,000 orders. Certified carbon-neutral. East Africa's #1 natural skincare brand.",
  },
];

const team = [
  {
    name: "Dawn Kawiria",
    role: "Founder & Professional Nutritionist",
    bio: "Ethnobotanist with 12 years studying Kenyan medicinal plants. Amina has catalogued over 300 native botanical actives and holds two patents in plant extraction.",
    initial: "DK",
    quote: "Health is wealth",
  },
  {
    name: "Allan Muriithi",
    role: "Lead Developer",
    bio: "Experienced full stack engineer with more than a year of experience developing premium performant websites and a future mechanical engineer",
    initial: "AM",
    quote: "The mind is the only limit",
  },
];

const stats = [
  ["50K+", "Happy Customers"],
  ["40+", "Farm Partners"],
  ["30+", "Products"],
  ["5", "Years"],
];

// ── Reusable: Section Label ──
const SectionLabel = ({text, light = false}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      marginBottom: 24,
    }}
  >
    <div
      style={{
        width: 36,
        height: 1,
        background: light ? `${GOLD_LIGHT}80` : GOLD,
      }}
    />
    <span
      style={{
        fontSize: 9,
        fontWeight: 500,
        letterSpacing: "0.44em",
        textTransform: "uppercase",
        color: light ? `${GOLD_LIGHT}cc` : MUTED,
      }}
    >
      {text}
    </span>
    <div
      style={{
        width: 36,
        height: 1,
        background: light ? `${GOLD_LIGHT}80` : GOLD,
      }}
    />
  </div>
);

// ── Reusable: Animated Section Wrapper ──
const RevealSection = ({children, delay = 0, style = {}}) => {
  const ref = useRef(null);
  const inView = useInView(ref, {once: true, margin: "-80px"});
  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, y: 48}}
      animate={inView ? {opacity: 1, y: 0} : {}}
      transition={{duration: 0.95, delay, ease: [0.16, 1, 0.3, 1]}}
      style={style}
    >
      {children}
    </motion.div>
  );
};

// ── Value Card ──
const ValueCard = ({icon, title, body, index}) => {
  const ref = useRef(null);
  const inView = useInView(ref, {once: true, margin: "-40px"});
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, y: 56, filter: "blur(4px)"}}
      animate={inView ? {opacity: 1, y: 0, filter: "blur(0px)"} : {}}
      transition={{
        duration: 0.85,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? FOREST : "white",
        borderRadius: 32,
        padding: "48px 38px",
        border: `1px solid ${hovered ? GOLD + "50" : GOLD + "14"}`,
        boxShadow: hovered
          ? `0 40px 80px -16px ${GOLD}35, 0 0 0 1px ${GOLD}20`
          : "0 6px 28px -8px rgba(30,70,10,0.08)",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.55s cubic-bezier(0.16,1,0.3,1)",
        cursor: "default",
      }}
    >
      {/* Animated corner glow */}
      <motion.div
        animate={{opacity: hovered ? 1 : 0.4, scale: hovered ? 1.4 : 1}}
        transition={{duration: 0.6}}
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 180,
          height: 180,
          background: `radial-gradient(circle, ${GOLD}22 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Number watermark */}
      <div
        style={{
          position: "absolute",
          bottom: -16,
          right: 24,
          fontFamily: "'Playfair Display', serif",
          fontSize: 100,
          fontWeight: 300,
          lineHeight: 1,
          color: hovered ? `${GOLD_LIGHT}12` : `${GOLD}08`,
          pointerEvents: "none",
          userSelect: "none",
          transition: "color 0.5s",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Icon */}
      <motion.div
        animate={{
          background: hovered ? `${GOLD}22` : GOLD_PALE,
          color: hovered ? GOLD_LIGHT : GOLD,
        }}
        transition={{duration: 0.4}}
        style={{
          width: 58,
          height: 58,
          borderRadius: 20,
          marginBottom: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
        }}
      >
        {icon}
      </motion.div>

      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 21,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: hovered ? "#F0F7EC" : DARK,
          margin: "0 0 12px",
          transition: "color 0.4s",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: 13.5,
          color: hovered ? "rgba(240,247,236,0.65)" : MUTED,
          lineHeight: 1.9,
          fontWeight: 300,
          margin: 0,
          transition: "color 0.4s",
        }}
      >
        {body}
      </p>

      {/* Bottom accent line */}
      <motion.div
        animate={{scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0}}
        transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${GOLD_LIGHT}, transparent)`,
          transformOrigin: "left",
        }}
      />
    </motion.div>
  );
};

// ── Timeline Item ──
const TimelineItem = ({year, event, index, isLast}) => {
  const ref = useRef(null);
  const inView = useInView(ref, {once: true, margin: "-20px"});
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, x: 32}}
      animate={inView ? {opacity: 1, x: 0} : {}}
      transition={{duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1]}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        gap: 28,
        marginBottom: isLast ? 0 : 36,
        paddingLeft: 4,
      }}
    >
      {/* Dot + line */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <motion.div
          animate={{
            boxShadow: hovered
              ? `0 0 0 6px ${GOLD}22, 0 0 0 12px ${GOLD}0c, 0 6px 20px ${GOLD}50`
              : `0 0 0 4px ${GOLD}20, 0 4px 12px ${GOLD}30`,
            scale: hovered ? 1.2 : 1,
          }}
          transition={{duration: 0.4}}
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            flexShrink: 0,
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
            border: `3px solid ${GOLD_PALE}`,
          }}
        />
        {!isLast && (
          <div
            style={{
              width: 1,
              flex: 1,
              marginTop: 6,
              background: `linear-gradient(to bottom, ${GOLD}60, ${GOLD}15)`,
              minHeight: 28,
            }}
          />
        )}
      </div>

      <div style={{paddingBottom: isLast ? 0 : 8, paddingTop: 1}}>
        <motion.div
          animate={{color: hovered ? GOLD_LIGHT : GOLD}}
          transition={{duration: 0.3}}
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            marginBottom: 7,
          }}
        >
          {year}
        </motion.div>
        <p
          style={{
            fontSize: 13.5,
            color: DARK,
            lineHeight: 1.8,
            margin: 0,
            fontWeight: 300,
          }}
        >
          {event}
        </p>
      </div>
    </motion.div>
  );
};

// ── Team Card ──
const TeamMember = ({name, role, bio, initial, quote, index}) => {
  const ref = useRef(null);
  const inView = useInView(ref, {once: true});
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, y: 56, filter: "blur(5px)"}}
      animate={inView ? {opacity: 1, y: 0, filter: "blur(0px)"} : {}}
      transition={{duration: 0.9, delay: index * 0.14, ease: [0.16, 1, 0.3, 1]}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        borderRadius: 36,
        overflow: "hidden",
        border: `1px solid ${GOLD}14`,
        boxShadow: hovered
          ? `0 40px 80px -16px rgba(30,70,10,0.22)`
          : "0 6px 28px -10px rgba(30,70,10,0.09)",
        transition: "all 0.55s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        cursor: "default",
      }}
    >
      {/* Top band */}
      <div
        style={{
          height: 8,
          background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, ${GOLD})`,
          backgroundSize: "200% auto",
          animation: hovered ? "shimmer-bg 2s linear infinite" : "none",
        }}
      />

      <div style={{padding: "44px 36px 40px", textAlign: "center"}}>
        {/* Avatar */}
        <div
          style={{
            position: "relative",
            width: 96,
            height: 96,
            margin: "0 auto 28px",
          }}
        >
          <motion.div
            animate={{opacity: hovered ? 1 : 0.4, scale: hovered ? 1.3 : 1}}
            transition={{duration: 0.5}}
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${GOLD}30 0%, transparent 70%)`,
            }}
          />
          {/* Rotating dashed ring */}
          <motion.svg
            animate={{rotate: hovered ? 360 : 0}}
            transition={{
              duration: 12,
              repeat: hovered ? Infinity : 0,
              ease: "linear",
            }}
            viewBox="0 0 96 96"
            style={{position: "absolute", inset: 0, width: 96, height: 96}}
          >
            <circle
              cx="48"
              cy="48"
              r="44"
              fill="none"
              stroke={GOLD}
              strokeWidth="0.8"
              strokeDasharray="4 6"
              opacity={hovered ? 0.6 : 0.2}
            />
          </motion.svg>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 400,
              color: "white",
              fontFamily: "'Playfair Display', serif",
              boxShadow: `0 16px 40px ${GOLD}45`,
              position: "relative",
              zIndex: 1,
            }}
          >
            {initial}
          </div>
        </div>

        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 21,
            fontWeight: 500,
            color: DARK,
            margin: "0 0 6px",
            letterSpacing: "-0.01em",
          }}
        >
          {name}
        </h3>

        <p
          style={{
            fontSize: 9.5,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: GOLD,
            margin: "0 0 20px",
            fontWeight: 600,
          }}
        >
          {role}
        </p>

        <div
          style={{
            width: 32,
            height: 1,
            background: `${GOLD}40`,
            margin: "0 auto 20px",
          }}
        />

        <p
          style={{
            fontSize: 13,
            color: MUTED,
            lineHeight: 1.9,
            margin: "0 0 24px",
            fontWeight: 300,
          }}
        >
          {bio}
        </p>

        {/* Quote */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{opacity: 0, height: 0, marginTop: 0}}
              animate={{opacity: 1, height: "auto", marginTop: 20}}
              exit={{opacity: 0, height: 0, marginTop: 0}}
              transition={{duration: 0.45, ease: [0.16, 1, 0.3, 1]}}
              style={{
                padding: "16px 20px",
                background: GOLD_PALE,
                borderRadius: 16,
                borderLeft: `3px solid ${GOLD}`,
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  fontSize: 14,
                  color: DARK,
                  margin: 0,
                  lineHeight: 1.7,
                  fontWeight: 400,
                }}
              >
                "{quote}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ── Floating Image ──
const FloatingImage = ({inView}) => (
  <motion.div
    initial={{opacity: 0, x: 50, rotateY: -12}}
    animate={inView ? {opacity: 1, x: 0, rotateY: 0} : {}}
    transition={{duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1]}}
    style={{
      flex: "1 1 480px",
      minWidth: 280,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      perspective: 900,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: "-10%",
        background: `radial-gradient(ellipse 70% 65% at 52% 52%, ${GOLD}32 0%, transparent 72%)`,
        pointerEvents: "none",
        filter: "blur(28px)",
      }}
    />

    {[360, 480, 620].map((size, i) => (
      <motion.div
        key={size}
        animate={{scale: [1, 1.04, 1], opacity: [0.12, 0.32, 0.12]}}
        transition={{
          duration: 3.5 + i * 0.9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.6,
        }}
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          border: `1px solid ${GOLD_LIGHT}50`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
        }}
      />
    ))}

    <motion.div
      animate={{y: [0, -18, 0], rotateX: [0, 2, 0], rotateZ: [-0.8, 0.8, -0.8]}}
      transition={{duration: 6.5, repeat: Infinity, ease: "easeInOut"}}
      whileHover={{scale: 1.035, rotateY: 4, rotateX: -3}}
      style={{
        position: "relative",
        zIndex: 2,
        transformStyle: "preserve-3d",
        cursor: "default",
        width: "100%",
        maxWidth: "min(85vw, 700px)",
        margin: "0 auto",
      }}
    >
      <img
        src="/ABOUT-US.png"
        alt="Mindful Living KE — botanical roots"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          borderRadius: "50% 46% 54% 42% / 44% 52% 48% 56%",
          objectFit: "cover",
          aspectRatio: "1 / 1",
          filter: `
            drop-shadow(0 50px 80px rgba(20,60,8,0.42))
            drop-shadow(0 16px 32px rgba(20,60,8,0.22))
            drop-shadow(0  4px 10px rgba(20,60,8,0.14))
          `,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50% 46% 54% 42% / 44% 52% 48% 56%",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  </motion.div>
);

// ── Manifesto counter ──
const AnimatedNumber = ({target, suffix = ""}) => {
  const ref = useRef(null);
  const inView = useInView(ref, {once: true});
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target.replace(/\D/g, ""));
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  const prefix = target.match(/^\D+/) ? target.match(/^\D+/)[0] : "";
  const suf = target.match(/\D+$/) ? target.match(/\D+$/)[0] : suffix;

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suf}
    </span>
  );
};

// ══════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════
const AboutPage = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, {once: true});
  const {scrollYProgress} = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <main style={{background: CREAM, minHeight: "100vh", overflowX: "hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; }

        @keyframes shimmer-text {
          0%   { background-position: 0%   center }
          50%  { background-position: 100% center }
          100% { background-position: 0%   center }
        }
        @keyframes shimmer-bg {
          0%   { background-position: 0%   center }
          100% { background-position: 200% center }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px) }
          to   { opacity:1; transform:none }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg) }
          to   { transform: rotate(360deg) }
        }
        @keyframes grain {
          0%,100% { transform: translate(0,0) }
          10%     { transform: translate(-2%,-3%) }
          30%     { transform: translate(3%,2%) }
          50%     { transform: translate(-1%,4%) }
          70%     { transform: translate(2%,-2%) }
          90%     { transform: translate(-3%,1%) }
        }

        .about-page { font-family: 'Jost', sans-serif; }

        .manifesto-char {
          display: inline-block;
          animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }

        /* --- Existing responsive overrides (unchanged) --- */
        @media (max-width: 1024px) {
          .hero-content    { flex-direction: column !important; }
          .story-grid      { grid-template-columns: 1fr !important; gap: 60px !important; }
          .values-grid     { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          .hero-section    { padding: 100px 24px 180px !important; }
          .page-section    { padding: 72px 24px !important; }
          .values-grid     { grid-template-columns: 1fr !important; }
          .team-grid       { grid-template-columns: 1fr !important; }
          .stats-bar > div { padding: 20px 24px !important; border-right: none !important; border-bottom: 1px solid rgba(74,140,42,0.15) !important; }
          .cta-section     { padding: 60px 24px !important; }
          .manifesto-section { padding: 80px 24px !important; }
          .nl-section      { padding: 60px 24px !important; }
        }
        @media (max-width: 600px) {
          .story-grid      { gap: 48px !important; }
        }

        /* ===== ADDITIONAL RESPONSIVE FIXES FOR HERO ===== */
        @media (max-width: 900px) {
          /* Hide image column on mobile */
          .hero-image-col {
            display: none !important;
          }
          /* Left text column takes full width */
          .hero-text-col {
            flex: 1 1 100% !important;
            width: 100% !important;
          }
          /* Remove max‑width constraint on paragraph */
          .hero-text-col p {
            max-width: 100% !important;
          }
          /* Adjust heading size if needed */
          .hero-text-col h1 {
            font-size: clamp(36px, 6vw, 48px) !important;
          }
          /* Make buttons stack nicely */
          .hero-buttons {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .hero-buttons a, .hero-buttons button {
            width: 100% !important;
            justify-content: center !important;
            margin-left: 0 !important;
          }
          /* Reduce left column padding on mobile */
          .hero-section {
            padding: 80px 24px 180px !important;
          }
        }
      `}</style>

      <div className="about-page">
        <NavBar />

        {/* ══════════════════════════════════
            HERO
        ══════════════════════════════════ */}
        <section
          ref={heroRef}
          className="hero-section"
          style={{
            minHeight: "92vh",
            background: `linear-gradient(145deg, ${FOREST} 0%, #1A3E0C 45%, #2A5E16 100%)`,
            position: "relative",
            overflow: "hidden",
            padding: "120px 80px 210px",
          }}
        >
          {/* Grain texture overlay */}
          <div
            style={{
              position: "absolute",
              inset: "-50%",
              width: "200%",
              height: "200%",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
              backgroundSize: "180px 180px",
              opacity: 0.6,
              pointerEvents: "none",
              zIndex: 0,
              animation: "grain 8s steps(2) infinite",
            }}
          />

          {/* Animated ambient orbs */}
          {[
            {size: 600, top: "-20%", right: "8%", delay: 0, dur: 14},
            {size: 400, bottom: "4%", left: "4%", delay: 2, dur: 17},
            {size: 260, top: "35%", right: "30%", delay: 1, dur: 11},
          ].map((o, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, i % 2 === 0 ? 26 : -24, 0],
                y: [0, i % 2 === 0 ? -20 : 24, 0],
              }}
              transition={{
                duration: o.dur,
                repeat: Infinity,
                delay: o.delay,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                width: o.size,
                height: o.size,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${GOLD}1c 0%, transparent 68%)`,
                top: o.top,
                right: o.right,
                bottom: o.bottom,
                left: o.left,
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          ))}

          {/* Fine grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              backgroundImage: `linear-gradient(${GOLD}07 1px, transparent 1px), linear-gradient(90deg, ${GOLD}07 1px, transparent 1px)`,
              backgroundSize: "72px 72px",
              pointerEvents: "none",
            }}
          />

          {/* Diagonal streak */}
          <div
            style={{
              position: "absolute",
              top: "-10%",
              left: "-5%",
              width: "60%",
              height: "130%",
              background: `linear-gradient(120deg, transparent 0%, ${GOLD}06 40%, transparent 80%)`,
              transform: "skewX(-12deg)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Corner ornament — top left */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            style={{
              position: "absolute",
              top: 88,
              left: 80,
              opacity: 0.18,
              zIndex: 1,
            }}
          >
            <path
              d="M0 0 L60 0 M0 0 L0 60"
              stroke={GOLD_LIGHT}
              strokeWidth="0.8"
              fill="none"
            />
            <path
              d="M10 0 L0 0 L0 10"
              stroke={GOLD_LIGHT}
              strokeWidth="0.5"
              fill="none"
              opacity="0.5"
            />
            <circle cx="60" cy="0" r="2" fill={GOLD_LIGHT} opacity="0.4" />
            <circle cx="0" cy="60" r="2" fill={GOLD_LIGHT} opacity="0.4" />
          </svg>

          {/* Corner ornament — bottom right */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            style={{
              position: "absolute",
              bottom: 88,
              right: 80,
              opacity: 0.18,
              zIndex: 1,
              transform: "rotate(180deg)",
            }}
          >
            <path
              d="M0 0 L60 0 M0 0 L0 60"
              stroke={GOLD_LIGHT}
              strokeWidth="0.8"
              fill="none"
            />
            <circle cx="60" cy="0" r="2" fill={GOLD_LIGHT} opacity="0.4" />
            <circle cx="0" cy="60" r="2" fill={GOLD_LIGHT} opacity="0.4" />
          </svg>

          {/* Hero content */}
          <motion.div
            style={{
              y: parallaxY,
              opacity: heroOpacity,
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 56,
              maxWidth: 1360,
              margin: "0 auto",
            }}
            className="hero-content"
          >
            {/* Left: text column (now with a class for responsive targeting) */}
            <div
              className="hero-text-col"
              style={{flex: "1 1 380px", minWidth: 0}}
            >
              {/* Pill */}
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={isHeroInView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 0.7}}
                style={{marginBottom: 36}}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 20px",
                    border: `1px solid ${GOLD}55`,
                    background: `${GOLD}18`,
                    borderRadius: 100,
                  }}
                >
                  <motion.div
                    animate={{scale: [1, 1.5, 1], opacity: [1, 0.45, 1]}}
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
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "0.4em",
                      textTransform: "uppercase",
                      color: GOLD_LIGHT,
                    }}
                  >
                    Our Story
                  </span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{opacity: 0, y: 48, filter: "blur(8px)"}}
                animate={
                  isHeroInView ? {opacity: 1, y: 0, filter: "blur(0px)"} : {}
                }
                transition={{
                  duration: 1.1,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontSize: "clamp(44px, 5vw, 82px)",
                  fontWeight: 300,
                  color: "white",
                  margin: "0 0 28px",
                  lineHeight: 1.06,
                  letterSpacing: "-0.02em",
                }}
              >
                Born from the <br />
                <em
                  style={{
                    fontStyle: "italic",
                    background: `linear-gradient(90deg, ${GOLD_LIGHT} 0%, #A8D870 50%, ${GOLD_LIGHT} 100%)`,
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "shimmer-text 3s ease-in-out infinite",
                  }}
                >
                  Kenyan earth
                </em>
              </motion.h1>

              {/* Divider */}
              <motion.div
                initial={{opacity: 0, scaleX: 0}}
                animate={isHeroInView ? {opacity: 1, scaleX: 1} : {}}
                transition={{
                  duration: 0.9,
                  delay: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  width: 64,
                  height: 1,
                  transformOrigin: "left",
                  background: `linear-gradient(90deg, ${GOLD_LIGHT}, transparent)`,
                  marginBottom: 28,
                }}
              />

              <motion.p
                initial={{opacity: 0, y: 20}}
                animate={isHeroInView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 0.85, delay: 0.3}}
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.68)",
                  maxWidth: 480,
                  lineHeight: 1.95,
                  fontWeight: 300,
                  margin: "0 0 44px",
                  letterSpacing: "0.01em",
                }}
              >
                Mindful Living KE was born from a simple belief, that Kenya's
                abundant natural landscape holds the most powerful health
                solutions in the world. All was needed was just needed to
                utilise it.
              </motion.p>

              {/* Two CTAs */}
              <motion.div
                className="hero-buttons"
                initial={{opacity: 0, y: 20}}
                animate={isHeroInView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 0.8, delay: 0.45}}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  flexWrap: "wrap",
                }}
              >
                <Link to={"/discover-more"}>
                  <motion.button
                    whileHover={{
                      scale: 1.04,
                      boxShadow: `0 20px 50px ${GOLD}55`,
                    }}
                    whileTap={{scale: 0.97}}
                    style={{
                      background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                      border: "none",
                      borderRadius: 100,
                      padding: "14px 36px",
                      color: "white",
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      boxShadow: `0 12px 36px ${GOLD}40`,
                      fontFamily: "'Jost', sans-serif",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <motion.span
                      animate={{x: ["-100%", "200%"]}}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        repeatDelay: 1.5,
                        ease: "easeInOut",
                      }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)",
                        pointerEvents: "none",
                      }}
                    />
                    Shop the Collection
                  </motion.button>
                </Link>
                <Link to={"/blog"}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 11,
                      fontWeight: 400,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "rgba(240,247,236,0.55)",
                      fontFamily: "'Jost', sans-serif",
                      transition: "color 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = GOLD_LIGHT)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(240,247,236,0.55)")
                    }
                  >
                    Read Our Journal
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
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Right: floating image (now with a class for hiding on mobile) */}
            <div className="hero-image-col" style={{flex: "1 1 480px"}}>
              <FloatingImage inView={isHeroInView} />
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            className="stats-bar"
            initial={{opacity: 0, y: 24}}
            animate={isHeroInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.85, delay: 0.6}}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(8,22,4,0.6)",
              backdropFilter: "blur(20px) saturate(1.4)",
              WebkitBackdropFilter: "blur(20px) saturate(1.4)",
              borderTop: `1px solid ${GOLD}28`,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              zIndex: 3,
            }}
          >
            {stats.map(([n, l], i) => (
              <div
                key={l}
                style={{
                  padding: "28px 56px",
                  textAlign: "center",
                  borderRight:
                    i < stats.length - 1 ? `1px solid ${GOLD}20` : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 36,
                    fontWeight: 300,
                    color: "white",
                    letterSpacing: "-0.01em",
                  }}
                >
                  <AnimatedNumber target={n} />
                </div>
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: `${GOLD_LIGHT}bb`,
                    marginTop: 6,
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ══════════════════════════════════
            MANIFESTO BAND
        ══════════════════════════════════ */}
        <RevealSection>
          <div
            className="manifesto-section"
            style={{
              background: GOLD_PALE,
              padding: "96px 80px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                left: 80,
                fontFamily: "'Playfair Display', serif",
                fontSize: 180,
                fontWeight: 300,
                lineHeight: 1,
                color: `${GOLD}10`,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              "
            </div>

            <SectionLabel text="Our Manifesto" />

            <p
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(22px, 3vw, 42px)",
                color: "#2C3A28",
                lineHeight: 1.55,
                maxWidth: 760,
                margin: "0 auto 32px",
                position: "relative",
              }}
            >
              Your health to us is gold . We believe you deserve the best out
              there and we are the right destination.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <div style={{width: 40, height: 1, background: GOLD}} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: MUTED,
                }}
              >
                Dawn Kawiria, Founder
              </span>
              <div style={{width: 40, height: 1, background: GOLD}} />
            </div>
          </div>
        </RevealSection>

        <section
          className="page-section"
          style={{padding: "108px 80px", maxWidth: 1400, margin: "0 auto"}}
        >
          <div style={{textAlign: "center", marginBottom: 72}}>
            <RevealSection>
              <SectionLabel text="What We Stand For" />
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(32px, 4vw, 56px)",
                  fontWeight: 300,
                  color: DARK,
                  margin: "0 0 18px",
                  letterSpacing: "-0.015em",
                }}
              >
                Our Core{" "}
                <em style={{fontStyle: "italic", color: GOLD}}>Values</em>
              </h2>
              <p
                style={{
                  fontSize: 14.5,
                  color: MUTED,
                  maxWidth: 460,
                  margin: "0 auto",
                  fontWeight: 300,
                  lineHeight: 1.9,
                }}
              >
                The principles that guide every ingredient we choose, every
                Company we partner with, and every product we put our name on.
              </p>
            </RevealSection>
          </div>

          <div
            className="values-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {values.map((v, i) => (
              <ValueCard
                key={v.title}
                icon={v.icon}
                title={v.title}
                body={v.body}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════
            STORY + TIMELINE
        ══════════════════════════════════ */}
        <section
          style={{
            background: `linear-gradient(155deg, ${GOLD_PALE} 0%, #ddf0c0 55%, #eef8e4 100%)`,
            padding: "108px 80px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative watermark */}
          <div
            style={{
              position: "absolute",
              right: -60,
              top: "10%",
              fontSize: 320,
              opacity: 0.035,
              pointerEvents: "none",
              fontFamily: "serif",
              transform: "rotate(20deg)",
              lineHeight: 1,
              color: GOLD,
              userSelect: "none",
            }}
          >
            ✿
          </div>
          {/* Second watermark */}
          <div
            style={{
              position: "absolute",
              left: -40,
              bottom: "5%",
              fontSize: 200,
              opacity: 0.025,
              pointerEvents: "none",
              fontFamily: "serif",
              transform: "rotate(-15deg)",
              lineHeight: 1,
              color: GOLD,
              userSelect: "none",
            }}
          >
            ✦
          </div>

          <div
            className="story-grid"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 100,
              alignItems: "start",
            }}
          >
            {/* Left side – unchanged narrative */}
            <RevealSection>
              <SectionLabel text="Our Journey" />
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(32px, 3.5vw, 52px)",
                  fontWeight: 300,
                  color: DARK,
                  margin: "0 0 30px",
                  lineHeight: 1.18,
                  letterSpacing: "-0.01em",
                }}
              >
                Two years of growing{" "}
                <em style={{fontStyle: "italic", color: GOLD}}>with BF suma</em>
              </h2>

              <p
                style={{
                  fontSize: 14.5,
                  color: MUTED,
                  lineHeight: 2.05,
                  fontWeight: 300,
                  margin: "0 0 22px",
                }}
              >
                What started as just a product distribution expercise with the
                company's porducts became Kenya's most-loved natural wellness
                brand. We've never strayed from our founding principle.
              </p>
              <p
                style={{
                  fontSize: 14.5,
                  color: MUTED,
                  lineHeight: 2.05,
                  fontWeight: 300,
                  margin: "0 0 40px",
                }}
              >
                Every product we create is tested by real poeple, for healthy
                skin, with the full spectrum of melanin in mind.
              </p>

              {/* Pull quote */}
              <div
                style={{
                  padding: "28px 32px",
                  borderLeft: `3px solid ${GOLD}`,
                  background: "rgba(255,255,255,0.65)",
                  borderRadius: "0 20px 20px 0",
                  backdropFilter: "blur(12px)",
                  boxShadow: `0 8px 32px -8px ${GOLD}18`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    fontSize: 100,
                    fontFamily: "'Playfair Display', serif",
                    color: `${GOLD}10`,
                    lineHeight: 1,
                    pointerEvents: "none",
                  }}
                >
                  "
                </div>
                <p
                  style={{
                    fontFamily:
                      "'Cormorant Garamond', 'Playfair Display', serif",
                    fontStyle: "italic",
                    fontSize: 18,
                    fontWeight: 400,
                    color: DARK,
                    margin: 0,
                    lineHeight: 1.7,
                  }}
                >
                  "Your health to us is Gold"
                </p>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    color: GOLD,
                    textTransform: "uppercase",
                    margin: "12px 0 0",
                    fontWeight: 600,
                  }}
                >
                  — Dawn Kawiria, Founder
                </p>
              </div>
            </RevealSection>

            {/* ── Right side: CREATIVE REPLACEMENT for timeline ── */}
            <RevealSection delay={0.15}>
              <div>
                {/* Section label inside right side */}
                <div style={{marginBottom: 32}}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    <div style={{width: 28, height: 1, background: GOLD}} />
                    <span
                      style={{
                        fontSize: 8,
                        letterSpacing: "0.38em",
                        textTransform: "uppercase",
                        color: MUTED,
                      }}
                    >
                      From Soil to Soul
                    </span>
                    <div style={{width: 28, height: 1, background: GOLD}} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(20px, 3vw, 28px)",
                      fontWeight: 400,
                      color: DARK,
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    The pillars we stand on
                  </h3>
                </div>

                {/* 4 creative pillars – replaces the timeline list */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 28,
                  }}
                >
                  {[
                    {
                      icon: <RiPlantFill />,
                      title: "Regenerative farming",
                      desc: "We work with 40+ farms that rebuild soil health, store carbon, and mimic nature.",
                    },
                    {
                      icon: <FaExchangeAlt />,
                      title: "Direct trade",
                      desc: "No middlemen. Strictly just us doing what we do best.",
                    },
                    {
                      icon: <GiMicroscope />,
                      title: "Cold extraction",
                      desc: "Our lab uses low‑heat, low‑waste methods to preserve every active compound.",
                    },
                    {
                      icon: <RiRecycleFill />,
                      title: "Zero waste",
                      desc: "All packaging is recycleable.",
                    },
                  ].map((pillar, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "rgba(255,255,255,0.6)",
                        backdropFilter: "blur(8px)",
                        borderRadius: 24,
                        padding: "24px 20px",
                        border: `1px solid ${GOLD}20`,
                        transition: "all 0.25s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.transform = "translateY(-4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.6)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <div
                        style={{
                          fontSize: 32,
                          marginBottom: 14,
                          lineHeight: 1,
                        }}
                      >
                        {pillar.icon}
                      </div>
                      <h4
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: 16,
                          fontWeight: 500,
                          color: DARK,
                          margin: "0 0 8px",
                        }}
                      >
                        {pillar.title}
                      </h4>
                      <p
                        style={{
                          fontSize: 12,
                          color: MUTED,
                          lineHeight: 1.65,
                          margin: 0,
                          fontWeight: 300,
                        }}
                      >
                        {pillar.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Small note at bottom – ties back to the land */}
                <div
                  style={{
                    marginTop: 32,
                    textAlign: "center",
                    fontSize: 10,
                    color: MUTED,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    style={{
                      background: `${GOLD}15`,
                      padding: "6px 14px",
                      borderRadius: 60,
                    }}
                  >
                    proudly grown, made & loved in Kenya
                  </span>
                </div>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* ══════════════════════════════════
            INGREDIENTS RIBBON
        ══════════════════════════════════ */}
        <RevealSection>
          <div
            style={{
              background: FOREST,
              padding: "52px 80px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `linear-gradient(${GOLD}06 1px, transparent 1px), linear-gradient(90deg, ${GOLD}06 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 32,
                maxWidth: 1200,
                margin: "0 auto",
                position: "relative",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 500,
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    color: `${GOLD_LIGHT}80`,
                    marginBottom: 10,
                  }}
                >
                  Key Botanicals
                </p>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(22px, 2.5vw, 34px)",
                    fontWeight: 300,
                    color: "white",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  14 rare actives.{" "}
                  <em style={{fontStyle: "italic", color: GOLD_LIGHT}}>
                    One formula.
                  </em>
                </h3>
              </div>

              <div style={{display: "flex", flexWrap: "wrap", gap: 12}}>
                {[
                  "Moringa",
                  "Neem",
                  "Turmeric",
                  "Baobab",
                  "Shea",
                  "Tea Tree",
                  "Aloe",
                  "Frankincense",
                  "Rosehip",
                  "Calendula",
                  "Black Seed",
                  "Hibiscus",
                  "African Violet",
                  "Marula",
                ].map((herb, i) => (
                  <motion.span
                    key={herb}
                    initial={{opacity: 0, y: 10}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5, delay: i * 0.04}}
                    style={{
                      padding: "6px 16px",
                      border: `1px solid ${GOLD}30`,
                      background: `${GOLD}12`,
                      borderRadius: 100,
                      fontSize: 11,
                      fontWeight: 300,
                      letterSpacing: "0.1em",
                      color: "rgba(240,247,236,0.7)",
                    }}
                  >
                    {herb}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ══════════════════════════════════
            TEAM
        ══════════════════════════════════ */}
        <section
          className="page-section"
          style={{padding: "108px 80px", maxWidth: 1400, margin: "0 auto"}}
        >
          <div style={{textAlign: "center", marginBottom: 72}}>
            <RevealSection>
              <SectionLabel text="The Faces Behind the Brand" />
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(32px, 4vw, 56px)",
                  fontWeight: 300,
                  color: DARK,
                  margin: "0 0 18px",
                  letterSpacing: "-0.015em",
                }}
              >
                Meet the{" "}
                <em style={{fontStyle: "italic", color: GOLD}}>Team</em>
              </h2>
              <p
                style={{
                  fontSize: 14.5,
                  color: MUTED,
                  maxWidth: 420,
                  margin: "0 auto",
                  fontWeight: 300,
                  lineHeight: 1.9,
                }}
              >
                The scientists, farmers, and dreamers behind every bottle. Hover
                a card to hear them speak.
              </p>
            </RevealSection>
          </div>

          <div
            className="team-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 28,
            }}
          >
            {team.map((member, i) => (
              <TeamMember
                key={member.name}
                name={member.name}
                role={member.role}
                bio={member.bio}
                initial={member.initial}
                quote={member.quote}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════
            CTA STRIP
        ══════════════════════════════════ */}
        <section
          className="cta-section"
          style={{
            background: `linear-gradient(135deg, ${FOREST} 0%, #1E4A10 55%, #2E6B1A 100%)`,
            padding: "96px 80px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(${GOLD}06 1px, transparent 1px), linear-gradient(90deg, ${GOLD}06 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
              pointerEvents: "none",
            }}
          />

          {/* Corner ornaments */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            style={{position: "absolute", top: 40, left: 80, opacity: 0.15}}
          >
            <path
              d="M0 0 L40 0 M0 0 L0 40"
              stroke={GOLD_LIGHT}
              strokeWidth="0.8"
              fill="none"
            />
          </svg>
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            style={{
              position: "absolute",
              bottom: 40,
              right: 80,
              opacity: 0.15,
              transform: "rotate(180deg)",
            }}
          >
            <path
              d="M0 0 L40 0 M0 0 L0 40"
              stroke={GOLD_LIGHT}
              strokeWidth="0.8"
              fill="none"
            />
          </svg>

          <motion.div
            initial={{opacity: 0, y: 32}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.9, ease: [0.16, 1, 0.3, 1]}}
            style={{position: "relative", zIndex: 1}}
          >
            <SectionLabel text="Start Your Ritual" light />

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(30px, 3.5vw, 52px)",
                fontWeight: 300,
                color: "white",
                margin: "0 0 22px",
                letterSpacing: "-0.01em",
              }}
            >
              Ready to go{" "}
              <em
                style={{
                  fontStyle: "italic",
                  background: `linear-gradient(90deg, ${GOLD_LIGHT}, #A8D870, ${GOLD_LIGHT})`,
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "shimmer-text 3s ease-in-out infinite",
                }}
              >
                natural?
              </em>
            </h2>

            <p
              style={{
                fontSize: 14.5,
                color: "rgba(255,255,255,0.6)",
                margin: "0 auto 48px",
                maxWidth: 420,
                lineHeight: 1.95,
                fontWeight: 300,
              }}
            >
              Explore our full range of natural health supplementaries crafted
              with purpose, precision, and a deep love for green solutions.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              <Link to={"/discover-more"}>
                <motion.button
                  whileHover={{scale: 1.05, boxShadow: `0 24px 56px ${GOLD}60`}}
                  whileTap={{scale: 0.97}}
                  style={{
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                    border: "none",
                    borderRadius: 100,
                    padding: "16px 48px",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    boxShadow: `0 12px 40px ${GOLD}45`,
                    fontFamily: "'Jost', sans-serif",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <motion.span
                    animate={{x: ["-100%", "200%"]}}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                      ease: "easeInOut",
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
                      pointerEvents: "none",
                    }}
                  />
                  Shop the Collection
                </motion.button>
              </Link>
              <Link to={"/blog"}>
                <button
                  style={{
                    background: "none",
                    border: `1px solid ${GOLD}40`,
                    borderRadius: 100,
                    padding: "16px 40px",
                    color: "rgba(240,247,236,0.7)",
                    fontSize: 12,
                    fontWeight: 400,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: "'Jost', sans-serif",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${GOLD}22`;
                    e.currentTarget.style.borderColor = `${GOLD}80`;
                    e.currentTarget.style.color = "rgba(240,247,236,0.95)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.borderColor = `${GOLD}40`;
                    e.currentTarget.style.color = "rgba(240,247,236,0.7)";
                  }}
                >
                  Read Our Journal
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </main>
  );
};

export default AboutPage;
