import { model, Schema, models, Types } from "mongoose";
export interface IUser{
  _id?:string,
  accountId: string,
  name:string;
  username:string,
  phone:number,
  image?:string,
  address?:string,
}


const UserSchema = new Schema({
  accountId: { type: Types.ObjectId, ref: "account", required: true },
  name:{ type:String, required:true},
  username: { type:String, required:true},
  phone:{type:Number, required:true, unique:true},
  image:{type: String},
  address:{type: String},
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
const User = models?.User|| model<IUser>('User', UserSchema);

export default User

