
import { columns } from '@/components/table/MedicalReportColumn';
import DataTable from '@/components/table/MedicalReportTable';

import { getAllMedicalReports } from '@/lib/actions/medicalReport.action'


const medicalreport = async () => {

  const medicalreports =  await getAllMedicalReports();
  return (
    <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
        <DataTable columns={columns} data={medicalreports} />

    </div>
  )
}

export default medicalreport