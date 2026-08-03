type ServiceIconProps = {
  service: "bazi" | "qimen" | "fengshui";
};

export default function ServiceIcon({ service }: ServiceIconProps) {
  return (
    <span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--teal-soft)] text-[var(--teal-dark)]" aria-hidden="true">
      {service === "bazi" && <BaziIcon />}
      {service === "qimen" && <QimenIcon />}
      {service === "fengshui" && <FengShuiIcon />}
    </span>
  );
}

function BaziIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none">
      <path d="M20 61C35 55 48 48 50 39c1-5-4-7-11-9-6-2-7-4-2-7 6-4 14-5 22-8-10 1-20 2-27 5-8 3-9 7-1 11 6 3 8 5 5 9-4 6-12 10-21 14L5 59l15 2Z" fill="currentColor" opacity=".28" />
      <circle cx="16" cy="17" r="4" fill="currentColor" />
      <path d="m15 23-2 11 7 5 3 10M14 28l-6 7M13 34l-4 12M16 25l8 7" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QimenIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 12v41" />
      <path d="M32 17H13l-6 7 6 7h19" />
      <path d="M32 33h19l6 7-6 7H32" />
      <circle cx="32" cy="10" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FengShuiIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 31 20-16 20 16" />
      <path d="M18 28v17h28V28M27 45V33h10v12" />
      <path d="M7 51c7-4 11 4 18 0s11 4 18 0 10 3 14 0M7 58c7-4 11 4 18 0s11 4 18 0 10 3 14 0" />
    </svg>
  );
}
