import { columns } from '@/components/table/patientColumns';
import DataTable from '@/components/table/PatientTable';
import { getPatientList } from '@/lib/actions/patient.actions';
import React from 'react'

const PatientList = async () => {
  const patient = await getPatientList();
  console.log(patient)
  return (
    <div className='relative mx-auto flex max-w-4xl flex-col space-y-14'>

      <DataTable columns={columns} data={patient.documents} />
    </div>
  )
}

export default PatientList