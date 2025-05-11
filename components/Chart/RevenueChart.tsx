
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
const chartData = [
  { month: "January", online: 186, offline: 80 },
  { month: "February", online: 305, offline: 200 },
  { month: "March", online: 237, offline: 120 },
  { month: "April", online: 73, offline: 190 },
  { month: "May", online: 209, offline: 130 },
  { month: "June", online: 214, offline: 140 },
];



const chartConfig = {
  online: {
    label: "Online",
    color: "#004e64",
  },
  offline: {
    label: "Offline",
    color: "#f4a300",
  }
} satisfies ChartConfig



function RevenueChart() {
  return (
    <div className="max-h-400px ">
      <div>
        <ChartContainer config={chartConfig}>

          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <defs>
              <linearGradient id="fillOnline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-online)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-online)" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="fillOffline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-offline)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-offline)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              dataKey="offline"
              type="natural"
              fill="url(#fillOffline)"
              fillOpacity={0.4}
              stroke="var(--color-offline)"
              stackId="a"
              strokeWidth={3}
            />
            <Area
              dataKey="online"
              type="natural"
              fill="url(#fillOnline)"
              fillOpacity={0.4}
              stroke="var(--color-online)"
              stackId="a"
              strokeWidth={3}
            />
            <ChartLegend content={<ChartLegendContent />} />

          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
export default RevenueChart
