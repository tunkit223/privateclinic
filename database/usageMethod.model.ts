import { model, Schema, models, Types, Document } from "mongoose";

export interface IUsageMethod {
  _id: Types.ObjectId;
  name: string;
  deleted?: boolean
  deletedAt?: Date
}

export interface IUsageMethodDoc extends IUsageMethod, Document {
  _id: Types.ObjectId;
}

const UsageMethodSchema = new Schema<IUsageMethod>(
  {
    name: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);


const UsageMethod = models.UsageMethod || model<IUsageMethod>("UsageMethod", UsageMethodSchema);

export default UsageMethod;
