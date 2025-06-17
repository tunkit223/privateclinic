import NewemployeeModal from '@/components/NewemployeeModal'
import DataTable from '@/components/table/userTable'
import { columns } from '@/components/table/userColumns'
import { getEmployeesList } from '@/lib/actions/employees.action'
import React from 'react'

const employee = async () => {
   const employees = await getEmployeesList();
  return (
    <div className='relative mx-auto flex max-w-4xl flex-col space-y-14'>
    
      <DataTable columns={columns} data={employees.documents}/>   
    </div>
  )
}

export default employee