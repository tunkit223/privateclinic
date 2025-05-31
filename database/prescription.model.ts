import { autoGenerateCode } from "@/lib/middlewares/autoGenerateCodel";
import { model, Schema, models, Types, Document } from "mongoose";

export interface IPrescription {
  _id: Types.ObjectId;
  medicalReportId: {
    _id: Types.ObjectId;
    appointmentId: {
      _id: Types.ObjectId;
      doctor: string;
      patientId: {
        _id: Types.ObjectId;
        name: string;
      }
    }
  }
  prescribeByDoctor: {
    _id: Types.ObjectId;
    name: string;
  }
  isPaid?: boolean,
  totalPrice?: number,
  code?: string,
  deleted?: boolean,
  deletedAt?: Date,
}
export interface IPrescriptionDoc extends IPrescription, Document {
  _id: Types.ObjectId;
}

const PrescriptionSchema = new Schema<IPrescription>({

  medicalReportId: { type: Schema.Types.ObjectId, ref: "MedicalReport", required: true },
  prescribeByDoctor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isPaid: { type: Boolean, default: false },
  totalPrice: { type: Number, },
  code: { type: String, unique: true },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
},
  {
    timestamps: true
  }
);

// Middleware auto generate code, example: Rx000001 for schema has field code
console.log("Đăng ký middleware autoGenerateCode cho PrescriptionSchema");

PrescriptionSchema.pre("save", autoGenerateCode("Rx", "prescription"));
const Prescription = models?.Prescription || model<IPrescription>('Prescription', PrescriptionSchema);

export default Prescription

