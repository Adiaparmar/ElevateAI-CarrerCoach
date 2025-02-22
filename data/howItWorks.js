import { UserPlus, FileEdit, Users, LineChart } from "lucide-react";

export const howItWorks = [
  {
    title: "Expert Onboarding",
    description: "Provide your industry and skills for tailored career support",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Build Your Materials",
    description: "Develop ATS-friendly resumes and persuasive cover letters",
    icon: <FileEdit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Master Your Interviews",
    description: "Train with AI-driven mock interviews customized for your position",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Measure Your Growth",
    description: "Evaluate your progress with comprehensive performance insights",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
];
