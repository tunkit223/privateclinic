import { model, Schema, models, Types } from "mongoose";
export interface IUser{
  accountId: Types.ObjectId,
  name:string;
  username:string,
  phone:number,
  image?:string,
  role:string,
  address?:string,
}

export interface IUserDoc extends IUser, Document {}
const UserSchema = new Schema<IUser>({
  accountId: { type: Schema.Types.ObjectId, ref: "account", required: true },
  name:{ type:String, required:true},
  username: { type:String, required:true},
  phone:{type:Number, required:true, unique:true},
  role:{type: String, required: true, enum: ['admin', 'doctor', 'receptionist']},
  image:{type: String},
  address:{type: String},
},
{timestamps: true}
);

const User = models?.User|| model<IUser>('User', UserSchema);

export default User

