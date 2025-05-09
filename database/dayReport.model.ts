import { model, Schema, models, Types } from "mongoose";
export interface IDayReport{
  billId: Types.ObjectId,
  date:Date,
  numberPatient:number,
  revenue:number,
}

export interface IDayReportDoc extends IDayReport, Document {}
const DayReportSchema = new Schema<IDayReport>({
  billId: { type: Schema.Types.ObjectId, ref: "bill", required: true },
  date:{type:Date, required:true},
  numberPatient:{type:Number, required:true},
  revenue:{type:Number, required:true},
},
{timestamps: true}
);

const DayReport = models?.DayReport|| model<IDayReport>('DayReport', DayReportSchema);

export default DayReport

