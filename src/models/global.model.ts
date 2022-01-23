import { Document, Schema, model, SchemaTypes } from "mongoose";

export interface IGlobal extends Document {
  global: number
}

const globalSchema = new Schema<IGlobal>(
    {
        global: {type: Number, default:0},
    }
);

export const Global = model("Global", globalSchema);
