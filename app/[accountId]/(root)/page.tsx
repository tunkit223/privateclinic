"use client";

import React, { useEffect, useState } from 'react';
import { Col, Select, Row, DatePicker, Button, Carousel, Segmented } from 'antd';
import CartItem from '@/components/CartItem/CartItem';
import "./Page.scss"
import PatientByGender from '@/components/Chart/PatientGenderChart';
import { getFigureAppointmentToday, getPatientByDateRange } from '@/lib/actions/dashboard.action';
import UpcomingAppointment from '@/components/Calendar/UpcomingAppointment';
import dayjs, { Dayjs } from 'dayjs';

import type { RangePickerProps } from 'antd/es/date-picker';
import RevenueChart from '@/components/Chart/RevenueChart';
import { FaUserDoctor } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { LuChartNoAxesCombined } from "react-icons/lu";
import AvailableDoctor from '@/components/table/TableAvailableDoctor/TableAvailableDoctor';
import { error } from 'console';
import { getPatientList } from '@/lib/actions/patient.actions';
import { getAvailableDoctors } from '@/lib/actions/workschedules.action';
import { any } from 'zod';
import { getFigureByModel } from '@/lib/utils';


const { RangePicker } = DatePicker;

type AvailableDoctor = {
  name: string;
  image: string;
  workShift: string;
  _id: string
}

const Dashboard = () => {

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>([dayjs().subtract(7, 'day'), dayjs()]);
  const [genderData, setGenderData] = useState<any[]>([]);
  const [availableDoctor, setAvailableDoctor] = useState<AvailableDoctor[]>([]);
  const [selectShift, setSelectShift] = useState<string>("Morning");


  // Fetch data for Gender chart
  useEffect(() => {
    const fetchGenderData = async () => {
      if (!dateRange || !dateRange[0] || !dateRange[1]) return;

      try {
        const data = await getPatientByDateRange(
          dateRange[0].toDate(),
          dateRange[1].toDate()
        );
        // console.log("Patient by gender:", data);
        setGenderData(data);
      } catch (err) {
        console.error("Error fetch patient by gender", err);
      }
    };

    fetchGenderData();
  }, [dateRange]);




  // Fetch data available doctor
  useEffect(() => {
    const fetchAvailableDoctor = async () => {
      const today = new Date();
      const [afternoonShift, morningShift] = await Promise.all([
        getAvailableDoctors(today, "Afternoon"),
        getAvailableDoctors(today, "Morning"),
      ]);

      const result = [
        ...afternoonShift,
        ...morningShift
      ]
      setAvailableDoctor(result);
    };
    fetchAvailableDoctor();
  }, [])
  console.log("available doctor", availableDoctor);


  // handle change range picker of patient gender
  const handleChangeRangePicker: RangePickerProps['onChange'] = (dates) => {
    setDateRange(dates as [Dayjs, Dayjs]);
  };


  // css for Upcoming appointment
  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: '160px',
    color: '#000',
    // lineHeight: '50px',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'start',
    background: '#E4F5FF',
    display: 'flex',
    borderRadius: '10px'
  };


  // handle change work shift
  const handleChangeWorkShift = (value: string) => {
    setSelectShift(value)
  }
  // console.log(handleChangeWorkShift);

  const filteredDoctors = availableDoctor.filter(dt => dt.workShift.toLowerCase() === selectShift.toLowerCase());


  const [figureData, setFigureData] = useState<{
    appointment: any;
    patient: any;
  }>({
    appointment: null,
    patient: null,
  }); useEffect(() => {
    const fetchFigure = async () => {
      try {
        const [appointmentRes, patientRes] = await Promise.all([
          fetch("/api/dashboard/figure/appointment"),
          fetch("/api/dashboard/figure/patient"),
        ]);

        const [appointment, patient] = await Promise.all([
          appointmentRes.json(),
          patientRes.json(),
        ]);

        setFigureData({ appointment, patient });
      } catch (err) {
        console.error("Error fetch patient by gender", err);
      }
    };
    fetchFigure();
  }, []);

  return (
    <>
      {/* Section one  */}
      <Row className='overview' justify="space-evenly" align="stretch">
        {/* Grid figure  */}
        <Col className='overview__figure ' span={12}>
          <Row className='overview__figure__row' gutter={[20, 20]} align="stretch">
            <Col span={12} className='overview__figure__cart'>
              <CartItem background='#D9E2FF' colorIcon='#6580F0' icon={<FaUserDoctor />
              } count={availableDoctor.length} title='Total doctor' desc={
                <>
                  Doctor is working
                </>
              } href='#' />
            </Col>
            <Col span={12} className='overview__figure__cart'>
              <CartItem background='#E4F5FF' colorIcon='#48AEF2' icon={<FaCalendarAlt />

              } count={figureData.appointment?.totalToday} title='Appointment' desc={
                <>
                  {figureData.appointment?.percentChange >= 0 ? (
                    <>
                      Up <span className="text-green-500 font-bold">{figureData.appointment?.percentChange}%</span> from <br /> yesterday
                    </>
                  ) : (
                    <>
                      Down <span className="text-red-500 font-bold">{Math.abs(figureData.appointment?.percentChange)}%</span> from <br /> yesterday
                    </>
                  )}
                </>
              } href='#' />
            </Col>
            <Col span={12} className='overview__figure__cart'>
              <CartItem background='#F5E0FE' colorIcon='#F492E2' icon={<FaUsers />
              } count={figureData.patient?.totalToday} title='Total patient' desc={
                <>
                  {figureData.patient?.percentChange >= 0 ? (
                    <>
                      Up <span className="text-green-500 font-bold">{figureData.patient?.percentChange}%</span> from <br /> yesterday
                    </>
                  ) : (
                    <>
                      Down <span className="text-red-500 font-bold">{Math.abs(figureData.patient?.percentChange)}%</span> from <br /> yesterday
                    </>
                  )}
                </>
              } href='#' />
            </Col>
            <Col span={12} className='overview__figure__cart'>
              <CartItem background='#D0F2E7' colorIcon='#4EC092' icon={<LuChartNoAxesCombined />
              } count={6} title='Total revenue' desc={
                <>
                  Up <span className="text-green-500 font-bold">4.2%</span> from <br /> yesterday
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
          </div>
          <div className='revenue__chart'>
            <RevenueChart />
            {/* <DemoDualAxes /> */}
          </div>
        </Col>
        <Col span={11} className='appointment flex flex-col justify-between'>
          <Row className='flex rounded-lg'>
            <UpcomingAppointment />
          </Row>

          <div className='bg-[#fff] mt-5 rounded-lg'>
            <div className='available-doctor m-4'>
              <div className='available-doctor__header flex mb-4 border-b pb-1 justify-between w-full'>
                <div className='text-2xl font-semibold'>Available doctor today</div>
                <div>
                  <Segmented<string>
                    options={["Morning", "Afternoon"]}
                    onChange={handleChangeWorkShift}>
                  </Segmented>
                </div>
              </div>
              <div className='available-doctor__body'>
                <Carousel className='flex' draggable={true} autoplay={{ dotDuration: false }} autoplaySpeed={3000} arrows infinite={true} >
                  {filteredDoctors && filteredDoctors.map(dt => (
                    <>
                      <div>
                        <h3 style={contentStyle}>
                          <div className='flex justify-start items-center ml-10 '>
                            <div className='w-[100px] h-[100px] rounded-full overflow-hidden border-[#48AEF2] border-4'>
                              <img className='w-full h-full object-cover' src={dt.image}></img>
                            </div>
                            <div className='info ml-4 text-xl' >
                              <div className='font-semibold'>{dt.name}</div>
                              <div>Specialty: <span className='font-semibold'>General Medicine</span> </div>
                              <div>{dt.workShift.charAt(0).toUpperCase() + dt.workShift.slice(1)}</div>
                            </div>
                          </div>
                        </h3>
                      </div>
                    </>
                  ))}
                </Carousel>
              </div>
            </div>
          </div>

        </Col>
      </Row>
      {/* End Section two  */}

    </>
  )
}

export default Dashboard;