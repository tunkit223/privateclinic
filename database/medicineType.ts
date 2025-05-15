import { model, Schema, models, Types, Document } from "mongoose";

export interface IMedicineType {
  name: string;
  description: string;
}

export interface IMedicineTypeDoc extends IMedicineType, Document {
  _id: Types.ObjectId; 
}

const MedicineTypeSchema = new Schema<IMedicineType>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);


const MedicineType =
  models.MedicineType || model<IMedicineType>("MedicineType", MedicineTypeSchema);

export default MedicineType;
