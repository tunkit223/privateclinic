export interface Create_EditPrescriptionPayload {
  medicalReportId: string;
  prescribeByDoctor?: string;
  details: {
    quantity: number;
    medicineId: string;
    usageMethodId?: string;
    price?: number;
  }[];
}