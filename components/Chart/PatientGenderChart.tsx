
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
import { useEffect, useState } from "react";

interface PatientByGender {
  date: string;
  male: number;
  female: number;
}


const chartConfig = {
  male: {
    label: "Male",
    color: "#004e64",
  },
  female: {
    label: "Female",
    color: "#F37877",
  }
} satisfies ChartConfig


const PatientByGender = ({ data }: { data: PatientByGender[] }) => {
  return (
    <div className="max-h-400px w-full">
      <div>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              bottom: 10,
              top: 10
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <defs>
              <linearGradient id="fillMale" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-male)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-male)" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="fillFemale" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-female)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--color-female)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              dataKey="female"
              type="natural"
              fill="url(#fillFemale)"
              fillOpacity={0.4}
              stroke="var(--color-female)"
              stackId="a"
              strokeWidth={3}
            />
            <Area
              dataKey="male"
              type="natural"
              fill="url(#fillMale)"
              fillOpacity={0.4}
              stroke="var(--color-male)"
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
export default PatientByGender;
