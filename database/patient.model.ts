import { model, Schema, models } from "mongoose";
export interface IPatient{
  _id?:string;
  name:string;
  email:string,
  phone:number,
  gender?:Gender,
  address?:string,
  birthdate:Date,
}
const PatientSchema = new Schema({
  name:{ type:String, required:true},
  email:{ type:String, required:true, unique: true},
  phone:{type:Number, required:true, unique:true},
  gender:{type: String},
  address:{type: String},
  birthdate:{type:Date},
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
  }
});
// check xem patient da ton tai chua, neu chua thi tao
const Patient = models?.Patient|| model<IPatient>('Patient', PatientSchema);

export default Patient

