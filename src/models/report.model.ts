import { Document, Schema, model, SchemaTypes } from "mongoose";

export interface IReport extends Document {
  user: String
  report: String
}

const reportSchema = new Schema<IReport>(
    {   user: String,
        report: String
    }
);

export const Report = model("Report", reportSchema);
