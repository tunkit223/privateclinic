//Thuốc đã được kê trong đơn gồm mã PhieuKhamBenh, MaThuoc
import { model, Schema, models, Types } from "mongoose";
export interface IMedicalRPDetail{
  medicineId: Types.ObjectId,
  medicalReportId: Types.ObjectId,
  amount:number;
  usage?:Usage,
  price?:number
}

export interface IMedicalRPDetailDoc extends IMedicalRPDetail, Document {}

const MedicalRPDetailSchema = new Schema<IMedicalRPDetail>({
  medicineId: { type: Schema.Types.ObjectId, ref: "medicine", required: true },
  medicalReportId: { type: Schema.Types.ObjectId, ref: "medicalReport", required: true },
  amount:{type:Number, require:true},
  usage:{type: String},
  price:{type:Number},
},
{timestamps: true}
);

const MedicalRPDetail = models?.MedicalRPDetail|| model<IMedicalRPDetail>('MedicalRPDetail', MedicalRPDetailSchema);

export default MedicalRPDetail

