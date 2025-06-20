import { model, Schema, models, Types } from "mongoose";
import Invoice from "./invoice.model";
import Prescription from "./prescription.model";
import { IAccount } from "./account.model";
import { getPrescriptionDetailsById } from "@/lib/actions/prescription.action";
import { getLatestSetting } from "@/lib/actions/setting.action";

const AccountSchema = new Schema<IAccount>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
},
  { timestamps: true }
);
const Account = models?.Account || model<IAccount>('Account', AccountSchema);

export interface IMedicalReport {
  _id: Types.ObjectId,
  appointmentId: {
    _id: Types.ObjectId;
    date: Date,
    patientId: {
      _id: Types.ObjectId;
      name: string,
      phone: string,
      address: string,
      gender: string,
      birthdate: Date
      email: string
    };
    doctor: {
      _id: Types.ObjectId,
      name: string,
      phone: string,
      accountId: {
        _id: Types.ObjectId,
        email: string
      }
    }
  },
  examinationDate?: Date,
  diseaseType?: string,
  symptom?: string,
  status: MedicalStatus,
  deleted?: boolean,
  deletedAt?: Date
}


const MedicalReportSchema = new Schema<IMedicalReport>({
  appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
  examinationDate: { type: Date, default: null },
  diseaseType: { type: String },
  symptom: { type: String },
  status: { type: String, required: true },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
},
  { timestamps: true }
);
// Middleware create invoice automatically
MedicalReportSchema.post('save', async function (doc: IMedicalReport) {

  if (doc && doc.status === 'examined') {
    console.log("doc", doc)
    try {
      // Check existing Invoice
      const existingInvoice = await Invoice.findOne({ 'medicalReportId._id': doc._id });
      if (existingInvoice) {
        console.log(`Invoice already exists for MedicalRp ${doc._id}`);
        return;
      }

      // Get data medicalReport
      const medicalReport = await model<IMedicalReport>('MedicalReport')
        .findById(doc._id)
        .populate({
          path: 'appointmentId',
          populate: [
            { path: 'patientId' },
            {
              path: 'doctor',
              populate: {
                path: 'accountId',
                model: 'Account'
              }
            }
          ]
        });

      if (!medicalReport) {
        throw new Error('MedicalRP not found');
      }

      // Find prescription
      const prescription = await Prescription.findOne({ 'medicalReportId._id': doc._id });
      // console.log("pre", prescription)
      // const prescriptionDetail = await getPrescriptionDetailsById(prescription._id);

      const settingFee = await getLatestSetting();
      const consultationFee = settingFee.ExamineFee;
      let medicationFee = 0;
      let prescriptionData = null;
      if (prescription) {
        // Get all PrescriptionDetail relevant with prescription
        const prescriptionDetails = await getPrescriptionDetailsById(prescription._id);
        console.log("pres detail", prescriptionDetails)

        medicationFee = prescription.totalPrice || 0;
        prescriptionData = {
          _id: prescription._id,
          code: prescription.code,
          totalPrice: prescription.totalPrice,
          isPaid: prescription.isPaid,
          prescribeByDoctor: prescription.prescribeByDoctor ? {
            _id: prescription.prescribeByDoctor._id,
            name: prescription.prescribeByDoctor.name,
          } : undefined,
          details: prescriptionDetails.map((detail: any) => ({
            medicineName: detail.medicineId.name,
            usageMethodName: detail.usageMethodId.name,
            duration: detail.duration,
            dosage: `Morning: ${detail.morningDosage}, Noon: ${detail.noonDosage}, Afternoon: ${detail.afternoonDosage}, Evening: ${detail.eveningDosage}`,
            quantity: detail.quantity,
            price: detail.price,
            unit: detail.medicineId.unit || "N/A"
          }))
        }
      }

      const issueDate = new Date();
      const dueDate = new Date(issueDate);
      dueDate.setDate(issueDate.getDate() + 30);

      // Create invoice
      const invoice = new Invoice({
        medicalReportId: {
          _id: medicalReport._id,
          examinationDate: medicalReport?.examinationDate,
          appointmentId: {
            _id: medicalReport.appointmentId._id,
            patientId: {
              _id: medicalReport.appointmentId.patientId._id,
              name: medicalReport.appointmentId.patientId.name,
              phone: medicalReport.appointmentId.patientId.phone,
              address: medicalReport.appointmentId.patientId.address,
              gender: medicalReport.appointmentId.patientId.gender,
              birthdate: medicalReport.appointmentId.patientId.birthdate,
              email: medicalReport.appointmentId.patientId.email
            },
            doctor: {
              _id: medicalReport.appointmentId.doctor._id,
              name: medicalReport.appointmentId.doctor.name,
              phone: medicalReport.appointmentId.doctor.phone,
              email: medicalReport.appointmentId.doctor.accountId.email
            }
          },
          diseaseType: medicalReport.diseaseType,
          symptom: medicalReport.symptom,
          status: medicalReport.status
        },
        prescriptionId: prescriptionData,
        consultationFee,
        medicationFee,
        totalAmount: consultationFee + medicationFee,
        // code: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        issueDate,
        dueDate
      });
      console.log("invoice before saving", invoice)
      await invoice.save();
      console.log(`Invoice created for MedicalReport ${doc._id}`)

    } catch (error) {
      console.log("Error create invoice automatically", error);
    }
  }
})

const MedicalReport = models?.MedicalReport || model<IMedicalReport>('MedicalReport', MedicalReportSchema);

export default MedicalReport
