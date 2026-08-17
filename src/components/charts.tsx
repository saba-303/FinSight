import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--color-popover)",
    border: "1px solid var(--color-border)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "var(--color-popover-foreground)",
  },
  labelStyle: { color: "var(--color-muted-foreground)", fontSize: "11px" },
} as const;

const palette = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export function TrendLine({
  data,
  keys,
  height = 240,
}: {
  data: object[];
  keys: { key: string; label: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="year" {...axis} />
        <YAxis {...axis} width={62} />
        <Tooltip {...tooltipStyle} />
        {keys.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
        {keys.map((k, i) => (
          <Line
            key={k.key}
            type="monotone"
            dataKey={k.key}
            name={k.label}
            stroke={palette[i % palette.length]}
            strokeWidth={2}
            dot={{ r: 2.5, strokeWidth: 0, fill: palette[i % palette.length] }}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TrendBars({
  data,
  keys,
  height = 240,
  stacked = false,
}: {
  data: object[];
  keys: { key: string; label: string }[];
  height?: number;
  stacked?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="year" {...axis} />
        <YAxis {...axis} width={62} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-secondary)", opacity: 0.35 }} />
        {keys.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
        {keys.map((k, i) => (
          <Bar
            key={k.key}
            dataKey={k.key}
            name={k.label}
            {...(stacked ? { stackId: "a" } : {})}
            fill={palette[i % palette.length]}
            radius={stacked ? [0, 0, 0, 0] : [3, 3, 0, 0]}
            maxBarSize={38}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CompositionArea({
  data,
  keys,
  height = 240,
}: {
  data: object[];
  keys: { key: string; label: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
        <defs>
          {keys.map((k, i) => (
            <linearGradient key={k.key} id={`grad-${k.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette[i % palette.length]} stopOpacity={0.5} />
              <stop offset="100%" stopColor={palette[i % palette.length]} stopOpacity={0.04} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="year" {...axis} />
        <YAxis {...axis} width={62} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {keys.map((k, i) => (
          <Area
            key={k.key}
            type="monotone"
            dataKey={k.key}
            name={k.label}
            stackId="1"
            stroke={palette[i % palette.length]}
            fill={`url(#grad-${k.key})`}
            strokeWidth={1.6}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DonutMix({
  data,
  height = 240,
}: {
  data: { name: string; value: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="56%"
          outerRadius="82%"
          paddingAngle={2}
          stroke="var(--color-background)"
          strokeWidth={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={palette[i % palette.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} formatter={(v: number) => `${v}%`} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function HealthRadar({
  data,
  height = 260,
  series = "Score",
}: {
  data: { label: string; score: number }[];
  height?: number;
  series?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis dataKey="label" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
        <Radar
          name={series}
          dataKey="score"
          stroke="var(--color-chart-1)"
          fill="var(--color-chart-1)"
          fillOpacity={0.28}
          strokeWidth={2}
        />
        <Tooltip {...tooltipStyle} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function RiskMatrix({
  risks,
  height = 300,
}: {
  risks: { name: string; likelihood: number; impact: number; level: string }[];
  height?: number;
}) {
  const color = (level: string) =>
    level === "High"
      ? "var(--color-destructive)"
      : level === "Medium"
        ? "var(--color-warning)"
        : "var(--color-success)";
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 12, right: 18, bottom: 18, left: -8 }}>
        <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="likelihood"
          name="Likelihood"
          domain={[0, 10]}
          {...axis}
          label={{
            value: "Likelihood",
            position: "insideBottom",
            offset: -8,
            fill: "var(--color-muted-foreground)",
            fontSize: 11,
          }}
        />
        <YAxis
          type="number"
          dataKey="impact"
          name="Impact"
          domain={[0, 10]}
          {...axis}
          width={54}
          label={{
            value: "Impact",
            angle: -90,
            position: "insideLeft",
            offset: 18,
            fill: "var(--color-muted-foreground)",
            fontSize: 11,
          }}
        />
        <ZAxis range={[140, 141]} />
        <Tooltip
          {...tooltipStyle}
          cursor={{ strokeDasharray: "3 3" }}
          formatter={(v: number, n: string) => [v, n]}
          labelFormatter={() => ""}
        />
        <Scatter data={risks} name="Risks">
          {risks.map((r, i) => (
            <Cell key={i} fill={color(r.level)} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function MiniSpark({ data, dataKey }: { data: object[]; dataKey: string }) {
  return (
    <ResponsiveContainer width="100%" height={44}>
      <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="var(--color-chart-1)"
          strokeWidth={1.8}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export const chartPalette = palette;
