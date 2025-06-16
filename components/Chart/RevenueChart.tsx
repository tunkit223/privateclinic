"use client";
// import { getExpense, getRevenue } from '@/lib/actions/dashboard.action';
import { DualAxes } from '@ant-design/plots';
import React, { useEffect, useState } from 'react';

type RevenueAndExpense = {
  date: string;
  value: number;
  type: string;
}

type RevenueChartProps = {
  fromDate: Date;
  toDate: Date;
  revenueData: RevenueAndExpense[];
  expenseData: RevenueAndExpense[];
};

const RevenueChart = ({ fromDate, toDate, revenueData, expenseData }: RevenueChartProps) => {




  // console.log("rev", revenueData)


  // Income Data
  const incomeData = revenueData.map(rev => {
    const exp = expenseData.find((e) => e.date === rev.date);
    return {
      date: rev.date,
      income: rev.value - (exp?.value || 0),
    };
  })

  const revenueExpensesData = [
    ...revenueData,
    ...expenseData
  ]

  const config = {
    height: 800,
    xField: 'date',
    legend: {
      color: {
        position: 'top',
        layout: { justifyContent: 'center' },
      },
    },
    scale: { color: { range: ['#5B8FF9', '#5D7092', '#5AD8A6'] } },
    slider: {
      x: {
        values: [0.1, 3],
      },
    },
    children: [
      {
        data: revenueExpensesData,
        type: 'interval',
        yField: 'value',
        colorField: 'type',
        group: true,
        style: { maxWidth: 50 },
        label: { position: 'top' },
        interaction: { elementHighlight: { background: true } },
      },
      {
        data: incomeData,
        type: 'line',
        yField: 'income',
        style: { lineWidth: 2 },
        axis: { y: { position: 'right' } },
        // shape: 'smooth',
        interaction: {
          tooltip: {
            crosshairs: false,
            marker: false,
          },
        },
      },
    ],
  };
  return (
    <>
      <DualAxes {...config} />
    </>
  );
};

export default RevenueChart;