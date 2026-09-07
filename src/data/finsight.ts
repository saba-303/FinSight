// FinSight prototype data layer.
// ALL VALUES ARE MOCK / SAMPLE DATA for demonstration. Not live market data.

export type CompanyType = "Listed" | "Unlisted / Document-based";

export interface YearPoint {
  year: string;
  revenue: number; // ₹ crore
  netProfit: number;
  ebitda: number;
  eps: number;
  debt: number;
  equity: number;
  opMargin: number;
  netMargin: number;
}

export interface RiskItem {
  name: string;
  level: "High" | "Medium" | "Low";
  likelihood: number; // 1-10
  impact: number; // 1-10
  description: string;
  evidence: string;
  page: number;
  document: string;
  interpretation: string;
}

export interface Company {
  slug: string;
  name: string;
  ticker?: string;
  industry: string;
  sector: string;
  type: CompanyType;
  latestReport: string;
  documents: string[];
  marketCap?: string;
  snapshot: { label: string; value: string; delta?: string; kind: "reported" | "calculated" }[];
  history: YearPoint[];
  health: { total: number; dims: { label: string; score: number }[] };
  overview: string;
  segments: { name: string; value: number }[];
  geography: { name: string; value: number }[];
  outlook: "Positive" | "Neutral" | "Cautious";
  sentimentTrend: { year: string; score: number }[];
  themes: { theme: string; weight: number; note: string }[];
  managementQuote: { text: string; source: string; page: number };
  risks: RiskItem[];
  timeline: { year: string; event: string; source: string }[];
}

function derive(
  base: Omit<YearPoint, "opMargin" | "netMargin" | "eps"> & { eps: number },
): YearPoint {
  return {
    ...base,
    opMargin: +((base.ebitda / base.revenue) * 100).toFixed(1),
    netMargin: +((base.netProfit / base.revenue) * 100).toFixed(1),
  };
}

const h = (
  rows: [string, number, number, number, number, number, number][],
): YearPoint[] =>
  rows.map(([year, revenue, netProfit, ebitda, eps, debt, equity]) =>
    derive({ year, revenue, netProfit, ebitda, eps, debt, equity }),
  );

export const companies: Company[] = [
  {
    slug: "reliance-industries",
    name: "Reliance Industries",
    ticker: "RELIANCE",
    industry: "Conglomerate",
    sector: "Energy",
    type: "Listed",
    latestReport: "FY 2025-26",
    documents: [
      "Reliance_Annual_Report_2025.pdf",
      "Reliance_Annual_Report_2024.pdf",
      "Reliance_Investor_Presentation_Q4.pdf",
    ],
    marketCap: "₹19,42,000 Cr",
    snapshot: [
      { label: "Market Capitalization", value: "₹19,42,000 Cr", kind: "reported" },
      { label: "Revenue (FY26)", value: "₹10,42,000 Cr", delta: "+8.4%", kind: "reported" },
      { label: "Net Profit (FY26)", value: "₹79,020 Cr", delta: "+6.1%", kind: "reported" },
      { label: "EPS", value: "₹116.8", kind: "reported" },
      { label: "ROE", value: "9.1%", kind: "calculated" },
      { label: "Debt / Equity", value: "0.42", kind: "calculated" },
      { label: "Operating Margin", value: "16.4%", kind: "calculated" },
      { label: "Profit Margin", value: "7.6%", kind: "calculated" },
    ],
    history: h([
      ["FY17", 330180, 29901, 55400, 46.2, 218000, 287000],
      ["FY18", 390823, 34988, 64100, 52.1, 232000, 314000],
      ["FY19", 568000, 39588, 83500, 58.4, 287000, 381000],
      ["FY20", 596743, 39880, 88200, 62.3, 336000, 442000],
      ["FY21", 466307, 49128, 80100, 68.4, 251000, 693000],
      ["FY22", 721634, 60705, 110300, 89.7, 266000, 721000],
      ["FY23", 876396, 66702, 125400, 97.2, 279000, 764000],
      ["FY24", 917000, 69621, 138900, 102.4, 288000, 812000],
      ["FY25", 961000, 74480, 152100, 109.6, 296000, 861000],
      ["FY26", 1042000, 79020, 170900, 116.8, 302000, 918000],
    ]),
    health: {
      total: 78,
      dims: [
        { label: "Profitability", score: 82 },
        { label: "Liquidity", score: 74 },
        { label: "Solvency", score: 71 },
        { label: "Growth", score: 86 },
        { label: "Efficiency", score: 79 },
      ],
    },
    overview:
      "Reliance operates across energy, retail, digital services and new energy initiatives. Oil-to-chemicals remains the largest revenue contributor, while retail and digital services drive incremental growth and margin expansion. The group continues to allocate capital toward new energy manufacturing capacity.",
    segments: [
      { name: "Oil to Chemicals", value: 44 },
      { name: "Retail", value: 26 },
      { name: "Digital Services", value: 18 },
      { name: "Oil & Gas (E&P)", value: 6 },
      { name: "New Energy & Other", value: 6 },
    ],
    geography: [
      { name: "India", value: 68 },
      { name: "Asia (ex-India)", value: 14 },
      { name: "Europe", value: 10 },
      { name: "Americas & Other", value: 8 },
    ],
    outlook: "Positive",
    sentimentTrend: [
      { year: "FY22", score: 62 },
      { year: "FY23", score: 66 },
      { year: "FY24", score: 71 },
      { year: "FY25", score: 74 },
      { year: "FY26", score: 79 },
    ],
    themes: [
      { theme: "Capacity Expansion", weight: 92, note: "New energy giga-factories referenced repeatedly in MD&A." },
      { theme: "Digital Monetisation", weight: 84, note: "ARPU improvement and subscriber additions emphasised." },
      { theme: "Capital Expenditure", weight: 78, note: "Sustained capex cycle across new energy and retail." },
      { theme: "Cost Management", weight: 61, note: "Operating leverage cited in retail commentary." },
      { theme: "Deleveraging", weight: 54, note: "Net debt discipline mentioned in Chairman's statement." },
    ],
    managementQuote: {
      text: "Our new energy business is progressing on schedule and we expect the first phase of the giga-factory ecosystem to be operational within the coming financial year.",
      source: "Annual Report FY2025 — Chairman's Statement",
      page: 14,
    },
    risks: [
      {
        name: "Regulatory Risk",
        level: "High",
        likelihood: 8,
        impact: 8,
        description:
          "Changes in energy, telecom and retail regulation could materially affect operations and pricing.",
        evidence:
          "The company identifies regulatory changes as a material risk to future operations.",
        page: 127,
        document: "Annual Report FY2025",
        interpretation:
          "Regulatory exposure is spread across three regulated verticals, which raises aggregate sensitivity relative to single-segment peers.",
      },
      {
        name: "Market Risk",
        level: "Medium",
        likelihood: 7,
        impact: 6,
        description: "Exposure to crude and refining margin volatility across the O2C segment.",
        evidence: "The company is exposed to fluctuations in commodity and market conditions.",
        page: 132,
        document: "Annual Report FY2025",
        interpretation:
          "Refining spread volatility remains the largest single driver of earnings variance in the disclosed sensitivity table.",
      },
      {
        name: "Currency Risk",
        level: "Medium",
        likelihood: 6,
        impact: 5,
        description: "Foreign-currency borrowings and import-linked raw material costs.",
        evidence: "A significant portion of borrowings are denominated in foreign currency.",
        page: 138,
        document: "Annual Report FY2025",
        interpretation: "Partially hedged per the disclosed hedging policy; residual exposure is moderate.",
      },
      {
        name: "Operational Risk",
        level: "Low",
        likelihood: 4,
        impact: 5,
        description: "Plant shutdowns, supply disruption and project execution delays.",
        evidence: "The report identifies supply-side disruptions as a potential operational risk.",
        page: 139,
        document: "Annual Report FY2025",
        interpretation: "Historic utilisation levels suggest strong operational continuity.",
      },
      {
        name: "Cybersecurity Risk",
        level: "Medium",
        likelihood: 6,
        impact: 7,
        description: "Digital and retail platforms handle large volumes of customer data.",
        evidence: "Cybersecurity is listed among the principal enterprise risks.",
        page: 144,
        document: "Annual Report FY2025",
        interpretation: "Risk weight has increased year-over-year in the disclosed risk register.",
      },
    ],
    timeline: [
      { year: "FY22", event: "Retail footprint expansion and new commerce scale-up", source: "AR FY2022, p. 22" },
      { year: "FY23", event: "New energy giga-factory programme announced", source: "AR FY2023, p. 18" },
      { year: "FY24", event: "Digital services ARPU-led growth cycle", source: "AR FY2024, p. 31" },
      { year: "FY25", event: "First phase new energy capacity commissioning", source: "AR FY2025, p. 14" },
    ],
  },
  {
    slug: "tcs",
    name: "Tata Consultancy Services",
    ticker: "TCS",
    industry: "IT Services",
    sector: "IT",
    type: "Listed",
    latestReport: "FY 2025-26",
    documents: ["TCS_Annual_Report_2025.pdf", "TCS_Investor_Presentation_Q4.pdf"],
    marketCap: "₹14,10,000 Cr",
    snapshot: [
      { label: "Market Capitalization", value: "₹14,10,000 Cr", kind: "reported" },
      { label: "Revenue (FY26)", value: "₹2,68,400 Cr", delta: "+6.9%", kind: "reported" },
      { label: "Net Profit (FY26)", value: "₹52,100 Cr", delta: "+8.2%", kind: "reported" },
      { label: "EPS", value: "₹143.9", kind: "reported" },
      { label: "ROE", value: "48.6%", kind: "calculated" },
      { label: "Debt / Equity", value: "0.08", kind: "calculated" },
      { label: "Operating Margin", value: "25.9%", kind: "calculated" },
      { label: "Profit Margin", value: "19.4%", kind: "calculated" },
    ],
    history: h([
      ["FY17", 117966, 26289, 30100, 67.5, 4200, 86000],
      ["FY18", 123104, 25826, 31200, 67.5, 4100, 84000],
      ["FY19", 146463, 31472, 37800, 83.9, 4400, 89000],
      ["FY20", 156949, 32340, 39100, 86.2, 6900, 84000],
      ["FY21", 164177, 32430, 42500, 87.4, 7300, 86000],
      ["FY22", 191754, 38327, 48900, 103.6, 7600, 89000],
      ["FY23", 225458, 42147, 55100, 115.2, 8100, 90000],
      ["FY24", 240893, 45908, 60300, 126.1, 8400, 94000],
      ["FY25", 251000, 48160, 64200, 133.2, 8600, 99000],
      ["FY26", 268400, 52100, 69500, 143.9, 8900, 107000],
    ]),
    health: {
      total: 86,
      dims: [
        { label: "Profitability", score: 93 },
        { label: "Liquidity", score: 90 },
        { label: "Solvency", score: 95 },
        { label: "Growth", score: 71 },
        { label: "Efficiency", score: 84 },
      ],
    },
    overview:
      "TCS provides IT services, consulting and business solutions across banking, retail, manufacturing and life sciences. Growth is led by cloud modernisation and AI-led transformation deals, with a large and diversified client base and industry-leading margin discipline.",
    segments: [
      { name: "BFSI", value: 32 },
      { name: "Retail & CPG", value: 16 },
      { name: "Manufacturing", value: 12 },
      { name: "Communications & Media", value: 14 },
      { name: "Life Sciences & Other", value: 26 },
    ],
    geography: [
      { name: "North America", value: 51 },
      { name: "Europe", value: 27 },
      { name: "India", value: 8 },
      { name: "Rest of World", value: 14 },
    ],
    outlook: "Neutral",
    sentimentTrend: [
      { year: "FY22", score: 76 },
      { year: "FY23", score: 72 },
      { year: "FY24", score: 68 },
      { year: "FY25", score: 70 },
      { year: "FY26", score: 73 },
    ],
    themes: [
      { theme: "AI-led Transformation", weight: 95, note: "AI adoption dominates MD&A narrative." },
      { theme: "Margin Discipline", weight: 88, note: "Utilisation and pyramid management repeatedly cited." },
      { theme: "Deal Pipeline", weight: 80, note: "TCV commentary stable across quarters." },
      { theme: "Talent & Attrition", weight: 62, note: "Attrition normalising per HR disclosures." },
    ],
    managementQuote: {
      text: "Client spending remains selective, but AI-led modernisation programmes are expanding our addressable pipeline.",
      source: "Annual Report FY2025 — MD&A",
      page: 41,
    },
    risks: [
      {
        name: "Client Concentration Risk",
        level: "Medium",
        likelihood: 5,
        impact: 6,
        description: "Dependence on discretionary technology spending in BFSI.",
        evidence: "BFSI represents the largest vertical share of revenue.",
        page: 88,
        document: "Annual Report FY2025",
        interpretation: "Diversification across verticals limits, but does not remove, cyclicality.",
      },
      {
        name: "Currency Risk",
        level: "Medium",
        likelihood: 7,
        impact: 5,
        description: "Majority of revenue is billed in USD, EUR and GBP.",
        evidence: "The company reports material foreign-exchange translation exposure.",
        page: 92,
        document: "Annual Report FY2025",
        interpretation: "Hedging programme reduces near-term earnings volatility.",
      },
      {
        name: "Regulatory / Immigration Risk",
        level: "Medium",
        likelihood: 6,
        impact: 6,
        description: "Visa and cross-border talent mobility restrictions.",
        evidence: "Immigration policy changes are listed as a principal risk.",
        page: 95,
        document: "Annual Report FY2025",
        interpretation: "Local hiring ratios have reduced structural dependence over time.",
      },
      {
        name: "Cybersecurity Risk",
        level: "High",
        likelihood: 7,
        impact: 8,
        description: "Custodian of sensitive client data across regulated industries.",
        evidence: "Information security is identified as a top-tier enterprise risk.",
        page: 99,
        document: "Annual Report FY2025",
        interpretation: "Elevated impact given contractual liability exposure.",
      },
    ],
    timeline: [
      { year: "FY23", event: "Large-deal momentum in cloud modernisation", source: "AR FY2023, p. 27" },
      { year: "FY24", event: "AI/GenAI practice scale-up", source: "AR FY2024, p. 33" },
      { year: "FY25", event: "Margin recovery programme", source: "AR FY2025, p. 41" },
    ],
  },
  {
    slug: "infosys",
    name: "Infosys",
    ticker: "INFY",
    industry: "IT Services",
    sector: "IT",
    type: "Listed",
    latestReport: "FY 2025-26",
    documents: ["Infosys_Annual_Report_2025.pdf"],
    marketCap: "₹6,80,000 Cr",
    snapshot: [
      { label: "Market Capitalization", value: "₹6,80,000 Cr", kind: "reported" },
      { label: "Revenue (FY26)", value: "₹1,72,300 Cr", delta: "+5.4%", kind: "reported" },
      { label: "Net Profit (FY26)", value: "₹28,400 Cr", delta: "+6.8%", kind: "reported" },
      { label: "EPS", value: "₹68.4", kind: "reported" },
      { label: "ROE", value: "31.2%", kind: "calculated" },
      { label: "Debt / Equity", value: "0.10", kind: "calculated" },
      { label: "Operating Margin", value: "21.3%", kind: "calculated" },
      { label: "Profit Margin", value: "16.5%", kind: "calculated" },
    ],
    history: h([
      ["FY17", 68484, 14353, 16100, 62.8, 3100, 68000],
      ["FY18", 70522, 16029, 17200, 71.3, 3000, 64000],
      ["FY19", 82675, 15404, 17800, 35.4, 3300, 62000],
      ["FY20", 90791, 16594, 19100, 38.9, 5900, 65000],
      ["FY21", 100472, 19351, 22400, 45.6, 6100, 76000],
      ["FY22", 121641, 22110, 26100, 52.5, 6700, 75000],
      ["FY23", 146767, 24095, 28400, 57.6, 7300, 76000],
      ["FY24", 153670, 26233, 31200, 63.4, 7600, 82000],
      ["FY25", 163400, 26600, 33800, 64.1, 7800, 87000],
      ["FY26", 172300, 28400, 36700, 68.4, 8000, 91000],
    ]),
    health: {
      total: 81,
      dims: [
        { label: "Profitability", score: 86 },
        { label: "Liquidity", score: 88 },
        { label: "Solvency", score: 93 },
        { label: "Growth", score: 64 },
        { label: "Efficiency", score: 76 },
      ],
    },
    overview:
      "Infosys delivers digital services and consulting with a focus on cloud (Cobalt), data and AI platforms. Revenue is concentrated in North America with growing European contribution.",
    segments: [
      { name: "Financial Services", value: 28 },
      { name: "Retail", value: 14 },
      { name: "Communication", value: 12 },
      { name: "Energy & Utilities", value: 13 },
      { name: "Manufacturing & Other", value: 33 },
    ],
    geography: [
      { name: "North America", value: 58 },
      { name: "Europe", value: 27 },
      { name: "India", value: 3 },
      { name: "Rest of World", value: 12 },
    ],
    outlook: "Neutral",
    sentimentTrend: [
      { year: "FY22", score: 74 },
      { year: "FY23", score: 69 },
      { year: "FY24", score: 63 },
      { year: "FY25", score: 66 },
      { year: "FY26", score: 69 },
    ],
    themes: [
      { theme: "Cloud & AI Platforms", weight: 90, note: "Cobalt and AI platform references dominate." },
      { theme: "Cost Optimisation Deals", weight: 76, note: "Vendor consolidation deals highlighted." },
      { theme: "Capital Return", weight: 68, note: "Buyback and dividend policy reiterated." },
    ],
    managementQuote: {
      text: "We continue to see strong demand for cost-efficiency programmes alongside selective discretionary investment.",
      source: "Annual Report FY2025 — MD&A",
      page: 36,
    },
    risks: [
      {
        name: "Demand Risk",
        level: "Medium",
        likelihood: 6,
        impact: 6,
        description: "Discretionary spend compression among large clients.",
        evidence: "The report notes uncertainty in client technology budgets.",
        page: 74,
        document: "Annual Report FY2025",
        interpretation: "Near-term growth guidance is sensitive to budget cycles.",
      },
      {
        name: "Currency Risk",
        level: "Medium",
        likelihood: 7,
        impact: 5,
        description: "Multi-currency revenue base.",
        evidence: "Foreign exchange sensitivity is disclosed in notes to accounts.",
        page: 79,
        document: "Annual Report FY2025",
        interpretation: "Comparable to sector peers.",
      },
      {
        name: "Talent Risk",
        level: "Low",
        likelihood: 4,
        impact: 5,
        description: "Attrition and skill availability in AI roles.",
        evidence: "Attrition trends are disclosed in the human capital section.",
        page: 83,
        document: "Annual Report FY2025",
        interpretation: "Attrition has normalised versus prior periods.",
      },
    ],
    timeline: [
      { year: "FY24", event: "Large cost-takeout deal wins", source: "AR FY2024, p. 29" },
      { year: "FY25", event: "AI platform expansion", source: "AR FY2025, p. 36" },
    ],
  },
  {
    slug: "hal",
    name: "Hindustan Aeronautics (HAL)",
    ticker: "HAL",
    industry: "Aerospace & Defence",
    sector: "Defence",
    type: "Listed",
    latestReport: "FY 2024-25",
    documents: [
      "HAL_Annual_Report_2025.pdf",
      "HAL_Annual_Report_2024.pdf",
      "HAL_Investor_Presentation_2025.pdf",
    ],
    marketCap: "₹3,05,000 Cr",
    snapshot: [
      { label: "Market Capitalization", value: "₹3,05,000 Cr", kind: "reported" },
      { label: "Revenue (FY25)", value: "₹32,850 Cr", delta: "+12.1%", kind: "reported" },
      { label: "Net Profit (FY25)", value: "₹8,240 Cr", delta: "+15.3%", kind: "reported" },
      { label: "EPS", value: "₹123.2", kind: "reported" },
      { label: "ROE", value: "27.4%", kind: "calculated" },
      { label: "Debt / Equity", value: "0.03", kind: "calculated" },
      { label: "Operating Margin", value: "28.6%", kind: "calculated" },
      { label: "Profit Margin", value: "25.1%", kind: "calculated" },
    ],
    history: h([
      ["FY17", 17604, 2625, 3900, 39.2, 1100, 11800],
      ["FY18", 18284, 2070, 3400, 30.9, 1300, 12400],
      ["FY19", 19705, 2282, 3700, 34.1, 1500, 13100],
      ["FY20", 21445, 2842, 4300, 42.5, 1400, 14200],
      ["FY21", 22755, 3239, 5100, 48.4, 1200, 15900],
      ["FY22", 24620, 5080, 6900, 75.9, 950, 18600],
      ["FY23", 26928, 5828, 7800, 87.1, 880, 21400],
      ["FY24", 30381, 7595, 8900, 113.5, 810, 25800],
      ["FY25", 32850, 8240, 9400, 123.2, 790, 30100],
      ["FY26", 36900, 9310, 10800, 139.2, 760, 34600],
    ]),
    health: {
      total: 84,
      dims: [
        { label: "Profitability", score: 88 },
        { label: "Liquidity", score: 81 },
        { label: "Solvency", score: 96 },
        { label: "Growth", score: 83 },
        { label: "Efficiency", score: 72 },
      ],
    },
    overview:
      "HAL designs, manufactures and overhauls aircraft, helicopters, aero-engines and avionics primarily for Indian defence services. Revenue visibility is driven by a multi-year order book across manufacturing and repair-and-overhaul (ROH) services.",
    segments: [
      { name: "Manufacturing", value: 52 },
      { name: "Repair & Overhaul", value: 41 },
      { name: "Exports & Other", value: 7 },
    ],
    geography: [
      { name: "India (Defence Services)", value: 92 },
      { name: "Exports", value: 8 },
    ],
    outlook: "Positive",
    sentimentTrend: [
      { year: "FY22", score: 64 },
      { year: "FY23", score: 71 },
      { year: "FY24", score: 78 },
      { year: "FY25", score: 83 },
    ],
    themes: [
      { theme: "Order Book Visibility", weight: 96, note: "Multi-year order pipeline emphasised across MD&A." },
      { theme: "Indigenisation", weight: 89, note: "Domestic content targets repeatedly referenced." },
      { theme: "Capacity Expansion", weight: 82, note: "New production lines for LCA variants." },
      { theme: "Supply Chain", weight: 66, note: "Engine and component supply dependencies flagged." },
    ],
    managementQuote: {
      text: "The order book provides strong revenue visibility over the medium term, and capacity augmentation remains our principal execution priority.",
      source: "Annual Report FY2025 — Chairman's Statement",
      page: 11,
    },
    risks: [
      {
        name: "Customer Concentration Risk",
        level: "High",
        likelihood: 9,
        impact: 7,
        description:
          "A dominant share of revenue is derived from Indian defence services, linking growth to the defence budget cycle.",
        evidence: "The company derives a substantial majority of revenue from defence services.",
        page: 118,
        document: "Annual Report FY2025",
        interpretation:
          "Concentration is structural to the business model; budgetary shifts translate directly into order flow.",
      },
      {
        name: "Supply Chain Risk",
        level: "High",
        likelihood: 7,
        impact: 8,
        description: "Dependence on imported aero-engines and specialised components.",
        evidence: "The report identifies supply-side disruptions as a potential operational risk.",
        page: 139,
        document: "Annual Report FY2025",
        interpretation: "Delivery schedules are sensitive to single-source international suppliers.",
      },
      {
        name: "Execution / Delivery Risk",
        level: "Medium",
        likelihood: 6,
        impact: 7,
        description: "Programme timelines for complex platforms may slip.",
        evidence: "Execution timelines for certain platforms are subject to milestone approvals.",
        page: 127,
        document: "Annual Report FY2025",
        interpretation: "Revenue recognition is milestone-linked and therefore lumpy.",
      },
      {
        name: "Regulatory Risk",
        level: "Medium",
        likelihood: 5,
        impact: 6,
        description: "Procurement policy and offset regulation changes.",
        evidence: "Changes in defence procurement policy are listed as a material risk.",
        page: 132,
        document: "Annual Report FY2025",
        interpretation: "Policy direction currently favours domestic manufacturers.",
      },
      {
        name: "Currency Risk",
        level: "Low",
        likelihood: 4,
        impact: 4,
        description: "Import-linked component costs in foreign currency.",
        evidence: "Foreign currency exposure is disclosed in notes to accounts.",
        page: 201,
        document: "Annual Report FY2025",
        interpretation: "Partially offset by contractual escalation clauses.",
      },
    ],
    timeline: [
      { year: "FY22", event: "LCA Tejas Mk1A contract award", source: "AR FY2022, p. 19" },
      { year: "FY23", event: "Aero-engine capacity investment approved", source: "AR FY2023, p. 24" },
      { year: "FY24", event: "Record order book milestone", source: "AR FY2024, p. 16" },
      { year: "FY25", event: "Export order pipeline expansion", source: "AR FY2025, p. 11" },
    ],
  },
  {
    slug: "bel",
    name: "Bharat Electronics (BEL)",
    ticker: "BEL",
    industry: "Defence Electronics",
    sector: "Defence",
    type: "Listed",
    latestReport: "FY 2024-25",
    documents: ["BEL_Annual_Report_2025.pdf", "BEL_Investor_Presentation_2025.pdf"],
    marketCap: "₹2,18,000 Cr",
    snapshot: [
      { label: "Market Capitalization", value: "₹2,18,000 Cr", kind: "reported" },
      { label: "Revenue (FY25)", value: "₹23,100 Cr", delta: "+14.6%", kind: "reported" },
      { label: "Net Profit (FY25)", value: "₹4,320 Cr", delta: "+18.2%", kind: "reported" },
      { label: "EPS", value: "₹5.9", kind: "reported" },
      { label: "ROE", value: "26.1%", kind: "calculated" },
      { label: "Debt / Equity", value: "0.01", kind: "calculated" },
      { label: "Operating Margin", value: "24.7%", kind: "calculated" },
      { label: "Profit Margin", value: "18.7%", kind: "calculated" },
    ],
    history: h([
      ["FY17", 8825, 1536, 1900, 2.1, 200, 7300],
      ["FY18", 10085, 1399, 1800, 1.9, 220, 8100],
      ["FY19", 11789, 1888, 2400, 2.3, 240, 9100],
      ["FY20", 12968, 1825, 2300, 2.4, 260, 10100],
      ["FY21", 14109, 2100, 2700, 2.6, 250, 11200],
      ["FY22", 15368, 2350, 3100, 2.9, 230, 12400],
      ["FY23", 17734, 2985, 3900, 3.7, 210, 13900],
      ["FY24", 20268, 3985, 5000, 4.9, 190, 15800],
      ["FY25", 23100, 4320, 5700, 5.9, 180, 17600],
      ["FY26", 26400, 5060, 6700, 6.9, 170, 19900],
    ]),
    health: {
      total: 83,
      dims: [
        { label: "Profitability", score: 85 },
        { label: "Liquidity", score: 84 },
        { label: "Solvency", score: 98 },
        { label: "Growth", score: 87 },
        { label: "Efficiency", score: 74 },
      ],
    },
    overview:
      "BEL manufactures defence electronics including radars, communication systems, electronic warfare suites and naval systems, with a growing non-defence business in homeland security and civilian electronics.",
    segments: [
      { name: "Radar & Weapon Systems", value: 34 },
      { name: "Communication & C4I", value: 25 },
      { name: "Electronic Warfare", value: 18 },
      { name: "Naval Systems", value: 13 },
      { name: "Non-Defence", value: 10 },
    ],
    geography: [
      { name: "India", value: 94 },
      { name: "Exports", value: 6 },
    ],
    outlook: "Positive",
    sentimentTrend: [
      { year: "FY22", score: 68 },
      { year: "FY23", score: 74 },
      { year: "FY24", score: 80 },
      { year: "FY25", score: 85 },
    ],
    themes: [
      { theme: "Order Inflow", weight: 94, note: "Record order inflow highlighted in MD&A." },
      { theme: "Indigenisation", weight: 88, note: "In-house R&D contribution to turnover emphasised." },
      { theme: "Non-Defence Diversification", weight: 63, note: "Civilian electronics scale-up." },
    ],
    managementQuote: {
      text: "Order inflow during the year reached a record level, supported by indigenous development and increased domestic procurement.",
      source: "Annual Report FY2025 — MD&A",
      page: 47,
    },
    risks: [
      {
        name: "Customer Concentration Risk",
        level: "High",
        likelihood: 8,
        impact: 7,
        description: "Dependence on Ministry of Defence procurement.",
        evidence: "Defence customers account for the majority of revenue.",
        page: 96,
        document: "Annual Report FY2025",
        interpretation: "Non-defence diversification is early-stage relative to core revenue.",
      },
      {
        name: "Technology Obsolescence Risk",
        level: "Medium",
        likelihood: 6,
        impact: 6,
        description: "Rapid change in electronics and EW technology cycles.",
        evidence: "R&D intensity is identified as critical to competitiveness.",
        page: 101,
        document: "Annual Report FY2025",
        interpretation: "Sustained R&D spend partially mitigates the exposure.",
      },
      {
        name: "Supply Chain Risk",
        level: "Medium",
        likelihood: 6,
        impact: 6,
        description: "Semiconductor and component sourcing dependencies.",
        evidence: "Component availability constraints are disclosed as a risk.",
        page: 104,
        document: "Annual Report FY2025",
        interpretation: "Lead-time volatility affects execution schedules.",
      },
      {
        name: "Execution Risk",
        level: "Low",
        likelihood: 4,
        impact: 5,
        description: "Large programme delivery timelines.",
        evidence: "Project milestone dependencies are noted in MD&A.",
        page: 108,
        document: "Annual Report FY2025",
        interpretation: "Execution track record has been consistent.",
      },
    ],
    timeline: [
      { year: "FY23", event: "Record order inflow year", source: "AR FY2023, p. 40" },
      { year: "FY24", event: "EW systems capacity expansion", source: "AR FY2024, p. 44" },
      { year: "FY25", event: "Non-defence vertical scale-up", source: "AR FY2025, p. 47" },
    ],
  },
  {
    slug: "tata-motors",
    name: "Tata Motors",
    ticker: "TATAMOTORS",
    industry: "Automobile & EV",
    sector: "EV",
    type: "Listed",
    latestReport: "FY 2024-25",
    documents: ["TataMotors_Annual_Report_2025.pdf"],
    marketCap: "₹2,74,000 Cr",
    snapshot: [
      { label: "Market Capitalization", value: "₹2,74,000 Cr", kind: "reported" },
      { label: "Revenue (FY25)", value: "₹4,42,000 Cr", delta: "+3.1%", kind: "reported" },
      { label: "Net Profit (FY25)", value: "₹22,400 Cr", delta: "-28.4%", kind: "reported" },
      { label: "EPS", value: "₹60.8", kind: "reported" },
      { label: "ROE", value: "24.6%", kind: "calculated" },
      { label: "Debt / Equity", value: "0.71", kind: "calculated" },
      { label: "Operating Margin", value: "13.1%", kind: "calculated" },
      { label: "Profit Margin", value: "5.1%", kind: "calculated" },
    ],
    history: h([
      ["FY17", 269693, -2429, 18400, -7.2, 79000, 57000],
      ["FY18", 291550, 6813, 26900, 20.1, 82000, 60000],
      ["FY19", 301938, -28933, 21100, -85.1, 91000, 51000],
      ["FY20", 261068, -12071, 15600, -35.5, 108000, 48000],
      ["FY21", 249795, -13395, 20100, -37.1, 122000, 53000],
      ["FY22", 278454, -11441, 24300, -31.5, 116000, 55000],
      ["FY23", 345967, 2414, 35200, 6.3, 98000, 58000],
      ["FY24", 437928, 31290, 58100, 84.9, 74000, 84000],
      ["FY25", 442000, 22400, 57900, 60.8, 64000, 90000],
      ["FY26", 461000, 25800, 62400, 69.4, 58000, 99000],
    ]),
    health: {
      total: 69,
      dims: [
        { label: "Profitability", score: 62 },
        { label: "Liquidity", score: 66 },
        { label: "Solvency", score: 58 },
        { label: "Growth", score: 81 },
        { label: "Efficiency", score: 74 },
      ],
    },
    overview:
      "Tata Motors manufactures passenger vehicles, commercial vehicles and electric vehicles, and owns Jaguar Land Rover. The EV portfolio and domestic PV franchise are the primary structural growth drivers.",
    segments: [
      { name: "Jaguar Land Rover", value: 62 },
      { name: "Commercial Vehicles", value: 18 },
      { name: "Passenger Vehicles", value: 14 },
      { name: "Electric Vehicles", value: 6 },
    ],
    geography: [
      { name: "Europe & UK", value: 38 },
      { name: "India", value: 32 },
      { name: "China", value: 15 },
      { name: "North America & Other", value: 15 },
    ],
    outlook: "Cautious",
    sentimentTrend: [
      { year: "FY22", score: 48 },
      { year: "FY23", score: 58 },
      { year: "FY24", score: 72 },
      { year: "FY25", score: 61 },
    ],
    themes: [
      { theme: "Deleveraging", weight: 91, note: "Net-debt reduction targets central to commentary." },
      { theme: "EV Transition", weight: 86, note: "EV capacity and product pipeline emphasised." },
      { theme: "Demand Softness", weight: 70, note: "Cautious tone on premium demand." },
      { theme: "Capital Expenditure", weight: 74, note: "Elevated product-cycle investment." },
    ],
    managementQuote: {
      text: "We remain focused on debt reduction while continuing to invest in electrification and new product cycles.",
      source: "Annual Report FY2025 — MD&A",
      page: 52,
    },
    risks: [
      {
        name: "Demand Risk",
        level: "High",
        likelihood: 7,
        impact: 8,
        description: "Cyclical premium vehicle demand in Europe and China.",
        evidence: "The report notes softening demand in key premium markets.",
        page: 143,
        document: "Annual Report FY2025",
        interpretation: "Earnings are highly sensitive to JLR volume and mix.",
      },
      {
        name: "Leverage Risk",
        level: "Medium",
        likelihood: 5,
        impact: 7,
        description: "Historically elevated debt relative to peers.",
        evidence: "Net debt levels and reduction targets are disclosed in MD&A.",
        page: 149,
        document: "Annual Report FY2025",
        interpretation: "Leverage has improved materially over the last three reporting periods.",
      },
      {
        name: "Regulatory / Emissions Risk",
        level: "Medium",
        likelihood: 7,
        impact: 6,
        description: "Emission standards and EV policy shifts across geographies.",
        evidence: "Emission compliance costs are identified as a principal risk.",
        page: 152,
        document: "Annual Report FY2025",
        interpretation: "Compliance capex is a recurring cash-flow commitment.",
      },
      {
        name: "Supply Chain Risk",
        level: "Medium",
        likelihood: 6,
        impact: 6,
        description: "Battery cell and semiconductor availability.",
        evidence: "Component supply constraints are noted in operational review.",
        page: 156,
        document: "Annual Report FY2025",
        interpretation: "Localisation programmes reduce, but do not eliminate, exposure.",
      },
    ],
    timeline: [
      { year: "FY23", event: "Return to consolidated profitability", source: "AR FY2023, p. 48" },
      { year: "FY24", event: "Net debt reduction milestone", source: "AR FY2024, p. 50" },
      { year: "FY25", event: "EV portfolio expansion", source: "AR FY2025, p. 52" },
    ],
  },
  {
    slug: "example-aerospace",
    name: "Example Aerospace Pvt Ltd",
    industry: "Aerospace Components",
    sector: "Defence",
    type: "Unlisted / Document-based",
    latestReport: "FY 2024-25 (uploaded)",
    documents: [
      "ExampleAerospace_Annual_Report_2025.pdf",
      "ExampleAerospace_Financial_Statements_2024.pdf",
    ],
    snapshot: [
      { label: "Revenue (FY25)", value: "₹1,284 Cr", delta: "+21.4%", kind: "reported" },
      { label: "Net Profit (FY25)", value: "₹146 Cr", delta: "+26.1%", kind: "reported" },
      { label: "EBITDA", value: "₹243 Cr", kind: "reported" },
      { label: "Operating Margin", value: "18.9%", kind: "calculated" },
      { label: "Profit Margin", value: "11.4%", kind: "calculated" },
      { label: "Debt / Equity", value: "0.38", kind: "calculated" },
      { label: "ROE", value: "17.2%", kind: "calculated" },
      { label: "Revenue CAGR (3Y)", value: "19.6%", kind: "calculated" },
    ],
    history: h([
      ["FY22", 742, 68, 128, 8.4, 240, 620],
      ["FY23", 891, 92, 161, 11.3, 268, 702],
      ["FY24", 1058, 116, 197, 14.2, 302, 798],
      ["FY25", 1284, 146, 243, 17.8, 324, 850],
    ]),
    health: {
      total: 72,
      dims: [
        { label: "Profitability", score: 74 },
        { label: "Liquidity", score: 68 },
        { label: "Solvency", score: 66 },
        { label: "Growth", score: 88 },
        { label: "Efficiency", score: 64 },
      ],
    },
    overview:
      "Example Aerospace manufactures precision aerostructure components and sub-assemblies for defence and civil aviation OEMs. All figures on this page are extracted from user-provided documents; no live market data is available for this entity.",
    segments: [
      { name: "Aerostructures", value: 58 },
      { name: "Precision Machining", value: 27 },
      { name: "MRO Services", value: 15 },
    ],
    geography: [
      { name: "India", value: 74 },
      { name: "Exports (EU)", value: 18 },
      { name: "Exports (US)", value: 8 },
    ],
    outlook: "Positive",
    sentimentTrend: [
      { year: "FY23", score: 66 },
      { year: "FY24", score: 72 },
      { year: "FY25", score: 78 },
    ],
    themes: [
      { theme: "Capacity Expansion", weight: 88, note: "New machining line commissioned in FY25." },
      { theme: "Export Orders", weight: 74, note: "EU OEM qualification referenced in directors' report." },
      { theme: "Working Capital", weight: 62, note: "Receivable cycle discussed in financial review." },
    ],
    managementQuote: {
      text: "The company commissioned an additional precision machining line during the year and expects export contribution to increase.",
      source: "Uploaded Annual Report FY2025 — Directors' Report",
      page: 23,
    },
    risks: [
      {
        name: "Customer Concentration Risk",
        level: "High",
        likelihood: 8,
        impact: 7,
        description: "Top three OEM customers account for a majority of order value.",
        evidence: "Customer concentration is disclosed in the notes to accounts.",
        page: 87,
        document: "Uploaded Annual Report FY2025",
        interpretation: "Loss of a single OEM relationship would be material to revenue.",
      },
      {
        name: "Working Capital Risk",
        level: "Medium",
        likelihood: 6,
        impact: 6,
        description: "Extended receivable cycles from institutional customers.",
        evidence: "Trade receivable ageing is disclosed in the financial statements.",
        page: 64,
        document: "Uploaded Annual Report FY2025",
        interpretation: "Growth is currently funded partly through incremental borrowing.",
      },
      {
        name: "Certification Risk",
        level: "Medium",
        likelihood: 5,
        impact: 7,
        description: "Aerospace quality certifications are prerequisites for export orders.",
        evidence: "Certification renewals are referenced in the directors' report.",
        page: 29,
        document: "Uploaded Annual Report FY2025",
        interpretation: "Certification lapse would restrict addressable export demand.",
      },
    ],
    timeline: [
      { year: "FY23", event: "EU OEM supplier qualification", source: "Uploaded AR FY2023, p. 18" },
      { year: "FY25", event: "New precision machining line commissioned", source: "Uploaded AR FY2025, p. 23" },
    ],
  },
];

export const getCompany = (slug: string) => companies.find((c) => c.slug === slug);

export interface DocRecord {
  id: string;
  file: string;
  company: string;
  companySlug?: string;
  type: string;
  year: string;
  pages: number;
  tables: number;
  sections: string[];
  uploaded: string;
  status: "Ready" | "Processing";
}

export const documents: DocRecord[] = [
  {
    id: "hal-ar-2025",
    file: "HAL_Annual_Report_2025.pdf",
    company: "Hindustan Aeronautics (HAL)",
    companySlug: "hal",
    type: "Annual Report",
    year: "FY2025",
    pages: 312,
    tables: 47,
    sections: [
      "Company Overview",
      "Financial Statements",
      "MD&A",
      "Risk Factors",
      "Cash Flow",
      "Balance Sheet",
      "ESG",
      "Notes to Accounts",
      "Auditor Report",
    ],
    uploaded: "2 days ago",
    status: "Ready",
  },
  {
    id: "reliance-ar-2025",
    file: "Reliance_Annual_Report_2025.pdf",
    company: "Reliance Industries",
    companySlug: "reliance-industries",
    type: "Annual Report",
    year: "FY2025",
    pages: 438,
    tables: 61,
    sections: [
      "Company Overview",
      "Financial Statements",
      "MD&A",
      "Risk Factors",
      "Cash Flow",
      "Balance Sheet",
      "ESG",
      "Notes to Accounts",
      "Auditor Report",
    ],
    uploaded: "5 days ago",
    status: "Ready",
  },
  {
    id: "bel-ar-2025",
    file: "BEL_Annual_Report_2025.pdf",
    company: "Bharat Electronics (BEL)",
    companySlug: "bel",
    type: "Annual Report",
    year: "FY2025",
    pages: 268,
    tables: 39,
    sections: [
      "Company Overview",
      "Financial Statements",
      "MD&A",
      "Risk Factors",
      "Cash Flow",
      "Balance Sheet",
      "Notes to Accounts",
    ],
    uploaded: "1 week ago",
    status: "Ready",
  },
  {
    id: "example-aero-ar-2025",
    file: "ExampleAerospace_Annual_Report_2025.pdf",
    company: "Example Aerospace Pvt Ltd",
    companySlug: "example-aerospace",
    type: "Annual Report (Unlisted)",
    year: "FY2025",
    pages: 96,
    tables: 18,
    sections: [
      "Directors' Report",
      "Financial Statements",
      "Notes to Accounts",
      "Auditor Report",
      "Risk Factors",
    ],
    uploaded: "1 week ago",
    status: "Ready",
  },
  {
    id: "tcs-ip-q4",
    file: "TCS_Investor_Presentation_Q4.pdf",
    company: "Tata Consultancy Services",
    companySlug: "tcs",
    type: "Investor Presentation",
    year: "FY2025",
    pages: 42,
    tables: 12,
    sections: ["Business Highlights", "Financial Summary", "Segment Performance", "Outlook"],
    uploaded: "2 weeks ago",
    status: "Ready",
  },
];

export const getDocument = (id: string) => documents.find((d) => d.id === id);

export const sectors = [
  {
    slug: "defence",
    name: "Defence",
    companies: ["hal", "bel", "example-aerospace"],
    extra: ["Mazagon Dock", "Bharat Dynamics", "Cochin Shipyard"],
    revenueGrowth: 14.8,
    avgMargin: 22.4,
    avgRoe: 24.1,
    debtEquity: 0.06,
    risks: ["Budget cycle dependency", "Supply chain concentration", "Programme execution timelines"],
    themes: ["Indigenisation", "Export push", "Order-book visibility"],
    insight:
      "Defence companies in the selected dataset show increasing order-book visibility, while profitability varies significantly across companies.",
  },
  {
    slug: "it",
    name: "IT Services",
    companies: ["tcs", "infosys"],
    extra: ["HCL Technologies", "Wipro", "Tech Mahindra"],
    revenueGrowth: 6.2,
    avgMargin: 23.6,
    avgRoe: 39.9,
    debtEquity: 0.09,
    risks: ["Discretionary spend compression", "Currency volatility", "Pricing pressure from AI-led delivery"],
    themes: ["AI-led modernisation", "Vendor consolidation", "Margin discipline"],
    insight:
      "Growth in the selected IT dataset has moderated, while margins remain stable and balance sheets are effectively debt-free.",
  },
  {
    slug: "ev",
    name: "EV & Automobile",
    companies: ["tata-motors"],
    extra: ["Mahindra & Mahindra", "Ashok Leyland", "Olectra Greentech"],
    revenueGrowth: 9.4,
    avgMargin: 13.1,
    avgRoe: 24.6,
    debtEquity: 0.71,
    risks: ["Cyclical demand", "Battery supply chain", "Emission regulation"],
    themes: ["Electrification", "Deleveraging", "Product-cycle investment"],
    insight:
      "Electrification capex remains elevated across the selected dataset while leverage has been reducing from prior peaks.",
  },
  {
    slug: "energy",
    name: "Energy",
    companies: ["reliance-industries"],
    extra: ["ONGC", "IOC", "BPCL"],
    revenueGrowth: 8.4,
    avgMargin: 16.4,
    avgRoe: 9.1,
    debtEquity: 0.42,
    risks: ["Commodity price volatility", "Regulatory intervention", "Energy transition capex"],
    themes: ["New energy investment", "Refining spreads", "Integrated value chains"],
    insight:
      "Reported margins in the selected energy dataset track refining spreads closely, with new-energy capex weighing on near-term returns.",
  },
  {
    slug: "banking",
    name: "Banking",
    companies: [],
    extra: ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank"],
    revenueGrowth: 11.7,
    avgMargin: 26.8,
    avgRoe: 16.4,
    debtEquity: 0,
    risks: ["Credit cost cycle", "Deposit competition", "Regulatory capital"],
    themes: ["Deposit mobilisation", "Digital lending", "Asset quality stability"],
    insight:
      "Structured coverage for this sector is limited in the prototype dataset. Upload bank annual reports to enable document-grounded analysis.",
  },
  {
    slug: "pharma",
    name: "Pharma",
    companies: [],
    extra: ["Sun Pharma", "Cipla", "Dr Reddy's"],
    revenueGrowth: 10.2,
    avgMargin: 21.3,
    avgRoe: 17.8,
    debtEquity: 0.14,
    risks: ["Regulatory inspections", "US pricing pressure", "Patent cliffs"],
    themes: ["Specialty portfolio", "US generics pricing", "R&D pipeline"],
    insight:
      "Structured coverage for this sector is limited in the prototype dataset. Upload company reports to enable document-grounded analysis.",
  },
];

export const getSector = (slug: string) => sectors.find((s) => s.slug === slug);

export interface Insight {
  kind: "Growth" | "Profitability" | "Risk" | "Management" | "Anomaly";
  title: string;
  body: string;
  why: string;
  source: string;
  company: string;
  slug: string;
}

export const insights: Insight[] = [
  {
    kind: "Growth",
    title: "Revenue CAGR increased over the last five years",
    body: "HAL revenue compounded at 13.5% between FY21 and FY26 in the extracted dataset.",
    why: "Computed programmatically from reported revenue in FY21 and FY26 filings using the CAGR formula.",
    source: "HAL Annual Report FY2025, p. 76",
    company: "Hindustan Aeronautics (HAL)",
    slug: "hal",
  },
  {
    kind: "Profitability",
    title: "Operating margin improved despite moderate revenue growth",
    body: "BEL operating margin expanded from 20.2% (FY22) to 24.7% (FY25) while revenue grew at a slower pace.",
    why: "Margin computed as EBITDA / Revenue from extracted statement lines for each year.",
    source: "BEL Annual Report FY2025, p. 58",
    company: "Bharat Electronics (BEL)",
    slug: "bel",
  },
  {
    kind: "Risk",
    title: "Supply chain risk weight increased year-over-year",
    body: "Supply-side disruption moved from a secondary mention to a principal risk in the latest report.",
    why: "Risk register comparison between the FY2024 and FY2025 uploaded documents.",
    source: "HAL Annual Report FY2025, p. 139",
    company: "Hindustan Aeronautics (HAL)",
    slug: "hal",
  },
  {
    kind: "Management",
    title: "Management has increased emphasis on capacity expansion",
    body: "Capacity and capex language frequency rose across the last three MD&A sections.",
    why: "Theme frequency analysis over the MD&A section of three uploaded annual reports.",
    source: "Reliance Annual Report FY2025, p. 14",
    company: "Reliance Industries",
    slug: "reliance-industries",
  },
  {
    kind: "Anomaly",
    title: "Profit declined despite broadly flat revenue",
    body: "Tata Motors net profit fell 28.4% while revenue grew 3.1% in the extracted FY25 figures.",
    why: "Year-over-year growth computed separately for revenue and net profit; divergence exceeded the 15pp threshold.",
    source: "Tata Motors Annual Report FY2025, p. 52",
    company: "Tata Motors",
    slug: "tata-motors",
  },
];

export const researchWorkspaces = [
  {
    id: "defence-2025",
    title: "Indian Defence Sector Analysis",
    updated: "Updated 2 days ago",
    companies: ["hal", "bel", "example-aerospace"],
    documents: ["HAL FY2025", "BEL FY2025", "Mazagon Dock FY2025"],
    queries: [
      "What are the major risks?",
      "Compare revenue growth.",
      "Which company has better order-book visibility?",
    ],
    insights: 12,
  },
  {
    id: "it-margins",
    title: "IT Margin Durability Study",
    updated: "Updated 1 week ago",
    companies: ["tcs", "infosys"],
    documents: ["TCS FY2025", "Infosys FY2025"],
    queries: ["Summarize the MD&A.", "Which segment grew the fastest?"],
    insights: 8,
  },
  {
    id: "unlisted-aero",
    title: "Unlisted Aerospace Suppliers",
    updated: "Updated 3 weeks ago",
    companies: ["example-aerospace"],
    documents: ["Example Aerospace FY2025", "Example Aerospace FY2024"],
    queries: ["What is the working capital cycle?", "What are the customer concentration risks?"],
    insights: 5,
  },
];

export const savedReports = [
  {
    id: "r1",
    title: "HAL — Full Research Report",
    company: "Hindustan Aeronautics (HAL)",
    created: "17 Aug 2026",
    pages: 24,
    sections: ["Overview", "Financials", "Risk", "Management", "Sources"],
  },
  {
    id: "r2",
    title: "HAL vs BEL — Comparative Analysis",
    company: "HAL, BEL",
    created: "15 Aug 2026",
    pages: 18,
    sections: ["Metrics", "Charts", "AI Comparison", "Sources"],
  },
  {
    id: "r3",
    title: "Reliance — Risk & Management Digest",
    company: "Reliance Industries",
    created: "11 Aug 2026",
    pages: 12,
    sections: ["Risk Matrix", "Management Commentary", "Sources"],
  },
];

// --- Programmatic financial calculations (never delegated to the LLM) ---

export const cagr = (begin: number, end: number, years: number) =>
  years <= 0 || begin <= 0 ? 0 : (Math.pow(end / begin, 1 / years) - 1) * 100;

export const yoy = (curr: number, prev: number) => (prev === 0 ? 0 : ((curr - prev) / prev) * 100);

export const profitMargin = (profit: number, revenue: number) =>
  revenue === 0 ? 0 : (profit / revenue) * 100;

export const debtToEquity = (debt: number, equity: number) => (equity === 0 ? 0 : debt / equity);

export const roe = (netIncome: number, equity: number) =>
  equity === 0 ? 0 : (netIncome / equity) * 100;

export const fmtCr = (v: number) =>
  Math.abs(v) >= 100000 ? `₹${(v / 100000).toFixed(2)} L Cr` : `₹${v.toLocaleString("en-IN")} Cr`;

export const pct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;

export const sliceYears = (history: YearPoint[], n: number) => history.slice(Math.max(0, history.length - n));

// --- Anomaly detection feed -------------------------------------------------
// Each anomaly ties to a specific, checkable number extracted from a document,
// never a vague AI sentence. `check` states the arithmetic that produced the flag.

export interface Anomaly {
  id: string;
  companySlug: string;
  title: string;
  severity: "High" | "Medium" | "Low";
  explanation: string;
  check: string;
  claim: "reported" | "calculated" | "interpretation";
  document: string;
  page: number;
  note: string;
  excerpt: string;
}

export const anomalies: Anomaly[] = [
  {
    id: "a1",
    companySlug: "hal",
    title: "Receivables grew 2.4x faster than revenue",
    severity: "High",
    explanation:
      "Trade receivables rose 31.2% while revenue rose 12.8% in the same period, stretching the collection cycle.",
    check: "31.2% ÷ 12.8% = 2.44x · receivable days moved from 118 to 139",
    claim: "calculated",
    document: "HAL Annual Report FY2025",
    page: 87,
    note: "note 14",
    excerpt:
      "Trade receivables (unsecured, considered good) ₹41,208 crore as at 31 March 2025 against ₹31,405 crore in the previous year. Ageing beyond 180 days: ₹6,842 crore.",
  },
  {
    id: "a2",
    companySlug: "hal",
    title: "Other income contributed 18% of profit before tax",
    severity: "Medium",
    explanation:
      "A materially higher share of pre-tax profit came from non-operating income than in the prior year.",
    check: "Other income ₹3,140 Cr ÷ PBT ₹17,420 Cr = 18.0% (prior year: 11.2%)",
    claim: "calculated",
    document: "HAL Annual Report FY2025",
    page: 74,
    note: "note 22",
    excerpt:
      "Other income comprises interest on bank deposits ₹2,190 crore and net gain on financial assets ₹950 crore, aggregating ₹3,140 crore.",
  },
  {
    id: "a3",
    companySlug: "hal",
    title: "Narrative growth claim exceeds reported figure",
    severity: "Medium",
    explanation:
      "The Directors' Report describes 'robust double-digit order inflow growth' while the disclosed order book table shows 8.4% growth.",
    check: "Order book ₹94,100 Cr vs ₹86,800 Cr = +8.4%, below the 10% double-digit threshold",
    claim: "interpretation",
    document: "HAL Annual Report FY2025",
    page: 23,
    note: "directors' report",
    excerpt:
      "The Company delivered robust double-digit growth in order inflows during the year under review, supported by sustained defence procurement.",
  },
  {
    id: "a4",
    companySlug: "hal",
    title: "Capitalised development cost rose sharply",
    severity: "Low",
    explanation:
      "Development expenditure moved to the balance sheet at a faster rate, which flatters reported operating profit.",
    check: "Capitalised dev cost ₹2,480 Cr vs ₹1,610 Cr = +54.0%; expensed R&D fell 6.1%",
    claim: "calculated",
    document: "HAL Annual Report FY2025",
    page: 92,
    note: "note 5",
    excerpt:
      "Intangible assets under development include product development expenditure of ₹2,480 crore capitalised during the year in accordance with Ind AS 38.",
  },
  {
    id: "a5",
    companySlug: "hal",
    title: "Contingent liabilities equal 21% of net worth",
    severity: "High",
    explanation:
      "Disclosed contingent liabilities are large relative to equity and are not reflected on the balance sheet.",
    check: "Contingent liabilities ₹8,940 Cr ÷ net worth ₹42,600 Cr = 21.0%",
    claim: "calculated",
    document: "HAL Annual Report FY2025",
    page: 141,
    note: "note 38",
    excerpt:
      "Claims against the Company not acknowledged as debts: ₹8,940 crore, primarily comprising disputed statutory demands and contractual claims.",
  },
  {
    id: "a6",
    companySlug: "tata-motors",
    title: "Profit fell while revenue grew",
    severity: "High",
    explanation:
      "Net profit declined 28.4% against 3.1% revenue growth — a 31.5 percentage-point divergence.",
    check: "Revenue +3.1%, net profit −28.4%; divergence 31.5pp exceeds the 15pp flag threshold",
    claim: "calculated",
    document: "Tata Motors Annual Report FY2025",
    page: 52,
    note: "statement of P&L",
    excerpt:
      "Profit for the year ₹22,140 crore against ₹30,920 crore in the previous year, after exceptional items of ₹4,180 crore.",
  },
];

export const anomaliesFor = (slug: string) => anomalies.filter((a) => a.companySlug === slug);
