import { model, Schema, models, Types } from "mongoose";
export interface IBill{
  medicalReportId: Types.ObjectId,
  medicalFee:number,
  medicine:string[],
  medicineFee:number,
}

export interface IBillDoc extends IBill, Document {}
const BillSchema = new Schema<IBill>({
  medicalReportId: { type: Schema.Types.ObjectId, ref: "medicalReportId", required: true },
  medicalFee:{type:Number, require:true},
  medicineFee:{type:Number, require:true},
  medicine:{type:[String], require:true},
},
{timestamps: true}
);

const Bill = models?.Bill|| model<IBill>('Bill', BillSchema);

export default Bill

