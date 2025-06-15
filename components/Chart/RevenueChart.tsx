"use client";
import { getExpense, getIncome, getRevenue } from '@/lib/actions/dashboard.action';
import { getRevenueFromInvoice } from '@/lib/actions/invoice.action';
import { getExpenseFromDatetoDate } from '@/lib/actions/medicineBatch.action';
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
};

const RevenueChart = ({ fromDate, toDate }: RevenueChartProps) => {
  const [revenueData, setRevenueData] = useState<RevenueAndExpense[]>([]);
  const [expenseData, setExpenseData] = useState<RevenueAndExpense[]>([]);


  // Fetch expense data
  useEffect(() => {
    const fetchExpense = async () => {
      try {

        const expense = await getExpenseFromDatetoDate(fromDate, toDate)

        setExpenseData(expense);
      } catch (err) {
        console.error("Error fetch expense ", err);
      }
    };
    fetchExpense();
  }, [fromDate, toDate]);
  // console.log("exp", expenseData)


  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch('/api/dashboard/revenue', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fromDate: fromDate,
            toDate: toDate,
          }),
        });

        const json = await res.json();

        if (json.success) {
          setRevenueData(json.data);
        } else {
          console.error("Failed to get revenue:", json.error);
        }

      } catch (error) {
        console.log("Error fetch revenue:", error);
      }
    };
    fetchRevenue();
  }, [fromDate, toDate]);

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
        values: [0.1, 0.5],
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
        label: { position: 'inside' },
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