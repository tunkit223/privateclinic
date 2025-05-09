import { model, Schema, models, Types } from "mongoose";
export interface IMonthReport{
  DayReportId: Types.ObjectId[],
  rate:number,
}

export interface IMonthReportDoc extends IMonthReport, Document {}
const MonthReportSchema = new Schema<IMonthReport>({
  DayReportId: { type: [Schema.Types.ObjectId], ref: "bill", required: true },
  rate:{type:Number, required:true},
},
{timestamps: true}
);

const MonthReport = models?.MonthReport|| model<IMonthReport>('MonthReport', MonthReportSchema);

export default MonthReport

