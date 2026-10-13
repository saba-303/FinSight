/** Reusable financial calculations. Return null when inputs are missing. */
export const growth = (cur: number | null, prev: number | null) =>
  cur == null || prev == null || prev === 0 ? null : ((cur - prev) / Math.abs(prev)) * 100;

export const ratio = (a: number | null, b: number | null) =>
  a == null || b == null || b === 0 ? null : a / b;

export const share = (part: number, total: number) => (part / total) * 100;

export const cagr = (start: number, end: number, years: number) =>
  (Math.pow(end / start, 1 / years) - 1) * 100;

/** FCF as defined in the source: OCF − capex − dividends to shareholders − dividends to minority. */
export const fcfAfterDividends = (ocf: number, capex: number, div: number, minority: number) =>
  ocf - capex - div - minority;

export const fmtCr = (v: number | null) =>
  v == null ? "Not disclosed" : `₹${v.toLocaleString("en-IN")} cr`;
export const fmtPct = (v: number | null, d = 1) =>
  v == null ? "—" : `${v > 0 ? "+" : ""}${v.toFixed(d)}%`;
export const fmtPp = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)} pp`;
