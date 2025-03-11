import { model, Schema, models, Types } from "mongoose";
export interface IAppointment{
  _id?:string,
  patientId: string;
  doctor:string,
  date:Date,
  reason?:string,
  note?:string,
}
const AppointmentSchema = new Schema({
  patientId:{ type: String, ref:"Patient", required:true},
  doctor:{type:String, require:true},
  date:{type:Date, required:true},
  reason:{type: String},
  note:{type: String},
},
{
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret._id = ret._id.toString(); // Chuyển ObjectId thành string
      delete ret.__v;
      return ret;
    }
  }}
);
// check xem patient da ton tai chua, neu chua thi tao
const Appointment = models?.Appointment|| model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment

