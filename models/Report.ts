// models/Report.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReport extends Document {
  userId: string;
  name: string;
  status: "Pending" | "Generated";
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema<IReport> = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Generated"], default: "Pending" },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const Report: Model<IReport> =
  mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);

export default Report;

