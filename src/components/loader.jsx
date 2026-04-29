import {motion} from "framer-motion";
import {PiPlantBold} from "react-icons/pi";

const GREEN = "#4A8C2A";
const GREEN_LIGHT = "#72B84A";
const GREEN_PALE = "#E8F5E0";
const CREAM = "#F7FBF4";
const DARK_GREEN = "#14280F";

const PremiumLoader = ({fullPage = true, transparent = false}) => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    ...(fullPage && {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
    }),
    background: transparent
      ? "rgba(247,251,244,0.85)"
      : `linear-gradient(135deg, ${CREAM} 0%, ${GREEN_PALE} 100%)`,
    backdropFilter: transparent ? "blur(12px)" : "none",
  };

  return (
    <div style={containerStyle}>
      {/* Floating animated background circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GREEN_LIGHT}20, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GREEN}20, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Main icon and text */}
      <motion.div
        initial={{opacity: 0, y: 20, scale: 0.9}}
        animate={{opacity: 1, y: 0, scale: 1}}
        transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
        style={{
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 0.98, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${GREEN}, ${DARK_GREEN})`,
            boxShadow: `0 12px 28px -8px ${GREEN}60`,
            marginBottom: 28,
          }}
        >
          <PiPlantBold size={40} color={CREAM} />
        </motion.div>

        <motion.h2
          animate={{opacity: [0.6, 1, 0.6]}}
          transition={{duration: 1.8, repeat: Infinity}}
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: DARK_GREEN,
            margin: "0 0 8px",
          }}
        >
          Mindful Living
        </motion.h2>

        <motion.div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 16,
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{y: [0, -8, 0]}}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              style={{
                display: "block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: GREEN_LIGHT,
              }}
            />
          ))}
        </motion.div>

        <motion.p
          animate={{opacity: [0.4, 0.9, 0.4]}}
          transition={{duration: 2, repeat: Infinity}}
          style={{
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: GREEN,
            marginTop: 20,
            fontWeight: 500,
          }}
        >
          Please wait
        </motion.p>
      </motion.div>

      {/* Subtle leaf trail (decorative) */}
      <motion.div
        animate={{x: [0, 30, 0]}}
        transition={{duration: 4, repeat: Infinity, ease: "easeInOut"}}
        style={{
          position: "absolute",
          bottom: "15%",
          left: "20%",
          opacity: 0.2,
          pointerEvents: "none",
        }}
      >
        <PiPlantBold size={32} color={GREEN} />
      </motion.div>
      <motion.div
        animate={{x: [0, -25, 0]}}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{
          position: "absolute",
          top: "20%",
          right: "15%",
          opacity: 0.15,
          pointerEvents: "none",
          transform: "rotate(45deg)",
        }}
      >
        <PiPlantBold size={48} color={GREEN} />
      </motion.div>
    </div>
  );
};

export default PremiumLoader;
