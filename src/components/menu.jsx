import {useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";

const DEFAULT_LINKS = [
  {label: "Maison", href: "#"},
  {label: "Collections", href: "#"},
  {label: "Atelier", href: "#"},
  {label: "Journal", href: "#"},
  {label: "Contact", href: "#"},
];

// ── Animation variants ────────────────────────────────────────────────────────

const overlayVariants = {
  closed: {
    clipPath: "circle(0% at calc(100% - 44px) 44px)",
    transition: {duration: 0.55, ease: [0.76, 0, 0.24, 1]},
  },
  open: {
    clipPath: "circle(170% at calc(100% - 44px) 44px)",
    transition: {duration: 0.6, ease: [0.76, 0, 0.24, 1]},
  },
};

const navListVariants = {
  closed: {transition: {staggerChildren: 0.04, staggerDirection: -1}},
  open: {transition: {staggerChildren: 0.09, delayChildren: 0.25}},
};

const navItemVariants = {
  closed: {opacity: 0, y: 32, transition: {duration: 0.3, ease: "easeIn"}},
  open: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.5, ease: [0.16, 1, 0.3, 1]},
  },
};

const footerVariants = {
  closed: {opacity: 0, y: 16, transition: {duration: 0.2}},
  open: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.5, delay: 0.55, ease: "easeOut"},
  },
};

const dividerVariants = {
  closed: {scaleX: 0, transition: {duration: 0.3}},
  open: {
    scaleX: 1,
    transition: {duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1]},
  },
};

// ── Hamburger icon lines ──────────────────────────────────────────────────────

function HamburgerIcon({isOpen, accent}) {
  return (
    <div className="flex flex-col justify-center items-end gap-[5px] w-6 h-5">
      {/* Top bar */}
      <motion.span
        className="block h-px origin-right"
        style={{background: isOpen ? accent : "#1A1410"}}
        animate={
          isOpen
            ? {width: "100%", rotate: -45, y: 3, x: 1}
            : {width: "100%", rotate: 0, y: 0, x: 0}
        }
        transition={{duration: 0.4, ease: [0.76, 0, 0.24, 1]}}
      />
      {/* Middle bar — shorter for elegance */}
      <motion.span
        className="block h-px"
        style={{background: isOpen ? accent : "#1A1410"}}
        animate={
          isOpen ? {width: "0%", opacity: 0} : {width: "68%", opacity: 1}
        }
        transition={{duration: 0.3, ease: "easeInOut"}}
      />
      {/* Bottom bar */}
      <motion.span
        className="block h-px origin-right"
        style={{background: isOpen ? accent : "#1A1410"}}
        animate={
          isOpen
            ? {width: "100%", rotate: 45, y: -3, x: 1}
            : {width: "100%", rotate: 0, y: 0, x: 0}
        }
        transition={{duration: 0.4, ease: [0.76, 0, 0.24, 1]}}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HamburgerMenu({
  links = DEFAULT_LINKS,
  accent = "#C9A84C",
  onNav,
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNav = (href) => {
    setIsOpen(false);
    onNav?.(href);
  };

  return (
    // Wrapper — only visible on mobile (md:hidden in your layout)
    <div className="relative z-50">
      {/* ── TRIGGER BUTTON ── */}
      <motion.button
        className="relative flex items-center justify-center w-11 h-11 rounded-full focus:outline-none"
        style={{
          background: isOpen ? `${accent}18` : "transparent",
          border: `1px solid ${isOpen ? accent + "50" : "transparent"}`,
          transition: "background 0.3s, border-color 0.3s",
        }}
        whileTap={{scale: 0.92}}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <HamburgerIcon isOpen={isOpen} accent={accent} />
      </motion.button>

      {/* ── FULL-SCREEN OVERLAY ── */}
      <AnimatePresence>
        {/* Backdrop blur — separate layer */}
        {isOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{
              backdropFilter: "blur(4px)",
              background: "rgba(15,12,8,0.15)",
            }}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.4}}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SLIDE PANEL ── */}
      <motion.div
        className="fixed inset-0 z-50 flex flex-col"
        style={{background: "#0F0C08", pointerEvents: isOpen ? "auto" : "none"}}
        variants={overlayVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        {/* Top bar inside panel */}
        <div className="flex items-center justify-between px-8 pt-6 pb-0">
          {/* Wordmark */}
          <div>
            <div
              className="text-xl tracking-[0.22em] uppercase"
              style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontWeight: 400,
                color: "#F9F4EC",
              }}
            >
              BF<span style={{color: accent}}>·</span>Suma
            </div>
            <div
              className="text-[8px] tracking-[0.42em] uppercase mt-0.5"
              style={{color: accent + "99", fontWeight: 300}}
            >
              Health You Happy Us
            </div>
          </div>

          {/* Close trigger (re-uses the same button) */}
          <motion.button
            className="flex items-center justify-center w-11 h-11 rounded-full"
            style={{border: `1px solid ${accent}30`}}
            whileTap={{scale: 0.92}}
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <HamburgerIcon isOpen={true} accent={accent} />
          </motion.button>
        </div>

        {/* Gold divider */}
        <motion.div
          className="mx-8 mt-8 mb-0 origin-left"
          style={{height: 1, background: `${accent}30`}}
          variants={dividerVariants}
        />

        {/* ── NAV LINKS ── */}
        <motion.nav
          className="flex-1 flex flex-col justify-center px-8"
          variants={navListVariants}
        >
          <ul className="list-none p-0 m-0 space-y-1">
            {links.map(({label, href}, i) => (
              <motion.li key={label} variants={navItemVariants}>
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(href);
                  }}
                  className="group flex items-center justify-between py-5 no-underline"
                  style={{borderBottom: `1px solid ${accent}14`}}
                >
                  {/* Index + label */}
                  <div className="flex items-baseline gap-5">
                    <span
                      className="text-[10px] tracking-[0.3em]"
                      style={{color: accent + "60", fontWeight: 300}}
                    >
                      0{i + 1}
                    </span>
                    <motion.span
                      className="text-4xl tracking-tight leading-none"
                      style={{
                        fontFamily: "'Playfair Display', 'Georgia', serif",
                        fontWeight: 300,
                        color: "#F9F4EC",
                        transition: "color 0.3s",
                      }}
                      whileHover={{color: accent}}
                    >
                      {label}
                    </motion.span>
                  </div>

                  {/* Arrow — slides in on hover */}
                  <motion.div
                    className="opacity-0 group-hover:opacity-100"
                    initial={{x: -8}}
                    whileHover={{x: 0}}
                    style={{
                      transition: "opacity 0.3s, transform 0.3s",
                      color: accent,
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.nav>

        {/* ── FOOTER META ── */}
        <motion.div
          className="px-8 pb-10 pt-6"
          variants={footerVariants}
          style={{borderTop: `1px solid ${accent}18`}}
        >
          <div className="flex items-center justify-between">
            {/* Socials */}
            <div className="flex gap-5">
              {["IG", "FB", "TW", "TK"].map((s) => (
                <button
                  key={s}
                  className="text-[9px] tracking-[0.3em] uppercase transition-colors duration-300"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: accent + "70",
                    fontWeight: 400,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = accent + "70")
                  }
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Tagline */}
            <span
              className="text-[9px] tracking-[0.3em] uppercase"
              style={{color: accent + "50", fontWeight: 300}}
            >
              Pure · Natural · Luxe
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
