// Multiple overlays can own the viewport at once (menu, preloader, catalogue).
// Only the last owner restores the original styles.
export const SCROLL_LOCK_EVENT = "portfolio:scroll-lock";
const owners = new Set<symbol>();
let previousBodyOverflow = "";
let previousHtmlOverflow = "";

export function lockPageScroll() {
  const owner = Symbol("scroll-lock");
  if (owners.size === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.dataset.scrollLocked = "true";
    window.dispatchEvent(new Event(SCROLL_LOCK_EVENT));
  }
  owners.add(owner);
  return () => {
    if (!owners.delete(owner) || owners.size > 0) return;
    document.body.style.overflow = previousBodyOverflow;
    document.documentElement.style.overflow = previousHtmlOverflow;
    delete document.documentElement.dataset.scrollLocked;
    window.dispatchEvent(new Event(SCROLL_LOCK_EVENT));
  };
}
