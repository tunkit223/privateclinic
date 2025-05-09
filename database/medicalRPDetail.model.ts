//Thuốc đã được kê trong đơn gồm mã PhieuKhamBenh, MaThuoc
import { model, Schema, models, Types } from "mongoose";
export interface IMedicalRPDetail{
  medicineId: Types.ObjectId,
  medicalReportId: Types.ObjectId,
  amount:number;
  price?:number
}

export interface IIMedicalRPDetailDoc extends IMedicalRPDetail, Document {}

const MedicineReportSchema = new Schema<IMedicalRPDetail>({
  medicineId: { type: Schema.Types.ObjectId, ref: "medicine", required: true },
  medicalReportId: { type: Schema.Types.ObjectId, ref: "medicalReport", required: true },
  amount:{type:Number, require:true},
  price:{type:Number},
},
{timestamps: true}
);

const IMedicalRPDetail = models?.IMedicalRPDetail|| model<IMedicalRPDetail>('MedicineReport', MedicineReportSchema);

export default IMedicalRPDetail

