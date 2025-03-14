import Link from 'next/link'
import Image from 'next/image'
import StatCard from '@/components/StatCard'
import { getRecentAppointmentList } from '@/lib/actions/appointment.action'
import DataTable from '@/components/table/DataTable'
import {columns} from '@/components/table/columns'

const appointments = async () => {

  const appointments = await getRecentAppointmentList();
  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
      <main className='admin-main'>
        <section className='admin-stat'>
          <StatCard
            type="appointments"
            count={appointments.finishedCount}
            label="Finished appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

         <DataTable columns={columns} data={appointments.documents}/>   
       
      </main>
    </div>
  )
}

export default appointments