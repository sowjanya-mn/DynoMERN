import OpenAI from "openai";
import { z } from "zod";

// Definition matching your data schema strategy
const extractionTargetSchema = z.object({
  companyName: z.string().nullable(),
  contactName: z.string().nullable(),
  languageDetected: z.enum(["German", "English", "Other"]),
  summary: z.string(),
  intentClassification: z.enum([
    "Sales Lead",
    "Technical Support",
    "Billing Issue",
    "Spam",
  ]),
  estimatedValueEstimate: z.number().nullable(),
  urgencyLevel: z.enum(["Low", "Medium", "High", "Critical"]),
});

type ExtractedIntakeData = z.infer<typeof extractionTargetSchema>;

// Configure the SDK to target your local Ollama instance instead of cloud servers
const openai = new OpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama", // Ollama doesn't require a key, but a non-empty placeholder string prevents SDK validation crashes
});

export const analyzeIncomingText = async (
  rawText: string,
): Promise<ExtractedIntakeData> => {
  const completion = await openai.chat.completions.create({
    model: "llama3", // <-- Swap this with whatever model you have pulled in Ollama (e.g., 'mistral', 'llama3.1')
    messages: [
      {
        role: "system",
        content: `You are an enterprise AI extraction agent. Extract structured JSON metadata fields from text streams. 
        You MUST respond with a raw JSON object matching this exact key layout structure:
        {
          "companyName": string or null,
          "contactName": string or null,
          "languageDetected": "German" or "English" or "Other",
          "summary": string,
          "intentClassification": "Sales Lead" or "Technical Support" or "Billing Issue" or "Spam",
          "estimatedValueEstimate": number or null,
          "urgencyLevel": "Low" or "Medium" or "High" or "Critical"
        }
        Do not include markdown tags, formatting backticks, or any chat conversational filler text in your response.`,
      },
      { role: "user", content: rawText },
    ],
  });

  const rawContent = completion.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error("Local LLM engine failed to return content.");
  }

  try {
    // Local open-source models do not support native SDK structured 'parse' formatting hooks,
    // so we handle parsing the raw string to guarantee schema validation downstream.
    const parsedOutput = JSON.parse(rawContent.trim());
    return parsedOutput as ExtractedIntakeData;
  } catch (parseError) {
    throw new Error(
      "Failed to map unstructured LLM text response into valid schema. Ensure local model output integrity.",
    );
  }
};
export default analyzeIncomingText;
