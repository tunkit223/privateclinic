import { model, Schema, models, Types } from "mongoose";
export interface IPermissions {
  UserId: Types.ObjectId,
  Right: string[],
}

export interface IPermissionsDoc extends IPermissions, Document { }

const PermissionsSchema = new Schema<IPermissions>({
  UserId: { type: Schema.Types.ObjectId, ref: "User" },
  Right:{ type: [String], default: [] },
},
  { timestamps: true }
);

const Permissions = models?.Permissions || model<IPermissions>('Permissions', PermissionsSchema);
export default Permissions
