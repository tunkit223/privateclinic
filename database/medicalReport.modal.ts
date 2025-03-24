import { model, Schema, models, Types } from "mongoose";
export interface IMedicalReport{
  _id?:string,
  password:string,
  email:string,
  tag?:string,
}


const MedicalReportSchema = new Schema({
  appointmentId:{type: Types.ObjectId, ref:"Appointment", require:true},
  sympton:{type: String},
  disease:{type:String},
  
},
{timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret._id = ret._id.toString(); // Chuyển ObjectId thành string
      delete ret.__v;
      return ret;
    }
  }}
);
// check xem user da ton tai chua, neu chua thi tao
const MedicalReport = models?.MedicalReport|| model<IMedicalReport>('MedicalReport', MedicalReportSchema);

export default MedicalReport

