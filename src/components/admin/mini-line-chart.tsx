import type { AdminChartPoint } from "@/lib/admin-types";

interface MiniLineChartProps {
  data: AdminChartPoint[];
  stroke?: string;
  fill?: string;
  height?: number;
}

export function MiniLineChart({
  data,
  stroke = "#67e8f9",
  fill = "rgba(103, 232, 249, 0.18)",
  height = 220,
}: MiniLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[180px] items-center justify-center rounded-[1.75rem] border border-white/8 bg-[#081224]/80 text-sm text-slate-400 sm:h-[220px]">
        No chart data available.
      </div>
    );
  }

  const width = 640;
  const maxValue = Math.max(...data.map((point) => point.value));
  const minValue = Math.min(...data.map((point) => point.value));
  const range = Math.max(maxValue - minValue, 1);

  const points = data
    .map((point, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * width;
      const y = height - ((point.value - minValue) / range) * (height - 24) - 12;

      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `${points} ${width},${height} 0,${height}`;

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/8 bg-[#081224]/80 p-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[180px] w-full sm:h-[220px]"
        role="img"
        aria-label="Trend chart"
      >
        <defs>
          <linearGradient id={`chart-fill-${stroke.replace("#", "")}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={fill} />
            <stop offset="100%" stopColor="rgba(8,18,36,0)" />
          </linearGradient>
        </defs>
        <polyline
          fill={`url(#chart-fill-${stroke.replace("#", "")})`}
          points={areaPoints}
        />
        <polyline
          fill="none"
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
          points={points}
        />
      </svg>
      <div className="mt-3 flex flex-wrap justify-between gap-3 text-xs text-slate-500">
        <span>{data[0]?.label}</span>
        <span>{data[Math.floor(data.length / 2)]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}
