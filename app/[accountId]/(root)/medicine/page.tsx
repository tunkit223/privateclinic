import NewMedicineModal from '@/components/NewMedicineModal'
import MedicineTableClient from '@/components/table/MedicineTableClient'  // client wrapper
import { getMedicineList, getMedicineTypes } from '@/lib/actions/medicine.action';

const Medicine = async () => {
  const medicine = await getMedicineList();
  const medicineTypes = await getMedicineTypes();

  // Chuyển _id về string để tránh lỗi so sánh ObjectId với string
  const parsedTypes = medicineTypes.map((t: any) => ({
    _id: t._id.toString(),
    name: t.name,
  }));

  return (
    <div className='relative mx-auto flex max-w-4xl flex-col space-y-14'>
      <MedicineTableClient data={medicine.documents} medicineTypes={parsedTypes} />
    </div>
  )
}

export default Medicine;
