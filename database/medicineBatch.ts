import { model, Schema, models, Types, Document } from "mongoose";
export type Status = 'importing' | 'imported'
export interface IMedicineBatch {
    _id: Types.ObjectId | string;
  medicineId: Types.ObjectId;    
  importQuantity: number;            
  importDate: Date;                  
  status: Status  
  expiryDate?: Date | null;         
  note?: string | null;  
  deleted?: boolean,
  deletedAt?: Date,            
}

export interface IMedicineBatchDoc extends IMedicineBatch, Document {
  _id: Types.ObjectId;
}

const MedicineBatchSchema = new Schema<IMedicineBatch>({
  medicineId: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
  importQuantity: { type: Number, required: true },
  importDate: { type: Date, required: true, default: () => new Date() },
  status: { 
    type: String, 
    required: true, 
    enum: ['importing', 'imported'], 
    default: 'importing' 
  },
  expiryDate: { type: Date, default: null },
  note: { type: String, default: null },
  deleted:{
    type:Boolean,
    default: false,
  },
  deletedAt:{
    type: Date,
    default: null,
  },
}, { timestamps: true });

const MedicineBatch = models?.MedicineBatch || model<IMedicineBatch>('MedicineBatch', MedicineBatchSchema);

export default MedicineBatch;
