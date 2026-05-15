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
import {RiPlantLine, RiLeafLine} from "react-icons/ri";
import {MdScience} from "react-icons/md";
import {FaShippingFast, FaLeaf} from "react-icons/fa";
import {BsPatchQuestion} from "react-icons/bs";
import {HiOutlineSparkles} from "react-icons/hi";

// ── Palette (matches AboutPage) ──
const GOLD = "#4A8C2A";
const GOLD_LIGHT = "#72B84A";
const GOLD_PALE = "#E8F5E0";
const CREAM = "#F7FBF4";
const DARK = "#1A1A1A";
const MUTED = "#5A7A4A";
const FOREST = "#14280F";

// ── FAQ Data ──
const categories = [
  {
    id: "products",
    label: "Products",
    icon: <RiPlantLine />,
    color: GOLD,
    faqs: [
      {
        q: "Are all your products 100% natural?",
        a: "Absolutely. Every single product in our range is formulated exclusively with natural, plant-derived ingredients. We rigorously screen for harmful synthetics, parabens, sulphates, and harsh chemicals. Each ingredient is traceable back to its source , most within Kenya's own rich botanical landscape.",
      },
      {
        q: "Are your products suitable for all skin tones?",
        a: "Yes. From the very beginning, inclusivity has been central to our mission. Every formula is tested across the full spectrum of melanin, ensuring efficacy and safety for all skin tones. We are proudly made for African skin, and for every skin.",
      },
      {
        q: "Do you test on animals?",
        a: "Never. We are proudly cruelty-free. All our products are tested by real people , volunteers from our community , in controlled, ethical conditions overseen by our in-house dermatologist.",
      },
      {
        q: "What is the shelf life of your products?",
        a: "Because we use natural preservatives and avoid synthetics, shelf life varies by product , typically 12–24 months from manufacture. Each product is clearly labelled with its best-before date. We recommend storing products away from direct sunlight and heat.",
      },
    ],
  },
  {
    id: "ingredients",
    label: "Ingredients",
    icon: <FaLeaf />,
    color: "#5EA832",
    faqs: [
      {
        q: "Where do your ingredients come from?",
        a: "We partner with 40+ farms across Kenya and the East African region , from the Rift Valley highlands to the coastal lowlands. Farmers are paid fairly above market rate, and we conduct regular on-site visits to verify regenerative farming practices.",
      },
      {
        q: "What are your hero botanicals?",
        a: "Our formulas are built around 14 rare African actives: Moringa, Neem, Turmeric, Baobab, Shea, Tea Tree, Aloe, Frankincense, Rosehip, Calendula, Black Seed, Hibiscus, African Violet, and Marula. Each is cold-extracted to preserve the full potency of its active compounds.",
      },
      {
        q: "Are your products safe for sensitive skin?",
        a: "Yes. Our dermatologist-led formulation process pays particular attention to reactive and sensitive skin types. We avoid known irritants, always patch-test formulas, and clearly list every ingredient on our packaging using both common and INCI names.",
      },
      {
        q: "Do any products contain allergens?",
        a: "Some products contain tree-nut derivatives (e.g. Shea, Marula) or essential oils that may trigger reactions in individuals with specific allergies. We strongly recommend reviewing the full ingredient list , available on every product page , before purchasing. When in doubt, consult your dermatologist.",
      },
    ],
  },
  {
    id: "science",
    label: "Science & Safety",
    icon: <MdScience />,
    color: "#3D7A20",
    faqs: [
      {
        q: "How are your products tested?",
        a: "Every product goes through a multi-stage quality protocol: botanical screening in our lab, cold-extraction to preserve actives, stability testing, patch testing on volunteer panels, and a final sign-off by our in-house dermatologist. Only products that pass every stage reach our shelves.",
      },
      {
        q: "Are your products certified?",
        a: "We hold multiple quality certifications and are proud to be certified carbon-neutral. We are also working toward organic certification for our core skincare line. Specific certifications are listed on each product page.",
      },
      {
        q: "Can I use your products alongside prescription skincare?",
        a: "While our products are gentle and natural, we always recommend consulting your dermatologist before layering them with prescription treatments (e.g. retinoids, hydroquinone). Our team is available to advise on compatibility , reach us via our contact page.",
      },
    ],
  },
  {
    id: "orders",
    label: "Orders & Delivery",
    icon: <FaShippingFast />,
    color: "#629A35",
    faqs: [
      {
        q: "Where do you deliver?",
        a: "We deliver across Kenya, Uganda, and Tanzania. Nairobi orders qualify for same-day or next-day delivery. Upcountry and regional deliveries typically take 2–5 business days. Shipping costs and estimated delivery windows are shown at checkout.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order is dispatched, you will receive an SMS and email with a tracking link. You can also log into your account on our website and view real-time order status under 'My Orders'.",
      },
      {
        q: "Can I return or exchange a product?",
        a: "Yes. We offer a 14-day return window for unopened, sealed products. If a product causes a reaction or arrives damaged, we will arrange a full replacement or refund — no questions asked. Simply contact our customer care team with your order number and a brief description.",
      },
      {
        q: "Do you offer wholesale or bulk orders?",
        a: "We do. We work with wellness retailers, spas, hotels, and corporate gifting programmes across East Africa. For wholesale enquiries, please email wholesale@mindfullivingke.co.ke or fill out the wholesale form on our contact page.",
      },
    ],
  },
  {
    id: "sustainability",
    label: "Sustainability",
    icon: <RiLeafLine />,
    color: "#4A8C2A",
    faqs: [
      {
        q: "How is Mindful Living KE carbon-neutral?",
        a: "We offset our full carbon footprint through a combination of on-farm carbon sequestration (via our regenerative farming partners), use of solar energy at our lab, and certified carbon credits. We publish an annual sustainability report detailing our emissions and offsets.",
      },
      {
        q: "What is your packaging made from?",
        a: "All our packaging is either fully recyclable or made from post-consumer recycled materials. We are actively phasing out any single-use plastic and replacing it with glass, aluminium, and compostable alternatives.",
      },
      {
        q: "I heard you give discounts for recycling , how does that work?",
        a: "Yes! Bring any empty Mindful Living KE container to one of our partner drop-off points (listed on our website) or send us photographic proof of recycling via our app. You'll receive a discount code for your next order. It's our small way of closing the loop.",
      },
    ],
  },
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

// ── Reusable: Reveal Section ──
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

// ── FAQ Accordion Item ──
const FaqItem = ({q, a, index, categoryColor}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, {once: true, margin: "-20px"});

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, y: 32, filter: "blur(4px)"}}
      animate={inView ? {opacity: 1, y: 0, filter: "blur(0px)"} : {}}
      transition={{
        duration: 0.75,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{marginBottom: 12}}
    >
      <motion.div
        onClick={() => setOpen(!open)}
        whileHover={{scale: 1.005}}
        transition={{duration: 0.2}}
        style={{
          background: open ? "white" : "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          border: `1px solid ${open ? categoryColor + "35" : GOLD + "14"}`,
          borderRadius: open ? "24px 24px 0 0" : 24,
          padding: "22px 28px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          boxShadow: open
            ? `0 8px 32px -8px ${categoryColor}22`
            : "0 2px 12px -4px rgba(30,70,10,0.06)",
          transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left accent bar */}
        <motion.div
          animate={{scaleY: open ? 1 : 0, opacity: open ? 1 : 0}}
          transition={{duration: 0.4}}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: `linear-gradient(to bottom, ${categoryColor}, ${GOLD_LIGHT})`,
            transformOrigin: "top",
            borderRadius: "0 0 0 24px",
          }}
        />

        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(14px, 1.8vw, 17px)",
            fontWeight: open ? 500 : 400,
            color: open ? DARK : "#2C3A28",
            lineHeight: 1.45,
            transition: "all 0.3s",
            paddingLeft: open ? 8 : 0,
          }}
        >
          {q}
        </span>

        <motion.div
          animate={{
            rotate: open ? 45 : 0,
            background: open ? categoryColor + "18" : GOLD_PALE,
          }}
          transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: open ? categoryColor : GOLD,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </motion.div>
      </motion.div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
            style={{overflow: "hidden"}}
          >
            <div
              style={{
                background: "white",
                border: `1px solid ${categoryColor}25`,
                borderTop: "none",
                borderRadius: "0 0 24px 24px",
                padding: "20px 28px 26px 36px",
                boxShadow: `0 12px 36px -8px ${categoryColor}18`,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: MUTED,
                  lineHeight: 2.0,
                  margin: 0,
                  fontWeight: 300,
                  fontFamily: "'Jost', sans-serif",
                }}
              >
                {a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Category Tab ──
const CategoryTab = ({cat, active, onClick, index}) => {
  const ref = useRef(null);
  const inView = useInView(ref, {once: true});

  return (
    <motion.button
      ref={ref}
      initial={{opacity: 0, y: 20}}
      animate={inView ? {opacity: 1, y: 0} : {}}
      transition={{duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1]}}
      onClick={onClick}
      whileHover={{scale: 1.04}}
      whileTap={{scale: 0.97}}
      style={{
        background: active ? FOREST : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${active ? GOLD + "50" : GOLD + "18"}`,
        borderRadius: 100,
        padding: "11px 24px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 9,
        fontFamily: "'Jost', sans-serif",
        fontSize: 11,
        fontWeight: active ? 500 : 400,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: active ? GOLD_LIGHT : MUTED,
        boxShadow: active
          ? `0 12px 32px -8px ${GOLD}40, 0 0 0 1px ${GOLD}25`
          : "0 2px 8px -4px rgba(30,70,10,0.08)",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{fontSize: 15, color: active ? GOLD_LIGHT : GOLD, lineHeight: 1}}
      >
        {cat.icon}
      </span>
      {cat.label}
      <span
        style={{
          background: active ? `${GOLD_LIGHT}30` : `${GOLD}14`,
          color: active ? GOLD_LIGHT : MUTED,
          borderRadius: 100,
          padding: "2px 8px",
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.1em",
          transition: "all 0.3s",
        }}
      >
        {cat.faqs.length}
      </span>
    </motion.button>
  );
};

// ── Floating Orb ──
const Orb = ({size, top, left, right, bottom, delay, dur, opacity = "1c"}) => (
  <motion.div
    animate={{x: [0, 20, 0], y: [0, -16, 0]}}
    transition={{duration: dur, repeat: Infinity, delay, ease: "easeInOut"}}
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${GOLD}${opacity} 0%, transparent 68%)`,
      top,
      left,
      right,
      bottom,
      pointerEvents: "none",
      zIndex: 0,
    }}
  />
);

// ── Contact Strip ──
const ContactStrip = () => {
  const ref = useRef(null);
  const inView = useInView(ref, {once: true});

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, y: 40}}
      animate={inView ? {opacity: 1, y: 0} : {}}
      transition={{duration: 0.9, ease: [0.16, 1, 0.3, 1]}}
      style={{
        background: GOLD_PALE,
        borderRadius: 36,
        padding: "52px 56px",
        textAlign: "center",
        border: `1px solid ${GOLD}18`,
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 24px 64px -16px ${GOLD}18`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -40,
          fontSize: 220,
          fontFamily: "'Playfair Display', serif",
          color: `${GOLD}08`,
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        ?
      </div>

      <div style={{position: "relative"}}>
        <motion.div
          animate={{rotate: [0, 8, -8, 0], scale: [1, 1.1, 1]}}
          transition={{duration: 4, repeat: Infinity, ease: "easeInOut"}}
          style={{
            fontSize: 36,
            color: GOLD,
            marginBottom: 16,
            display: "block",
          }}
        >
          <BsPatchQuestion />
        </motion.div>

        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(22px, 3vw, 34px)",
            fontWeight: 400,
            color: DARK,
            margin: "0 0 14px",
            lineHeight: 1.3,
          }}
        >
          Still have a{" "}
          <em style={{fontStyle: "italic", color: GOLD}}>question?</em>
        </h3>
        <p
          style={{
            fontSize: 14,
            color: MUTED,
            margin: "0 auto 32px",
            maxWidth: 380,
            lineHeight: 1.85,
            fontWeight: 300,
          }}
        >
          Our wellness team is available Monday – Saturday, 8 am to 6 pm EAT. We
          aim to respond to all queries within 2 hours.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {[
            {label: "WhatsApp Us", href: "#", primary: true},
            {label: "Send an Email", href: "#", primary: false},
          ].map(({label, href, primary}) => (
            <motion.a
              key={label}
              href={href}
              whileHover={{
                scale: 1.05,
                boxShadow: primary ? `0 16px 44px ${GOLD}45` : "none",
              }}
              whileTap={{scale: 0.97}}
              style={{
                display: "inline-block",
                padding: "14px 36px",
                borderRadius: 100,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontFamily: "'Jost', sans-serif",
                textDecoration: "none",
                cursor: "pointer",
                background: primary
                  ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`
                  : "transparent",
                color: primary ? "white" : GOLD,
                border: primary ? "none" : `1px solid ${GOLD}40`,
                boxShadow: primary ? `0 10px 28px ${GOLD}35` : "none",
                transition: "all 0.3s",
              }}
            >
              {label}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ══════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════
const Faqs = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, {once: true});
  const {scrollYProgress} = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const [activeCategory, setActiveCategory] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");

  const activeData = categories.find((c) => c.id === activeCategory);

  const filteredFaqs = searchQuery.trim()
    ? categories
        .flatMap((c) =>
          c.faqs.map((faq) => ({...faq, categoryColor: c.color, catId: c.id})),
        )
        .filter(
          (f) =>
            f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.a.toLowerCase().includes(searchQuery.toLowerCase()),
        )
    : null;

  return (
    <main style={{background: CREAM, minHeight: "100vh", overflowX: "hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
        * { box-sizing: border-box; }

        @keyframes shimmer-text {
          0%   { background-position: 0% center }
          50%  { background-position: 100% center }
          100% { background-position: 0% center }
        }
        @keyframes grain {
          0%,100% { transform: translate(0,0) }
          10%     { transform: translate(-2%,-3%) }
          30%     { transform: translate(3%,2%) }
          50%     { transform: translate(-1%,4%) }
          70%     { transform: translate(2%,-2%) }
          90%     { transform: translate(-3%,1%) }
        }
        @keyframes float-sparkle {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
          50%       { transform: translateY(-14px) rotate(180deg); opacity: 1; }
        }
        .faq-page { font-family: 'Jost', sans-serif; }
        .search-input::placeholder { color: ${MUTED}88; }
        .search-input:focus { outline: none; }
        .tab-scroll::-webkit-scrollbar { display: none; }
        .tab-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        @media (max-width: 900px) {
          .hero-section    { padding: 80px 24px 200px !important; }
          .faq-body        { padding: 64px 24px !important; }
          .contact-wrap    { padding: 64px 24px !important; }
        }
        @media (max-width: 600px) {
          .contact-card    { padding: 36px 28px !important; }
        }
      `}</style>

      <div className="faq-page">
        <NavBar />

        {/* ══════════════════════════════════
            HERO
        ══════════════════════════════════ */}
        <section
          ref={heroRef}
          className="hero-section"
          style={{
            minHeight: "72vh",
            background: `linear-gradient(145deg, ${FOREST} 0%, #1A3E0C 45%, #2A5E16 100%)`,
            position: "relative",
            overflow: "hidden",
            padding: "130px 80px 220px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Grain overlay */}
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

          {/* Grid */}
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

          {/* Orbs */}
          <Orb size={500} top="-15%" right="5%" delay={0} dur={14} />
          <Orb size={340} bottom="8%" left="3%" delay={2} dur={17} />
          <Orb
            size={220}
            top="40%"
            right="28%"
            delay={1}
            dur={11}
            opacity="14"
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

          {/* Corner ornament TL */}
          <svg
            width="100"
            height="100"
            viewBox="0 0 120 120"
            style={{
              position: "absolute",
              top: 80,
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
            <circle cx="60" cy="0" r="2" fill={GOLD_LIGHT} opacity="0.4" />
            <circle cx="0" cy="60" r="2" fill={GOLD_LIGHT} opacity="0.4" />
          </svg>
          {/* Corner ornament BR */}
          <svg
            width="100"
            height="100"
            viewBox="0 0 120 120"
            style={{
              position: "absolute",
              bottom: 80,
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

          {/* Floating sparkles */}
          {[
            {top: "18%", left: "12%", delay: "0s", size: 18},
            {top: "65%", left: "8%", delay: "1.2s", size: 12},
            {top: "22%", right: "14%", delay: "0.6s", size: 14},
            {top: "70%", right: "10%", delay: "1.8s", size: 10},
          ].map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: s.top,
                left: s.left,
                right: s.right,
                fontSize: s.size,
                color: `${GOLD_LIGHT}70`,
                animation: `float-sparkle 3.5s ease-in-out ${s.delay} infinite`,
                zIndex: 1,
                pointerEvents: "none",
              }}
            >
              <HiOutlineSparkles />
            </div>
          ))}

          {/* Hero content */}
          <motion.div
            style={{
              y: parallaxY,
              opacity: heroOpacity,
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              width: "100%",
              maxWidth: 860,
            }}
          >
            {/* Pill badge */}
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={isHeroInView ? {opacity: 1, y: 0} : {}}
              transition={{duration: 0.7}}
              style={{
                marginBottom: 36,
                display: "flex",
                justifyContent: "center",
              }}
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
                  animate={{scale: [1, 1.5, 1], opacity: [1, 0.4, 1]}}
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
                  Help Centre
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{opacity: 0, y: 52, filter: "blur(10px)"}}
              animate={
                isHeroInView ? {opacity: 1, y: 0, filter: "blur(0px)"} : {}
              }
              transition={{duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1]}}
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "clamp(44px, 6vw, 88px)",
                fontWeight: 300,
                color: "white",
                margin: "0 0 24px",
                lineHeight: 1.06,
                letterSpacing: "-0.025em",
              }}
            >
              Frequently{" "}
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
                Asked
              </em>
              <br />
              Questions
            </motion.h1>

            {/* Divider */}
            <motion.div
              initial={{opacity: 0, scaleX: 0}}
              animate={isHeroInView ? {opacity: 1, scaleX: 1} : {}}
              transition={{duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1]}}
              style={{
                width: 64,
                height: 1,
                transformOrigin: "center",
                background: `linear-gradient(90deg, transparent, ${GOLD_LIGHT}, transparent)`,
                margin: "0 auto 28px",
              }}
            />

            <motion.p
              initial={{opacity: 0, y: 20}}
              animate={isHeroInView ? {opacity: 1, y: 0} : {}}
              transition={{duration: 0.85, delay: 0.3}}
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.62)",
                maxWidth: 520,
                margin: "0 auto 52px",
                lineHeight: 1.95,
                fontWeight: 300,
                letterSpacing: "0.01em",
              }}
            >
              Everything you need to know about our products, ingredients,
              delivery, and sustainability mission — all in one place.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{opacity: 0, y: 24, scale: 0.97}}
              animate={isHeroInView ? {opacity: 1, y: 0, scale: 1} : {}}
              transition={{
                duration: 0.85,
                delay: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: "relative",
                maxWidth: 560,
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: -1,
                  borderRadius: 100,
                  background: `linear-gradient(135deg, ${GOLD}60, ${GOLD_LIGHT}40, ${GOLD}60)`,
                  backgroundSize: "200% auto",
                  animation: "shimmer-text 4s linear infinite",
                  zIndex: 0,
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(8,22,4,0.75)",
                  backdropFilter: "blur(16px)",
                  borderRadius: 100,
                  padding: "4px 4px 4px 24px",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={`${GOLD_LIGHT}80`}
                  strokeWidth="2"
                  style={{flexShrink: 0, marginRight: 12}}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search questions…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    fontSize: 14,
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    color: "rgba(240,247,236,0.85)",
                    letterSpacing: "0.02em",
                    padding: "12px 0",
                  }}
                />
                {searchQuery && (
                  <motion.button
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.8}}
                    onClick={() => setSearchQuery("")}
                    style={{
                      background: `${GOLD}25`,
                      border: "none",
                      borderRadius: 100,
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: GOLD_LIGHT,
                      marginRight: 8,
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}
                <motion.button
                  whileHover={{scale: 1.05}}
                  whileTap={{scale: 0.96}}
                  style={{
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                    border: "none",
                    borderRadius: 100,
                    padding: "12px 28px",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: "'Jost', sans-serif",
                    flexShrink: 0,
                    boxShadow: `0 6px 20px ${GOLD}40`,
                  }}
                >
                  Search
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Stat bubbles anchored to bottom */}
          <motion.div
            initial={{opacity: 0, y: 24}}
            animate={isHeroInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.85, delay: 0.65}}
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
            {[
              ["5", "Categories"],
              [
                `${categories.reduce((a, c) => a + c.faqs.length, 0)}`,
                "Questions Answered",
              ],
              ["2h", "Avg. Response Time"],
              ["7d", "Support Available"],
            ].map(([n, l], i, arr) => (
              <div
                key={l}
                style={{
                  padding: "22px 48px",
                  textAlign: "center",
                  borderRight:
                    i < arr.length - 1 ? `1px solid ${GOLD}20` : "none",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 32,
                    fontWeight: 300,
                    color: "white",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: `${GOLD_LIGHT}bb`,
                    marginTop: 5,
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ══════════════════════════════════
            FAQ BODY
        ══════════════════════════════════ */}
        <section
          className="faq-body"
          style={{padding: "96px 80px", maxWidth: 1200, margin: "0 auto"}}
        >
          {/* Search results view */}
          <AnimatePresence mode="wait">
            {searchQuery.trim() ? (
              <motion.div
                key="search-results"
                initial={{opacity: 0, y: 24}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -16}}
                transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
              >
                <RevealSection>
                  <div style={{textAlign: "center", marginBottom: 56}}>
                    <SectionLabel text="Search Results" />
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(26px, 3vw, 40px)",
                        fontWeight: 300,
                        color: DARK,
                        margin: "0 0 12px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {filteredFaqs.length > 0 ? (
                        <>
                          Found{" "}
                          <em style={{fontStyle: "italic", color: GOLD}}>
                            {filteredFaqs.length}
                          </em>{" "}
                          result{filteredFaqs.length !== 1 ? "s" : ""}
                        </>
                      ) : (
                        <>
                          No results for{" "}
                          <em style={{fontStyle: "italic", color: GOLD}}>
                            "{searchQuery}"
                          </em>
                        </>
                      )}
                    </h2>
                    {filteredFaqs.length === 0 && (
                      <p style={{fontSize: 14, color: MUTED, fontWeight: 300}}>
                        Try a different keyword, or browse the categories below.
                      </p>
                    )}
                  </div>
                </RevealSection>

                {filteredFaqs.length > 0 &&
                  filteredFaqs.map((faq, i) => (
                    <FaqItem
                      key={i}
                      q={faq.q}
                      a={faq.a}
                      index={i}
                      categoryColor={faq.categoryColor}
                    />
                  ))}
              </motion.div>
            ) : (
              <motion.div
                key="category-view"
                initial={{opacity: 0, y: 24}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -16}}
                transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
              >
                {/* Section header */}
                <RevealSection>
                  <div style={{textAlign: "center", marginBottom: 52}}>
                    <SectionLabel text="Browse by Topic" />
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "clamp(28px, 3.5vw, 48px)",
                        fontWeight: 300,
                        color: DARK,
                        margin: "0 0 16px",
                        letterSpacing: "-0.015em",
                      }}
                    >
                      Choose a{" "}
                      <em style={{fontStyle: "italic", color: GOLD}}>
                        category
                      </em>
                    </h2>
                    <p
                      style={{
                        fontSize: 14,
                        color: MUTED,
                        maxWidth: 400,
                        margin: "0 auto",
                        fontWeight: 300,
                        lineHeight: 1.9,
                      }}
                    >
                      Select a topic below and explore the questions our
                      community asks most.
                    </p>
                  </div>
                </RevealSection>

                {/* Category tabs */}
                <div
                  className="tab-scroll"
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginBottom: 60,
                    overflowX: "auto",
                    padding: "4px 4px 16px",
                  }}
                >
                  {categories.map((cat, i) => (
                    <CategoryTab
                      key={cat.id}
                      cat={cat}
                      active={activeCategory === cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      index={i}
                    />
                  ))}
                </div>

                {/* Active category FAQs */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{opacity: 0, y: 20, filter: "blur(4px)"}}
                    animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
                    exit={{opacity: 0, y: -12, filter: "blur(4px)"}}
                    transition={{duration: 0.55, ease: [0.16, 1, 0.3, 1]}}
                  >
                    {/* Category heading strip */}
                    <div
                      style={{
                        background: `linear-gradient(135deg, ${FOREST} 0%, #1A4010 100%)`,
                        borderRadius: 24,
                        padding: "28px 36px",
                        marginBottom: 20,
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        border: `1px solid ${GOLD}25`,
                        boxShadow: `0 16px 40px -8px rgba(20,40,15,0.28)`,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `linear-gradient(${GOLD}06 1px, transparent 1px), linear-gradient(90deg, ${GOLD}06 1px, transparent 1px)`,
                          backgroundSize: "40px 40px",
                          pointerEvents: "none",
                        }}
                      />
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 16,
                          background: `${GOLD}25`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                          color: GOLD_LIGHT,
                          flexShrink: 0,
                          position: "relative",
                        }}
                      >
                        {activeData.icon}
                      </div>
                      <div style={{position: "relative"}}>
                        <div
                          style={{
                            fontSize: 9,
                            letterSpacing: "0.35em",
                            textTransform: "uppercase",
                            color: `${GOLD_LIGHT}80`,
                            marginBottom: 4,
                          }}
                        >
                          Category
                        </div>
                        <h3
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 22,
                            fontWeight: 400,
                            color: "white",
                            margin: 0,
                          }}
                        >
                          {activeData.label}
                        </h3>
                      </div>
                      <div style={{marginLeft: "auto", position: "relative"}}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 300,
                            color: `${GOLD_LIGHT}70`,
                            letterSpacing: "0.15em",
                          }}
                        >
                          {activeData.faqs.length} questions
                        </span>
                      </div>
                    </div>

                    {activeData.faqs.map((faq, i) => (
                      <FaqItem
                        key={faq.q}
                        q={faq.q}
                        a={faq.a}
                        index={i}
                        categoryColor={activeData.color}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ══════════════════════════════════
            MANIFESTO BAND
        ══════════════════════════════════ */}
        <RevealSection>
          <div
            style={{
              background: GOLD_PALE,
              padding: "80px 80px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -24,
                left: 60,
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

            <SectionLabel text="Our Promise" />

            <p
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(20px, 2.8vw, 38px)",
                color: "#2C3A28",
                lineHeight: 1.55,
                maxWidth: 680,
                margin: "0 auto 32px",
                position: "relative",
              }}
            >
              Your health to us is gold. Every question you ask helps us serve
              you better.
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

        {/* ══════════════════════════════════
            STILL HAVE A QUESTION?
        ══════════════════════════════════ */}
        <section
          className="contact-wrap"
          style={{padding: "96px 80px", maxWidth: 900, margin: "0 auto"}}
        >
          <ContactStrip />
        </section>

        {/* ══════════════════════════════════
            CTA STRIP
        ══════════════════════════════════ */}
        <section
          style={{
            background: `linear-gradient(135deg, ${FOREST} 0%, #1E4A10 55%, #2E6B1A 100%)`,
            padding: "80px 80px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
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
            initial={{opacity: 0, y: 28}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.9, ease: [0.16, 1, 0.3, 1]}}
            style={{position: "relative", zIndex: 1}}
          >
            <SectionLabel text="Explore the Collection" light />
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 3.5vw, 50px)",
                fontWeight: 300,
                color: "white",
                margin: "0 0 18px",
                letterSpacing: "-0.01em",
              }}
            >
              Ready to experience{" "}
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
                nature's best?
              </em>
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.58)",
                margin: "0 auto 44px",
                maxWidth: 380,
                lineHeight: 1.95,
                fontWeight: 300,
              }}
            >
              Browse our full range of natural wellness products, crafted with
              purpose and a deep love for the Kenyan earth.
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  label: "Shop the Collection",
                  primary: true,
                  href: "/discover-more",
                },
                {label: "Read Our Journal", primary: false, href: "/blog"},
              ].map(({label, primary, href}) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: primary ? `0 24px 56px ${GOLD}60` : "none",
                  }}
                  whileTap={{scale: 0.97}}
                  style={{
                    display: "inline-block",
                    padding: "15px 44px",
                    borderRadius: 100,
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontFamily: "'Jost', sans-serif",
                    textDecoration: "none",
                    background: primary
                      ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`
                      : "transparent",
                    color: primary ? "white" : "rgba(240,247,236,0.7)",
                    border: primary ? "none" : `1px solid ${GOLD}40`,
                    boxShadow: primary ? `0 12px 40px ${GOLD}45` : "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                >
                  {label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </main>
  );
};

export default Faqs;
