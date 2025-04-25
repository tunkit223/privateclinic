import React, { useState } from 'react';
import { Calendar, Col, Radio, Row, Select, theme, Typography, List } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';

import 'dayjs/locale/en';
import { date } from 'zod';
import { set } from 'mongoose';


const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
  console.log(value.format('DD-MM-YYYY'), mode);
};

dayjs.extend(dayLocaleData);
dayjs.extend(updateLocale);

// Cofig for day start from Monday to Sunday
dayjs.updateLocale('en', {
  weekStart: 1,
});

const UpcomingAppoitment = () => {

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null); // Lưu ngày được chọn
  const [appointments, setAppointments] = useState([
    { date: '2025-04-22', time: '10:00 AM', description: 'Meeting with Dr. Smith', status: 'completed' },
    { date: '2025-04-22', time: '2:00 PM', description: 'Follow-up with patient John', status: 'pending' },
    { date: '2025-04-22', time: '2:00 PM', description: 'Follow-up with patient John', status: 'cancel' },
    { date: '2025-04-22', time: '2:00 PM', description: 'Follow-up with patient John', status: 'completed' },
    { date: '2025-04-22', time: '2:00 PM', description: 'Follow-up with patient John', status: 'pending' },
    { date: '2025-04-23', time: '9:00 AM', description: 'Surgery preparation', status: 'completed' },
  ]); // Dữ liệu lịch hẹn mẫu

  const filteredAppointments = selectedDate ? appointments.filter((appointment) => appointment.date === selectedDate.format('YYYY-MM-DD'))
    : [];


  const { token } = theme.useToken();

  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };


  return (
    <div style={wrapperStyle}>
      <Calendar fullscreen={false} onPanelChange={onPanelChange}
        onSelect={(date) => setSelectedDate(date)}
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
                <div className='text-[25px] font-[600]'>Upcoming appoitment</div>
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
      <div style={{ marginTop: 16 }}>
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
                    title={`${item.time}`}
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
export default UpcomingAppoitment;