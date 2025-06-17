import { model, Schema, models, Types, Document } from "mongoose";
export interface IAppointment {
  patientId: Types.ObjectId;
  doctor: Types.ObjectId,
  date: Date,
  reason?: string,
  note?: string,
  status: Status,
  cancellationReason?: string
  deleted?: boolean,
  deletedAt?: Date
}
export interface IAppointmentDoc extends IAppointment, Document {
  _id: Types.ObjectId;
}

const AppointmentSchema = new Schema<IAppointment>({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  doctor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  reason: { type: String },
  note: { type: String },
  status: { type: String },
  cancellationReason: { type: String },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
},
  {
    timestamps: true
  }
);

const Appointment = models?.Appointment || model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment

