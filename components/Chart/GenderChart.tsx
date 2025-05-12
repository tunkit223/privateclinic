import { Column } from '@ant-design/plots';
import React from 'react';

const DemoColumn = () => {
  const config = {
    data: {
      type: 'fetch',
      value: 'https://gw.alipayobjects.com/os/antfincdn/iPY8JFnxdb/dodge-padding.json',
    },
    xField: '月份',
    yField: '月均降雨量',
    colorField: 'name',
    group: true,
    style: {
      inset: 5,

    },
    slider: {
      x: {
        values: [0.1, 0.2],
      },
    },
  };
  return <Column {...config} />;
};
export default DemoColumn;