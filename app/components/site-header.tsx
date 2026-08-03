import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--paper)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-4 sm:px-6">
        <Link href="/" aria-label="Realm of Qimen home" className="flex min-w-0 items-center gap-3">
          <Image src="/ROQ%20logo.png" alt="Realm of Qimen" width={80} height={80} priority className="h-16 w-16 shrink-0 rounded-full object-contain sm:h-20 sm:w-20" />
          <span className="min-w-0">
            <strong className="block whitespace-nowrap font-serif text-sm font-normal tracking-[.13em] sm:text-base">REALM OF QIMEN</strong>
            <span className="mt-1 block text-[11px] text-[var(--muted)] sm:text-xs">Traditional wisdom for modern life</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm md:flex">
          <Link href="/#bazi" className="transition hover:text-[var(--teal-dark)]">Bazi</Link>
          <span className="text-[var(--muted)]">Qimen</span>
          <span className="text-[var(--muted)]">Feng Shui</span>
        </nav>
        <nav aria-label="Mobile navigation" className="flex items-center gap-1.5 text-[10px] sm:gap-2 sm:text-xs md:hidden">
          <Link href="/#bazi" className="rounded-full border border-[var(--teal)] bg-[var(--teal-soft)] px-2 py-2 text-[var(--teal-dark)] sm:px-2.5">Bazi</Link>
          <Link href="/#services" className="rounded-full border border-[var(--border)] px-2 py-2 text-[var(--muted)] sm:px-2.5">Qimen</Link>
          <Link href="/#services" className="rounded-full border border-[var(--border)] px-2 py-2 text-[var(--muted)] sm:px-2.5">Feng Shui</Link>
        </nav>
      </div>
    </header>
  );
}
