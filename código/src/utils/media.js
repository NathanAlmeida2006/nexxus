/*
 * Media queries que ligam/desligam efeitos — a única fonte dessas decisões.
 * Consultadas no momento do uso (não cacheadas): o efeito que monta depois
 * de uma mudança na preferência já a respeita.
 */
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const hasFinePointer = () => window.matchMedia('(pointer: fine)').matches
