import React from "react";
import {Link} from "react-router-dom";
import {motion} from "framer-motion";

// Brand palette (match your app)
const GREEN = "#4A8C2A";
const GREEN_LIGHT = "#72B84A";
const GREEN_DARK = "#14280F";
const MUTED = "#5A7A4A";

const Footer = () => {
  return (
    <footer
      style={{
        background: GREEN_DARK,
        color: "#fff",
        padding: "60px 80px 32px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative leaf */}
      <div
        style={{
          position: "absolute",
          bottom: -40,
          right: -40,
          fontSize: 200,
          opacity: 0.03,
          pointerEvents: "none",
          transform: "rotate(15deg)",
        }}
      >
        ✿
      </div>

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 48,
        }}
      >
        {/* Logo & tagline */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#F7FBF4",
                padding: 4,
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/src/assets/logo.jpeg"
                alt="Mindful Living KE"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "#fff",
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
              marginTop: 8,
              maxWidth: 260,
            }}
          >
            Kenyan natural skincare rooted in botanical wisdom. Pure, effective,
            and kind to your skin and the planet.
          </p>
        </div>

        {/* Quick Links – now using actual navbar routes */}
        <div>
          <h4
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: GREEN_LIGHT,
              marginBottom: 20,
            }}
          >
            Explore
          </h4>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <li>
              <Link
                to="/"
                style={{
                  fontSize: 13,
                  color: "#B8C4B2",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = GREEN_LIGHT)
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = "#B8C4B2")}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/discovery"
                style={{
                  fontSize: 13,
                  color: "#B8C4B2",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = GREEN_LIGHT)
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = "#B8C4B2")}
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                style={{
                  fontSize: 13,
                  color: "#B8C4B2",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = GREEN_LIGHT)
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = "#B8C4B2")}
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: GREEN_LIGHT,
              marginBottom: 20,
            }}
          >
            Resources
          </h4>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <li>
              <Link
                to="/blog"
                style={{
                  fontSize: 13,
                  color: "#B8C4B2",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = GREEN_LIGHT)
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = "#B8C4B2")}
              >
                Journal
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                style={{
                  fontSize: 13,
                  color: "#B8C4B2",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = GREEN_LIGHT)
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = "#B8C4B2")}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                style={{
                  fontSize: 13,
                  color: "#B8C4B2",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = GREEN_LIGHT)
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = "#B8C4B2")}
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter / Social */}
        <div>
          <h4
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: GREEN_LIGHT,
              marginBottom: 20,
            }}
          >
            Connect
          </h4>
          <p style={{fontSize: 13, color: "#B8C4B2", marginBottom: 20}}>
            Join our newsletter for botanical insights & offers.
          </p>
          <div style={{display: "flex", gap: 12}}>
            <input
              type="email"
              placeholder="Your email"
              style={{
                flex: 1,
                padding: "10px 14px",
                background: "rgba(255,255,255,0.1)",
                border: `1px solid ${GREEN}40`,
                borderRadius: 40,
                fontSize: 12,
                color: "#fff",
                outline: "none",
              }}
            />
            <button
              style={{
                background: GREEN,
                border: "none",
                borderRadius: 40,
                padding: "10px 20px",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: "#fff",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = GREEN_LIGHT)
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = GREEN)}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          marginTop: 56,
          paddingTop: 24,
          borderTop: `1px solid ${GREEN}30`,
          textAlign: "center",
          fontSize: 11,
          color: "#8A9A80",
          letterSpacing: "0.05em",
        }}
      >
        © {new Date().getFullYear()} Mindful Living KE. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
