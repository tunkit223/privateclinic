import { model, Schema, models, Types, ObjectId } from "mongoose";
export interface IMedicineType{
    name : string,
    description: string,
}

export interface IMedicineTypeDoc extends IMedicineType, Document {}

const MedicineTypeSchema = new Schema<IMedicineType>({

    name:{type: String, require:true},
    description:{type: String, require:true},
},
{timestamps:true}
);
const MedicineType = models?.MedicineType || model<IMedicineType>('MedicineType', MedicineTypeSchema);
export default MedicineType