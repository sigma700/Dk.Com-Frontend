import React, {useEffect, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {Link, useParams} from "react-router-dom";
import {useGetOrderStore} from "../stores/getOrderStore";
import {FaBoxOpen, FaTruckMoving} from "react-icons/fa6";
import {RiPlantLine} from "react-icons/ri";
import {TiTickOutline} from "react-icons/ti";

const GOLD = "#4A8C2A";
const GOLD_LIGHT = "#72B84A";
const GOLD_PALE = "#E8F5E0";
const CREAM = "#F7FBF4";
const DARK = "#1A1A1A";
const MUTED = "#5A7A4A";
const DARK_GREEN = "#14280F";

const Particle = ({delay, duration, x, y, size}) => (
  <motion.div
    initial={{opacity: 0, y: 0, x: 0, scale: 0}}
    animate={{
      opacity: [0, 1, 0],
      y: [0, -120 - Math.random() * 80],
      x: [0, (Math.random() - 0.5) * 120],
      scale: [0, 1, 0.5],
      rotate: [0, 360],
    }}
    transition={{
      duration,
      delay,
      ease: "easeOut",
      repeat: Infinity,
      repeatDelay: Math.random() * 3,
    }}
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
      pointerEvents: "none",
      zIndex: 0,
    }}
  />
);

const LeafIcon = ({style}) => (
  <svg
    viewBox="0 0 40 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <path
      d="M20 58 C20 58 2 40 2 22 C2 10 10 2 20 2 C30 2 38 10 38 22 C38 40 20 58 20 58Z"
      fill={GOLD}
      opacity="0.15"
      stroke={GOLD}
      strokeWidth="0.5"
    />
    <path d="M20 58 L20 10" stroke={GOLD} strokeWidth="0.8" opacity="0.4" />
    <path
      d="M20 20 C14 16 8 18 8 26"
      stroke={GOLD}
      strokeWidth="0.6"
      opacity="0.3"
    />
    <path
      d="M20 30 C26 26 32 28 32 36"
      stroke={GOLD}
      strokeWidth="0.6"
      opacity="0.3"
    />
  </svg>
);

const CheckmarkCircle = ({isVisible}) => {
  return (
    <div style={{position: "relative", width: 120, height: 120}}>
      <AnimatePresence>
        {isVisible && (
          <>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{scale: 0.5, opacity: 0.8}}
                animate={{scale: 2.5, opacity: 0}}
                transition={{
                  duration: 1.8,
                  delay: i * 0.3,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: `2px solid ${GOLD}`,
                  zIndex: 0,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{scale: 0, opacity: 0}}
        animate={isVisible ? {scale: 1, opacity: 1} : {}}
        transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2}}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          boxShadow: `0 20px 60px ${GOLD}50`,
        }}
      >
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <motion.path
            d="M12 26 L22 36 L40 16"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{pathLength: 0}}
            animate={isVisible ? {pathLength: 1} : {}}
            transition={{duration: 0.7, delay: 0.7, ease: "easeOut"}}
          />
        </svg>
      </motion.div>
    </div>
  );
};

const OrderDetailRow = ({label, value, delay}) => (
  <motion.div
    initial={{opacity: 0, x: -20}}
    animate={{opacity: 1, x: 0}}
    transition={{duration: 0.6, delay, ease: [0.16, 1, 0.3, 1]}}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 0",
      borderBottom: `1px solid ${GOLD}18`,
    }}
  >
    <span
      style={{
        fontSize: 11,
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: MUTED,
        fontWeight: 500,
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: 14,
        color: DARK,
        fontWeight: 400,
        fontFamily: "'Playfair Display', serif",
      }}
    >
      {value}
    </span>
  </motion.div>
);

const DeliveryStep = ({icon, label, isActive, isComplete, delay}) => (
  <motion.div
    initial={{opacity: 0, y: 20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.6, delay, ease: [0.16, 1, 0.3, 1]}}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      flex: 1,
    }}
  >
    <motion.div
      animate={isActive ? {scale: [1, 1.12, 1]} : {}}
      transition={{duration: 2, repeat: Infinity, ease: "easeInOut"}}
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: isComplete
          ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`
          : isActive
            ? `${GOLD}20`
            : `${DARK}08`,
        border: isActive ? `2px solid ${GOLD}` : `1px solid ${GOLD}20`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        boxShadow: isActive ? `0 8px 24px ${GOLD}30` : "none",
        transition: "all 0.4s ease",
      }}
    >
      {icon}
    </motion.div>
    <span
      style={{
        fontSize: 9,
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: isActive || isComplete ? GOLD : MUTED,
        fontWeight: 500,
        textAlign: "center",
      }}
    >
      {label}
    </span>
  </motion.div>
);

const OrderConfirmation = () => {
  const {orderId} = useParams();
  const {order, isLoading, error, fetchOrder, isGotten} = useGetOrderStore();
  const [checkVisible, setCheckVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId, fetchOrder]);

  useEffect(() => {
    const t1 = setTimeout(() => setCheckVisible(true), 300);
    const t2 = setTimeout(() => setShowContent(true), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const particles = Array.from({length: 18}, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 40 + Math.random() * 40,
    size: 4 + Math.random() * 6,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
  }));

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: CREAM,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{color: MUTED}}>Loading your order...</p>
      </div>
    );
  }

  if (error || (!isLoading && (!order || !isGotten))) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: CREAM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <p style={{color: "#C0392B", marginBottom: 20}}>
          {error || "Order not found"}
        </p>
        <Link to="/">
          <button
            style={{
              padding: "12px 24px",
              background: GOLD,
              color: "white",
              border: "none",
              borderRadius: 40,
              cursor: "pointer",
            }}
          >
            Return to Shop
          </button>
        </Link>
      </div>
    );
  }

  const orderNumber = order._id.slice(-8).toUpperCase();
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const paymentStatusText =
    order.paymentStatus === "paid" ? "M-Pesa — Confirmed" : "Pending Payment";
  const totalAmount = order.total;

  let stepConfirmed = false;
  let stepPreparing = false;
  let stepPacked = false;
  let stepOnWay = false;

  switch (order.orderStatus) {
    case "confirmed":
      stepConfirmed = true;
      stepPreparing = true;
      break;
    case "shipped":
      stepConfirmed = true;
      stepPreparing = true;
      stepPacked = true;
      break;
    case "out_for_delivery":
    case "delivered":
      stepConfirmed = true;
      stepPreparing = true;
      stepPacked = true;
      stepOnWay = true;
      break;
    default:
      stepConfirmed = true;
      break;
  }

  return (
    <main
      className="w-full min-h-screen"
      style={{
        background: `linear-gradient(160deg, ${CREAM} 0%, ${GOLD_PALE} 50%, #C5E4AC22 100%)`,
        fontFamily: "'Georgia', serif",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{x: [0, 40, 0], y: [0, -30, 0]}}
        transition={{duration: 14, repeat: Infinity, ease: "easeInOut"}}
        style={{
          position: "fixed",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GOLD}14 0%, transparent 70%)`,
          top: "-20%",
          right: "10%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{x: [0, -30, 0], y: [0, 40, 0]}}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        style={{
          position: "fixed",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GOLD_LIGHT}10 0%, transparent 70%)`,
          bottom: "-10%",
          left: "-5%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1}}
      >
        {checkVisible && particles.map((p) => <Particle key={p.id} {...p} />)}
      </div>

      {[
        {top: "8%", right: "6%", size: 60, delay: 0.5, rot: 20},
        {top: "70%", left: "3%", size: 40, delay: 1.2, rot: -30},
        {top: "30%", right: "2%", size: 30, delay: 0.8, rot: 45},
      ].map((leaf, i) => (
        <motion.div
          key={i}
          initial={{opacity: 0}}
          animate={{
            opacity: 0.6,
            rotate: [leaf.rot - 5, leaf.rot + 5, leaf.rot - 5],
          }}
          transition={{
            opacity: {delay: leaf.delay, duration: 1},
            rotate: {duration: 5 + i, repeat: Infinity, ease: "easeInOut"},
          }}
          style={{position: "fixed", ...leaf, pointerEvents: "none", zIndex: 0}}
        >
          <LeafIcon style={{width: leaf.size, height: leaf.size * 1.5}} />
        </motion.div>
      ))}

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 680,
          margin: "0 auto",
          padding: "60px 24px 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.div
          initial={{opacity: 0, y: -20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
          style={{marginBottom: 40}}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 20px",
              border: `1px solid ${GOLD}50`,
              background: `${GOLD}10`,
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
                background: GOLD,
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: GOLD,
              }}
            >
              Mindful Living KE
            </span>
          </div>
        </motion.div>

        <div style={{marginBottom: 36, position: "relative"}}>
          <CheckmarkCircle isVisible={checkVisible} />
        </div>

        <AnimatePresence>
          {showContent && (
            <>
              <motion.h1
                initial={{opacity: 0, y: 30, filter: "blur(8px)"}}
                animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
                transition={{duration: 0.9, ease: [0.16, 1, 0.3, 1]}}
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontSize: "clamp(36px, 5vw, 58px)",
                  fontWeight: 300,
                  color: DARK,
                  textAlign: "center",
                  lineHeight: 1.1,
                  margin: "0 0 12px",
                  letterSpacing: "-0.01em",
                }}
              >
                Order{" "}
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
                  Confirmed
                </em>
              </motion.h1>

              <motion.p
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{
                  duration: 0.7,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  fontSize: 14,
                  color: MUTED,
                  textAlign: "center",
                  maxWidth: 420,
                  margin: "0 auto 48px",
                  lineHeight: 1.9,
                  fontWeight: 300,
                  letterSpacing: "0.02em",
                  fontFamily: "Georgia, serif",
                }}
              >
                Your botanicals are being lovingly prepared. Thank you for
                choosing the natural way your skin will thank you.
              </motion.p>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{opacity: 0, y: 40, scale: 0.96}}
              animate={{opacity: 1, y: 0, scale: 1}}
              transition={{duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1]}}
              style={{
                width: "100%",
                background: "white",
                borderRadius: 28,
                padding: "36px 40px",
                marginBottom: 28,
                boxShadow:
                  "0 30px 80px -20px rgba(30,70,10,0.12), 0 8px 24px -8px rgba(0,0,0,0.06)",
                border: `1px solid ${GOLD}15`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 200,
                  height: 200,
                  background: `radial-gradient(circle, ${GOLD}08 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 28,
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
                  Order Summary
                </span>
                <div style={{width: 36, height: 1, background: GOLD}} />
              </div>

              <OrderDetailRow
                label="Order ID"
                value={orderNumber}
                delay={0.4}
              />
              <OrderDetailRow label="Date" value={orderDate} delay={0.5} />
              <OrderDetailRow
                label="Payment"
                value={paymentStatusText}
                delay={0.6}
              />
              <OrderDetailRow
                label="Delivery"
                value="Nairobi, 2–3 Business Days"
                delay={0.7}
              />

              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.85}}
                style={{
                  marginTop: 24,
                  padding: "20px 24px",
                  background: GOLD_PALE,
                  borderRadius: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: MUTED,
                    fontWeight: 500,
                  }}
                >
                  Total Paid
                </span>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 28,
                    fontWeight: 300,
                    color: DARK,
                  }}
                >
                  KES{" "}
                  {totalAmount.toLocaleString("en-KE", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{opacity: 0, y: 30}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1]}}
              style={{
                width: "100%",
                background: "white",
                borderRadius: 28,
                padding: "36px 40px",
                marginBottom: 32,
                boxShadow: "0 20px 60px -16px rgba(30,70,10,0.10)",
                border: `1px solid ${GOLD}15`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 32,
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
                  Delivery Status
                </span>
                <div style={{width: 36, height: 1, background: GOLD}} />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 24,
                    left: "12.5%",
                    right: "12.5%",
                    height: 1,
                    background: `linear-gradient(90deg, ${GOLD}, ${GOLD}30, ${GOLD}10)`,
                    zIndex: 0,
                  }}
                />

                <DeliveryStep
                  icon=<TiTickOutline />
                  label="Confirmed"
                  isComplete={stepConfirmed}
                  delay={0.6}
                />
                <DeliveryStep
                  icon=<RiPlantLine />
                  label="Preparing"
                  isActive={stepPreparing && !stepConfirmed}
                  isComplete={stepPreparing}
                  delay={0.7}
                />
                <DeliveryStep
                  icon=<FaBoxOpen />
                  label="Packed"
                  isComplete={stepPacked}
                  delay={0.8}
                />
                <DeliveryStep
                  icon=<FaTruckMoving />
                  label="On The Way"
                  isComplete={stepOnWay}
                  delay={0.9}
                />
              </div>

              <motion.p
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 1.1}}
                style={{
                  textAlign: "center",
                  marginTop: 28,
                  fontSize: 12,
                  color: MUTED,
                  letterSpacing: "0.04em",
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}
              >
                We'll send an SMS update to your registered number at each step.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1]}}
              style={{
                display: "flex",
                gap: 16,
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/"
                style={{flex: 1, minWidth: 200, textDecoration: "none"}}
              >
                <motion.button
                  whileHover={{scale: 1.02, boxShadow: `0 20px 50px ${GOLD}50`}}
                  whileTap={{scale: 0.98}}
                  style={{
                    width: "100%",
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                    border: "none",
                    borderRadius: 100,
                    padding: "16px 0",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    boxShadow: `0 12px 36px ${GOLD}35`,
                    transition: "box-shadow 0.3s ease",
                  }}
                >
                  Continue Shopping
                </motion.button>
              </Link>

              <motion.button
                whileHover={{borderColor: GOLD, color: GOLD}}
                whileTap={{scale: 0.98}}
                style={{
                  flex: 1,
                  minWidth: 200,
                  background: "white",
                  border: `1px solid ${GOLD}40`,
                  borderRadius: 100,
                  padding: "16px 0",
                  color: MUTED,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Track Order
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 1}}
              style={{
                marginTop: 44,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={{width: 36, height: 1, background: `${GOLD}40`}} />
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: MUTED,
                  fontWeight: 400,
                  opacity: 0.7,
                }}
              >
                Kenya's Natural Choice — Est. 2020
              </span>
              <div style={{width: 36, height: 1, background: `${GOLD}40`}} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        @keyframes shimmer-text {
          0%   { background-position: 0%   center }
          50%  { background-position: 100% center }
          100% { background-position: 0%   center }
        }
        * { box-sizing: border-box; }
        @media (max-width: 600px) {
          div[style*="padding: 36px 40px"] { padding: 28px 20px !important; }
        }
      `}</style>
    </main>
  );
};

export default OrderConfirmation;
