"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

const isCurrent = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const toggle = useRef<HTMLButtonElement>(null);

  // Close the mobile menu after navigating.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    // The menu only exists below md: reset it when the viewport grows past that.
    // (The scroll lock itself is CSS, scoped to the same breakpoint: see globals.css.)
    const desktop = window.matchMedia("(min-width: 768px)");
    const onDesktop = () => desktop.matches && setOpen(false);
    // Any link (menu items, header logo) closes it, even when it points to the current page
    // and the pathname therefore does not change.
    const onClick = (event: MouseEvent) => event.target instanceof Element && event.target.closest("a") && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    desktop.addEventListener("change", onDesktop);
    document.documentElement.toggleAttribute("data-menu-open", true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      desktop.removeEventListener("change", onDesktop);
      document.documentElement.removeAttribute("data-menu-open");
    };
  }, [open]);

  return (
    <>
      {/* Desktop */}
      <nav aria-label="Principal" className="hidden md:block">
        <ul className="flex items-center gap-10 text-sm font-medium">
          {siteConfig.nav.map((item) => {
            const current = isCurrent(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={`group relative py-2 transition-colors duration-300 ${
                    current ? "text-ink" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-aqua transition-transform duration-500 ease-calm ${
                      current ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile */}
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((value) => !value)}
        className="relative z-10 grid size-11 place-items-center rounded-full border border-line md:hidden"
      >
        <span
          aria-hidden
          className={`absolute h-px w-4 bg-ink transition-transform duration-500 ease-calm ${open ? "rotate-45" : "-translate-y-1"}`}
        />
        <span
          aria-hidden
          className={`absolute h-px w-4 bg-ink transition-transform duration-500 ease-calm ${open ? "-rotate-45" : "translate-y-1"}`}
        />
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-20 bottom-0 z-40 flex flex-col justify-between overflow-y-auto bg-canvas px-5 pt-10 pb-10 md:hidden"
      >
        <nav aria-label="Principal móvil">
          <ul className="space-y-2">
            {siteConfig.nav.map((item, index) => {
              const current = isCurrent(pathname, item.href);
              return (
                <li key={item.href} className="animate-rise" style={{ animationDelay: `${index * 70}ms` }}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className="flex items-baseline justify-between border-b border-line py-5 text-3xl font-medium"
                  >
                    {item.label}
                    {current && <span aria-hidden className="size-2 rounded-full bg-aqua" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <Image
          src="/brand/frases/frase-stay-grounded-aqua.svg"
          alt=""
          width={360}
          height={164}
          unoptimized
          className="mt-12 h-auto w-44 animate-rise self-center [animation-delay:350ms]"
        />
      </div>
    </>
  );
}
