import MedicineBatchTableClient from '@/components/table/MedicineBatchTableClient'
import NewMedicineBatchModal from '@/components/NewMedicineBacthModal'
import ImportMedicineModal from '@/components/ImportMedicineModal'

import { getMedicineList, getMedicineTypes } from '@/lib/actions/medicine.action'
import { getMedicineBatches } from '@/lib/actions/medicineBatch.action'


const MedicineImportPage = async () => {
  const [batches, medicines, types] = await Promise.all([
    getMedicineBatches(),
    getMedicineList(),
    getMedicineTypes(),
  ])
  
  const parsedBatches = batches.map((b: any) => ({
    ...b,
    _id: b._id.toString(),
    medicineId: b.medicineId.toString(),
  }))
  
  const parsedMedicines = medicines.documents.map((m: any) => ({
    ...m,
    _id: m._id.toString(),
    medicineTypeId: m.medicineTypeId.toString(),
  }))
  
  const parsedTypes = types.map((t: any) => ({
    _id: t._id.toString(),
    name: t.name,
  }))
  return (
    <div className="relative mx-auto max-w-6xl space-y-12 p-4">
      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <ImportMedicineModal />
        <NewMedicineBatchModal medicines={parsedMedicines} />
      </div>

      {/* Table hiển thị danh sách lô thuốc */}
      <MedicineBatchTableClient
        data={parsedBatches}
        medicineTypes={parsedTypes}
      />
    </div>
  )
}

export default MedicineImportPage
