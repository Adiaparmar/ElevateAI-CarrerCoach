"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateCareerPaths(data) {
  console.log("Generating career paths with data:", data);
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    You are a professional AI career advisor. You must provide a response in a strict, fixed JSON format without any deviations. A user has the following background:
    - Industry: ${user.industry}
    - Experience: ${user.experience} years
    - Current Skills: ${user.skills?.join(", ")}
    - Career Goal: ${data}

    Your response must exactly match the following structure and include a career path. Do not add, remove, or modify any fields, and ensure all values are properly formatted as strings or arrays as shown:

    {
      "candidate_profile": {
        "industry": "${user.industry}",
        "experience": "${user.experience} years",
        "career_goal": "${data}",
        "current_skills": ${JSON.stringify(user.skills)}
      },
      "suggested_career_paths": [
        {
          "timeline": {
            "entry_to_intermediate": "<duration e.g. '6-12 months'>",
            "intermediate_to_advanced": "<duration e.g. '12-18 months'>"
          },
          "path_name": "<name of career path e.g. 'Quant-Focused Software Engineer'>",
          "description": "<brief description e.g. 'This path focuses on strengthening core software engineering skills...'>",
          "sample_job_titles": ["<job title 1>", "<job title 2>", "<job title 3>"],
          "skill_progression": {
            "entry": ["<skill 1>", "<skill 2>", "<skill 3>"],
            "intermediate": ["<skill 1>", "<skill 2>", "<skill 3>"],
            "advanced": ["<skill 1>", "<skill 2>", "<skill 3>"]
          },
          "learning_resources": {
            "entry": ["<resource 1>", "<resource 2>", "<resource 3>"],
            "intermediate": ["<resource 1>", "<resource 2>", "<resource 3>"],
            "advanced": ["<resource 1>", "<resource 2>", "<resource 3>"]
          },
          "expected_salary_range": {
            "entry_level": "<range e.g. '$80,000 - $120,000'>",
            "intermediate": "<range e.g. '$120,000 - $200,000'>",
            "advanced": "<range e.g. '$180,000 - $300,000'>"
          }
        }
      ]
    }

    Ensure the response is valid JSON, with exactly 1 career path, and all fields populated with appropriate values based on the user's background and career goal. Do not include any additional fields, comments, or markdown (e.g., no json wrappers).
  `;

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const jsonText = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(jsonText);

    const newPath = await db.careerPath.create({
      data: {
        goal: data,
        userId: user.id,
        path: parsed,
      },
    });

    return newPath;
  } catch (error) {
    console.error("Error generating career path:", error.message);
    throw new Error("Failed to generate career path");
  }
}

export async function getCareerPaths() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.careerPath.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCareerPath(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.careerPath.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCareerPath(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.careerPath.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}
