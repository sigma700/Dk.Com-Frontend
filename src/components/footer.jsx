import React from "react";
import {Link} from "react-router-dom";

// Brand palette (match your app)
const GREEN = "#4A8C2A";
const GREEN_LIGHT = "#72B84A";
const GREEN_DARK = "#14280F";

const Footer = () => {
  return (
    <>
      <style>
        {`
          /* ----- FOOTER ROOT ----- */
          .footer-root {
            background: ${GREEN_DARK};
            color: #fff;
            position: relative;
            overflow: hidden;
            padding: 60px 80px 32px;
          }

          /* ----- DECORATIVE LEAF ----- */
          .footer-leaf {
            position: absolute;
            bottom: -40px;
            right: -40px;
            font-size: 200px;
            opacity: 0.03;
            pointer-events: none;
            transform: rotate(15deg);
          }

          /* ----- INNER CONTAINER (GRID) ----- */
          .footer-inner {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 48px;
          }

          /* ----- LOGO SECTION ----- */
          .logo-wrapper {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
          }
          .logo-circle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #F7FBF4;
            padding: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .logo-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }
          .brand-name {
            font-size: 18px;
            font-weight: 600;
            letter-spacing: -0.01em;
            color: #fff;
          }
          .brand-name span {
            color: ${GREEN_LIGHT};
          }
          .tagline {
            font-size: 13px;
            line-height: 1.7;
            color: #B8C4B2;
            margin-top: 8px;
            max-width: 260px;
          }

          /* ----- HEADINGS & LISTS ----- */
          .footer-heading {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: ${GREEN_LIGHT};
            margin-bottom: 20px;
          }
          .footer-links {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .footer-link {
            font-size: 13px;
            color: #B8C4B2;
            text-decoration: none;
            transition: color 0.2s ease;
          }
          .footer-link:hover {
            color: ${GREEN_LIGHT};
          }

          /* ----- NEWSLETTER SECTION ----- */
          .newsletter-text {
            font-size: 13px;
            color: #B8C4B2;
            margin-bottom: 20px;
          }
          .newsletter-form {
            display: flex;
            gap: 12px;
          }
          .newsletter-input {
            flex: 1;
            padding: 10px 14px;
            background: rgba(255,255,255,0.1);
            border: 1px solid ${GREEN}40;
            border-radius: 40px;
            font-size: 12px;
            color: #fff;
            outline: none;
            transition: border-color 0.2s;
          }
          .newsletter-input:focus {
            border-color: ${GREEN_LIGHT};
          }
          .newsletter-input::placeholder {
            color: #8A9A80;
          }
          .newsletter-button {
            background: ${GREEN};
            border: none;
            border-radius: 40px;
            padding: 10px 20px;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.1em;
            color: #fff;
            cursor: pointer;
            transition: background 0.2s ease;
            white-space: nowrap;
          }
          .newsletter-button:hover {
            background: ${GREEN_LIGHT};
          }

          /* ----- COPYRIGHT ----- */
          .footer-copyright {
            margin-top: 56px;
            padding-top: 24px;
            border-top: 1px solid ${GREEN}30;
            text-align: center;
            font-size: 11px;
            color: #8A9A80;
            letter-spacing: 0.05em;
          }

          /* ========== RESPONSIVE BREAKPOINTS ========== */
          @media (max-width: 1024px) {
            .footer-root {
              padding: 48px 40px 32px;
            }
            .footer-inner {
              gap: 32px;
              grid-template-columns: repeat(2, 1fr);
            }
            .tagline {
              max-width: 100%;
            }
          }

          @media (max-width: 768px) {
            .footer-root {
              padding: 40px 24px 32px;
            }
            .footer-inner {
              grid-template-columns: 1fr;
              gap: 40px;
            }
            .footer-leaf {
              display: none;
            }
            .logo-wrapper {
              justify-content: center;
            }
            .tagline {
              text-align: center;
              margin-left: auto;
              margin-right: auto;
            }
            .footer-heading {
              text-align: center;
            }
            .footer-links {
              align-items: center;
              text-align: center;
            }
            .newsletter-text {
              text-align: center;
            }
            .newsletter-form {
              flex-direction: column;
              gap: 12px;
            }
            .newsletter-button {
              width: 100%;
              white-space: normal;
            }
          }
        `}
      </style>

      <footer className="footer-root">
        {/* Decorative leaf (hidden on mobile) */}
        <div className="footer-leaf">✿</div>

        <div className="footer-inner">
          {/* Logo & tagline */}
          <div>
            <div className="logo-wrapper">
              <div className="logo-circle">
                <img
                  src="logo.jpeg"
                  alt="Mindful Living KE"
                  className="logo-img"
                />
              </div>
              <span className="brand-name">
                Mindful Living <span>KE</span>
              </span>
            </div>
            <p className="tagline">
              Kenyan natural skincare rooted in botanical wisdom. Pure,
              effective, and kind to your skin and the planet.
            </p>
          </div>

          {/* Quick Links (Explore) */}
          <div>
            <h4 className="footer-heading">Explore</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/discover-more" className="footer-link">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li>
                <Link to="/blog" className="footer-link">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="footer-link">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Connect */}
          <div>
            <h4 className="footer-heading">Connect</h4>
            <p className="newsletter-text">
              Join our newsletter for botanical insights & offers.
            </p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Your email"
                className="newsletter-input"
              />
              <button className="newsletter-button">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-copyright">
          © {new Date().getFullYear()} Mindful Living KE. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
