"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generateAIInsights = async (industry) => {
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

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(cleanedText);
};

// export async function getIndustryInsights() {
//   const { userId } = await auth();

//   const user = await db.user.findUnique({
//     where: {
//       clerkUserId: userId,
//     },
//     include: {
//       industryInsights: true,
//     },
//   });

//   if (!user) throw new Error("User not found");
//   let industryInsight = user.industryInsights;
//   if (!user.industryInsight) {
//     const insights = await generateAIInsights(user.industry);

//     const industryInsight = await db.industryInsight.create({
//       data: {
//         industry: user.industry,
//         ...insights,
//         nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//       },
//     });
//     return industryInsight;
//   }
//   return user.industryInsight;
// }

export async function getIndustryInsights() {
  const { userId } = await auth();

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsights: true }, // Correct relation name from schema
  });

  if (!user) throw new Error("User not found");

  // Check if user has an industry set
  if (!user.industry) throw new Error("User industry not specified");

  let industryInsight = user.industryInsights; // This is the related IndustryInsight (if any)

  if (!industryInsight) {
    // Look for an existing IndustryInsight for this industry
    industryInsight = await db.industryInsight.findUnique({
      where: { industry: user.industry },
    });

    if (!industryInsight) {
      // If none exists, generate and create a new one
      const insights = await generateAIInsights(user.industry);
      industryInsight = await db.industryInsight.create({
        data: {
          industry: user.industry,
          salaryRanges: insights.salaryRanges,
          growthRate: insights.growthRate,
          demandLevel: insights.demandLevel,
          topSkills: insights.topSkills,
          marketOutlook: insights.marketOutlook,
          keyTrends: insights.keyTrends,
          recommendationSkills: insights.recommendationSkills, // Fixed typo from "recommendationSkills"
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      });
    }

    // Note: No need to update the user here since the relation is via the `industry` field matching
  }

  return industryInsight;
}
