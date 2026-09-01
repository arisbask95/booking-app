export default function ResourceIcon({ icon, size = 48 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "white", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };

  if (icon === "desk") {
    return (
      <svg {...common}>
        <rect x="2" y="7" width="20" height="3" rx="1" />
        <path d="M4 10v7" />
        <path d="M20 10v7" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
      </svg>
    );
  }

  if (icon === "meeting") {
    return (
      <svg {...common}>
        <rect x="4" y="9" width="16" height="3" rx="1" />
        <path d="M6 12v6" />
        <path d="M18 12v6" />
        <circle cx="7" cy="5" r="2" />
        <circle cx="17" cy="5" r="2" />
      </svg>
    );
  }

  // conference
  return (
    <svg {...common}>
      <rect x="3" y="4" width="18" height="10" rx="1" />
      <path d="M8 20h8" />
      <path d="M12 14v6" />
      <circle cx="7" cy="9" r="1.2" />
      <circle cx="12" cy="9" r="1.2" />
      <circle cx="17" cy="9" r="1.2" />
    </svg>
  );
}
