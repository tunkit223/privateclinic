import { model, Schema, models, Types } from "mongoose";
export interface IMedicalReport {
  appointmentId: Types.ObjectId,
  diseaseType?: Diseasetype,
  symptom?:string,
  status:MedicalStatus,

}


const MedicalReportSchema = new Schema<IMedicalReport>({
  appointmentId:{type: Schema.Types.ObjectId, ref:"Appointment", required:true},
  diseaseType:{type: String},
  symptom:{type: String},
  status:{type: String, required:true},
},
  { timestamps: true }
);

const MedicalReport = models?.MedicalReport || model<IMedicalReport>('MedicalReport', MedicalReportSchema);

export default MedicalReport
// Tạo phiếu khám bệnh ban đầu với status là chưa khám, sau đó sẽ update dần và có 1 button chuyển thành examined
