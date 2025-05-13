"use client";
import { getExpense, getIncome, getRevenue } from '@/lib/actions/dashboard.action';
// import { getExpense, getRevenue } from '@/lib/actions/dashboard.action';
import { DualAxes } from '@ant-design/plots';
import { NumberExpression } from 'mongoose';
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

const DemoDualAxes = () => {
  const [incomeData, setIncomeData] = useState<IncomeItem[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueAndExpense[]>([]);
  const [expenseData, setExpenseData] = useState<RevenueAndExpense[]>([]);

  // Fetch Revenue Data
  useEffect(() => {
    const fetchRevenue = async () => {
      const response = await getRevenue();
      if (response) {
        setRevenueData(response);
      }
    };
    fetchRevenue();
  }, [])

  // Fetch Expense Data
  useEffect(() => {
    const fetchExpense = async () => {
      const response = await getExpense();
      if (response) {
        setExpenseData(response);
      }
    };
    fetchExpense();
  }, [])

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

  console.log(revenueExpensesData);


  const uvBillData = [
    { time: '2019-03', value: 350, type: 'uv' },
    { time: '2019-04', value: 900, type: 'uv' },
    { time: '2019-05', value: 300, type: 'uv' },
    { time: '2019-06', value: 450, type: 'uv' },
    { time: '2019-07', value: 470, type: 'uv' },
    { time: '2019-03', value: 220, type: 'bill' },
    { time: '2019-04', value: 300, type: 'bill' },
    { time: '2019-05', value: 250, type: 'bill' },
    { time: '2019-06', value: 220, type: 'bill' },
    { time: '2019-07', value: 362, type: 'bill' },
  ];
  // console.log(uvBillData);

  const transformData = [
    { time: '2019-03', count: 801 },
    { time: '2019-04', count: 600 },
    { time: '2019-05', count: 401 },
    { time: '2019-06', count: 380 },
    { time: '2019-07', count: 220 },
  ];

  const config = {
    height: 600,
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

export default DemoDualAxes;