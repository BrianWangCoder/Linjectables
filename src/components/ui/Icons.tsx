type P = { className?: string };
const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const MailIcon = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6.5l8.5 6 8.5-6" /></svg>
);
export const PhoneIcon = (p: P) => (
  <svg {...base} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" /></svg>
);
export const InstagramIcon = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></svg>
);
export const PinIcon = (p: P) => (
  <svg {...base} {...p}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const ArrowIcon = (p: P) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowUpRight = (p: P) => (
  <svg {...base} {...p}><path d="M7 17L17 7M8 7h9v9" /></svg>
);
export const CheckIcon = (p: P) => (
  <svg {...base} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
