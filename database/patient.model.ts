import { model, Schema, models } from "mongoose";
import { Types, Document } from "mongoose";
export interface IPatient{
  name:string;
  email:string,
  phone:string,  
  gender?:Gender,
  address?:string,
  birthdate:Date,
  deleted?:boolean,
  deletedAt?:Date,  
}

export interface IPatientDoc extends IPatient, Document {
  _id: Types.ObjectId; 
}

const PatientSchema = new Schema<IPatient>({
  name:{ type:String, required:true},
  email:{ type:String, required:true, unique: true},
  phone:{type:String, required:true, unique:true},
  gender:{type: String},
  address:{type: String},
  birthdate:{type:Date},
  deleted:{
    type:Boolean,
    default: false,
  },
  deletedAt:{
    type: Date,
    default: null,
  },

},
  { timestamps: true });

const Patient = models?.Patient || model<IPatient>('Patient', PatientSchema);

export default Patient

