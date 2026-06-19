import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Image registry
// ─────────────────────────────────────────────────────────────────────────────
export const IMG = {
  splash:   "https://images.unsplash.com/photo-1774979131447-525875465c2a?w=800&h=1000&fit=crop&auto=format",
  hero:     "https://images.unsplash.com/photo-1566759996874-04d713cc224a?w=800&h=700&fit=crop&auto=format",
  loginBg:  "https://images.unsplash.com/photo-1529305068150-201f3ded72c5?w=800&h=1000&fit=crop&auto=format",
  ooty:     "https://images.unsplash.com/photo-1603640979625-251bd448907d?w=500&h=400&fit=crop&auto=format",
  munnar:   "https://images.unsplash.com/photo-1742106854508-3b9172e52545?w=500&h=400&fit=crop&auto=format",
  goa:      "https://images.unsplash.com/photo-1642922835816-e2ac68db5c42?w=500&h=400&fit=crop&auto=format",
  coorg:    "https://images.unsplash.com/photo-1616388969587-8196f32388b4?w=500&h=400&fit=crop&auto=format",
  rajasthan:"https://images.unsplash.com/photo-1673115955449-4e50a5e78c9c?w=500&h=400&fit=crop&auto=format",
};

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────────────────────
export const T = {
  navy:    "#0F172A",
  teal:    "#14B8A6",
  slate:   "#64748B",
  slateL:  "#94A3B8",
  bg:      "#F8FAFC",
  white:   "#FFFFFF",
  amber:   "#F59E0B",
  green:   "#10B981",
  red:     "#EF4444",
  card:    "#FFFFFF",
  border:  "rgba(15,23,42,0.07)",
};

// ─────────────────────────────────────────────────────────────────────────────
// Typography helpers
// ─────────────────────────────────────────────────────────────────────────────
export const FK = { fontFamily: "'Plus Jakarta Sans', sans-serif" } as const;
export const FI = { fontFamily: "'Inter', sans-serif" } as const;

export const display  = { ...FK, fontWeight: 900 } as React.CSSProperties;
export const heading  = { ...FK, fontWeight: 800 } as React.CSSProperties;
export const subhead  = { ...FK, fontWeight: 700 } as React.CSSProperties;
export const body     = { ...FI, fontWeight: 400 } as React.CSSProperties;
export const bodyMed  = { ...FI, fontWeight: 600 } as React.CSSProperties;
export const label    = { ...FI, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const };
