import { model, Schema, models, Types } from "mongoose";
export interface ISetting{
  MaxPatientperDay:number,
  ExamineFee:number
}

export interface ISettingDoc extends ISetting, Document {}
const SettingSchema = new Schema<ISetting>({
  MaxPatientperDay:{type: Number},
  ExamineFee:{type: Number},
},
{timestamps: true}
);

const Setting = models?.Setting|| model<ISetting>('Setting', SettingSchema);

export default Setting

