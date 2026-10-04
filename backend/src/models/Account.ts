import { Schema, model } from "mongoose";

const accountSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Account name is required"],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, "Industry classification is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country field is required"],
      default: "Germany",
      trim: true,
    },
    totalPipelineValue: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Account = model("Account", accountSchema);
export default Account;
