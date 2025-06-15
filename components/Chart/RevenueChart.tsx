"use client";
import { getExpense, getIncome, getRevenue } from '@/lib/actions/dashboard.action';
import { getExpenseFromDatetoDate } from '@/lib/actions/medicineBatch.action';
// import { getExpense, getRevenue } from '@/lib/actions/dashboard.action';
import { DualAxes } from '@ant-design/plots';
import React, { useEffect, useState } from 'react';
type IncomeItem = {
  date: string;
  income: number;
}
type RevenueAndExpense = {
  date: string;
  value: number;
  type: string;
}

const RevenueChart = () => {
  const [incomeData, setIncomeData] = useState<IncomeItem[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueAndExpense[]>([]);
  const [expenseData, setExpenseData] = useState<RevenueAndExpense[]>([]);


  // Fetch expense data
  useEffect(() => {
    const fetchExpense = async () => {

      try {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const expense = await getExpenseFromDatetoDate(sevenDaysAgo, today)

        setExpenseData(expense);
      } catch (err) {
        console.error("Error fetch expense ", err);
      }
    };
    fetchExpense();
  }, []);
  console.log("exp", expenseData)


  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const res = await fetch('/api/dashboard/revenue', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fromDate: sevenDaysAgo,
            toDate: today,
          }),
        });


        const json = await res.json();
        if (!res.ok) {
          console.error("Failed to get revenue:", res.status, json.error);
          return;
        }
        if (json.success) {
          setRevenueData(json.data);
        } else {
          console.error("Failed to get revenue:", json.error);
        }
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
  }, []);

  console.log("rev", revenueData)


  // Fetch Income Data
  useEffect(() => {
    const fetchIncome = async () => {
      const response = await getIncome();
      if (response) {
        setIncomeData(response);
      }
    };
    fetchIncome();
  }, [])

  const revenueExpensesData = [
    ...revenueData,
    ...expenseData
  ]


  const config = {
    // height: 600,
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