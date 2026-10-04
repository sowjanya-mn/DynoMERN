import { Router } from "express";
import {
  getAccounts,
  createAccount,
  createOpportunity,
  updateOpportunityStatus,
  processAIIntake,
} from "#controllers";
import { validateBody } from "#middlewares";
import {
  accountInputSchema,
  opportunityInputSchema,
  intakeInputSchema,
} from "#schemas";

const crmRouter = Router();

// Endpoint layout mapping matrices
crmRouter
  .route("/accounts")
  .get(getAccounts)
  .post(validateBody(accountInputSchema), createAccount);

crmRouter
  .route("/opportunities")
  .post(validateBody(opportunityInputSchema), createOpportunity);

crmRouter.route("/opportunities/:id/status").patch(updateOpportunityStatus);

crmRouter
  .route("/ai/intake")
  .post(validateBody(intakeInputSchema), processAIIntake);

export default crmRouter;
