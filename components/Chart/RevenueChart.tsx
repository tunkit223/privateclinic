import { Column } from '@ant-design/plots';
import React, { useEffect, useState } from 'react';


const RevenueChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://gw.alipayobjects.com/os/antfincdn/iPY8JFnxdb/dodge-padding.json')
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const config = {
    data,
    xField: '月份',
    yField: '月均降雨量',
    colorField: 'name',
    group: true,

    style: {
      inset: 5,
    },
    slider: {
      x: {
        values: [0.1, 0.8],
      },
    },
  };

  return <Column {...config} />;
};

export default RevenueChart;

