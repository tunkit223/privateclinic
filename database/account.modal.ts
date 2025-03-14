import { model, Schema, models } from "mongoose";
export interface IAccount{
  _id?:string,
  password:string,
  email:string,
  tag?:string,
}


const AccountSchema = new Schema({
  email:{ type:String, required:true, unique: true},
  password: {type:String, required:true},
  tag:{type:String, required:true}
},
{timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret._id = ret._id.toString(); // Chuyển ObjectId thành string
      delete ret.__v;
      return ret;
    }
  }}
);
// check xem user da ton tai chua, neu chua thi tao
const Account = models?.Account|| model<IAccount>('Account', AccountSchema);

export default Account

