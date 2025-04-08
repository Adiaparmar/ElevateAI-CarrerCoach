// CareerPathCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  DollarSign,
  Briefcase,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

export const CareerPathCard = ({ path }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getPathContent = () => {
    return path?.suggested_career_paths || [];
  };

  const careerPaths = getPathContent();

  if (!careerPaths || careerPaths.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="font-medium text-lg">Invalid career path data</h3>
          <p className="text-muted-foreground">
            The data structure couldn't be processed correctly.
          </p>
          <pre className="mt-4 bg-muted p-2 rounded text-xs text-left max-h-48 overflow-auto">
            {JSON.stringify(path, null, 2)}
          </pre>
        </div>
      </Card>
    );
  }

  const get = (obj, path, fallback = "") => {
    try {
      return path
        .split(".")
        .reduce((o, p) => (o && o[p] !== undefined ? o[p] : fallback), obj);
    } catch (e) {
      return fallback;
    }
  };

  const has = (obj, path) => {
    try {
      return (
        path.split(".").reduce((o, p) => o && o[p] !== undefined, obj) !==
        undefined
      );
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="space-y-6 mb-8">
      <h2 className="text-xl font-bold">Career Path Options</h2>
      {careerPaths.map((careerPath, index) => (
        <Card
          key={index}
          className="overflow-hidden border-l-4 border-l-primary"
        >
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center justify-between">
              <span>{get(careerPath, "path_name", "Career Path")}</span>
              <Badge variant="outline" className="ml-2">
                {get(careerPath, "timeline.entry_to_intermediate", "N/A")} +{" "}
                {get(careerPath, "timeline.intermediate_to_advanced", "N/A")}
              </Badge>
            </CardTitle>
            {get(careerPath, "description") && (
              <p className="text-muted-foreground">
                {get(careerPath, "description")}
              </p>
            )}
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Timeline Section */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("timeline")}
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  <h3 className="font-medium">Timeline</h3>
                </div>
                {expandedSection === "timeline" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              {expandedSection === "timeline" &&
                has(careerPath, "timeline") && (
                  <div className="mt-2 pl-6 space-y-2">
                    {has(careerPath, "timeline.entry_to_intermediate") && (
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Entry to Intermediate</span>
                          <span className="text-muted-foreground">
                            {get(careerPath, "timeline.entry_to_intermediate")}
                          </span>
                        </div>
                        <Progress value={33} className="h-2" />
                      </div>
                    )}
                    {has(careerPath, "timeline.intermediate_to_advanced") && (
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Intermediate to Advanced</span>
                          <span className="text-muted-foreground">
                            {get(
                              careerPath,
                              "timeline.intermediate_to_advanced"
                            )}
                          </span>
                        </div>
                        <Progress value={66} className="h-2" />
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Skills Section */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("skills")}
              >
                <div className="flex items-center">
                  <BadgeCheck className="w-4 h-4 mr-2 text-primary" />
                  <h3 className="font-medium">Skill Progression</h3>
                </div>
                {expandedSection === "skills" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              {expandedSection === "skills" &&
                has(careerPath, "skill_progression") && (
                  <div className="mt-2 pl-6 space-y-4">
                    {has(careerPath, "skill_progression.entry") && (
                      <div>
                        <h4 className="font-medium">Entry Level</h4>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(
                            get(careerPath, "skill_progression.entry")
                          ) &&
                            get(careerPath, "skill_progression.entry").map(
                              (skill, i) => (
                                <Badge key={i} variant="secondary">
                                  {skill}
                                </Badge>
                              )
                            )}
                        </div>
                      </div>
                    )}
                    {has(careerPath, "skill_progression.intermediate") && (
                      <div>
                        <h4 className="font-medium">Intermediate Level</h4>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(
                            get(careerPath, "skill_progression.intermediate")
                          ) &&
                            get(
                              careerPath,
                              "skill_progression.intermediate"
                            ).map((skill, i) => (
                              <Badge key={i} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                    {has(careerPath, "skill_progression.advanced") && (
                      <div>
                        <h4 className="font-medium">Advanced Level</h4>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(
                            get(careerPath, "skill_progression.advanced")
                          ) &&
                            get(careerPath, "skill_progression.advanced").map(
                              (skill, i) => (
                                <Badge key={i} variant="secondary">
                                  {skill}
                                </Badge>
                              )
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Learning Resources */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("resources")}
              >
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-primary" />
                  <h3 className="font-medium">Learning Resources</h3>
                </div>
                {expandedSection === "resources" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              {expandedSection === "resources" &&
                has(careerPath, "learning_resources") && (
                  <div className="mt-2 pl-6 space-y-3">
                    {Array.isArray(
                      get(careerPath, "learning_resources.entry")
                    ) && (
                      <div>
                        <h4 className="text-sm font-medium">Entry Level</h4>
                        <ul className="ml-5 list-disc text-sm">
                          {get(careerPath, "learning_resources.entry").map(
                            (resource, i) => (
                              <li key={i}>{resource}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                    {Array.isArray(
                      get(careerPath, "learning_resources.intermediate")
                    ) && (
                      <div>
                        <h4 className="text-sm font-medium">
                          Intermediate Level
                        </h4>
                        <ul className="ml-5 list-disc text-sm">
                          {get(
                            careerPath,
                            "learning_resources.intermediate"
                          ).map((resource, i) => (
                            <li key={i}>{resource}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {Array.isArray(
                      get(careerPath, "learning_resources.advanced")
                    ) && (
                      <div>
                        <h4 className="text-sm font-medium">Advanced Level</h4>
                        <ul className="ml-5 list-disc text-sm">
                          {get(careerPath, "learning_resources.advanced").map(
                            (resource, i) => (
                              <li key={i}>{resource}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Job Titles & Salary */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("jobs")}
              >
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-primary" />
                  <h3 className="font-medium">Job Titles & Salary Ranges</h3>
                </div>
                {expandedSection === "jobs" ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
              {expandedSection === "jobs" && (
                <div className="mt-2 pl-6">
                  <div className="grid gap-2">
                    {has(careerPath, "sample_job_titles") && (
                      <div className="flex flex-col py-1 border-b border-dashed">
                        <span className="font-medium">Sample Job Titles</span>
                        <div className="text-sm">
                          {get(careerPath, "sample_job_titles").join(", ")}
                        </div>
                      </div>
                    )}
                    {has(careerPath, "expected_salary_range.entry_level") && (
                      <div className="flex justify-between items-center py-1 border-b border-dashed">
                        <span className="font-medium">Entry Level</span>
                        <div className="text-sm">
                          {get(careerPath, "expected_salary_range.entry_level")}
                        </div>
                      </div>
                    )}
                    {has(careerPath, "expected_salary_range.intermediate") && (
                      <div className="flex justify-between items-center py-1 border-b border-dashed">
                        <span className="font-medium">Intermediate Level</span>
                        <div className="text-sm">
                          {get(
                            careerPath,
                            "expected_salary_range.intermediate"
                          )}
                        </div>
                      </div>
                    )}
                    {has(careerPath, "expected_salary_range.advanced") && (
                      <div className="flex justify-between items-center py-1 border-b border-dashed">
                        <span className="font-medium">Advanced Level</span>
                        <div className="text-sm">
                          {get(careerPath, "expected_salary_range.advanced")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
