export const COLORS = {
  mxu: '#4285f4',        // Google Blue
  hbm: '#673ab7',        // Deep Purple
  vmem: '#34a853',       // Google Green
  vpu: '#ff7043',        // Deep Orange
  acc: '#ea4335',        // Google Red
  ici: '#fbbc04',        // Google Yellow
  host: '#5f6368',       // Grey
  bg: '#f8f9fa',         // Light grey background
  chipBg: '#ffffff',     // White card
  chipBorder: '#dadce0', // Card border
  text: '#202124',       // Primary text
  textSecondary: '#5f6368',
  activeStep: '#e8f0fe', // Active pipeline step bg
  flowDot: '#4285f4',    // Data flow dot
}

export function withAlpha(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
