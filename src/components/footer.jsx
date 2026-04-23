// components/Footer.jsx
import React from "react";
import {motion, useInView} from "framer-motion";
import {Link} from "react-router-dom";

// ── Mindful Living KE — Brand Palette (matches your app) ──
const GREEN = "#4A8C2A";
const GREEN_LIGHT = "#72B84A";
const GREEN_DARK = "#14280F";
const GREEN_PALE = "#E8F5E0";
const CREAM = "#F7FBF4";
const DARK = "#1A1A1A";
const MUTED = "#5A7A4A";

// ── Animated leaf divider ──
const LeafDivider = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: 12,
      margin: "16px 0",
    }}
  >
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        initial={{scale: 0, opacity: 0}}
        whileInView={{scale: 1, opacity: 1}}
        transition={{
          delay: i * 0.1,
          duration: 0.5,
          type: "spring",
          stiffness: 200,
        }}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
        }}
      />
    ))}
  </div>
);

// ── Social icon component ──
const SocialIcon = ({href, children}) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{y: -4, color: GREEN_LIGHT}}
    transition={{type: "spring", stiffness: 400}}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      borderRadius: "50%",
      border: `1px solid ${GREEN}35`,
      background: `${GREEN}08`,
      color: MUTED,
      transition: "all 0.2s ease",
    }}
  >
    {children}
  </motion.a>
);

// ── Main Footer ──
const Footer = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, {once: true, margin: "-80px"});

  const footerVariants = {
    hidden: {opacity: 0, y: 40},
    visible: {
      opacity: 1,
      y: 0,
      transition: {duration: 0.8, ease: [0.16, 1, 0.3, 1]},
    },
  };

  const linkVariants = {
    hidden: {opacity: 0, y: 10},
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {delay: 0.1 + i * 0.05, duration: 0.5},
    }),
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={ref}
      style={{
        background: `linear-gradient(135deg, ${DARK} 0%, #1E2A1A 100%)`,
        color: CREAM,
        borderTop: `1px solid ${GREEN}40`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative top glow */}
      <div
        style={{
          position: "absolute",
          top: -60,
          left: "10%",
          right: "10%",
          height: 120,
          background: `radial-gradient(ellipse at center, ${GREEN}30 0%, transparent 70%)`,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <motion.div
        variants={footerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "64px 32px 32px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 48,
            marginBottom: 48,
          }}
        >
          {/* Brand column */}
          <motion.div
            custom={0}
            variants={linkVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div style={{marginBottom: 20}}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
                    borderRadius: "50%",
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
                    stroke="#fff"
                    strokeWidth="1.8"
                  >
                    <path d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z" />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Mindful Living <span style={{color: GREEN_LIGHT}}>KE</span>
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "#B8C4B2",
                  margin: "12px 0 0",
                }}
              >
                Kenyan natural skincare rooted in botanical wisdom. Pure,
                effective, and kind to your skin and the planet.
              </p>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            custom={1}
            variants={linkVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <h3
              style={{
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 20,
                color: GREEN_LIGHT,
              }}
            >
              Quick Links
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {[
                "Shop",
                "About",
                "Ingredients",
                "Sustainability",
                "Contact",
              ].map((item, idx) => (
                <li key={item}>
                  <Link
                    to={item === "Shop" ? "/" : `/${item.toLowerCase()}`}
                    style={{
                      color: "#CCDFC5",
                      textDecoration: "none",
                      fontSize: 13,
                      transition: "color 0.2s",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = GREEN_LIGHT)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#CCDFC5")
                    }
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            custom={2}
            variants={linkVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <h3
              style={{
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 20,
                color: GREEN_LIGHT,
              }}
            >
              Support
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {[
                "FAQs",
                "Shipping Info",
                "Returns",
                "Privacy Policy",
                "Terms",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s/g, "-")}`}
                    style={{
                      color: "#CCDFC5",
                      textDecoration: "none",
                      fontSize: 13,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = GREEN_LIGHT)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#CCDFC5")
                    }
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            custom={3}
            variants={linkVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <h3
              style={{
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 20,
                color: GREEN_LIGHT,
              }}
            >
              Join the Community
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "#B8C4B2",
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              Receive 15% off your first order, botanical insights, and early
              access.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Newsletter demo: thanks for subscribing!");
              }}
              style={{display: "flex", gap: 8}}
            >
              <input
                type="email"
                placeholder="Your email"
                required
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: 50,
                  border: `1px solid ${GREEN}40`,
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: 13,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <motion.button
                type="submit"
                whileHover={{scale: 1.02}}
                whileTap={{scale: 0.98}}
                style={{
                  background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
                  border: "none",
                  borderRadius: 50,
                  padding: "0 20px",
                  color: "white",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        <LeafDivider />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            marginTop: 40,
            paddingTop: 24,
            borderTop: `1px solid ${GREEN}25`,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#A0B897",
              textAlign: "center",
              flex: 1,
            }}
          >
            © {currentYear} Mindful Living KE — The Natural Way. All rights
            reserved.
          </div>

          <div style={{display: "flex", gap: 12, justifyContent: "center"}}>
            <SocialIcon href="https://instagram.com">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <line x1="17" y1="7" x2="17.01" y2="7" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://x.com">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://facebook.com">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </SocialIcon>
            <SocialIcon href="https://pinterest.com">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M8 21.04a10 10 0 1 1 5.97-17.56 10 10 0 0 1-5.97 17.56z" />
                <path d="M9 13c.7 2 3 4 7 3" />
                <path d="M12 3v10" />
              </svg>
            </SocialIcon>
          </div>

          {/* Payment icons */}
          <div style={{display: "flex", gap: 12, alignItems: "center"}}>
            {["VISA", "Mastercard", "M-Pesa", "PayPal"].map((method) => (
              <span
                key={method}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  padding: "4px 12px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  color: "#C2D4B8",
                }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll to top button */}
        <motion.button
          onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
          whileHover={{y: -4}}
          whileTap={{scale: 0.95}}
          style={{
            position: "fixed",
            bottom: 32,
            right: 24,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
            border: "none",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.button>
      </motion.div>
    </footer>
  );
};

export default Footer;
