export interface Account {
  _id: string;
  name: string;
  industry: string;
  country: string;
  totalPipelineValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface IntakeResponse {
  success: boolean;
  classification: "Sales Lead" | "Technical Support" | "Billing Issue" | "Spam";
  urgency: "Low" | "Medium" | "High" | "Critical";
  accountId?: string;
  opportunityId?: string;
}
