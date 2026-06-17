import {useState} from "react";

const GREEN = "#4A8C2A";
const GREEN_HOVER = "#3A7220";
const GREEN_BG_HOVER = "#F3F9EF";

export default function BuyNowButton({label = "Buy Now", onClick}) {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    if (added) return;
    setAdded(true);
    onClick?.();
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={added}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 28px",
        borderRadius: 8,
        border: `1px solid ${isHovered ? GREEN_HOVER : GREEN}`,
        background: isHovered ? GREEN_BG_HOVER : "#fff",
        color: "#1A1A1A",
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: "0.02em",
        cursor: added ? "default" : "pointer",
        transition: "background-color 0.15s ease, border-color 0.15s ease",
      }}
    >
      {added ? "Added ✓" : label}
      {!added && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          style={{
            transform: isHovered ? "translateX(2px)" : "translateX(0)",
            transition: "transform 0.15s ease",
          }}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}
