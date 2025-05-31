//HosoBenhNhan được lập sau khi lập phiếu khám bệnh
import { model, Schema, models, Types } from "mongoose";
export interface IPatientReport {
  patientId: Types.ObjectId,
  medicalReportId: Types.ObjectId,
}

export interface IPatientReportDoc extends IPatientReport, Document { }

const PatientReportSchema = new Schema<IPatientReport>({
  patientId: { type: Schema.Types.ObjectId, ref: "patient", required: true },
  medicalReportId: { type: Schema.Types.ObjectId, ref: "medicalReport", required: true },
},
  { timestamps: true }
);

const PatientReport = models?.PatientReport || model<IPatientReport>('PatientReport', PatientReportSchema);

export default PatientReport

