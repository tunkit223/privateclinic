import { model, Schema, models, Types, ObjectId, Document } from "mongoose";
export interface IMedicine {
  medicineTypeId: Types.ObjectId,
  name: string,
  unit: string,
  amount: number,
  price: number,
  deleted?: boolean,
  deletedAt?: Date,
}

export interface IMedicineDoc extends IMedicine, Document { 
  _id:Types.ObjectId;
}

const MedicineSchema = new Schema<IMedicine>({
  medicineTypeId: { type: Schema.Types.ObjectId, ref: "MedicineType", required: true },
  name: { type: String, require: true },
  unit: { type: String, require: true },
  amount: { type: Number, require: true },
  price: { type: Number, require: true },
  deleted:{
    type:Boolean,
    default: false,
  },
  deletedAt:{
    type: Date,
    default: null,
  },
},
  { timestamps: true }
);
// check xem user da ton tai chua, neu chua thi tao
const Medicine = models?.Medicine || model<IMedicine>('Medicine', MedicineSchema);

export default Medicine

