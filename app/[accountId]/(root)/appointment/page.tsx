

import { getRecentAppointmentList } from '@/lib/actions/appointment.action'
import DataTable from '@/components/table/DataTable'
import { columns } from '@/components/table/columns'



const appointments = async () => {

  const appointments = await getRecentAppointmentList();

  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
      <main className='admin-main'>
        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  )
}

export default appointments