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
  totalValue?: number; // Tổng giá trị của lô thuốc, có thể tính từ importQuantity và price của medicine
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
  totalValue: { type: Number,required: true ,default: 0 }, 
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
