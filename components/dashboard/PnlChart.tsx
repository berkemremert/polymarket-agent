"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card } from "@/components/ui/Card";
import type { PnlDataPoint } from "@/lib/types";

interface Props {
  data: PnlDataPoint[];
}

export function PnlChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <Card className="h-64 flex items-center justify-center">
        <p className="text-zinc-500 text-sm">No resolved trades yet</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">
        Cumulative PnL
      </h2>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: 8,
              }}
              labelStyle={{ color: "#a1a1aa" }}
              formatter={(v) => [`$${Number(v).toFixed(2)}`, "PnL"]}
            />
            <ReferenceLine y={0} stroke="#3f3f46" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#8b5cf6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
