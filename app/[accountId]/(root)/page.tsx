"use client";

import React, { useEffect, useRef, useState } from 'react';
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
import { getExpenseFromDatetoDate } from '@/lib/actions/medicineBatch.action';
import type { DatePickerProps } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Printer } from 'lucide-react';
import html2canvas from 'html2canvas';


const { RangePicker } = DatePicker;

type AvailableDoctor = {
  name: string;
  image: string;
  workShift: string;
  _id: string
}

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

type RevenueAndExpense = {
  date: string;
  value: number;
  type: string;
}


const Dashboard = () => {

  const defaultEnd = dayjs();
  const defaultStart = dayjs().subtract(7, 'day');

  const [dateRangeRevenue, setDateRangeRevenue] = useState<[Dayjs, Dayjs] | null>([defaultStart, defaultEnd]);
  const [fromDate, setFromDate] = useState<Date>(defaultStart.toDate());
  const [toDate, setToDate] = useState<Date>(defaultEnd.toDate());

  const [dateRangePatient, setDateRangePatient] = useState<[Dayjs, Dayjs] | null>([defaultStart, defaultEnd]);
  const [genderData, setGenderData] = useState<any[]>([]);
  const [availableDoctor, setAvailableDoctor] = useState<AvailableDoctor[]>([]);
  const [selectShift, setSelectShift] = useState<string>("Morning");

  const [revenueData, setRevenueData] = useState<RevenueAndExpense[]>([]);
  const [expenseData, setExpenseData] = useState<RevenueAndExpense[]>([]);
  const [revenueFigure, setRevenueFigure] = useState<{
    totalToday: number;
    totalYesterday: number;
    percentChange: number;
  } | null>(null);

  const [figureData, setFigureData] = useState<{
    appointment: any;
    patient: any;
  }>({
    appointment: null,
    patient: null,
  });

  const [chartImages, setChartImages] = useState<{
    revenue: string | null;
    gender: string | null;
  }>({
    revenue: null,
    gender: null,
  });


  // Print
  const revenueChartRef = useRef<HTMLDivElement>(null);
  const genderChartRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);


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

  // Fetch revenue data
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

          const today = dayjs().format('DD/MM/YYYY');
          const yesterday = dayjs().subtract(1, 'day').format('DD/MM/YYYY');

          const totalToday = json.data
            .filter((item: RevenueAndExpense) => item.date === today)
            .reduce((sum: number, item: RevenueAndExpense) => sum + item.value, 0);

          const totalYesterday = json.data
            .filter((item: RevenueAndExpense) => item.date === yesterday)
            .reduce((sum: number, item: RevenueAndExpense) => sum + item.value, 0);

          const percentChange = totalYesterday !== 0
            ? ((totalToday - totalYesterday) / totalYesterday) * 100
            : totalToday > 0
              ? 100
              : 0;
        } else {
          console.error("Failed to get revenue:", json.error);
        }

      } catch (error) {
        console.log("Error fetch revenue:", error);
      }
    };
    fetchRevenue();
  }, [fromDate, toDate]);
  // console.log("Rev", revenueData)

  // Fetch data for Gender chart
  useEffect(() => {
    const fetchGenderData = async () => {
      if (!dateRangePatient || !dateRangePatient[0] || !dateRangePatient[1]) return;

      try {
        const data = await getPatientByDateRange(
          dateRangePatient[0].toDate(),
          dateRangePatient[1].toDate()
        );
        // console.log("Patient by gender:", data);
        setGenderData(data);
      } catch (err) {
        console.error("Error fetch patient by gender", err);
      }
    };

    fetchGenderData();
  }, [dateRangePatient]);
  console.log("pt", genderData)
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

  // Fetch figure
  useEffect(() => {
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

        setFigureData({
          appointment,
          patient,
        });
      } catch (err) {
        console.error("Error fetch patient by gender", err);
      }
    };
    fetchFigure();
  }, []);

  // Figure revenue



  // handle change range picker of patient gender
  const handleChangeRangePickerPatient: RangePickerProps['onChange'] = (dates) => {
    setDateRangePatient(dates as [Dayjs, Dayjs]);
  };

  // handle change work shift
  const handleChangeWorkShift = (value: string) => {
    setSelectShift(value)
  }
  // console.log(handleChangeWorkShift);

  const filteredDoctors = availableDoctor.filter(dt => dt.workShift.toLowerCase() === selectShift.toLowerCase());

  // handle change range picker of revenue
  const handleChangeRangePickerRevenue: RangePickerProps['onChange'] = (dates) => {
    if (!dates || !dates[0] || !dates[1]) return;
    setDateRangeRevenue(dates as [Dayjs, Dayjs]);
    setFromDate(dates[0].toDate());
    setToDate(dates[1].toDate());
  };
  // console.log('Revenue Chart Image:', chartImages.revenue);

  // Capture for print
  useEffect(() => {
    const captureCharts = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const revenueCanvas = revenueChartRef.current
          ? await html2canvas(revenueChartRef.current, {
            scale: 2,
            useCORS: true,
            logging: true,
            backgroundColor: '#fff',
            width: revenueChartRef.current.offsetWidth,
            height: revenueChartRef.current.offsetHeight,
          })
          : null;
        const genderCanvas = genderChartRef.current
          ? await html2canvas(genderChartRef.current, {
            scale: 2,
            useCORS: true,
            logging: true,
            backgroundColor: '#fff',
            width: genderChartRef.current.offsetWidth,
            height: genderChartRef.current.offsetHeight,
          })
          : null;

        setChartImages({
          revenue: revenueCanvas ? revenueCanvas.toDataURL('image/png') : null,
          gender: genderCanvas ? genderCanvas.toDataURL('image/png') : null,
        });
      } catch (error) {
        console.error('Error capturing charts:', error);
      }
    };

    // Only capture when data and refs are ready
    if (genderData.length > 0 && revenueChartRef.current && genderChartRef.current) {
      captureCharts();
    }
  }, [genderData, fromDate, toDate]);




  const combineData = (revenueData: any[], patientData: any[]): any[] => {
    const totalRevenue = revenueData.reduce((sum, rev) => sum + rev.value, 0)
    return revenueData.map((rev, index) => {
      const patient = patientData.find(p => p.date === rev.date);
      const rate = totalRevenue !== 0 ? ((rev.value / totalRevenue) * 100).toFixed(2) : '0.00';

      return {
        date: rev.date,
        revenue: rev.value,
        patient: patient ? patient.male + patient.female : 0,
        rate: `${rate}%`,
      };
    });
  };

  const handlePrint = async () => {
    if (!chartImages.revenue || !chartImages.gender) {
      alert('Charts are not fully loaded. Please wait a moment and try again.');
      return;
    }

    const printWindow = window.open('', '', 'width=1200,height=800');
    if (!printWindow) {
      alert('Please allow pop-ups for this site to enable printing.');
      return;
    }

    // Create a new document instead of using document.write
    const doc = printWindow.document;
    doc.open();
    doc.write('<!DOCTYPE html><html><head><title>Dashboard Report</title></head><body></body></html>');
    doc.close();

    // Append content to the body
    const body = doc.body;
    const container = doc.createElement('div');

    const combinedData = combineData(revenueData, genderData);
    // console.log("data", combinedData)


    // Create HTML for table with data
    const tableRows = combinedData.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.date}</td>
        <td>${item.patient}</td>
        <td>${item.revenue.toLocaleString()}</td>
        <td>${item.rate}</td>
      </tr>
    `).join('')
    container.innerHTML = `<style>
        body { 
          font-family: Arial, sans-serif; 
          padding: 30px; 
          max-width: 1100px; 
          margin: 0 auto; 
        }
        h2 { 
          text-align: center; 
          margin-bottom: 30px; 
          font-size: 24px; 
        }
        .section { 
          margin-bottom: 50px; 
        }
        .info-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
        }
        .info-table td, .info-table th {
          border: 1px solid #ddd;
          padding: 10px;
          font-size: 14px;
        }
        .info-table th {
          background-color: #f2f2f2;
          text-align: left;
          font-weight: bold;
        }
        img { 
          width: 100%; 
          height: auto; 
          display: block; 
          max-width: 1000px; 
          margin: 0 auto; 
        }
      </style>
      <h2>Revenue Report for ${selectedMonth?.format("MMMM")}</h2>
      <h2></h2>
      <div class="section">
        <h3>Statistics Table</h3>
        <table class="info-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Date</th>
              <th>Patient quantity</th>
              <th>Revenue</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
           ${tableRows}
          </tbody>
        </table>
      </div>
      <div class="section">
        <h3>Revenue Chart</h3>
        <img src="${chartImages.revenue}" alt="Revenue Chart" />
      </div>
      <div class="section">
        <h3>Patients by Gender</h3>
        <img src="${chartImages.gender}" alt="Patients by Gender" />
      </div>
    `;
    body.appendChild(container);

    printWindow.focus();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
    printWindow.print();
  };

  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(null)
  const handleChangePickerReport = (date: Dayjs) => {
    if (!date) return;
    const start = date.startOf('month');
    const end = date.endOf('month');
    setDateRangeRevenue([start, end]);
    setFromDate(start.toDate());
    setToDate(end.toDate());
    setDateRangePatient([start, end]);
    setSelectedMonth(date);
  }
  const combinedData = combineData(revenueData, genderData);

  return (
    <>

      <div className='mb-5 flex justify-end mr-5'>
        <DatePicker inputReadOnly className='mr-5'
          picker='month' format={"MM-YYYY"}
          onChange={handleChangePickerReport}
        />
        <Button type='primary' disabled={!chartImages.revenue || !chartImages.gender || !selectedMonth}
          icon={<DownloadOutlined />} onClick={handlePrint} >
          Export Report
        </Button>
      </div>
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
              } count={revenueFigure ? revenueFigure.totalToday : 0} title='Total revenue' desc={
                <>
                  {revenueFigure && revenueFigure.percentChange >= 0 ? (
                    <>
                      Up <span className="text-green-500 font-bold">{revenueFigure?.percentChange}%</span> from <br /> yesterday
                    </>
                  ) : (
                    <>
                      Down <span className="text-red-500 font-bold">{revenueFigure?.percentChange}%</span> from <br /> yesterday
                    </>
                  )}
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
              <RangePicker format="DD/MM/YYYY" value={dateRangePatient} onChange={handleChangeRangePickerPatient} />
            </div>
          </div>
          <div className='overview__gender__content' ref={genderChartRef}>
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
            <RangePicker
              className='mr-5'
              format="DD/MM/YYYY"
              value={dateRangeRevenue}
              onChange={handleChangeRangePickerRevenue}
            />
          </div>
          <div className='revenue__chart' ref={revenueChartRef}>
            <RevenueChart fromDate={fromDate} toDate={toDate} revenueData={revenueData} expenseData={expenseData} />
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
                  ))}
                </Carousel>
              </div>
            </div>
          </div>

        </Col>
      </Row>
      {/* End Section two  */}


      {/* Hidden print content */}
      <div ref={printRef} style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }}>
        <div className="section">
          <h3>Revenue Chart</h3>
          <div className="revenue__chart">
            <RevenueChart revenueData={revenueData} expenseData={expenseData} fromDate={fromDate} toDate={toDate} />
          </div>
        </div>
        <div className="section">
          <h3>Patients by Gender</h3>
          <div className="overview__gender__content"  >
            <PatientByGender data={genderData} />
          </div>
        </div>
        <div className="section">
          <h3>Statistics Table</h3>
          <table className="info-table">
            <thead>
              {combinedData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.date}</td>
                  <td>{item.patient}</td>
                  <td>{item.revenue.toLocaleString()}</td>
                  <td>{item.rate}</td>
                </tr>
              ))}
            </thead>
          </table>
        </div>
      </div>
    </>
  )
}

export default Dashboard;