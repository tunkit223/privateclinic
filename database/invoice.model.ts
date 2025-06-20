import { autoGenerateCode } from "@/lib/middlewares/autoGenerateCode";
import { model, Schema, models, Types } from "mongoose";
import { number } from "zod";

export interface IInvoicePrescriptionDetail {
  medicineName: string,
  usageMethodName: string,
  duration: number,
  dosage: string,
  quantity: number,
  unit?: string,
  price?: number
}
export interface IInvoice {
  _id: Types.ObjectId,
  medicalReportId: {
    _id: Types.ObjectId;
    examinationDate: Date,
    appointmentId: {
      _id: Types.ObjectId;
      patientId: {
        _id: Types.ObjectId;
        name: string,
        phone: string,
        address: string,
        gender: string,
        birthdate: Date,
        email: string
      };
      doctor: {
        _id: Types.ObjectId;
        name: string;
        phone: string;
        email: string
      }
    }
  },
  prescriptionId?: {
    _id: Types.ObjectId;
    code?: string;
    totalPrice?: number;
    isPaid?: boolean;
    prescribeByDoctor?: {
      _id: Types.ObjectId;
      name: string
    }
    details: IInvoicePrescriptionDetail[];
  },
  code?: string,
  consultationFee: number,
  medicationFee?: number,
  totalAmount: number,
  status: string,
  paidAt?: Date,
  issueDate?: Date,
  dueDate?: Date,
  deleted?: boolean,
  deletedAt?: Date,
}

const IInvoicePrescriptionDetailSchema = new Schema<IInvoicePrescriptionDetail>({
  medicineName: { type: String, required: true },
  usageMethodName: { type: String, required: true },
  duration: { type: Number, required: true },
  dosage: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number },
  unit: { type: String },
})

// export interface IInvoiceDoc extends IInvoice, Document { }
const InvoiceSchema = new Schema<IInvoice>({
  medicalReportId: {
    _id: { type: Schema.Types.ObjectId, ref: 'MedicalReport', required: true },
    examinationDate: { type: Date, default: null },
    appointmentId: {
      _id: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
      patientId: {
        _id: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        gender: { type: String, required: true },
        birthdate: { type: Date, required: true },
        email: { type: String, required: true }
      },
      doctor: {
        _id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
      }
    }
  },
  prescriptionId: {
    _id: { type: Schema.Types.ObjectId, ref: 'Prescription' },
    code: { type: String },
    totalPrice: { type: Number },
    isPaid: { type: Boolean, default: false },
    prescribeByDoctor: {
      _id: { type: Schema.Types.ObjectId, ref: "User" },
      name: { type: String },
    },
    details: [IInvoicePrescriptionDetailSchema]
  },
  code: { type: String, unique: true, },
  consultationFee: { type: Number, require: true },
  medicationFee: { type: Number },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
    required: true
  },
  paidAt: { type: Date, default: null },
  issueDate: { type: Date, default: null },
  dueDate: { type: Date, default: null },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
},
  { timestamps: true }
);

// Middleware auto generate code, example: INV00001 for schema has field code
console.log("Register middleware autoGenerateCode for InvoiceSchema");
InvoiceSchema.pre("save", autoGenerateCode("INV", "invoice"));

const Invoice = models?.Invoice || model<IInvoice>('Invoice', InvoiceSchema);
export default Invoice






