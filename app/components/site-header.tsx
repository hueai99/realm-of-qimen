import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--paper)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2 sm:flex-nowrap sm:gap-5 sm:px-6 sm:py-3">
        <Link href="/" aria-label="Realm of Qimen home" className="flex min-w-0 items-center gap-3">
          <Image src="/ROQ%20logo.png" alt="Realm of Qimen" width={96} height={96} priority className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-full object-contain sm:h-24 sm:w-24" />
          <span className="min-w-0">
            <strong className="font-display block whitespace-nowrap text-[13px] font-normal tracking-[.11em] sm:text-base sm:tracking-[.13em]">REALM OF QIMEN</strong>
            <span className="mt-0.5 block text-[10px] leading-4 text-[var(--muted)] sm:mt-1 sm:text-xs">Traditional wisdom for modern life</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm md:flex">
          <Link href="/#bazi" className="transition hover:text-[var(--teal-dark)]">Bazi</Link>
          <span className="text-[var(--muted)]">Qimen</span>
          <span className="text-[var(--muted)]">Feng Shui</span>
        </nav>
        <nav aria-label="Mobile navigation" className="flex basis-full items-center justify-center gap-0 border-t border-[var(--border)] pt-1.5 text-xs md:hidden">
          <Link href="/#bazi" className="border-b-2 border-[var(--teal)] px-4 py-0.5 font-semibold text-[var(--teal-dark)]">Bazi</Link>
          <span aria-hidden="true" className="text-[var(--border)]">·</span>
          <Link href="/#services" className="px-4 py-0.5 text-[var(--muted)]">Qimen</Link>
          <span aria-hidden="true" className="text-[var(--border)]">·</span>
          <Link href="/#services" className="px-4 py-0.5 text-[var(--muted)]">Feng Shui</Link>
        </nav>
      </div>
    </header>
  );
}
