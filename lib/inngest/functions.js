import { GoogleGenAI } from "@google/genai";
import { db } from "../prisma";
import { inngest } from "./client";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" },
  async ({ step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industries) {
      const prompt = `
      Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
      {
        "salaryRanges": [
          { "role": "string", "min": number, "max": number, "median": number, "location": "string"}
        ],
        "growthRate": number,
        "demandLevel" : "HIGH"| "MEDIUM" | "LOW",
        "topSkills" : ["skill1", "skill2"],
        "marketOutlook" : "POSITIVE" | "NEUTRAL" | "NEGATIVE",
        "keyTrends" : ["trend1", "trend2"],
        "recommendationSkills" : ["skill1", "skill2"]
      }

      IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
      Include at least 5 common roles for salary ranges.
      Growth rate should be in percentage.
      Include at least 5 skills and trends
  `;

      const res = await step.ai.wrap(
        "gemini",
        async (p) => {
          return await ai.models.generateContent({
            model: "gemini-3.1-flash-lite-preview",
            contents: [{ role: "user", parts: [{ text: p }] }],
          });
        },
        prompt
      );

      const text = res.text || "";
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      const insights = JSON.parse(cleanedText);

      await step.run(`Update ${industry} Insights`, async () => {
        return await db.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);
