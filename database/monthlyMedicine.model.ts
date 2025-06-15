import { model, Schema, models, Types } from "mongoose";
export interface IMonthlyMedicine{
  billId: Types.ObjectId,
  medicines: IMedicineItem[];
}
export interface IMedicineItem {
  name: string,
  unit: string,
  quantity: number,
  numberOfUse: number,
}

const MedicineItemSchema = new Schema<IMedicineItem>(
  {
    name: { type: String, required: true },
    unit: { type: String, required: true },
    quantity: { type: Number, required: true },
    numberOfUse: { type: Number, required: true },
  },
  { _id: false }
);

export interface IMonthlyMedicineDoc extends IMonthlyMedicine, Document {}

const MonthlyMedicineSchema = new Schema<IMonthlyMedicine>({
  billId: { type: Schema.Types.ObjectId, ref: "bill", required: true },
  medicines: { type: [MedicineItemSchema], default: [] },
},
{timestamps: true}
);

const MonthlyMedicine = models?.MonthlyMedicine|| model<IMonthlyMedicine>('MonthlyMedicine', MonthlyMedicineSchema);

export default MonthlyMedicine

