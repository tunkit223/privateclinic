"use client"
import React, { useState } from 'react';
import { Calendar, Col, Radio, Row, Select, theme, Typography, List } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';
import { getRecentAppointmentList } from '@/lib/actions/appointment.action'
import { useEffect } from 'react';
import 'dayjs/locale/en';
import "./UpcommingAppointment.scss"

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
  console.log(value.format('DD-MM-YYYY'), mode);
};

dayjs.extend(dayLocaleData);
dayjs.extend(updateLocale);

// Config for day start from Monday to Sunday
dayjs.updateLocale('en', {
  weekStart: 1,
});

type Appointment = {
  _id: string;
  patientId: { name: string };
  doctor: { name: string };
  date: string;
  reason: string;
  status: string;
  time: string;
  description: string;
};

const UpcomingAppointment = () => {

  const [appointmentsByDate, setAppointmentsByDate] = useState<Record<string, Appointment[]>>({});

  useEffect(() => {
    const fetchAppointmentList = async () => {
      const response = await getRecentAppointmentList();
      console.log("recent appoit", response)
      if (response) {
        const mappedAppointments = response.documents.map((item: Appointment) => ({
          ...item,
          date: dayjs(item.date).format('YYYY-MM-DD'),
          time: dayjs(item.date).format('h:mm A'),
          description: (
            <>
              <div>Doctor: <span className='font-bold'>{item.doctor.name}</span></div>
              <div>Patient: <span className='font-bold'>{item.patientId?.name}</span></div>
            </>
          )
        }));

        const appointmentMap: Record<string, Appointment[]> = {};
        mappedAppointments.forEach((appointment: Appointment) => {
          if (!appointmentMap[appointment.date]) {
            appointmentMap[appointment.date] = [];
          }
          appointmentMap[appointment.date].push(appointment);
        });

        setAppointmentsByDate(appointmentMap);
      }
    };
    fetchAppointmentList();
  }, [])



  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs);

  const filteredAppointments = selectedDate ? (appointmentsByDate[selectedDate.format('YYYY-MM-DD')] || []) : [];

  // console.log("filteredAppointments", filteredAppointments);
  const { token } = theme.useToken();

  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };



  const renderDateCell = (value: Dayjs) => {
    const dayAppointments = appointmentsByDate[value.format('YYYY-MM-DD')] || [];
    // Do not take duplicate elements, ex: [pending, pending, cancelled] => [pending, cancelled]
    const uniqueStatuses = Array.from(new Set(dayAppointments.map(item => item.status)));

    const limitedStatuses = uniqueStatuses.slice(0, 3);

    const statusColorMap: { [key: string]: string } = {
      pending: '#4062BB',
      confirmed: '#2E8B57',
      cancelled: '#FF4D4F',
    };

    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        {limitedStatuses.map((status, index) => (
          <span
            key={index}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: statusColorMap[status] || '#d9d9d9',
              margin: '0 2px',
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={wrapperStyle}>
      <Calendar fullscreen={false} onPanelChange={onPanelChange}
        onSelect={(date) => setSelectedDate(date)}
        cellRender={(value) => renderDateCell(value)}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          const start = 0;
          const end = 12;
          const monthOptions = [];

          let current = value.clone();
          const localeData = value.localeData();
          const months = [];
          for (let i = 0; i < 12; i++) {
            current = current.month(i);
            months.push(localeData.monthsShort(current));
          }

          for (let i = start; i < end; i++) {
            monthOptions.push(
              <Select.Option key={i} value={i} className="month-item">
                {months[i]}
              </Select.Option>,
            );
          }

          const year = value.year();
          const month = value.month();
          const options = [];
          for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
              <Select.Option key={i} value={i} className="year-item">
                {i}
              </Select.Option>,
            );
          }
          return (
            <div style={{ padding: 8 }}>
              <Row justify="space-between" align="middle">
                <div className='text-[23px] font-[600]'>Upcoming appointment</div>
                <Row gutter={[8, 8]} align="middle" justify="end">
                  <Col>
                    <Radio.Group
                      size="small"
                      onChange={(e) => onTypeChange(e.target.value)}
                      value={type}
                    >
                      <Radio.Button value="month">Month</Radio.Button>
                      <Radio.Button value="year">Year</Radio.Button>
                    </Radio.Group>
                  </Col>
                  <Col>
                    <Select
                      size="small"
                      popupMatchSelectWidth={false}
                      className="my-year-select"
                      value={year}
                      onChange={(newYear) => {
                        const now = value.clone().year(newYear);
                        onChange(now);
                      }}
                    >
                      {options}
                    </Select>
                  </Col>
                  <Col>
                    <Select
                      size="small"
                      popupMatchSelectWidth={false}
                      value={month}
                      onChange={(newMonth) => {
                        const now = value.clone().month(newMonth);
                        onChange(now);
                      }}
                    >
                      {monthOptions}
                    </Select>
                  </Col>
                </Row>
              </Row>
            </div>
          );
        }} />
      <div className='bg-[#fff] rounded-b-lg'>
        {/* <Typography.Title level={5}>
          {selectedDate ? `Appointments for ${selectedDate.format('DD-MM-YYYY')}` : 'Select a date to view appointments'}
        </Typography.Title> */}
        <List className='appointment__list'
          dataSource={filteredAppointments}
          renderItem={(item) => (
            <div className='appointment__item'>
              <div className={"appointment__item__status appointment__item__status--" + `${item.status}`}></div>
              <div className='appointment__item__content'>
                <List.Item>
                  <List.Item.Meta
                    title={`${item.time} - ${item.status}`}
                    description={item.description}
                  />
                </List.Item>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
export default UpcomingAppointment;