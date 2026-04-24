import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import NavBar from "../components/navBar";
import Footer from "../components/Footer";

// ── Mindful Living KE — Brand Palette ──
const GOLD = "#4A8C2A";
const GOLD_LIGHT = "#72B84A";
const GOLD_PALE = "#E8F5E0";
const CREAM = "#F7FBF4";
const DARK = "#1A1A1A";
const MUTED = "#5A7A4A";
const FOREST = "#14280F";
const INK = "#2C3A28";

const blogPosts = [
  {
    id: 1,
    category: "Skincare Science",
    readTime: "6 min",
    date: "April 18, 2025",
    month: "April 2025",
    title: "Why Cold-Press Extraction Preserves Every Molecule That Matters",
    excerpt:
      "Most brands use heat to process their botanicals. Heat is the enemy of efficacy. Our cold-press method keeps every bioactive compound intact — here's what that means for your skin.",
    author: {initials: "KM", name: "Dr. Kiprotich Mutai"},
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700&q=80&auto=format&fit=crop",
    variant: "feature",
  },
  {
    id: 2,
    category: "Ingredients",
    readTime: "4 min",
    date: "March 9, 2025",
    month: "March 2025",
    title: "Moringa: Africa's Most Underestimated Skin Superfood",
    excerpt: "",
    author: {initials: "FW", name: "Fatuma Wanjiku"},
    image:
      "https://images.unsplash.com/photo-1600428853876-fb5f43f4e6a4?w=600&q=80&auto=format&fit=crop",
    variant: "standard",
  },
  {
    id: 3,
    category: "Ritual",
    readTime: "5 min",
    date: "Feb 22, 2025",
    month: "February 2025",
    title: "The Two-Minute Evening Ritual That Changes Everything",
    excerpt: "",
    author: {initials: "AN", name: "Amina Njoroge"},
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80&auto=format&fit=crop",
    variant: "standard",
  },
  {
    id: 4,
    category: "Wellness",
    readTime: "7 min",
    date: "Jan 14, 2025",
    month: "January 2025",
    title:
      "Your Skin's Microbiome: The Invisible Garden You're Either Nurturing or Destroying",
    excerpt:
      "Billions of microorganisms live on your skin right now. They're your first line of defense — and most cleansers are quietly annihilating them. Here's how to make peace.",
    author: {initials: "KM", name: "Dr. Kiprotich Mutai"},
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=700&q=80&auto=format&fit=crop",
    variant: "wide",
  },
];

const categories = [
  {label: "All", count: 24},
  {label: "Skincare Science", count: 8},
  {label: "Ingredients", count: 6},
  {label: "Ritual & Routine", count: 5},
  {label: "Wellness", count: 3},
  {label: "Behind the Brand", count: 2},
];

// ── Sub-components ──

const AuthorAvatar = ({initials, size = 38, dark = false}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: dark
        ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`
        : GOLD_PALE,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.32,
      fontWeight: 500,
      color: dark ? "white" : GOLD,
      flexShrink: 0,
      letterSpacing: "0.05em",
    }}
  >
    {initials}
  </div>
);

const ArrowIcon = ({color = GOLD}) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const CardArrow = ({hovered}) => (
  <div
    style={{
      width: 36,
      height: 36,
      borderRadius: "50%",
      border: `1px solid ${hovered ? GOLD : "rgba(74,140,42,0.2)"}`,
      background: hovered ? GOLD : "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s",
      flexShrink: 0,
    }}
  >
    <ArrowIcon color={hovered ? "white" : GOLD} />
  </div>
);

const CardFooter = ({author, date, hovered}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 20,
      borderTop: `1px solid rgba(74,140,42,0.12)`,
    }}
  >
    <div style={{display: "flex", alignItems: "center", gap: 10}}>
      <AuthorAvatar initials={author.initials} size={30} />
      <div>
        <div style={{fontSize: 11, fontWeight: 400, color: INK}}>
          {author.name}
        </div>
        <div style={{fontSize: 10, color: MUTED}}>{date}</div>
      </div>
    </div>
    <CardArrow hovered={hovered} />
  </div>
);

const CardMeta = ({month}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 14,
    }}
  >
    <div
      style={{
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: GOLD,
      }}
    />
    <span style={{fontSize: 10, letterSpacing: "0.15em", color: MUTED}}>
      {month}
    </span>
  </div>
);

// ── Feature Card ──
const FeatureCard = ({post}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        overflow: "hidden",
        cursor: "pointer",
        gridRow: "1 / 3",
        gridColumn: "1",
        boxShadow: hovered
          ? "0 25px 40px -12px rgba(0,0,0,0.15)"
          : "0 8px 20px -6px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.4s ease",
      }}
    >
      <div style={{position: "relative", overflow: "hidden", height: 480}}>
        <img
          src={post.image}
          alt={post.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            opacity: hovered ? 0.85 : 0.7,
            filter: hovered ? "saturate(1)" : "saturate(0.8)",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition:
              "transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.4s, filter 0.4s",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(20,40,15,0.85) 0%, rgba(20,40,15,0.2) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            padding: "5px 14px",
            background: "rgba(74,140,42,0.9)",
            borderRadius: 100,
            fontSize: 8,
            fontWeight: 500,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "white",
          }}
        >
          {post.category}
        </span>
        <span
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            fontSize: 9,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {post.readTime}
        </span>
      </div>
      <div style={{padding: "32px 36px 36px"}}>
        <CardMeta month={post.month} />
        <h3
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontSize: 26,
            fontWeight: 400,
            color: DARK,
            lineHeight: 1.3,
            marginBottom: 16,
          }}
        >
          {post.title}
        </h3>
        <p
          style={{
            fontSize: 13,
            fontWeight: 300,
            lineHeight: 1.9,
            color: "rgba(90,122,74,0.8)",
            marginBottom: 24,
          }}
        >
          {post.excerpt}
        </p>
        <CardFooter author={post.author} date={post.date} hovered={hovered} />
      </div>
    </article>
  );
};

// ── Standard Card ──
const StandardCard = ({post}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hovered
          ? "0 25px 40px -12px rgba(0,0,0,0.15)"
          : "0 8px 20px -6px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.4s ease",
      }}
    >
      <div style={{position: "relative", overflow: "hidden", height: 240}}>
        <img
          src={post.image}
          alt={post.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            opacity: hovered ? 0.85 : 0.7,
            filter: hovered ? "saturate(1)" : "saturate(0.8)",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition:
              "transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.4s, filter 0.4s",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(20,40,15,0.85) 0%, rgba(20,40,15,0.2) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            padding: "5px 14px",
            background: "rgba(74,140,42,0.9)",
            borderRadius: 100,
            fontSize: 8,
            fontWeight: 500,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "white",
          }}
        >
          {post.category}
        </span>
        <span
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            fontSize: 9,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {post.readTime}
        </span>
      </div>
      <div style={{padding: "28px 32px 32px"}}>
        <CardMeta month={post.month} />
        <h3
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontSize: 19,
            fontWeight: 400,
            color: DARK,
            lineHeight: 1.3,
            marginBottom: 16,
          }}
        >
          {post.title}
        </h3>
        <CardFooter author={post.author} date={post.date} hovered={hovered} />
      </div>
    </article>
  );
};

// ── Wide Card ──
const WideCard = ({post}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        overflow: "hidden",
        cursor: "pointer",
        gridColumn: "2 / 4",
        boxShadow: hovered
          ? "0 25px 40px -12px rgba(0,0,0,0.15)"
          : "0 8px 20px -6px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.4s ease",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          height: "100%",
        }}
      >
        <div style={{position: "relative", overflow: "hidden"}}>
          <img
            src={post.image}
            alt={post.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              opacity: hovered ? 0.85 : 0.7,
              filter: hovered ? "saturate(1)" : "saturate(0.8)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition:
                "transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.4s, filter 0.4s",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(20,40,15,0.85) 0%, rgba(20,40,15,0.2) 50%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              padding: "5px 14px",
              background: "rgba(74,140,42,0.9)",
              borderRadius: 100,
              fontSize: 8,
              fontWeight: 500,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "white",
            }}
          >
            {post.category}
          </span>
          <span
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {post.readTime}
          </span>
        </div>
        <div
          style={{
            padding: "36px 36px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CardMeta month={post.month} />
          <h3
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: 24,
              fontWeight: 400,
              color: DARK,
              lineHeight: 1.3,
              marginBottom: 16,
            }}
          >
            {post.title}
          </h3>
          <p
            style={{
              fontSize: 13,
              fontWeight: 300,
              lineHeight: 1.9,
              color: "rgba(90,122,74,0.8)",
              marginBottom: 24,
            }}
          >
            {post.excerpt}
          </p>
          <CardFooter author={post.author} date={post.date} hovered={hovered} />
        </div>
      </div>
    </article>
  );
};

// ── Main Blog Page ──
const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [nlName, setNlName] = useState("");
  const [nlEmail, setNlEmail] = useState("");
  const [heroImgHovered, setHeroImgHovered] = useState(false);

  return (
    <main style={{width: "100%", background: CREAM, overflowX: "hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

        * { box-sizing: border-box; }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes scrollLine {
          0%, 100% { transform: scaleY(1); opacity: 0.5; }
          50%       { transform: scaleY(0.6); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: none; }
        }

        .blog-page * { font-family: 'Jost', sans-serif; }

        .blog-hero { animation: fadeDown 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s both; }

        .pulse-dot { animation: pulse-dot 2s infinite; }
        .scroll-line { animation: scrollLine 2s ease-in-out infinite; }

        .hero-tag  { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
        .hero-feat { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.8s both; }
        .hero-h1   { animation: fadeUp 1s   cubic-bezier(0.16,1,0.3,1) 0.9s both; }
        .hero-p    { animation: fadeUp 1s   cubic-bezier(0.16,1,0.3,1) 1.0s both; }
        .hero-meta { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 1.1s both; }

        .read-btn { transition: background 0.3s, transform 0.2s; }
        .read-btn:hover { background: ${GOLD_LIGHT} !important; transform: translateY(-1px); }

        .view-all-link { transition: color 0.3s; }
        .view-all-link:hover { color: ${GOLD} !important; }
        .view-all-link:hover .view-all-arrow { transform: translateX(4px); }
        .view-all-arrow { display: inline-block; transition: transform 0.3s; }

        .cat-pill { transition: all 0.3s; cursor: pointer; }
        .cat-pill:hover { background: ${GOLD} !important; border-color: ${GOLD} !important; color: white !important; }

        .nl-input { transition: border-color 0.3s; }
        .nl-input:focus { outline: none; border-color: rgba(114,184,74,0.5) !important; }
        .nl-submit { transition: background 0.3s, transform 0.2s; }
        .nl-submit:hover { background: ${GOLD_LIGHT} !important; transform: translateY(-1px); }

        .footer-link { transition: color 0.3s; }
        .footer-link:hover { color: ${GOLD_LIGHT} !important; }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-right-col { display: none !important; }
          .hero-left-col { padding: 100px 24px 60px !important; }
          .articles-grid { grid-template-columns: 1fr !important; }
          .wide-card-inner { grid-template-columns: 1fr !important; }
          .newsletter-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .section-pad { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>

      <div className="blog-page">
        <NavBar />

        {/* ── HERO ── */}
        <section
          className="blog-hero"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Left */}
          <div
            className="hero-left-col"
            style={{
              background: FOREST,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "120px 72px 80px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 30% 60%, rgba(74,140,42,0.25) 0%, transparent 65%)",
                pointerEvents: "none",
              }}
            />

            {/* Tag */}
            <div
              className="hero-tag"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "7px 16px",
                border: "1px solid rgba(114,184,74,0.3)",
                background: "rgba(114,184,74,0.08)",
                borderRadius: 100,
                marginBottom: 36,
                width: "fit-content",
              }}
            >
              <div
                className="pulse-dot"
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: GOLD_LIGHT,
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: GOLD_LIGHT,
                }}
              >
                The Mindful Journal
              </span>
            </div>

            <p
              className="hero-feat"
              style={{
                fontSize: 9,
                fontWeight: 400,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(114,184,74,0.6)",
                marginBottom: 20,
              }}
            >
              Featured Article · Issue 07
            </p>

            <h1
              className="hero-h1"
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "clamp(36px, 3.5vw, 62px)",
                fontWeight: 300,
                lineHeight: 1.1,
                color: "#F0F7EC",
                marginBottom: 28,
              }}
            >
              The Ancient Art of{" "}
              <em style={{fontStyle: "italic", color: GOLD_LIGHT}}>
                Botanical Healing
              </em>{" "}
              for Modern Skin
            </h1>

            <p
              className="hero-p"
              style={{
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 2,
                color: "rgba(240,247,236,0.6)",
                maxWidth: 380,
                marginBottom: 52,
              }}
            >
              For thousands of years, African botanicals have held the secrets
              to radiant, resilient skin. We explore the fourteen plant actives
              at the heart of our formula and the science that confirms their
              power.
            </p>

            <div
              className="hero-meta"
              style={{display: "flex", alignItems: "center", gap: 24}}
            >
              <div style={{display: "flex", alignItems: "center", gap: 12}}>
                <AuthorAvatar initials="AN" size={38} dark />
                <div>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: "rgba(240,247,236,0.8)",
                    }}
                  >
                    Amina Njoroge
                  </p>
                  <span
                    style={{
                      fontSize: 10,
                      color: "rgba(240,247,236,0.4)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    May 2025 · 8 min read
                  </span>
                </div>
              </div>
              <button
                className="read-btn"
                style={{
                  marginLeft: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 28px",
                  background: GOLD,
                  border: "none",
                  borderRadius: 100,
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Read Article
                <ArrowIcon color="white" />
              </button>
            </div>
          </div>

          {/* Right */}
          <div
            className="hero-right-col"
            onMouseEnter={() => setHeroImgHovered(true)}
            onMouseLeave={() => setHeroImgHovered(false)}
            style={{
              position: "relative",
              overflow: "hidden",
              background: "linear-gradient(160deg, #1d3a12 0%, #0f2208 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url('/src/assets/model.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.35,
                transform: heroImgHovered ? "scale(1.04)" : "scale(1)",
                transition: "transform 8s ease",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to right, ${FOREST} 0%, transparent 40%)`,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 48,
                right: 48,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 72,
                  fontWeight: 300,
                  lineHeight: 1,
                  color: "rgba(114,184,74,0.15)",
                  letterSpacing: "-0.02em",
                }}
              >
                07
              </div>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "rgba(114,184,74,0.4)",
                }}
              >
                Current Issue
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 48,
                right: 48,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                color: "rgba(240,247,236,0.4)",
                fontSize: 8,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
              }}
            >
              <div
                className="scroll-line"
                style={{
                  width: 1,
                  height: 48,
                  background: `linear-gradient(to bottom, rgba(74,140,42,0.5), transparent)`,
                }}
              />
              Scroll
            </div>
          </div>
        </section>

        {/* ── SECTION DIVIDER ── */}
        <div
          className="section-pad"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "64px 80px 0",
          }}
        >
          <div
            style={{flex: 1, height: 1, background: "rgba(74,140,42,0.2)"}}
          />
          <span
            style={{
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            Latest from the journal
          </span>
          <div
            style={{flex: 1, height: 1, background: "rgba(74,140,42,0.2)"}}
          />
        </div>

        {/* ── ARTICLES ── */}
        <section className="section-pad" style={{padding: "56px 80px 100px"}}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 64,
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "clamp(28px, 3vw, 44px)",
                fontWeight: 300,
                color: DARK,
                lineHeight: 1.15,
              }}
            >
              Recent <em style={{fontStyle: "italic", color: GOLD}}>Stories</em>
            </h2>
            <a
              href="#"
              className="view-all-link"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 10,
                fontWeight: 400,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: MUTED,
                textDecoration: "none",
              }}
            >
              All Articles
              <span className="view-all-arrow">
                <ArrowIcon color={MUTED} />
              </span>
            </a>
          </div>

          {/* Grid */}
          <div
            className="articles-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gridTemplateRows: "auto auto",
              gap: 2,
            }}
          >
            <FeatureCard post={blogPosts[0]} />
            <StandardCard post={blogPosts[1]} />
            <StandardCard post={blogPosts[2]} />
            <WideCard post={blogPosts[3]} />
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section className="section-pad" style={{padding: "0 80px 80px"}}>
          <p
            style={{
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: 32,
            }}
          >
            Browse by topic
          </p>
          <div style={{display: "flex", flexWrap: "wrap", gap: 12}}>
            {categories.map(({label, count}) => (
              <button
                key={label}
                className="cat-pill"
                onClick={() => setActiveCategory(label)}
                style={{
                  padding: "10px 24px",
                  border: `1px solid ${activeCategory === label ? GOLD : "rgba(74,140,42,0.25)"}`,
                  background: activeCategory === label ? GOLD : "transparent",
                  borderRadius: 100,
                  fontSize: 10,
                  fontWeight: 400,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: activeCategory === label ? "white" : MUTED,
                }}
              >
                {label}
                <span style={{opacity: 0.5, marginLeft: 6, fontSize: 9}}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── PULL QUOTE ── */}
        <div
          style={{
            padding: "80px",
            background: GOLD_PALE,
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
              fontSize: 160,
              lineHeight: 1,
              fontWeight: 300,
              color: "rgba(74,140,42,0.1)",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            "
          </div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
              fontSize: "clamp(22px, 2.5vw, 38px)",
              fontWeight: 300,
              fontStyle: "italic",
              color: INK,
              lineHeight: 1.6,
              maxWidth: 740,
              margin: "0 auto 28px",
              position: "relative",
            }}
          >
            Nature has been solving the problem of healthy, radiant skin for ten
            thousand years. Our only job is to get out of the way and let it
            work.
          </p>
          <p
            style={{
              fontSize: 10,
              fontWeight: 400,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 30,
                height: 1,
                background: GOLD,
                verticalAlign: "middle",
                margin: "0 12px",
              }}
            />
            Founder, Mindful Living KE
            <span
              style={{
                display: "inline-block",
                width: 30,
                height: 1,
                background: GOLD,
                verticalAlign: "middle",
                margin: "0 12px",
              }}
            />
          </p>
        </div>

        {/* ── NEWSLETTER ── */}
        <div
          className="section-pad newsletter-grid"
          style={{
            margin: "0 80px 100px",
            padding: "80px",
            background: FOREST,
            position: "relative",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -120,
              right: -120,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(74,140,42,0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div>
            <p
              style={{
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(114,184,74,0.6)",
                marginBottom: 20,
              }}
            >
              The Mindful Letter
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontSize: "clamp(28px, 2.5vw, 44px)",
                fontWeight: 300,
                lineHeight: 1.2,
                color: "#F0F7EC",
                marginBottom: 20,
              }}
            >
              Skincare wisdom,{" "}
              <em style={{fontStyle: "italic", color: GOLD_LIGHT}}>
                delivered monthly
              </em>
            </h2>
            <p
              style={{
                fontSize: 13,
                fontWeight: 300,
                lineHeight: 2,
                color: "rgba(240,247,236,0.5)",
              }}
            >
              Exclusive articles, early access to new products, and the
              botanical knowledge our team has spent years curating. No noise.
              No promotions. Just insight.
            </p>
          </div>

          <div style={{display: "flex", flexDirection: "column", gap: 16}}>
            <input
              className="nl-input"
              type="text"
              placeholder="Your full name"
              value={nlName}
              onChange={(e) => setNlName(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 20px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(114,184,74,0.2)",
                color: "#F0F7EC",
                fontFamily: "'Jost', sans-serif",
                fontSize: 13,
                fontWeight: 300,
              }}
            />
            <input
              className="nl-input"
              type="email"
              placeholder="Your email address"
              value={nlEmail}
              onChange={(e) => setNlEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 20px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(114,184,74,0.2)",
                color: "#F0F7EC",
                fontFamily: "'Jost', sans-serif",
                fontSize: 13,
                fontWeight: 300,
              }}
            />
            <button
              className="nl-submit"
              style={{
                padding: "16px 32px",
                background: GOLD,
                border: "none",
                fontFamily: "'Jost', sans-serif",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "white",
                cursor: "pointer",
                alignSelf: "flex-start",
              }}
            >
              Subscribe to the Journal
            </button>
            <p
              style={{
                fontSize: 10,
                color: "rgba(240,247,236,0.25)",
                letterSpacing: "0.05em",
              }}
            >
              No spam. Unsubscribe at any time. We respect your privacy.
            </p>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer
          className="footer-grid section-pad"
          style={{
            background: "#0d1f09",
            padding: "64px 80px 40px",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 60,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                fontWeight: 300,
                color: "#F0F7EC",
                marginBottom: 16,
              }}
            >
              Mindful <span style={{color: GOLD_LIGHT}}>&</span> Living
            </div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 300,
                lineHeight: 1.9,
                color: "rgba(240,247,236,0.4)",
                maxWidth: 240,
              }}
            >
              Handcrafted botanical skincare rooted in Kenya's natural heritage.
              Pure. Thoughtful. Effective.
            </p>
          </div>

          {[
            {
              heading: "Journal",
              links: [
                "Skincare Science",
                "Ingredients",
                "Ritual & Routine",
                "Wellness",
              ],
            },
            {
              heading: "Shop",
              links: ["Face Soap", "All Products", "Bundles", "Gift Sets"],
            },
            {
              heading: "Company",
              links: ["Our Story", "Sustainability", "Stockists", "Contact"],
            },
          ].map(({heading, links}) => (
            <div key={heading}>
              <h4
                style={{
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "rgba(114,184,74,0.5)",
                  marginBottom: 24,
                }}
              >
                {heading}
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="footer-link"
                      style={{
                        fontSize: 13,
                        fontWeight: 300,
                        color: "rgba(240,247,236,0.5)",
                        textDecoration: "none",
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </footer>

        <div
          className="section-pad"
          style={{
            background: "#0d1f09",
            padding: "24px 80px",
            borderTop: "1px solid rgba(74,140,42,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              fontSize: 10,
              color: "rgba(240,247,236,0.25)",
              letterSpacing: "0.1em",
            }}
          >
            © 2025 Mindful Living KE. All rights reserved.
          </p>
          <p
            style={{
              fontSize: 10,
              color: "rgba(240,247,236,0.25)",
              letterSpacing: "0.1em",
            }}
          >
            Privacy Policy · Terms of Use
          </p>
        </div>
      </div>
    </main>
  );
};

export default BlogPage;
