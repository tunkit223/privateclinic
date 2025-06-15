export interface Create_EditPrescriptionPayload {
  medicalReportId: string;
  prescribeByDoctor?: string;
  details: {
    quantity: number;
    medicineId: string;
    usageMethodId?: string;
    duration: number,
    morningDosage: number,
    afternoonDosage: number,
    noonDosage: number,
    eveningDosage: number,
    price?: number;
  }[];
}

