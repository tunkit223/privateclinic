import { model, Schema, models, Types } from "mongoose";
export interface IAppointment{
  patientId: Types.ObjectId;
  doctor:string,
  date:Date,
  reason?:string,
  note?:string,
  status:Status,
  cancellationReason?:string
}
export interface IAppointmentDoc extends IAppointment, Document {}

const AppointmentSchema = new Schema<IAppointment>({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  doctor:{type:String, require:true},
  date:{type:Date, required:true},
  reason:{type: String},
  note:{type: String},
  status:{type:String},
  cancellationReason:{type:String}
},
{
  timestamps: true}
);

const Appointment = models?.Appointment|| model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment

