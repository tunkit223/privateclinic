"use client";

import React, { useState } from 'react';
import { Col, Select, Row } from 'antd';
import CartItem from '@/components/CartItem/CartItem';
import "./Page.scss"
import { ExpenseChart } from '@/components/Chart/ExpenseChart';
import { Table } from 'lucide-react';
import TableAppointment from '@/components/table/TableDashboard/TableAppointment';
import RevenueChart from '@/components/Chart/RevenueChart';
import UpcomingAppoitment from '@/components/Calendar/UpcomingAppoitment';


const Dashboard = () => {
  const changeDateRevenue = (value: string) => {
    console.log(`selected ${value}`);
  }
  const changeDateExpense = (value: string) => {
    console.log(`selected ${value}`);
  }


  const optionsSelectDate = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'thisMonth', label: 'This month' },
    { value: 'lastMonth', label: 'Last month' },
  ];

  return (
    <>
      {/* Section one  */}
      <Row className='overview' justify="space-evenly" align="stretch">
        {/* Grid figure  */}
        <Col className='overview__figure ' span={12}>
          <Row className='overview__figure__row' gutter={[20, 20]} align="stretch">
            <Col span={12} className='overview__figure__cart'>
              <CartItem count={10} title='Tổng bác sĩ' desc={
                <>
                  Bac si dang lam viec
                </>
              } href='#' />
            </Col>
            <Col span={12} className='overview__figure__cart'>
              <CartItem count={24} title='Lịch khám' desc={
                <>
                  Tăng <span className="text-green-500 font-bold">3.2%</span> so với hôm qua
                </>
              } href='#' />
            </Col>
            <Col span={12} className='overview__figure__cart'>
              <CartItem count={12} title='Tổng bệnh nhân' desc={
                <>
                  Giam <span className="text-red-500 font-bold">1.2%</span> so với hôm qua
                </>
              } href='#' />
            </Col>
            <Col span={12} className='overview__figure__cart'>
              <CartItem count={6} title='Tổng doanh thu' desc={
                <>
                  Tăng <span className="text-green-500 font-bold">4.2%</span> so với hôm qua
                </>
              } href='#' />
            </Col>
          </Row>
        </Col>
        {/* End Grid figure  */}

        {/* Chart Revenue */}
        <Col className='overview__revenueChart ' span={11} >
          <div className='overview__revenueChart__header'>
            <div className='overview__revenueChart__header--title'>Revenue Overview</div>
            <div className='overview__revenueChart__header--selectTime'>
              <Select
                defaultValue="today"
                onChange={changeDateRevenue}
                style={{ width: 120 }}
                options={optionsSelectDate}
              />
            </div>
          </div>
          <div className='overview__revenueChart__content'>
            <RevenueChart />
          </div>
        </Col>
        {/* End Chart Revenue */}
      </Row>
      {/* End Section one  */}


      {/* Section two  */}
      <Row className='overview-two' justify="space-evenly" align="stretch">
        <Col span={12} className='expense'>
          <div className='expense__header'>
            <div className='expense__header--title'>Expenses</div>
            <div className='expense__header--selectTime'>
              <Select
                defaultValue="today"
                onChange={changeDateExpense}
                style={{ width: 120 }}
                options={optionsSelectDate}
              />
            </div>
          </div>
          <div className='expense__chart'>
            <ExpenseChart />
          </div>
        </Col>
        <Col span={11} className='appointment'>
          <UpcomingAppoitment />
        </Col>
      </Row>
      {/* End Section two  */}

    </>
  )
}

export default Dashboard;