const P = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  pill: (
    <>
      <path d="M13.6 3.4l7 7a5 5 0 0 1-7.1 7.1l-7-7a5 5 0 0 1 7.1-7.1z" />
      <path d="M9.6 7.4l7 7" />
    </>
  ),
  box: (
    <>
      <path d="M21 8.2l-9-4.9-9 4.9v7.6l9 4.9 9-4.9z" />
      <path d="M3 8.2l9 4.9 9-4.9" />
      <path d="M12 13.1V20.7" />
    </>
  ),
  cart: (
    <>
      <circle cx="9.5" cy="20" r="1.6" />
      <circle cx="18" cy="20" r="1.6" />
      <path d="M2 3h2.6l2.4 12.2a1.4 1.4 0 0 0 1.4 1.1h9.1a1.4 1.4 0 0 0 1.4-1.1L21.5 7H6" />
    </>
  ),
  cash: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 10v4M18 10v4" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="9" cy="7" rx="7" ry="3.2" />
      <path d="M2 7v4.5c0 1.8 3.1 3.2 7 3.2s7-1.4 7-3.2V7" />
      <path d="M9 14.7v4.1c0 1.8 3.1 3.2 7 3.2s7-1.4 7-3.2v-8.3" />
      <ellipse cx="16" cy="10.5" rx="7" ry="3.2" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 2.5h12v19l-3-1.8-3 1.8-3-1.8-3 1.8z" />
      <path d="M9.5 8h5M9.5 12h5" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.6L22 20.4H2z" />
      <path d="M12 10v4.2" />
      <path d="M12 17.4h.01" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8.5a6 6 0 1 0-12 0c0 6.8-2.8 8.7-2.8 8.7h17.6S18 15.3 18 8.5" />
      <path d="M13.7 20.5a2 2 0 0 1-3.4 0" />
    </>
  ),
  bellOff: (
    <>
      <path d="M8.7 4.2A6 6 0 0 1 18 8.5c0 2.5.5 4.2 1.2 5.4" />
      <path d="M16 17.2H3.2S6 15.3 6 8.5a5.9 5.9 0 0 1 .6-2.6" />
      <path d="M13.7 20.5a2 2 0 0 1-3.4 0" />
      <path d="M3 3l18 18" />
    </>
  ),
  tag: (
    <>
      <path d="M20.6 11.6L12.4 3.4a2 2 0 0 0-2.8 0L3.4 9.6a2 2 0 0 0 0 2.8l8.2 8.2a2 2 0 0 0 2.8 0l6.2-6.2a2 2 0 0 0 0-2.8z" />
      <path d="M7.8 7.8h.01" />
    </>
  ),
  truck: (
    <>
      <rect x="1.5" y="5.5" width="13" height="10" rx="1.5" />
      <path d="M14.5 8.5h4l3 3.5V15.5h-7" />
      <circle cx="5.2" cy="18" r="2" />
      <circle cx="17.6" cy="18" r="2" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
      <path d="M16 3.1a4 4 0 0 1 0 7.8" />
    </>
  ),
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10.5" width="16" height="10.5" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
      <path d="M12 14.5v2.5" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4.5" width="20" height="15" rx="2" />
      <path d="M2.5 6.5L12 13.2l9.5-6.7" />
    </>
  ),
  phone: (
    <path d="M21.5 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.6 3.8 2 2 0 0 1 3.6 1.6h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L7.6 9.2a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z" />
  ),
  pin: (
    <>
      <path d="M20 10.2c0 5.8-8 11.6-8 11.6s-8-5.8-8-11.6a8 8 0 1 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="17" rx="2" />
      <path d="M16 2.5v4M8 2.5v4M3 10.5h18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.4 2" />
    </>
  ),
  chart: (
    <>
      <path d="M3 21h18" />
      <path d="M6.5 21v-6M12 21V5M17.5 21v-9" />
    </>
  ),
  trend: (
    <>
      <path d="M22 7l-8.5 8.5-4.5-4.5L2 18" />
      <path d="M16 7h6v6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="M18 6L6 18M6 6l12 12" />,
  check: <path d="M20 6.5L9.2 17.3 4 12.1" />,
  checkCircle: (
    <>
      <path d="M21.7 11.1V12a10 10 0 1 1-5.9-9.1" />
      <path d="M22 4.2L12 14.2l-3-3" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11.2v5M12 7.8h.01" />
    </>
  ),
  edit: (
    <>
      <path d="M11 4H4.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6.5" />
      <path d="M18.4 2.6a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z" />
    </>
  ),
  trash: (
    <>
      <path d="M3.5 6h17" />
      <path d="M8.5 6V4.2a1.7 1.7 0 0 1 1.7-1.7h3.6a1.7 1.7 0 0 1 1.7 1.7V6" />
      <path d="M18.5 6v13.8a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V6" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </>
  ),
  filter: <path d="M21.5 3.5h-19L10 12.8V19l4 2v-8.2z" />,
  refresh: (
    <>
      <path d="M20.5 11.5A8.5 8.5 0 0 0 6.6 5.6L3.5 8.5" />
      <path d="M3.5 3.5v5h5" />
      <path d="M3.5 12.5a8.5 8.5 0 0 0 13.9 5.9l3.1-2.9" />
      <path d="M20.5 20.5v-5h-5" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5.5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2H9" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  store: (
    <>
      <path d="M3.5 9.5L5 3.5h14l1.5 6" />
      <path d="M4.5 9.5v11h15v-11" />
      <path d="M9.5 20.5v-6h5v6" />
      <path d="M3.5 9.5a2.6 2.6 0 0 0 5.2 0 2.6 2.6 0 0 0 5.2 0 2.6 2.6 0 0 0 5.2 0" />
    </>
  ),
  cross: <path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z" />,
  droplet: <path d="M12 2.8l5.6 5.7a8 8 0 1 1-11.3 0z" />,
  flask: (
    <>
      <path d="M9 2.5h6" />
      <path d="M10 2.5v6.2L4.8 19a2 2 0 0 0 1.8 3h10.8a2 2 0 0 0 1.8-3L14 8.7V2.5" />
      <path d="M7.4 15h9.2" />
    </>
  ),
  leaf: (
    <>
      <path d="M4.5 19.5c0-8.5 6-14.5 16-16 0 10.5-6 16-16 16z" />
      <path d="M4.5 19.5c4-4.5 7.5-6.8 12-8.8" />
    </>
  ),
  heart: (
    <>
      <path d="M20.6 8.5a4.9 4.9 0 0 0-8.6-3.3A4.9 4.9 0 0 0 3.4 8.5c0 5 8.6 10.6 8.6 10.6s8.6-5.6 8.6-10.6z" />
      <path d="M7 11.5h2.5l1.5-2.5 2 5 1.5-2.5H17" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.8l8 3v5.9c0 4.6-3.4 8-8 9.5-4.6-1.5-8-4.9-8-9.5V5.8z" />
      <path d="M9 12l2.2 2.2L15.5 10" />
    </>
  ),
  eye: (
    <>
      <path d="M1.8 12S5.6 5.4 12 5.4 22.2 12 22.2 12 18.4 18.6 12 18.6 1.8 12 1.8 12z" />
      <circle cx="12" cy="12" r="3.1" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </>
  ),
  download: (
    <>
      <path d="M21 15.5v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
      <path d="M7.5 10.5L12 15l4.5-4.5" />
      <path d="M12 15V3.5" />
    </>
  ),
  percent: (
    <>
      <path d="M19 5L5 19" />
      <circle cx="7" cy="7" r="2.6" />
      <circle cx="17" cy="17" r="2.6" />
    </>
  ),
};

export const ICON_NAMES = Object.keys(P);

export default function Icon({ name, size = 18, strokeWidth = 2, className = "", style, title }) {
  const shape = P[name];
  if (!shape) return null;
  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
      style={style}
    >
      {shape}
    </svg>
  );
}

const CATEGORY_ICONS = [
  { match: /medic|farmac|receta|analg|antibio/i, icon: "pill", tone: "brand" },
  { match: /vitamina|suplemento|nutric/i, icon: "flask", tone: "amber" },
  { match: /cuidado|higiene|personal|derm/i, icon: "droplet", tone: "sky" },
  { match: /equip|instrument|mascarilla/gi, icon: "shield", tone: "violet" },
  { match: /confit|azucar|otro/i, icon: "box", tone: "slate" },
];

export function categoryIcon(nombre) {
  const txt = (nombre || "").toLowerCase();
  return CATEGORY_ICONS.find((c) => c.match.test(txt)) || { icon: "box", tone: "slate" };
}
