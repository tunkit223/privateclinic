import { model, Schema, models, Types, ObjectId, Document} from "mongoose";
export interface IMedicine{
  medicineTypeId: Types.ObjectId,
  name:string,
  unit:string,
  amount:number,
  price:number,
}

export interface IMedicineDoc extends IMedicine, Document {}

const MedicineSchema = new Schema<IMedicine>({
  medicineTypeId: { type: Schema.Types.ObjectId, ref: "MedicineType", required: true },
  name:{type: String, require:true},
  unit:{type: String, require:true},
  amount:{type:Number, require:true},
  price:{type:Number, require:true} 
},
{timestamps: true}
);
const Medicine = models?.Medicine|| model<IMedicine>('Medicine', MedicineSchema);

export default Medicine

