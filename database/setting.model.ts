import { model, Schema, models, Types } from "mongoose";
export interface ISetting{
  MaxPatientperDay:number,
  ExamineFee:number,
  DiseaseType:string[],
  Email:string,
  Phone:string,
  Address:string,
}

export interface ISettingDoc extends ISetting, Document {}
const SettingSchema = new Schema<ISetting>({
  MaxPatientperDay:{type: Number},
  ExamineFee:{type: Number},
  DiseaseType: {
  type: [String]},
  Email:{type: String},
  Phone:{type: String},
  Address:{type: String},
},
{timestamps: true}
);

const Setting = models?.Setting|| model<ISetting>('Setting', SettingSchema);

export default Setting

