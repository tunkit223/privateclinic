"use client"

import { CoffeeIcon, TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const expenseDetails = [
  { id: 'rentalCost', name: "Rental Cost", value: 24374, color: "#104078" },
  { id: 'wages', name: "Wages", value: 19500, color: "#F88B1F" },
  { id: 'medicalEquiment', name: "Medical Equipment", value: 12847, color: "#FFD024" },
  { id: 'supplies', name: "Supplies", value: 16538, color: "#2F9856" },
]
const totalExpenses = expenseDetails.reduce((sum, item) => sum + item.value, 0);

const chartData = [{ rentalCost: 24374, wages: 19500, medicalEquiment: 12847, supplies: 16538 }]


const chartConfig = expenseDetails.reduce((config, item) => {
  config[item.id] = {
    label: item.name,
    color: item.color,
  };
  return config;
}, {} as ChartConfig);



export function ExpenseChart() {

  return (
    <div className="flex">
      <div className="flex">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full  max-w-[400px] aspect-square">
          <RadialBarChart
            data={chartData}
            endAngle={360}
            innerRadius={140}
            outerRadius={200}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 30}
                          className="fill-muted-foreground text-2xl"
                        >
                          Total Expenses
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0)}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalExpenses.toLocaleString()}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            {expenseDetails.map((item) => (
              <RadialBar
                key={item.id}
                dataKey={item.id}
                fill={item.color}
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
            ))}

          </RadialBarChart>
        </ChartContainer>
        <div className="grid grid-cols-2 gap-4 px-4 py-2">
          {expenseDetails.map((item) => (
            <div key={item.name} className="flex items-center space-x-2 ">
              <span className={`w-3 h-3 rounded-full bg-[${item.color}]`}></span>
              <div>
                <p className="text-sm text-muted-foreground">{item.name}</p>
                <p className="text-base font-semibold">${item.value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


