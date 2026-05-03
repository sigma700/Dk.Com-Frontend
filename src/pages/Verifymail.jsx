import React, {useState, useRef, useEffect, useCallback} from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {FaLeaf, FaRegMoneyBillAlt, FaTruck} from "react-icons/fa";
import {FaPersonCircleCheck} from "react-icons/fa6";
import {TbHealthRecognition} from "react-icons/tb";
import useAuthStore from "../stores/authStore";

const GOLD = "#4A8C2A";
const GOLD_LIGHT = "#72B84A";
const GOLD_PALE = "#E8F5E0";
const CREAM = "#F7FBF4";
const DARK = "#1A1A1A";
const MUTED = "#5A7A4A";
const DARK_GREEN = "#14280F";
const GOLD_WARM = "#5BA535";

const CursorFollower = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isOverInteractive, setIsOverInteractive] = useState(false);
  const springConfig = {damping: 28, stiffness: 180, mass: 0.6};
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
    };
    const over = (e) =>
      setIsOverInteractive(
        !!e.target.closest("button, a, input, [data-interactive]"),
      );
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: smoothX,
        top: smoothY,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: isOverInteractive
          ? `radial-gradient(circle, rgba(74,140,42,0.38) 0%, transparent 70%)`
          : `radial-gradient(circle, rgba(74,140,42,0.18) 0%, transparent 70%)`,
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "multiply",
        filter: "blur(2px)",
        scale: isOverInteractive ? 1.9 : 1,
        transition: "scale 0.3s ease, background 0.3s ease",
      }}
    />
  );
};

const Particle = ({delay, size, startX, startY, color}) => (
  <motion.div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      filter: `blur(${size / 3}px)`,
      pointerEvents: "none",
      left: `${startX}%`,
      top: `${startY}%`,
      zIndex: 0,
    }}
    animate={{
      x: [0, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60, 0],
      y: [0, -40 - Math.random() * 60, -80 - Math.random() * 40, 0],
      opacity: [0, 0.7, 0.4, 0],
      scale: [0.5, 1, 0.8, 0.3],
    }}
    transition={{
      duration: 8 + Math.random() * 6,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const SectionLabel = ({text}) => {
  const ref = useRef(null);
  const inView = useInView(ref, {once: true});
  return (
    <div
      ref={ref}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 24,
      }}
    >
      <motion.div
        initial={{scaleX: 0}}
        animate={inView ? {scaleX: 1} : {}}
        transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
        style={{
          width: 36,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${GOLD})`,
          transformOrigin: "left",
        }}
      />
      <motion.span
        initial={{opacity: 0}}
        animate={inView ? {opacity: 1} : {}}
        transition={{duration: 0.7, delay: 0.3}}
        style={{
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: MUTED,
        }}
      >
        {text}
      </motion.span>
      <motion.div
        initial={{scaleX: 0}}
        animate={inView ? {scaleX: 1} : {}}
        transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15}}
        style={{
          width: 36,
          height: 1,
          background: `linear-gradient(90deg, ${GOLD}, transparent)`,
          transformOrigin: "right",
        }}
      />
    </div>
  );
};

const ThreeDots = () => (
  <span style={{display: "inline-flex", gap: 5, alignItems: "center"}}>
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        animate={{y: [0, -6, 0], opacity: [0.5, 1, 0.5]}}
        transition={{
          duration: 0.7,
          repeat: Infinity,
          delay: i * 0.15,
          ease: "easeInOut",
        }}
        style={{
          display: "inline-block",
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#fff",
        }}
      />
    ))}
  </span>
);

const ConfettiLeaf = ({x, angle, delay, color}) => (
  <motion.div
    initial={{y: 0, x: 0, opacity: 1, rotate: 0, scale: 1}}
    animate={{
      y: -160 - Math.random() * 100,
      x,
      opacity: 0,
      rotate: angle,
      scale: 0.3,
    }}
    transition={{
      duration: 1.4 + Math.random() * 0.5,
      delay,
      ease: [0.16, 1, 0.3, 1],
    }}
    style={{
      position: "absolute",
      width: 10,
      height: 10,
      borderRadius: "0 50% 50% 0",
      background: color,
      transformOrigin: "left center",
      pointerEvents: "none",
    }}
  />
);

const AnimatedText = ({text, stagger = 0.035}) => (
  <span style={{display: "inline-flex", flexWrap: "wrap"}}>
    {text.split("").map((char, i) => (
      <motion.span
        key={i}
        initial={{opacity: 0, y: 18, filter: "blur(4px)"}}
        animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
        transition={{
          duration: 0.45,
          delay: i * stagger,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          display: "inline-block",
          whiteSpace: char === " " ? "pre" : "normal",
        }}
      >
        {char}
      </motion.span>
    ))}
  </span>
);

const OtpCell = ({
  value,
  index,
  focused,
  error,
  inputRef,
  onChange,
  onKeyDown,
  onFocus,
  onPaste,
}) => {
  const isFilled = value !== "";

  return (
    <motion.div
      style={{position: "relative"}}
      animate={error ? {x: [0, -6, 6, -4, 4, -2, 0]} : {x: 0}}
      transition={error ? {duration: 0.4} : {}}
    >
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{opacity: 0, scale: 0.85}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0}}
            style={{
              position: "absolute",
              inset: -5,
              borderRadius: 18,
              background: `radial-gradient(ellipse, rgba(74,140,42,0.2) 0%, transparent 70%)`,
              filter: "blur(6px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      <motion.input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onPaste={onPaste}
        animate={{
          borderColor: error
            ? "#C41E3A"
            : focused
              ? GOLD
              : isFilled
                ? `rgba(74,140,42,0.55)`
                : "rgba(74,140,42,0.18)",
          background: focused
            ? "rgba(255,255,255,0.97)"
            : isFilled
              ? `rgba(232,245,224,0.6)`
              : "rgba(255,255,255,0.65)",
          boxShadow: error
            ? `0 0 0 3px rgba(196,30,58,0.12)`
            : focused
              ? `0 0 0 4px rgba(74,140,42,0.12), 0 8px 24px -8px rgba(74,140,42,0.28), inset 0 1px 0 rgba(255,255,255,0.9)`
              : isFilled
                ? `0 4px 14px -4px rgba(74,140,42,0.2), inset 0 1px 0 rgba(255,255,255,0.8)`
                : `0 2px 8px -4px rgba(74,140,42,0.08), inset 0 1px 0 rgba(255,255,255,0.7)`,
          scale: focused ? 1.06 : 1,
          y: isFilled && !focused ? -1 : 0,
        }}
        transition={{
          duration: 0.22,
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        style={{
          position: "relative",
          zIndex: 1,
          width: 52,
          height: 64,
          borderRadius: 16,
          border: `1.5px solid rgba(74,140,42,0.18)`,
          backdropFilter: "blur(16px)",
          textAlign: "center",
          fontSize: 22,
          fontWeight: 500,
          color: error ? "#C41E3A" : DARK,
          fontFamily: "'Playfair Display', Georgia, serif",
          outline: "none",
          cursor: "text",
          letterSpacing: 0,
          caretColor: "transparent",
        }}
      />

      <AnimatePresence>
        {isFilled && !focused && (
          <motion.div
            initial={{scale: 0}}
            animate={{scale: 1}}
            exit={{scale: 0}}
            style={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: GOLD,
              zIndex: 2,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";

  const {
    verifyEmail,
    resendVerificationCode,
    isLoading,
    error: authError,
    clearError,
  } = useAuthStore();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const inputRefs = useRef([]);
  const heroRef = useRef(null);
  const sidebarRef = useRef(null);
  const isHeroInView = useInView(heroRef, {once: true});
  const isSidebarInView = useInView(sidebarRef, {once: true});

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const orb1X = useTransform(mouseX, [0, 1], [-22, 22]);
  const orb1Y = useTransform(mouseY, [0, 1], [-16, 16]);
  const orb2X = useTransform(mouseX, [0, 1], [16, -16]);
  const orb2Y = useTransform(mouseY, [0, 1], [12, -12]);

  useEffect(() => {
    const fn = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (authError) {
      setError(authError);
      const t = setTimeout(() => {
        clearError();
        setError("");
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [authError, clearError]);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 600);
  }, []);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextEmpty = Math.min(pasted.length, 5);
    inputRefs.current[nextEmpty]?.focus();
  };

  const handleVerify = useCallback(async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    const result = await verifyEmail(code);
    if (result?.success) {
      setShowConfetti(true);
      setTimeout(() => {
        setSuccess(true);
        setShowConfetti(false);
        setTimeout(() => navigate("/"), 2200);
      }, 500);
    } else {
      setError(result?.error || "Invalid code. Please try again.");
      setTimeout(() => {
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }, 600);
    }
  }, [otp, verifyEmail, navigate]);

  const handleResend = async () => {
    if (!canResend || resendLoading) return;
    setResendLoading(true);
    setResendSuccess(false);
    const result = await resendVerificationCode(email);
    setResendLoading(false);
    if (result?.success) {
      setResendSuccess(true);
      setCountdown(30);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setTimeout(() => setResendSuccess(false), 4000);
    } else {
      setError(result?.error || "Failed to resend. Please try again.");
    }
  };

  const isComplete = otp.every((d) => d !== "");

  const particles = Array.from({length: 10}, (_, i) => ({
    delay: i * 0.5,
    size: 3 + Math.random() * 5,
    startX: Math.random() * 100,
    startY: 20 + Math.random() * 75,
    color: [
      "rgba(74,140,42,0.55)",
      "rgba(114,184,74,0.45)",
      "rgba(168,216,120,0.4)",
    ][i % 3],
  }));

  const confettiPieces = Array.from({length: 18}, (_, i) => ({
    x: (Math.random() - 0.5) * 280,
    angle: Math.random() * 720 - 360,
    delay: i * 0.04,
    color: [GOLD, GOLD_LIGHT, "#A8D878", GOLD_PALE, "#C5E4AC"][i % 5],
  }));

  const benefitVariants = {
    hidden: {},
    visible: {transition: {staggerChildren: 0.11, delayChildren: 0.55}},
  };
  const benefitItem = {
    hidden: {opacity: 0, x: -28, filter: "blur(4px)"},
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {duration: 0.65, ease: [0.16, 1, 0.3, 1]},
    },
  };

  const maskedEmail = (() => {
    if (!email || email === "your email") return "your email";
    const [local, domain] = email.split("@");
    if (!domain) return email;
    const visible = local.slice(0, 2);
    const masked = "*".repeat(Math.max(0, local.length - 2));
    return `${visible}${masked}@${domain}`;
  })();

  return (
    <>
      <CursorFollower />
      <main
        style={{
          background: CREAM,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&display=swap');
          @keyframes shimmer-text { 0%,100%{background-position:0% center} 50%{background-position:100% center} }
          @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes pulse-ring { 0%,100%{opacity:0.14;transform:scale(1)} 50%{opacity:0.32;transform:scale(1.05)} }
          @keyframes grain {
            0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)} 20%{transform:translate(2%,2%)}
            30%{transform:translate(-1%,3%)} 40%{transform:translate(3%,-1%)} 50%{transform:translate(-2%,2%)}
            60%{transform:translate(1%,-3%)} 70%{transform:translate(-3%,1%)} 80%{transform:translate(2%,3%)} 90%{transform:translate(-1%,-2%)}
          }
          @keyframes float-icon { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-8px) rotate(5deg)} 66%{transform:translateY(-4px) rotate(-3deg)} }
          @keyframes scan-line { 0%{top:-4px} 100%{top:calc(100% + 4px)} }
          * { cursor: none !important; }
          .verify-grid { display:grid; grid-template-columns:1fr 1fr; min-height:100vh; }
          .page-grain::after {
            content:''; position:fixed; inset:-50%; width:200%; height:200%;
            background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            opacity:0.025; pointer-events:none; z-index:9998; animation:grain 8s steps(10) infinite;
          }
          @media (max-width:900px) {
            .verify-grid { grid-template-columns:1fr !important; }
            .verify-sidebar { display:none !important; }
            .verify-form-panel { padding:40px 24px 60px !important; }
            .otp-row { gap:8px !important; }
            .otp-row > div input { width:42px !important; height:54px !important; font-size:18px !important; }
          }
        `}</style>

        <div
          className="page-grain"
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 9998,
          }}
        />

        <div
          style={{
            position: "fixed",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 1,
            background: `linear-gradient(to bottom, transparent 0%, ${GOLD}44 30%, ${GOLD_LIGHT}33 55%, ${GOLD}33 75%, transparent 100%)`,
            zIndex: 10,
            pointerEvents: "none",
            filter: "blur(1px)",
          }}
        />

        <div className="verify-grid">
          <motion.div
            ref={sidebarRef}
            initial={{x: -80, opacity: 0, filter: "blur(10px)"}}
            animate={
              isSidebarInView ? {x: 0, opacity: 1, filter: "blur(0px)"} : {}
            }
            transition={{duration: 1.05, ease: [0.16, 1, 0.3, 1]}}
            className="verify-sidebar"
            style={{
              background: `radial-gradient(circle at 70% 25%, #1A4012 0%, ${DARK_GREEN} 48%, #0D1F0A 100%)`,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "52px 56px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `linear-gradient(rgba(114,184,74,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(114,184,74,0.03) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
                pointerEvents: "none",
              }}
            />
            <motion.div
              style={{
                x: orb1X,
                y: orb1Y,
                position: "absolute",
                top: "-22%",
                right: "-12%",
                width: 520,
                height: 520,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(74,140,42,0.22) 0%, transparent 68%)",
                pointerEvents: "none",
              }}
            />
            <motion.div
              style={{
                x: orb2X,
                y: orb2Y,
                position: "absolute",
                bottom: "6%",
                left: "-10%",
                width: 280,
                height: 280,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(114,184,74,0.16) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            {[
              {
                size: 320,
                pos: {bottom: "5%", right: "-15%"},
                dur: "48s",
                op: 0.22,
                dir: "normal",
              },
              {
                size: 180,
                pos: {top: "12%", left: "-10%"},
                dur: "32s",
                op: 0.15,
                dir: "reverse",
              },
              {
                size: 90,
                pos: {top: "54%", right: "14%"},
                dur: "20s",
                op: 0.11,
                dir: "normal",
              },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: r.size,
                  height: r.size,
                  borderRadius: "50%",
                  border: `1px dashed rgba(114,184,74,${r.op})`,
                  ...r.pos,
                  pointerEvents: "none",
                  animation: `spin-slow ${r.dur} linear infinite ${r.dir}, pulse-ring ${6 + i * 2.5}s ease-in-out infinite`,
                }}
              />
            ))}
            {particles.map((p, i) => (
              <Particle key={i} {...p} />
            ))}
            <div style={{position: "relative", zIndex: 2}}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 56,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: `1.5px solid rgba(114,184,74,0.5)`,
                    background: "rgba(74,140,42,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={GOLD_LIGHT}
                    strokeWidth="1.4"
                  >
                    <path d="M12 3C8 3 4 6 4 11c0 3.5 2 6.5 5 8v2h6v-2c3-1.5 5-4.5 5-8 0-5-4-8-8-8z" />
                    <path d="M9 21h6M12 3v4M8 5l2 3M16 5l-2 3" />
                  </svg>
                </div>
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 18,
                    fontWeight: 400,
                    color: CREAM,
                    letterSpacing: "0.05em",
                  }}
                >
                  Mindful Living Ke
                </span>
              </div>

              <SectionLabel text="Almost There" />

              <motion.h2
                initial={{opacity: 0, y: 28, filter: "blur(8px)"}}
                animate={
                  isSidebarInView ? {opacity: 1, y: 0, filter: "blur(0px)"} : {}
                }
                transition={{duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1]}}
                style={{
                  fontFamily: "'Playfair Display','Georgia',serif",
                  fontSize: "clamp(28px, 2.6vw, 42px)",
                  fontWeight: 300,
                  color: CREAM,
                  margin: "0 0 18px",
                  lineHeight: 1.18,
                  letterSpacing: "-0.01em",
                }}
              >
                One step{" "}
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
                  closer
                </em>
              </motion.h2>

              <motion.p
                initial={{opacity: 0}}
                animate={isSidebarInView ? {opacity: 1} : {}}
                transition={{duration: 0.8, delay: 0.4}}
                style={{
                  fontSize: 13,
                  color: "rgba(247,251,244,0.5)",
                  fontWeight: 300,
                  lineHeight: 1.95,
                  maxWidth: 340,
                  marginBottom: 52,
                }}
              >
                Verify your email to unlock your full Mindful Living Ke
                experience – curated botanicals, wellness guides, and
                member-exclusive offers await.
              </motion.p>

              <motion.div
                variants={benefitVariants}
                initial="hidden"
                animate={isSidebarInView ? "visible" : "hidden"}
              >
                {[
                  {
                    icon: <FaRegMoneyBillAlt />,
                    text: "Get informed of seasonal discounts",
                  },
                  {
                    icon: <FaPersonCircleCheck />,
                    text: "Personalised wellness recommendations",
                  },
                  {
                    icon: <TbHealthRecognition />,
                    text: "Members-only bundles & savings",
                  },
                  {
                    icon: <FaTruck />,
                    text: "Free shipping on orders above Ksh 2,500",
                  },
                ].map(({icon, text}, i) => (
                  <motion.div
                    key={i}
                    variants={benefitItem}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "rgba(74,140,42,0.18)",
                        border: `1px solid rgba(114,184,74,0.28)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        color: GOLD_LIGHT,
                        flexShrink: 0,
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {icon}
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: "rgba(247,251,244,0.62)",
                        fontWeight: 300,
                        lineHeight: 1.55,
                      }}
                    >
                      {text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={isSidebarInView ? {opacity: 1, y: 0} : {}}
              transition={{duration: 0.8, delay: 0.9}}
              style={{position: "relative", zIndex: 2, perspective: 900}}
            >
              <motion.div
                whileHover={{rotateY: 8, rotateX: -4, scale: 1.018}}
                transition={{type: "spring", stiffness: 200, damping: 20}}
                style={{
                  background: "rgba(20,40,15,0.38)",
                  backdropFilter: "blur(14px)",
                  borderRadius: 20,
                  padding: "24px 24px 20px",
                  border: `1px solid rgba(114,184,74,0.12)`,
                  boxShadow:
                    "0 8px 32px -8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    color: GOLD_LIGHT,
                    marginBottom: 10,
                    opacity: 0.55,
                  }}
                >
                  "
                </div>
                <p
                  style={{
                    fontSize: 12.5,
                    color: "rgba(247,251,244,0.48)",
                    fontStyle: "italic",
                    fontFamily: "'Playfair Display', serif",
                    lineHeight: 1.8,
                    marginBottom: 16,
                  }}
                >
                  The moringa capsules genuinely transformed my energy levels. I
                  was sceptical at first, but the quality speaks for itself.
                </p>
                <div style={{display: "flex", alignItems: "center", gap: 12}}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#fff",
                      boxShadow: `0 4px 12px ${GOLD}55`,
                    }}
                  >
                    W
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: GOLD_LIGHT,
                        letterSpacing: "0.14em",
                      }}
                    >
                      Wanjiku M.
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "rgba(247,251,244,0.28)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      Nairobi · Member since 2024
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            ref={heroRef}
            initial={{x: 80, opacity: 0, filter: "blur(10px)"}}
            animate={
              isHeroInView ? {x: 0, opacity: 1, filter: "blur(0px)"} : {}
            }
            transition={{duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.1}}
            className="verify-form-panel"
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "52px 64px",
              overflow: "hidden",
              background: `radial-gradient(ellipse at 80% 20%, rgba(114,184,74,0.08) 0%, transparent 58%), radial-gradient(ellipse at 20% 80%, rgba(74,140,42,0.06) 0%, transparent 52%), ${CREAM}`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "20px",
                borderRadius: 32,
                background: "rgba(247,251,244,0.52)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.72)",
                borderBottom: "1px solid rgba(74,140,42,0.1)",
                borderRight: "1px solid rgba(74,140,42,0.08)",
                boxShadow: `0 32px 80px -24px rgba(74,140,42,0.13), 0 8px 32px -8px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(74,140,42,0.07)`,
                pointerEvents: "none",
              }}
            />

            {particles.slice(0, 5).map((p, i) => (
              <Particle
                key={`r${i}`}
                {...p}
                size={p.size * 0.65}
                delay={p.delay + 1.5}
                startX={8 + i * 18}
                startY={5 + i * 18}
              />
            ))}

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{
                    opacity: 0,
                    scale: 0.88,
                    y: 32,
                    filter: "blur(10px)",
                  }}
                  animate={{opacity: 1, scale: 1, y: 0, filter: "blur(0px)"}}
                  transition={{duration: 0.85, ease: [0.16, 1, 0.3, 1]}}
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginBottom: 32,
                    }}
                  >
                    <motion.div
                      initial={{scale: 0, rotate: -45}}
                      animate={{scale: 1, rotate: 0}}
                      transition={{
                        delay: 0.15,
                        type: "spring",
                        stiffness: 250,
                        damping: 18,
                      }}
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${GOLD_PALE} 0%, rgba(114,184,74,0.2) 100%)`,
                        border: `2px solid ${GOLD}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 34,
                        color: GOLD,
                        margin: "0 auto",
                        boxShadow: `0 0 0 8px rgba(74,140,42,0.08), 0 0 0 16px rgba(74,140,42,0.04), 0 16px 48px -16px rgba(74,140,42,0.35)`,
                      }}
                    >
                      <motion.div
                        animate={{rotate: [0, 9, -9, 0], scale: [1, 1.12, 1]}}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <FaLeaf />
                      </motion.div>
                    </motion.div>
                    {showConfetti &&
                      confettiPieces.map((c, i) => (
                        <ConfettiLeaf key={i} {...c} />
                      ))}
                    {[1, 2, 3].map((n) => (
                      <motion.div
                        key={n}
                        initial={{scale: 1, opacity: 0.55}}
                        animate={{scale: 1 + n * 0.5, opacity: 0}}
                        transition={{
                          duration: 1.5,
                          delay: n * 0.25,
                          repeat: Infinity,
                        }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          border: `1px solid ${GOLD}`,
                          pointerEvents: "none",
                        }}
                      />
                    ))}
                  </div>

                  <h2
                    style={{
                      fontFamily: "'Playfair Display','Georgia',serif",
                      fontSize: 34,
                      fontWeight: 300,
                      color: DARK,
                      margin: "0 0 14px",
                      lineHeight: 1.2,
                    }}
                  >
                    <AnimatedText text="Email " />
                    <em style={{fontStyle: "italic", color: GOLD}}>
                      <AnimatedText text="Verified" stagger={0.065} />
                    </em>
                  </h2>
                  <motion.p
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.85}}
                    style={{
                      fontSize: 13,
                      color: MUTED,
                      fontWeight: 300,
                      lineHeight: 1.9,
                      marginBottom: 12,
                    }}
                  >
                    Your account is now active. Redirecting you to your
                    dashboard…
                  </motion.p>
                  <motion.div
                    initial={{scaleX: 0}}
                    animate={{scaleX: 1}}
                    transition={{delay: 1.1, duration: 1.8, ease: "linear"}}
                    style={{
                      height: 2,
                      background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                      borderRadius: 100,
                      transformOrigin: "left",
                      maxWidth: 200,
                      margin: "0 auto",
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="verify-form"
                  initial={{opacity: 0, y: 24}}
                  animate={isHeroInView ? {opacity: 1, y: 0} : {}}
                  transition={{
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.2,
                  }}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    maxWidth: 460,
                    width: "100%",
                  }}
                >
                  <motion.div
                    whileHover={{x: -2}}
                    style={{display: "inline-flex"}}
                  >
                    <Link
                      to="/login"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 10,
                        color: MUTED,
                        textDecoration: "none",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                        marginBottom: 36,
                        opacity: 0.7,
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "0.7")
                      }
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
                      Back to Login
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{opacity: 0, scale: 0.5}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{
                      delay: 0.3,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${GOLD_PALE} 0%, rgba(114,184,74,0.15) 100%)`,
                      border: `1.5px solid rgba(74,140,42,0.28)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 24,
                      position: "relative",
                      boxShadow: `0 8px 28px -8px rgba(74,140,42,0.3), 0 0 0 6px rgba(74,140,42,0.06)`,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        overflow: "hidden",
                        pointerEvents: "none",
                      }}
                    >
                      <motion.div
                        animate={{top: ["-4px", "calc(100% + 4px)"]}}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                          repeatDelay: 1.5,
                        }}
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          height: 2,
                          background: `linear-gradient(90deg, transparent, ${GOLD_LIGHT}88, transparent)`,
                        }}
                      />
                    </div>
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={GOLD}
                      strokeWidth="1.4"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </motion.div>

                  <h1
                    style={{
                      fontFamily: "'Playfair Display','Georgia',serif",
                      fontSize: "clamp(26px, 2.8vw, 36px)",
                      fontWeight: 300,
                      color: DARK,
                      margin: "0 0 10px",
                      lineHeight: 1.12,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Verify your{" "}
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
                      email
                    </em>
                  </h1>

                  <p
                    style={{
                      fontSize: 13,
                      color: MUTED,
                      fontWeight: 300,
                      marginBottom: 36,
                      lineHeight: 1.85,
                    }}
                  >
                    We sent a 6-digit code to{" "}
                    <strong style={{color: GOLD, fontWeight: 500}}>
                      {maskedEmail}
                    </strong>
                    . Enter it below to activate your account.
                  </p>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        key="err"
                        initial={{opacity: 0, y: -8, height: 0}}
                        animate={{opacity: 1, y: 0, height: "auto"}}
                        exit={{opacity: 0, y: -6, height: 0}}
                        style={{
                          background: "rgba(196,30,58,0.07)",
                          border: `1px solid rgba(196,30,58,0.3)`,
                          borderRadius: 12,
                          padding: "11px 16px",
                          marginBottom: 20,
                          fontSize: 11,
                          color: "#C41E3A",
                          textAlign: "center",
                          fontWeight: 500,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {error}
                      </motion.div>
                    )}
                    {resendSuccess && (
                      <motion.div
                        key="resend-ok"
                        initial={{opacity: 0, y: -8, height: 0}}
                        animate={{opacity: 1, y: 0, height: "auto"}}
                        exit={{opacity: 0, y: -6, height: 0}}
                        style={{
                          background: "rgba(74,140,42,0.08)",
                          border: `1px solid rgba(74,140,42,0.3)`,
                          borderRadius: 12,
                          padding: "11px 16px",
                          marginBottom: 20,
                          fontSize: 11,
                          color: GOLD,
                          textAlign: "center",
                          fontWeight: 500,
                          letterSpacing: "0.04em",
                        }}
                      >
                        ✓ A new code has been sent to your inbox.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    className="otp-row"
                    style={{
                      display: "flex",
                      gap: 12,
                      justifyContent: "center",
                      marginBottom: 32,
                    }}
                  >
                    {otp.map((digit, i) => (
                      <motion.div
                        key={i}
                        initial={{opacity: 0, y: 20, scale: 0.8}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        transition={{
                          delay: 0.35 + i * 0.07,
                          type: "spring",
                          stiffness: 350,
                          damping: 22,
                        }}
                      >
                        <OtpCell
                          value={digit}
                          index={i}
                          focused={focusedIndex === i}
                          error={!!error}
                          inputRef={(el) => (inputRefs.current[i] = el)}
                          onChange={(e) => handleChange(i, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(i, e)}
                          onFocus={() => setFocusedIndex(i)}
                          onPaste={handlePaste}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 6,
                      marginBottom: 28,
                    }}
                  >
                    {otp.map((d, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          background: d ? GOLD : "rgba(74,140,42,0.18)",
                          scale: d ? 1.2 : 1,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                        style={{width: 5, height: 5, borderRadius: "50%"}}
                      />
                    ))}
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleVerify}
                    disabled={isLoading || !isComplete}
                    whileTap={isComplete ? {scale: 0.96, y: 1} : {}}
                    whileHover={
                      isComplete
                        ? {
                            y: -2,
                            boxShadow: `0 16px 48px -12px rgba(74,140,42,0.55), 0 4px 16px -4px rgba(0,0,0,0.1)`,
                          }
                        : {}
                    }
                    animate={{
                      opacity: isComplete ? 1 : 0.5,
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      background: `linear-gradient(135deg, ${GOLD_WARM} 0%, ${GOLD} 40%, ${DARK_GREEN} 100%)`,
                      border: "none",
                      borderRadius: 16,
                      padding: "16px 28px",
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      color: "#fff",
                      cursor:
                        isComplete && !isLoading ? "pointer" : "not-allowed",
                      fontFamily: "inherit",
                      boxShadow: `0 8px 28px -8px rgba(74,140,42,0.42), inset 0 1px 0 rgba(255,255,255,0.18)`,
                      marginBottom: 20,
                      transition: "box-shadow 0.3s ease",
                      willChange: "transform",
                    }}
                  >
                    {isLoading ? (
                      <ThreeDots />
                    ) : (
                      <>
                        Verify Email
                        <motion.svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          animate={isComplete ? {x: [0, 3, 0]} : {}}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </motion.svg>
                      </>
                    )}
                  </motion.button>

                  <div style={{textAlign: "center"}}>
                    <p
                      style={{
                        fontSize: 12,
                        color: MUTED,
                        fontWeight: 300,
                        lineHeight: 1.8,
                        marginBottom: 10,
                      }}
                    >
                      Didn't receive a code?{" "}
                      <motion.button
                        type="button"
                        onClick={handleResend}
                        disabled={!canResend || resendLoading}
                        whileTap={canResend ? {scale: 0.95} : {}}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          fontSize: 12,
                          fontWeight: 500,
                          fontFamily: "inherit",
                          cursor: canResend ? "pointer" : "default",
                          color: canResend ? GOLD : MUTED,
                          opacity: canResend ? 1 : 0.55,
                          transition: "color 0.2s, opacity 0.2s",
                          textDecoration: canResend ? "underline" : "none",
                          textDecorationColor: `${GOLD}55`,
                        }}
                      >
                        {resendLoading
                          ? "Sending…"
                          : canResend
                            ? "Resend code"
                            : `Resend in ${countdown}s`}
                      </motion.button>
                    </p>

                    {!canResend && (
                      <motion.div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: 8,
                        }}
                      >
                        <svg width="36" height="36" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke="rgba(74,140,42,0.1)"
                            strokeWidth="2"
                          />
                          <motion.circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke={GOLD}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 14}`}
                            style={{
                              strokeDashoffset: `${2 * Math.PI * 14 * (countdown / 30)}`,
                              transformOrigin: "50% 50%",
                              transform: "rotate(-90deg)",
                            }}
                            transition={{duration: 0.5}}
                          />
                          <text
                            x="18"
                            y="22"
                            textAnchor="middle"
                            fontSize="9"
                            fill={MUTED}
                            fontFamily="inherit"
                            fontWeight="500"
                          >
                            {countdown}
                          </text>
                        </svg>
                      </motion.div>
                    )}

                    <p
                      style={{
                        fontSize: 12,
                        color: MUTED,
                        fontWeight: 300,
                        opacity: 0.7,
                      }}
                    >
                      Wrong account?{" "}
                      <Link
                        to="/register"
                        style={{
                          color: GOLD,
                          fontWeight: 500,
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = GOLD_LIGHT)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = GOLD)
                        }
                      >
                        Create a new account
                      </Link>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default VerifyEmailPage;
