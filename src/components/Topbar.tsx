"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import LogoIcon from "@/components/LogoIcon";
import { lockPageScroll } from "@/lib/scroll-lock";
import { SHOW_PRICING_LINKS } from "@/config/navigation";
import styles from "./Topbar.module.css";

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/#top" },
  { id: "work", label: "Projects", href: "/#work" },
  { id: "catalogue", label: "3D Catalogue", href: "/catalogue" },
  { id: "services", label: "Services", href: "/#services" },
  { id: "stack", label: "Stack", href: "/#stack" },
  ...(SHOW_PRICING_LINKS ? [{ id: "pricing", label: "Pricing", href: "/pricing" }] : []),
  { id: "contact", label: "Contact", href: "/contact" },
];

export default function Topbar() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusFirst = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(pathname === "/" ? "home" : pathname.slice(1));
  const darkPage = pathname === "/catalogue" || pathname === "/pricing" || pathname === "/contact";

  const closeMenu = useCallback((restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => { closeMenu(); }, [pathname, closeMenu]);

  // Cache section nodes per route; one scheduled frame batches all geometry reads.
  // Theme updates go directly to CSS, so scrolling doesn't rerender the menu tree.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const work = document.getElementById("work");
    const services = document.getElementById("services") || document.getElementById("curriculum");
    const stack = document.getElementById("stack");
    let frame: number | null = null;
    let lastDarkness = -1;
    const update = () => {
      frame = null;
      header.dataset.scrolled = String(window.scrollY > 30);
      let darkness = darkPage ? 1 : 0;
      let section = pathname === "/" ? "home" : pathname.slice(1);
      if (!darkPage) {
        const workRect = work?.getBoundingClientRect();
        const servicesRect = services?.getBoundingClientRect();
        const stackRect = stack?.getBoundingClientRect();
        if (workRect && workRect.top <= 0 && workRect.bottom > 0) {
          const runway = workRect.height - window.innerHeight;
          if (runway > 0 && window.innerWidth >= 768) {
            const progress = Math.min(1, Math.max(0, -workRect.top / runway));
            darkness = Math.min(1, Math.max(0, (progress - .35) / .4));
          }
        }
        if (servicesRect && servicesRect.top <= 60 && servicesRect.bottom > 0) darkness = 1;
        if (stackRect && stackRect.top <= 60 && stackRect.bottom > 0) darkness = Math.min(1, Math.max(0, (stackRect.bottom - 20) / 100));
        for (const [id, rect] of [["work", workRect], ["services", servicesRect], ["stack", stackRect]] as const) {
          if (rect && rect.top <= window.innerHeight * .35 && rect.bottom > 0) section = id;
        }
      }
      setActiveId(previous => previous === section ? previous : section);
      if (Math.abs(darkness - lastDarkness) < .005) return;
      lastDarkness = darkness;
      const dark = darkness > .5;
      header.style.setProperty("--nav-title-color", `rgb(${Math.round(13 + 242 * darkness)},${Math.round(39 + 216 * darkness)},${Math.round(68 + 187 * darkness)})`);
      header.style.setProperty("--nav-surface", dark ? "#0b1c2ed9" : "#eef3f9");
      header.style.setProperty("--nav-border", dark ? "#ffffff26" : "#1b4c7826");
      header.style.setProperty("--nav-shadow", dark ? "0 4px 20px #0004" : "0 1px 5px #1b4c7814");
    };
    const schedule = () => { if (frame === null) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname, darkPage]);

  useEffect(() => {
    if (!isOpen) return;
    const releaseScroll = lockPageScroll();
    if (focusFirst.current) {
      menuRef.current?.querySelector<HTMLAnchorElement>("nav a")?.focus();
      focusFirst.current = false;
    }
    const outside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) closeMenu();
    };
    const keyboard = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeMenu(true);
      } else if (event.key === "Tab") {
        const items = menuRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled),a[href]");
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && (document.activeElement === first || !menuRef.current?.contains(document.activeElement))) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !menuRef.current?.contains(document.activeElement))) {
          event.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keyboard);
    return () => {
      releaseScroll();
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keyboard);
    };
  }, [isOpen, closeMenu]);

  const handleNavClick = (href: string, event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    closeMenu();
    if (pathname !== "/" || !href.startsWith("/#")) return;
    const target = document.getElementById(href.slice(2));
    if (!target) return;
    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Run after the menu's scroll lock is released.
    requestAnimationFrame(() => {
      if (href === "/#top") window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
      else target.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth" });
      window.history.pushState(null, "", href === "/#top" ? "/" : href.slice(1));
      const oldTabIndex = target.getAttribute("tabindex");
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (oldTabIndex === null) target.removeAttribute("tabindex");
      else target.setAttribute("tabindex", oldTabIndex);
    });
  };

  const handleTriggerKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (isOpen) menuRef.current?.querySelector<HTMLAnchorElement>("nav a")?.focus();
      else { focusFirst.current = true; setIsOpen(true); }
    }
  };

  return (
    <header ref={headerRef} className={styles.header} data-page-dark={darkPage}>
      <div className={styles.backdrop} data-open={isOpen} aria-hidden="true" onClick={() => closeMenu(true)} />
      <div className={styles.row}>
        <div className={styles.brand}>
          <a href="/" aria-label="Danish Syazwan Portfolio Home" onClick={event => handleNavClick("/#top", event)}>
            <LogoIcon className="h-7 w-7 md:h-8 md:w-8" /><span className={styles.brandName}>.Syazwan</span>
          </a>
        </div>
        <div ref={menuRef} className={styles.menuAnchor}>
          <div className={styles.menu} data-open={isOpen} role={isOpen ? "dialog" : undefined} aria-modal={isOpen ? true : undefined} aria-label={isOpen ? "Site menu" : undefined}>
            <button ref={triggerRef} type="button" className={styles.trigger} aria-expanded={isOpen} aria-controls="site-navigation-panel"
              aria-label={isOpen ? "Close menu" : "Open menu"} onClick={() => setIsOpen(previous => !previous)} onKeyDown={handleTriggerKey}>
              <span className={styles.triggerLabel}>Menu</span><span className={styles.burger} aria-hidden="true"><span /><span /></span>
            </button>
            <div id="site-navigation-panel" className={styles.disclosure} inert={!isOpen}>
              <div className={styles.contentClip}>
                <div className={styles.menuScroll} data-lenis-prevent>
                  <nav className={styles.links} aria-label="Primary navigation">
                    {NAV_ITEMS.map(item => <a key={item.id} href={item.href} className={styles.navLink}
                      aria-current={activeId === item.id ? item.href.startsWith("/#") ? "location" : "page" : undefined}
                      onClick={event => handleNavClick(item.href, event)}>
                      <span className={styles.cubeSlot} aria-hidden="true"><span className={styles.cube}>{Array.from({ length: 6 }, (_, index) => <span key={index} />)}</span></span>
                      <span className={styles.navLabel}>{item.label}</span><ArrowUpRight className={styles.navArrow} size={14} aria-hidden="true" />
                    </a>)}
                  </nav>
                  <div className={styles.contactLinks}>
                    <a href="mailto:danish.syazwan2005@gmail.com" onClick={() => closeMenu()}><span>danish.syazwan2005@gmail.com</span><ArrowUpRight size={13} aria-hidden="true" /></a>
                    <a href="https://github.com/dnishsyzwn" target="_blank" rel="noopener noreferrer" onClick={() => closeMenu()}><span>github.com/dnishsyzwn</span><ArrowUpRight size={13} aria-hidden="true" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.cta}><a href="/contact" onClick={() => closeMenu()}>Let&apos;s Talk</a></div>
      </div>
    </header>
  );
}
