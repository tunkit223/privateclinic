import { model, Schema, models, Types } from "mongoose";
export interface ISetting{
  MaxPatientperDay:number,
  ExamineFee:number
  DiseaseType:string[]
}

export interface ISettingDoc extends ISetting, Document {}
const SettingSchema = new Schema<ISetting>({
  MaxPatientperDay:{type: Number},
  ExamineFee:{type: Number},
  DiseaseType: {
  type: [String]},
},
{timestamps: true}
);

const Setting = models?.Setting|| model<ISetting>('Setting', SettingSchema);

export default Setting

