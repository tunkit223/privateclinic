import { model, Schema, models, Types } from "mongoose";
export interface IPrescriptionDetail {
  medicineId: Types.ObjectId,
  prescriptionId: Types.ObjectId,
  usageMethodId: Types.ObjectId,
  duration: number;
  morningDosage: number,
  afternoonDosage: number,
  noonDosage: number,
  eveningDosage: number,
  quantity: number;
  price?: number
  deleted?: boolean,
  deletedAt?: Date,
}

export interface IPrescriptionDetailDoc extends IPrescriptionDetail, Document { }

const PrescriptionDetailSchema = new Schema<IPrescriptionDetail>({
  medicineId: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
  prescriptionId: { type: Schema.Types.ObjectId, ref: "Prescription", required: true },
  usageMethodId: { type: Schema.Types.ObjectId, ref: "UsageMethod", required: true },
  duration: { type: Number, required: true },
  quantity: { type: Number, required: true },
  morningDosage: { type: Number, required: true },
  afternoonDosage: { type: Number, required: true },
  noonDosage: { type: Number, required: true },
  eveningDosage: { type: Number, required: true },
  price: { type: Number },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
},
  { timestamps: true }
);

const PrescriptionDetail = models?.PrescriptionDetail || model<IPrescriptionDetail>('PrescriptionDetail', PrescriptionDetailSchema);

export default PrescriptionDetail;

