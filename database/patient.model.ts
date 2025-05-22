import { model, Schema, models } from "mongoose";
export interface IPatient {
  name: string;
  email: string,
  phone: number,
  gender?: Gender,
  address?: string,
  birthdate: Date,
}

export interface IPatientDoc extends IPatient, Document { }

const PatientSchema = new Schema<IPatient>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true, unique: true },
  gender: { type: String },
  address: { type: String },
  birthdate: { type: Date },
},
  { timestamps: true });

const Patient = models?.Patient || model<IPatient>('Patient', PatientSchema);

export default Patient

