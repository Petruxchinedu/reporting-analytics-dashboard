import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserSettings extends Document {
  userId: mongoose.Types.ObjectId;
  theme: "light" | "dark" | "system";
  defaultMetric: string;
  defaultRegion: string;
  notificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema = new Schema<IUserSettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system",
    },

    defaultMetric: {
      type: String,
      default: "revenue",
    },

    defaultRegion: {
      type: String,
      default: "global",
    },

    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserSettings: Model<IUserSettings> =
  mongoose.models.UserSettings ||
  mongoose.model<IUserSettings>("UserSettings", UserSettingsSchema);

export default UserSettings;
