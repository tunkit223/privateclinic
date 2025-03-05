import Link from 'next/link'
import Image from 'next/image'
import StatCard from '@/components/StatCard'
import { getRecentAppointmentList } from '@/lib/actions/appointment.action'
import DataTable from '@/components/table/DataTable'
import {columns, Payment} from '@/components/table/columns'

const Admin = async () => {

  const appointments = await getRecentAppointmentList();
  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
      <main className='admin-main'>
        <section className='w-full space-4'>
          <h1 className='header'>Welcome👋</h1>
          <p className='text-dark-700'>Start day with managing new appointments</p>
        </section>

        <section className='admin-stat'>
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
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

export default Admin