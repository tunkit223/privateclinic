import { model, Schema, models, Types, ObjectId } from "mongoose";
export interface IMedicine{
  _id:Types.ObjectId,
  name:string,
  unit:string,
  amount:string,
  price:string,
}


const MedicineSchema = new Schema({
  name:{type: String, require:true},
  unit:{type: String, require:true},
  amount:{type:Number, require:true},
  price:{type:Number, require:true} 
},
{timestamps: true}
);
// check xem user da ton tai chua, neu chua thi tao
const Medicine = models?.Medicine|| model<IMedicine>('Medicine', MedicineSchema);

export default Medicine

