import { z } from "zod";
import { Types } from "mongoose";

export const accountInputSchema = z.strictObject({
  name: z.string().min(1, { message: "Account name is required" }),
  industry: z
    .string()
    .min(1, { message: "Industry sector classification is required" }),
  country: z.string().default("Germany"),
});

export const opportunityInputSchema = z.strictObject({
  title: z.string().min(1, { message: "Opportunity title is required" }),
  account: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid Account reference ID",
    }),
  estimatedRevenue: z
    .number()
    .min(0, { message: "Estimated revenue cannot be negative" }),
  status: z.enum(["Open", "Won", "Lost"]).default("Open"),
  closeDate: z.string().transform((str) => new Date(str)),
});

export const intakeInputSchema = z.strictObject({
  rawText: z
    .string()
    .min(10, {
      message: "Raw text metadata transcript is too brief to analyze safely.",
    }),
});
