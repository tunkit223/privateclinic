import { model, Schema, models, Types } from "mongoose";
export interface IMedicalReport{
  appointmentId: Types.ObjectId,
  diseaseId: Types.ObjectId,
  sympton:string,
}


const MedicalReportSchema = new Schema<IMedicalReport>({
  appointmentId:{type: Schema.Types.ObjectId, ref:"Appointment", require:true},
  diseaseId:{type: Schema.Types.ObjectId, ref:"disease", require:true},
  sympton:{type: String},
},
{timestamps: true}
);

const MedicalReport = models?.MedicalReport|| model<IMedicalReport>('MedicalReport', MedicalReportSchema);

export default MedicalReport
// Tạo phiếu khám bệnh thành công mới dẫn đến điền phiếu thuốc(từ phiếu thuốc sẽ có các chi tiết PKB).
