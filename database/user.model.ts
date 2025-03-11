import { model, Schema, models } from "mongoose";
export interface IUser{
  name:string;
  username:string,
  password:string,
  email:string,
  phone:number,
  image?:string,
  address?:string,
}


const UserSchema = new Schema({
  name:{ type:String, required:true},
  username: { type:String, required:true},
  email:{ type:String, required:true, unique: true},
  phone:{type:Number, required:true, unique:true},
  image:{type: String},
  address:{type: String},
  password: {type:String, required:true},
},
{timestamps: true}
);
// check xem user da ton tai chua, neu chua thi tao
const User = models?.User|| model<IUser>('User', UserSchema);

export default User

