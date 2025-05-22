//Thuốc đã được kê trong đơn gồm mã PhieuKhamBenh, MaThuoc
import { model, Schema, models, Types } from "mongoose";
export interface IPrescriptionDetail {
  medicineId: Types.ObjectId,
  prescriptionId: Types.ObjectId,
  name: string
  quantity: number;
  unit: string;
  usage?: string,
  price?: number
  totalPriceDetail?: number
}

export interface IPrescriptionDetailDoc extends IPrescriptionDetail, Document { }

const PrescriptionDetailSchema = new Schema<IPrescriptionDetail>({
  medicineId: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
  prescriptionId: { type: Schema.Types.ObjectId, ref: "Prescription", required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  usage: { type: String },
  price: { type: Number },
  totalPriceDetail: { type: Number }
},
  { timestamps: true }
);

const PrescriptionDetail = models?.PrescriptionDetail || model<IPrescriptionDetail>('PrescriptionDetail', PrescriptionDetailSchema);

export default PrescriptionDetail;

