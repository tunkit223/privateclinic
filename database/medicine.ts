import { model, Schema, models, Types, ObjectId } from "mongoose";
export interface IMedicine{
  name:string,
  unit:string,
  amount:number,
  usage?:string,
  price:number,
}

export interface IMedicineDoc extends IMedicine, Document {}

const MedicineSchema = new Schema<IMedicine>({
  name:{type: String, require:true},
  unit:{type: String, require:true},
  amount:{type:Number, require:true},
  usage:{type: String},
  price:{type:Number, require:true} 
},
{timestamps: true}
);
const Medicine = models?.Medicine|| model<IMedicine>('Medicine', MedicineSchema);

export default Medicine

