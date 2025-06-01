import { model, Schema, models, Types, Document  } from "mongoose";
export interface IWorkSchedules{
  doctor:Types.ObjectId,
  date:Date,
  shift:string,
}
export interface IWorkSchedulesDoc extends IWorkSchedules, Document {
  _id: Types.ObjectId;
}

const WorkSchedulesSchema = new Schema<IWorkSchedules>({
  doctor:{type:Schema.Types.ObjectId, ref: "User", require:true},
  date:{type:Date, required:true},
  shift:{type: String, required:true},
},
{
  timestamps: true}
);

const WorkSchedules = models?.WorkSchedules|| model<IWorkSchedules>('WorkSchedules', WorkSchedulesSchema);

export default WorkSchedules

