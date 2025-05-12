import NewMedicineTypeModal from '@/components/NewMedicineTypeModal'
import DataTable from '@/components/table/MedicineTable'
import { columns } from '@/components/table/MedicineTypeColumn';
import {getMedicineTypeList } from '@/lib/actions/medicineType.action';
import React from 'react'


const MedicineType = async () => {
  const medicineType = await getMedicineTypeList();
  return (
    
    <div className='relative mx-auto flex max-w-4xl flex-col space-y-14'>
      <div className='absolute right-0 -top-5'><NewMedicineTypeModal/></div>
      <DataTable columns={columns} data={medicineType.documents}/>   
    </div>
  )
}

export default MedicineType