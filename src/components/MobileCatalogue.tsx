"use client";

import { useRef, type TouchEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { CatalogueProject } from "./CatalogueGallery";
import styles from "./MobileCatalogue.module.css";

export default function MobileCatalogue({ projects, selected, entering, onSelect, onRestart }: {
  projects: CatalogueProject[];
  selected: number;
  entering: boolean;
  onSelect: (index: number) => void;
  onRestart: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const project = projects[selected];

  const finishSwipe = (event: TouchEvent) => {
    const start = gesture.current;
    gesture.current = null;
    if (!start || entering || !event.changedTouches[0]) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      onSelect(Math.max(0, Math.min(projects.length - 1, selected + (dx < 0 ? 1 : -1))));
    }
  };

  return (
    <motion.div className={styles.gallery} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.4 }}
      inert={entering} data-mobile-catalogue data-lenis-prevent>
      <header className={styles.heading}>
        <button className={styles.back} type="button" onClick={onRestart} aria-label="Back to card stack">
          <ArrowLeft size={15} aria-hidden="true" /><span>Catalogue</span>
        </button>
        <h1>{project.title}</h1>
        <p>{project.category}</p>
      </header>

      <div className={styles.stage} aria-label="Swipe left or right to change project"
        onTouchStart={event => {
          gesture.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
        }}
        onTouchEnd={finishSwipe} onTouchCancel={() => { gesture.current = null; }}>
        {projects.map((item, index) => {
          const distance = index - selected;
          const active = distance === 0;
          return (
            <motion.figure key={item.id} className={styles.card} initial={false}
              data-mobile-project={index} data-active={active} aria-hidden={!active}
              animate={{ x: `${distance * 100}%`, rotateY: Math.max(-20, Math.min(20, -distance * 14)),
                z: active ? 0 : -100, scale: active ? 1 : 0.88, opacity: Math.abs(distance) > 1 ? 0 : active ? 1 : 0.45 }}
              transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ backgroundColor: item.bg, zIndex: projects.length - Math.abs(distance) }}>
              <img src={item.image} alt={`${item.title} website preview`} draggable={false}
                loading={Math.abs(distance) <= 1 ? "eager" : "lazy"} />
            </motion.figure>
          );
        })}
      </div>

      <footer className={styles.footer}>
        <p className={styles.hint}>Swipe to explore the projects</p>
        <nav className={styles.controls} aria-label="Mobile catalogue navigation">
          <button type="button" className={styles.arrow} aria-label="Previous project" disabled={selected === 0}
            onClick={() => onSelect(selected - 1)}><ChevronLeft size={20} aria-hidden="true" /></button>
          <div className={styles.picker}>
            <span aria-hidden="true">{String(selected + 1).padStart(2, "0")} <span>/ {String(projects.length).padStart(2, "0")}</span><ChevronDown size={13} /></span>
            <select aria-label="Choose a project" value={selected} onChange={event => onSelect(Number(event.target.value))}>
              {projects.map((item, index) => <option key={item.id} value={index}>{String(index + 1).padStart(2, "0")} — {item.title}</option>)}
            </select>
          </div>
          <button type="button" className={styles.arrow} aria-label="Next project" disabled={selected === projects.length - 1}
            onClick={() => onSelect(selected + 1)}><ChevronRight size={20} aria-hidden="true" /></button>
        </nav>
      </footer>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">Project {selected + 1} of {projects.length}: {project.title}</p>
    </motion.div>
  );
}
