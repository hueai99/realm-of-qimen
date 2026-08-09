import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--paper)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5 sm:flex-nowrap sm:gap-5 sm:px-6 sm:py-4">
        <Link href="/" aria-label="Realm of Qimen home" className="flex min-w-0 items-center gap-3">
          <Image src="/ROQ%20logo.png" alt="Realm of Qimen" width={80} height={80} priority className="h-12 w-12 shrink-0 rounded-full object-contain sm:h-20 sm:w-20" />
          <span className="min-w-0">
            <strong className="font-display block whitespace-nowrap text-[13px] font-normal tracking-[.11em] sm:text-base sm:tracking-[.13em]">REALM OF QIMEN</strong>
            <span className="mt-1 hidden text-[11px] text-[var(--muted)] sm:block sm:text-xs">Traditional wisdom for modern life</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm md:flex">
          <Link href="/#bazi" className="transition hover:text-[var(--teal-dark)]">Bazi</Link>
          <span className="text-[var(--muted)]">Qimen</span>
          <span className="text-[var(--muted)]">Feng Shui</span>
        </nav>
        <nav aria-label="Mobile navigation" className="flex basis-full items-center justify-center gap-2 border-t border-[var(--border)] pt-2 text-[11px] sm:basis-auto sm:border-0 sm:pt-0 sm:text-xs md:hidden">
          <Link href="/#bazi" className="rounded-full border border-[var(--teal)] bg-[var(--teal-soft)] px-3 py-1.5 text-[var(--teal-dark)]">Bazi</Link>
          <Link href="/#services" className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[var(--muted)]">Qimen</Link>
          <Link href="/#services" className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[var(--muted)]">Feng Shui</Link>
        </nav>
      </div>
    </header>
  );
}
