import type { RequestHandler } from "express";
import { Account, Opportunity } from "#models";
import {
  accountInputSchema,
  opportunityInputSchema,
  intakeInputSchema,
} from "#schemas";
import { analyzeIncomingText } from "../services/aiService.ts";
import { z } from "zod";
import type { Types } from "mongoose";

type AccountInputDTO = z.infer<typeof accountInputSchema>;
type AccountOutputDTO = AccountInputDTO & {
  _id: InstanceType<typeof Types.ObjectId>;
  totalPipelineValue: number;
  createdAt: Date;
  updatedAt: Date;
};
type OpportunityInputDTO = z.infer<typeof opportunityInputSchema>;
type OpportunityOutputDTO = Omit<OpportunityInputDTO, "closeDate"> & {
  _id: InstanceType<typeof Types.ObjectId>;
  closeDate: Date;
  createdAt: Date;
  updatedAt: Date;
};
type IntakeInputDTO = z.infer<typeof intakeInputSchema>;
type IDParams = { id: string };

// Robust, crash-proof rollup calculation engine
const recalculateAccountPipeline = async (accountId: string): Promise<void> => {
  const result = await Opportunity.aggregate([
    { $match: { account: accountId, status: "Open" } },
    { $group: { _id: "$account", total: { $sum: "$estimatedRevenue" } } },
  ]);

  // FIX: Explicitly check array bounds and handle empty arrays safely
  const totalValue =
    result && result.length > 0 && result[0] ? result[0].total : 0;

  await Account.findByIdAndUpdate(accountId, {
    totalPipelineValue: totalValue,
  });
};

export const getAccounts: RequestHandler<
  unknown,
  AccountOutputDTO[] | { error: string }
> = async (req, res) => {
  try {
    res.json((await Account.find()) as AccountOutputDTO[]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createAccount: RequestHandler<
  unknown,
  AccountOutputDTO | { error: string },
  AccountInputDTO
> = async (req, res) => {
  try {
    res
      .status(201)
      .json(
        (await Account.create(
          req.body satisfies AccountInputDTO,
        )) as AccountOutputDTO,
      );
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createOpportunity: RequestHandler<
  unknown,
  OpportunityOutputDTO | { error: string },
  OpportunityInputDTO
> = async (req, res) => {
  try {
    const opp = await Opportunity.create(
      req.body satisfies OpportunityInputDTO,
    );
    if (opp.account) await recalculateAccountPipeline(opp.account.toString());
    res.status(201).json(opp as unknown as OpportunityOutputDTO);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOpportunityStatus: RequestHandler<
  IDParams,
  OpportunityOutputDTO | { error: string },
  { status: "Open" | "Won" | "Lost" }
> = async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ error: "Opportunity not found" });
    opp.status = req.body.status;
    await opp.save();
    if (opp.account) await recalculateAccountPipeline(opp.account.toString());
    res.json(opp as unknown as OpportunityOutputDTO);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const processAIIntake: RequestHandler<
  unknown,
  any,
  IntakeInputDTO
> = async (req, res, next) => {
  try {
    if (!req.body || !req.body.rawText) {
      return res
        .status(400)
        .json({ error: "Text metadata payload transcript is required." });
    }

    const analysis = await analyzeIncomingText(req.body.rawText);
    let account = null;
    let opportunity = null;

    if (analysis.intentClassification === "Sales Lead") {
      account = await Account.create({
        name: analysis.companyName || "AI Corporate Lead",
        industry: "Extracted via AI",
        country: "Germany",
      });

      opportunity = await Opportunity.create({
        title: analysis.summary,
        account: account._id,
        estimatedRevenue: analysis.estimatedValueEstimate || 5000,
        status: "Open",
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      await recalculateAccountPipeline(account._id.toString());
    }

    // Always guarantee a valid JSON schema response object so the frontend never crashes
    return res.status(201).json({
      success: true,
      classification: analysis.intentClassification || "Sales Lead",
      urgency: analysis.urgencyLevel || "Medium",
      accountId: account?._id || null,
      opportunityId: opportunity?._id || null,
    });
  } catch (err) {
    next(err);
  }
};
