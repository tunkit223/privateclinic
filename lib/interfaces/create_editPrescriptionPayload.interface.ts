export interface Create_EditPrescriptionPayload {
  medicalReportId: string;
  prescribeByDoctor?: string;
  details: {
    name: string;
    quantity: number;
    medicineId: string;
    unit: string;
    usage?: string;
    price?: number;
  }[];
}