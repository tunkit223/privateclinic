import { autoGenerateCode } from "@/lib/middlewares/autoGenerateCodel";
import { model, Schema, models, Types } from "mongoose";
import { number } from "zod";
export interface IInvoice {
  _id: Types.ObjectId,
  medicalReportId: {
    _id: Types.ObjectId;
    appointmentId: {
      _id: Types.ObjectId;
      patientId: {
        _id: Types.ObjectId;
        name: string,
        phone: string,
        address: string,
        gender: string,
        birthdate: Date,
      };
      doctor: {
        _id: Types.ObjectId;
        name: string;
      }
    }
  },
  prescriptionId?: {
    _id: Types.ObjectId;
    code?: string;
    totalPrice?: number;
    isPaid: boolean;
  },
  invoiceCode: string,
  consultationFee: number,
  medicationFee?: number,
  totalAmount: number,
  status: string,
  paidAt?: Date,
  deleted?: boolean,
  deletedAt?: Date,
}

// export interface IInvoiceDoc extends IInvoice, Document { }
const InvoiceSchema = new Schema<IInvoice>({
  medicalReportId: {
    _id: { type: Schema.Types.ObjectId, ref: 'MedicalReport', required: true },
    appointmentId: {
      _id: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
      patientId: {
        _id: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        gender: { type: String, required: true },
        birthdate: { type: Date, required: true },
      },
      doctor: {
        _id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
      }
    }
  },
  prescriptionId: {
    _id: { type: Schema.Types.ObjectId, ref: 'Prescription' },
    code: { type: String },
    totalPrice: { type: Number },
    isPaid: { type: Boolean, default: false },
  },
  invoiceCode: { type: String, required: true, unique: true },
  consultationFee: { type: Number, require: true },
  medicationFee: { type: Number },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
    required: true
  },
  paidAt: { type: Date },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
},
  { timestamps: true }
);

// Middleware auto generate code, example: INV00001 for schema has field code
// console.log("Register middleware autoGenerateCode for PrescriptionSchema");
// InvoiceSchema.pre("save", autoGenerateCode("INV", "invoice"));

const Invoice = models?.Invoice || model<IInvoice>('Invoice', InvoiceSchema);
export default Invoice






