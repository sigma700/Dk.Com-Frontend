import React, {useRef} from "react";
import {motion, useInView, useScroll, useTransform} from "framer-motion";
import NavBar from "../components/navBar";
import Footer from "../components/footer";

const GOLD = "#4A8C2A";
const GOLD_LIGHT = "#72B84A";
const GOLD_PALE = "#E8F5E0";
const CREAM = "#F7FBF4";
const DARK = "#1A1A1A";
const MUTED = "#5A7A4A";
const DARK_GREEN = "#14280F";

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
        letterSpacing: "0.4em",
        textTransform: "uppercase",
        color: MUTED,
      }}
    >
      {text}
    </span>
    <div style={{width: 36, height: 1, background: GOLD}} />
  </div>
);

const values = [
  {
    icon: "🌿",
    title: "100% Natural",
    body: "Every ingredient is sourced from certified organic Kenyan farms, free from synthetics and harsh chemicals.",
  },
  {
    icon: "🤝",
    title: "Community First",
    body: "We partner directly with 40+ smallholder farmers across the Rift Valley, ensuring fair wages and sustainable livelihoods.",
  },
  {
    icon: "🔬",
    title: "Science-Backed",
    body: "Our formulations are developed with ethnobotanists and dermatologists who understand African skin and flora.",
  },
  {
    icon: "♻️",
    title: "Earth-Kind",
    body: "All packaging is biodegradable or refillable. Our factory runs on 80% solar energy.",
  },
];

const milestones = [
  {
    year: "2020",
    event:
      "Founded in Nairobi's Westlands district with a single botanical soap recipe.",
  },
  {
    year: "2021",
    event:
      "Partnered with 12 Rift Valley farms. Launched 8 products. First 1,000 customers.",
  },
  {
    year: "2022",
    event:
      "Won the Kenya Beauty Awards – Best Natural Brand. Expanded to Mombasa & Kisumu.",
  },
  {
    year: "2023",
    event:
      "Crossed 10,000 loyal customers. Launched the Wellness Tea Collection.",
  },
  {
    year: "2024",
    event:
      "Entered Uganda & Tanzania markets. 40+ farm partnerships. 30+ products.",
  },
  {
    year: "2025",
    event:
      "Launched online store. Crossed 50,000 orders. East Africa's #1 natural brand.",
  },
];

const team = [
  {
    name: "Amina Wanjiru",
    role: "Co-Founder & Chief Botanist",
    bio: "Ethnobotanist with 12 years studying Kenyan medicinal plants.",
    initial: "AW",
  },
  {
    name: "David Omondi",
    role: "Co-Founder & CEO",
    bio: "Sustainable business advocate, former director at Kenya Climate Fund.",
    initial: "DO",
  },
  {
    name: "Grace Muthoni",
    role: "Head of Formulation",
    bio: "Cosmetic chemist trained in Nairobi and Cape Town. 8 years in natural skincare.",
    initial: "GM",
  },
];

const ValueCard = ({icon, title, body, index}) => {
  const ref = useRef(null);
  const inView = useInView(ref, {once: true, margin: "-40px"});

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, y: 40}}
      animate={inView ? {opacity: 1, y: 0} : {}}
      transition={{duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1]}}
      style={{
        background: "white",
        borderRadius: 24,
        padding: "36px 32px",
        border: `1px solid ${GOLD}15`,
        boxShadow: "0 8px 32px -12px rgba(30,70,10,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 120,
          height: 120,
          background: `radial-gradient(circle, ${GOLD}08 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{fontSize: 36, marginBottom: 16}}>{icon}</div>
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 20,
          fontWeight: 400,
          color: DARK,
          margin: "0 0 12px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 13,
          color: MUTED,
          lineHeight: 1.8,
          fontWeight: 300,
          margin: 0,
        }}
      >
        {body}
      </p>
    </motion.div>
  );
};

const AboutPage = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, {once: true});
  const {scrollYProgress} = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <main style={{background: CREAM, minHeight: "100vh"}}>
      <NavBar />

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          background: `linear-gradient(135deg, ${DARK_GREEN} 0%, #1E4A10 50%, #2E6B1A 100%)`,
          position: "relative",
          overflow: "hidden",
          padding: "100px 80px",
        }}
      >
        {/* Orbs */}
        {[
          [500, "top", "-15%", "right", "15%"],
          [350, "bottom", "-10%", "left", "8%"],
        ].map(([size, vp, vv, hp, hv], i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, i === 0 ? 25 : -20, 0],
              y: [0, i === 0 ? -20 : 25, 0],
            }}
            transition={{duration: 12 + i * 3, repeat: Infinity, delay: i * 2}}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${GOLD}20 0%, transparent 70%)`,
              [vp]: vv,
              [hp]: hv,
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Decorative grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${GOLD}08 1px, transparent 1px), linear-gradient(90deg, ${GOLD}08 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
            pointerEvents: "none",
          }}
        />

        <motion.div
          style={{y: parallaxY, position: "relative", zIndex: 2, maxWidth: 700}}
        >
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={isHeroInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.7}}
            style={{marginBottom: 28}}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 18px",
                border: `1px solid ${GOLD}50`,
                background: `${GOLD}18`,
                borderRadius: 100,
              }}
            >
              <motion.div
                animate={{scale: [1, 1.4, 1], opacity: [1, 0.5, 1]}}
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
                  letterSpacing: "0.38em",
                  textTransform: "uppercase",
                  color: GOLD_LIGHT,
                }}
              >
                Our Story
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{opacity: 0, y: 40, filter: "blur(6px)"}}
            animate={
              isHeroInView ? {opacity: 1, y: 0, filter: "blur(0px)"} : {}
            }
            transition={{duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1]}}
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "clamp(40px, 5vw, 72px)",
              fontWeight: 300,
              color: "white",
              margin: "0 0 24px",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            Born from the{" "}
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

          <motion.p
            initial={{opacity: 0, y: 20}}
            animate={isHeroInView ? {opacity: 1, y: 0} : {}}
            transition={{duration: 0.8, delay: 0.3}}
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 540,
              lineHeight: 1.9,
              fontWeight: 300,
              margin: 0,
            }}
          >
            Mindful Living KE was born from a simple belief — that Kenya's
            abundant botanical landscape holds the most powerful skincare
            solutions in the world. We just needed to listen to the land.
          </motion.p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={isHeroInView ? {opacity: 1, y: 0} : {}}
          transition={{duration: 0.8, delay: 0.5}}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(12px)",
            display: "flex",
            justifyContent: "center",
            borderTop: `1px solid ${GOLD}20`,
          }}
          className="about-stats"
        >
          {[
            ["50K+", "Happy Customers"],
            ["40+", "Farm Partners"],
            ["30+", "Products"],
            ["5", "Years"],
          ].map(([n, l]) => (
            <div
              key={l}
              style={{
                padding: "28px 48px",
                textAlign: "center",
                borderRight: `1px solid ${GOLD}20`,
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 32,
                  fontWeight: 300,
                  color: "white",
                }}
              >
                {n}
              </div>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: GOLD_LIGHT,
                  marginTop: 4,
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── VALUES ── */}
      <section
        style={{padding: "100px 80px", maxWidth: 1400, margin: "0 auto"}}
        className="about-section"
      >
        <div style={{textAlign: "center", marginBottom: 64}}>
          <SectionLabel text="What We Stand For" />
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 300,
              color: DARK,
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Our Core Values
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {values.map((v, i) => (
            <ValueCard key={v.title} {...v} index={i} />
          ))}
        </div>
      </section>

      {/* ── STORY + TIMELINE ── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${GOLD_PALE} 0%, #D8F0C0 100%)`,
          padding: "100px 80px",
        }}
        className="about-section"
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "start",
          }}
          className="story-grid"
        >
          {/* Left */}
          <div>
            <SectionLabel text="Our Journey" />
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 3.5vw, 48px)",
                fontWeight: 300,
                color: DARK,
                margin: "0 0 24px",
                lineHeight: 1.2,
              }}
            >
              Five years of growing{" "}
              <em style={{fontStyle: "italic", color: GOLD}}>with nature</em>
            </h2>
            <p
              style={{
                fontSize: 14,
                color: MUTED,
                lineHeight: 1.95,
                fontWeight: 300,
                margin: "0 0 20px",
              }}
            >
              What started as Amina's kitchen experiments with local herbs
              became East Africa's most-loved natural wellness brand. We've
              never strayed from our founding principle: if it doesn't grow from
              the earth, it doesn't belong on your skin.
            </p>
            <p
              style={{
                fontSize: 14,
                color: MUTED,
                lineHeight: 1.95,
                fontWeight: 300,
                margin: 0,
              }}
            >
              Every product we create is tested by real Kenyans, for Kenyan skin
              — with the full spectrum of melanin in mind.
            </p>
          </div>

          {/* Timeline */}
          <div style={{position: "relative"}}>
            <div
              style={{
                position: "absolute",
                left: 18,
                top: 0,
                bottom: 0,
                width: 1,
                background: `linear-gradient(to bottom, ${GOLD}, ${GOLD}40, transparent)`,
              }}
            />
            {milestones.map((m, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, {once: true});
              return (
                <motion.div
                  ref={ref}
                  key={m.year}
                  initial={{opacity: 0, x: 20}}
                  animate={inView ? {opacity: 1, x: 0} : {}}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    display: "flex",
                    gap: 24,
                    marginBottom: 36,
                    paddingLeft: 8,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      flexShrink: 0,
                      marginTop: 2,
                      background: GOLD,
                      border: `3px solid ${GOLD_PALE}`,
                      boxShadow: `0 0 0 3px ${GOLD}30`,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.3em",
                        color: GOLD,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      {m.year}
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: DARK,
                        lineHeight: 1.7,
                        margin: 0,
                        fontWeight: 300,
                      }}
                    >
                      {m.event}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section
        style={{padding: "100px 80px", maxWidth: 1400, margin: "0 auto"}}
        className="about-section"
      >
        <div style={{textAlign: "center", marginBottom: 64}}>
          <SectionLabel text="The Faces Behind the Brand" />
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 300,
              color: DARK,
              margin: 0,
            }}
          >
            Meet the Team
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 28,
          }}
        >
          {team.map((member, i) => {
            const ref = useRef(null);
            const inView = useInView(ref, {once: true});
            return (
              <motion.div
                ref={ref}
                key={member.name}
                initial={{opacity: 0, y: 40}}
                animate={inView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 0.7, delay: i * 0.12}}
                style={{
                  background: "white",
                  borderRadius: 28,
                  padding: "40px 32px",
                  textAlign: "center",
                  border: `1px solid ${GOLD}15`,
                  boxShadow: "0 8px 32px -12px rgba(30,70,10,0.08)",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    margin: "0 auto 20px",
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 400,
                    color: "white",
                    fontFamily: "'Playfair Display', serif",
                    boxShadow: `0 12px 32px ${GOLD}35`,
                  }}
                >
                  {member.initial}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 20,
                    fontWeight: 400,
                    color: DARK,
                    margin: "0 0 4px",
                  }}
                >
                  {member.name}
                </h3>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: GOLD,
                    margin: "0 0 16px",
                    fontWeight: 500,
                  }}
                >
                  {member.role}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: MUTED,
                    lineHeight: 1.8,
                    margin: 0,
                    fontWeight: 300,
                  }}
                >
                  {member.bio}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes shimmer-text {
          0%   { background-position: 0% center }
          50%  { background-position: 100% center }
          100% { background-position: 0% center }
        }
        @media (max-width: 900px) {
          .story-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .about-section { padding: 60px 24px !important; }
          .about-stats > div { padding: 20px 24px !important; }
        }
      `}</style>
    </main>
  );
};

export default AboutPage;
