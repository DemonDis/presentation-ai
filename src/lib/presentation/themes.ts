export type ThemeMode = "light" | "dark";

export type ThemeName =
  | "daktilo"
  | "noir"

export interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  text: string;
  heading: string;
  smartLayout: string;
  cardBackground: string;
}

export type ThemeColorsKeys = keyof ThemeColors;

export interface ThemeFonts {
  heading: string;
  body: string;
  headingWeight?: number;
  bodyWeight?: number;
  headingUrl?: string;
  bodyUrl?: string;
}

interface ThemeTransitions {
  default: string;
}

export interface ThemeShadows {
  card: string;
  button: string;
  slide: string;
}

export interface ThemeBorderRadius {
  card: string;
  slide: string;
  button: string;
}

interface ThemeMask {
  clipPath?: string;
  maskImage?: string;
  maskSize?: string;
  maskPosition?: string;
  maskRepeat?: string;
}

export interface ThemeBackground {
  type?: "solid" | "linear" | "radial" | "image";
  override?: string;
  gradient?: {
    type: "linear" | "radial";
    angle?: number;
    shape?: "circle" | "ellipse";
    at?: { x: number; y: number };
    stops?: Array<{ id: string; color: string; position: number }>;
  };
  imageUrl?: string;
}

export interface ThemeProperties {
  name: string;
  description: string;
  mode: ThemeMode;
  colors: ThemeColors;
  fonts: ThemeFonts;
  borderRadius: ThemeBorderRadius;
  transitions: ThemeTransitions;
  shadows: ThemeShadows;
  mask?: ThemeMask;
  background?: ThemeBackground;
}

export type Themes = keyof typeof themes;

// ============ Themes ============

/**
 * Button border-radius scale:
 * - For all values previously 0.5rem → now 0.17rem (scaled by ~1/3)
 * - For all values previously 0.75rem → now 0.25rem (scaled by ~1/3)
 * - For all values previously 0.625rem → now 0.21rem (scaled by ~1/3)
 * - For all values previously 1rem → now 0.33rem (scaled by ~1/3)
 * - For all values previously 0.375rem → now 0.13rem (scaled by ~1/3)
 * - For all values previously 0.25rem → now 0.08rem (scaled by ~1/3)
 * - For all values previously 1.25rem → now 0.42rem (scaled by ~1/3)
 * - 0, 9999px and 9999px remain unchanged.
 */

export const themes: { [key in ThemeName]: ThemeProperties } = {
  // ==================== DAKTILO / NOIR ====================
  daktilo: {
    name: "Daktilo",
    description: "Современный и чистый",
    mode: "light",
    colors: {
      primary: "#3B82F6",
      accent: "#60A5FA",
      background: "#FFFFFF",
      text: "#1F2937",
      heading: "#3B82F6",
      smartLayout: "#3B82F6",
      cardBackground: "#F3F4F6",
    },
    fonts: { heading: "Inter", body: "Inter" },
    borderRadius: {
      card: "0.75rem",
      slide: "1rem",
      button: "0.17rem",
    },
    transitions: { default: "all 0.2s ease-in-out" },
    shadows: {
      card: "0 1px 2px rgba(0,0,0,0.04), 0 4px 8px rgba(59,130,246,0.08)",
      button:
        "0 1px 3px rgba(59,130,246,0.12), 0 2px 6px rgba(59,130,246,0.08)",
      slide: "0 4px 6px rgba(0,0,0,0.02), 0 12px 24px rgba(59,130,246,0.1)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #3B82F615 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #60A5FA15 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #1F293710 0%, transparent 50%),
        #FFFFFF
      `,
    },
  },

  noir: {
    name: "Noir",
    description: "Эстетика нуар",
    mode: "dark",
    colors: {
      primary: "#60A5FA",
      accent: "#93C5FD",
      background: "#111827",
      text: "#E5E7EB",
      heading: "#60A5FA",
      smartLayout: "#60A5FA",
      cardBackground: "#1F2937",
    },
    fonts: { heading: "Inter", body: "Inter" },
    borderRadius: {
      card: "0.75rem",
      slide: "1rem",
      button: "0.17rem",
    },
    transitions: { default: "all 0.2s ease-in-out" },
    shadows: {
      card: "0 2px 4px rgba(0,0,0,0.3), 0 8px 16px rgba(96,165,250,0.1)",
      button: "0 2px 8px rgba(96,165,250,0.25), 0 0 20px rgba(96,165,250,0.1)",
      slide: "0 8px 32px rgba(0,0,0,0.4), 0 0 48px rgba(96,165,250,0.08)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #60A5FA20 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #93C5FD20 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #E5E7EB15 0%, transparent 50%),
        #111827
      `,
    },
  }
};

// ============ CSS Variable Setter ============

export function setThemeVariables(
  theme: ThemeProperties,
  element: HTMLElement = document.documentElement,
) {
  const { colors, shadows, mask, borderRadius } = theme;

  element.style.setProperty("--presentation-primary", colors.primary);
  element.style.setProperty("--presentation-accent", colors.accent);
  element.style.setProperty("--presentation-secondary", colors.accent);
  element.style.setProperty("--presentation-background", colors.background);
  element.style.setProperty("--presentation-text", colors.text);
  element.style.setProperty("--presentation-heading", colors.heading);
  element.style.setProperty("--presentation-smart-layout", colors.smartLayout);
  element.style.setProperty(
    "--presentation-card-background",
    colors.cardBackground,
  );
  element.style.setProperty("--presentation-heading-font", theme.fonts.heading);
  element.style.setProperty("--presentation-body-font", theme.fonts.body);
  element.style.setProperty(
    "--presentation-card-border-radius",
    borderRadius.card,
  );
  element.style.setProperty(
    "--presentation-slide-border-radius",
    borderRadius.slide,
  );
  element.style.setProperty(
    "--presentation-button-border-radius",
    borderRadius.button,
  );
  element.style.setProperty(
    "--presentation-transition",
    theme.transitions.default,
  );
  element.style.setProperty("--presentation-card-shadow", shadows.card);
  element.style.setProperty("--presentation-button-shadow", shadows.button);
  element.style.setProperty("--presentation-slide-shadow", shadows.slide);

  if (mask) {
    if (mask.clipPath)
      element.style.setProperty("--presentation-mask-clip-path", mask.clipPath);
    if (mask.maskImage)
      element.style.setProperty("--presentation-mask-image", mask.maskImage);
    if (mask.maskSize)
      element.style.setProperty("--presentation-mask-size", mask.maskSize);
    if (mask.maskPosition)
      element.style.setProperty(
        "--presentation-mask-position",
        mask.maskPosition,
      );
    if (mask.maskRepeat)
      element.style.setProperty("--presentation-mask-repeat", mask.maskRepeat);
  }
}
