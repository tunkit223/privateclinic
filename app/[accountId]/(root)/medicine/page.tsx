import NewMedicineModal from '@/components/NewMedicineModal'
import DataTable from '@/components/table/MedicineTable'
import { columns } from '@/components/table/medicineColumns';
import { getMedicineList } from '@/lib/actions/medicine.action';
import React from 'react'


const Medicine = async () => {
  const medicine = await getMedicineList();
  return (
    
    <div className='relative mx-auto flex max-w-4xl flex-col space-y-14'>
      <div className='absolute right-0 -top-5'><NewMedicineModal/></div>
      <DataTable columns={columns} data={medicine.documents}/>   
    </div>
  )
}

export default Medicine