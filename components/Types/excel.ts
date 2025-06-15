export type ExcelRow = {
  medicineName: string
  importQuantity: number
  importDate?: string | Date
  expiryDate?: string | Date
  note?: string
}

export type StatusInfo = {
  color: string;
  icon: React.ReactNode;
};


