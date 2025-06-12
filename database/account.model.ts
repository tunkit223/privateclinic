import { model, Schema, models } from "mongoose";
export interface IAccount {
  password: string,
  email: string,
}

export interface IAccountDoc extends IAccount, Document { }

const AccountSchema = new Schema<IAccount>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
},
  { timestamps: true }
);
// check xem user da ton tai chua, neu chua thi tao
const Account = models?.Account || model<IAccount>('Account', AccountSchema);
export default Account
