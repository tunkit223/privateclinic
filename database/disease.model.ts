import { model, Schema, models, Types } from "mongoose";
export interface IDisease{
  diseaseType:string;
}

export interface IDiseaseDoc extends IDisease, Document {}
const DiseaseSchema = new Schema<IDisease>({
  diseaseType:{type: String, require:true},
},
{timestamps: true}
);

const Disease = models?.Disease|| model<IDisease>('Disease', DiseaseSchema);

export default Disease

