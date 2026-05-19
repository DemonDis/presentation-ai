/**
 * Slide Renderer for Export
 * Temporarily scales slides to fixed dimensions (1920x1080) for accurate export,
 * then restores original sizes.
 */

import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";

const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

interface SlideSizeBackup {
  element: HTMLElement;
  width: string;
  height: string;
  maxWidth: string;
  maxHeight: string;
  minWidth: string;
  minHeight: string;
  transform: string;
  parentOverflow: string;
}

/**
 * Temporarily sets all slide elements to fixed export dimensions.
 * Returns a restore function to revert changes.
 */
export function prepareSlidesForExport(
  slides: PlateSlide[],
): () => void {
  const backups: SlideSizeBackup[] = [];

  for (const slide of slides) {
    const el = document.querySelector(
      `#presentation-root-${slide.id}`,
    ) as HTMLElement | null;

    if (!el) continue;

    const computed = window.getComputedStyle(el);
    const parent = el.parentElement;

    backups.push({
      element: el,
      width: el.style.width || computed.width,
      height: el.style.height || computed.height,
      maxWidth: el.style.maxWidth || computed.maxWidth,
      maxHeight: el.style.maxHeight || computed.maxHeight,
      minWidth: el.style.minWidth || computed.minWidth,
      minHeight: el.style.minHeight || computed.minHeight,
      transform: el.style.transform || computed.transform,
      parentOverflow: parent ? (parent.style.overflow || computed.overflow) : "",
    });

    // Disable parent overflow clipping
    if (parent) {
      parent.style.overflow = "visible";
    }

    // Set fixed dimensions for export
    el.style.width = `${SLIDE_WIDTH}px`;
    el.style.height = `${SLIDE_HEIGHT}px`;
    el.style.maxWidth = "none";
    el.style.maxHeight = "none";
    el.style.minWidth = `${SLIDE_WIDTH}px`;
    el.style.minHeight = `${SLIDE_HEIGHT}px`;
    el.style.transform = "none";
  }

  // Return restore function
  return () => {
    for (const backup of backups) {
      const { element, width, height, maxWidth, maxHeight, minWidth, minHeight, transform, parentOverflow } = backup;
      const parent = element.parentElement;

      element.style.width = width;
      element.style.height = height;
      element.style.maxWidth = maxWidth;
      element.style.maxHeight = maxHeight;
      element.style.minWidth = minWidth;
      element.style.minHeight = minHeight;
      element.style.transform = transform;

      if (parent) {
        parent.style.overflow = parentOverflow;
      }
    }
  };
}

/**
 * Gets the standard slide dimensions for export (in pixels).
 */
export const EXPORT_SLIDE_WIDTH = SLIDE_WIDTH;
export const EXPORT_SLIDE_HEIGHT = SLIDE_HEIGHT;
