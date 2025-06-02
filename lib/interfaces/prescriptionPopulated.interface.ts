import { IMedicine } from "@/database/medicine";
import { IPrescriptionDetail } from "@/database/prescriptionDetail.model";
import { IUsageMethod } from "@/database/usageMethod.model";

export interface IPrescriptionDetailPopulated extends Omit<IPrescriptionDetail, 'medicineId' | 'usageMethodId'> {
  medicineId: IMedicine;
  usageMethodId: IUsageMethod;
}