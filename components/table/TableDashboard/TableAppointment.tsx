
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
// import { getRecentAppointmentList } from '@/lib/actions/appointment.action'

interface DataType {
  key: string;
  name: string;
  time: Date;
  tags: string[];
}


const TableAppointment = async () => {

  // const appointments = await getRecentAppointmentList();
  // console.log(appointments.documents);

  const columns: TableProps<DataType>['columns'] = [

    {
      title: "Name",
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: "Contact",
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: "Time",
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Send message</a>
          <a>Call</a>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      time: new Date(),
      name: 'John Brown',
      tags: ['nice', 'developer'],
    },
  ];
  return (
    <>
      <Table<DataType> columns={columns} dataSource={data} />
    </>
  )
}
export default TableAppointment;