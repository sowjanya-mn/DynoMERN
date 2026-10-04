import { Schema, model } from "mongoose";

const opportunitySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Opportunity title is required"],
      trim: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Must be linked to an Account"],
    },
    estimatedRevenue: {
      type: Number,
      required: [true, "Estimated revenue is required"],
      min: [0, "Cannot be negative"],
    },
    status: {
      type: String,
      enum: { values: ["Open", "Won", "Lost"], message: "{VALUE} is invalid" },
      default: "Open",
    },
    closeDate: {
      type: Date,
      required: [true, "Closing date calculation estimation is required"],
    },
  },
  { timestamps: true },
);

const Opportunity = model("Opportunity", opportunitySchema);
export default Opportunity;
