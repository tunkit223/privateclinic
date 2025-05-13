"use client";

import React, { useEffect, useState } from 'react';
import { Col, Select, Row, DatePicker } from 'antd';
import CartItem from '@/components/CartItem/CartItem';
import "./Page.scss"
import RevenueChart from '@/components/Chart/RevenueChart';
import PatientByGender from '@/components/Chart/PatientGenderChart';
import { getPatientByDateRange } from '@/lib/actions/dashboard.action';
import UpcomingAppointment from '@/components/Calendar/UpcomingAppointment';
import dayjs, { Dayjs } from 'dayjs';

import type { RangePickerProps } from 'antd/es/date-picker';
import DemoDualAxes from '@/components/Chart/CombineChart';

const { RangePicker } = DatePicker;


const Dashboard = () => {

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>([dayjs().subtract(7, 'day'), dayjs()]);
  const [genderData, setGenderData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGenderData = async () => {
      if (!dateRange || !dateRange[0] || !dateRange[1]) return;

      try {
        const data = await getPatientByDateRange(
          dateRange[0].toDate(),
          dateRange[1].toDate()
        );
        console.log("Patient by gender:", data);
        setGenderData(data);
      } catch (err) {
        console.error("Error fetch patient by gender", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenderData();
  }, [dateRange]);

  const handleChangeRangePicker: RangePickerProps['onChange'] = (dates) => {
    setDateRange(dates as [Dayjs, Dayjs]);
  };

  return (
    <>
      {/* Section one  */}
      <Row className='overview' justify="space-evenly" align="stretch">
        {/* Grid figure  */}
        <Col className='overview__figure ' span={12}>
          <Row className='overview__figure__row' gutter={[20, 20]} align="stretch">
            <Col span={12} className='overview__figure__cart'>
              <CartItem count={10} title='Total doctor' desc={
                <>
                  Doctor is working
                </>
              } href='#' />
            </Col>
            <Col span={12} className='overview__figure__cart'>
              <CartItem count={24} title='Appointment' desc={
                <>
                  Up <span className="text-green-500 font-bold">3.2%</span> from yesterday
                </>
              } href='#' />
            </Col>
            <Col span={12} className='overview__figure__cart'>
              <CartItem count={12} title='Total patient' desc={
                <>
                  Down <span className="text-red-500 font-bold">1.2%</span> from yesterday
                </>
              } href='#' />
            </Col>
            <Col span={12} className='overview__figure__cart'>
              <CartItem count={6} title='Total revenue' desc={
                <>
                  Up <span className="text-green-500 font-bold">4.2%</span> from yesterday
                </>
              } href='#' />
            </Col>
          </Row>
        </Col>
        {/* End Grid figure  */}

        {/* Gender */}
        <Col className='overview__gender' span={11} >
          <div className='overview__gender__header'>
            <div className='overview__gender__header--title'>Patients by Gender</div>
            <div className='overview__gender__header--selectTime'>
              <RangePicker format="DD/MM/YYYY" value={dateRange} onChange={handleChangeRangePicker} />
            </div>
          </div>
          <div className='overview__gender__content'>
            <PatientByGender data={genderData} />
          </div>
        </Col>
        {/* End Gender */}
      </Row>
      {/* End Section one  */}


      {/* Section two  */}
      <Row className='overview-two' justify="space-evenly" align="stretch">
        <Col span={12} className='revenue'>
          <div className='revenue__header'>
            <div className='revenue__header--title'>Revenue</div>
            <div className='revenue__header--selectTime'>
            </div>
          </div>
          <div className='revenue__chart'>
            {/* <RevenueChart /> */}
            <DemoDualAxes />
          </div>
        </Col>
        <Col span={11} className='appointment'>
          <UpcomingAppointment />
        </Col>
      </Row>
      {/* End Section two  */}

    </>
  )
}

export default Dashboard;