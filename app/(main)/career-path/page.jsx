"use client";

import { useEffect, useState } from "react";
import { generateCareerPaths, getCareerPaths } from "@/actions/career-paths";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { Loader2 } from "lucide-react";
import { CareerPathCard } from "./_components/carrer-path-card";

const CareerPathPage = () => {
  const [careerGoal, setCareerGoal] = useState("");
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const existing = await getCareerPaths();
        setPaths(existing);
      } catch (error) {
        toast.error("Failed to load existing career paths");
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchPaths();
  }, []);

  const handleGenerate = async () => {
    if (!careerGoal.trim()) return toast.error("Enter a career goal first");

    try {
      setLoading(true);
      const newPath = await generateCareerPaths(careerGoal);
      setPaths((prev) => [newPath, ...prev]);
      setCareerGoal("");
      toast.success("Career path generated!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "Failed to generate career path: " + (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Career Path Visualizer</h1>

      <Card className="mb-8 border-2 border-dashed">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium mb-4">
            Generate a New Career Path
          </h2>
          <Textarea
            value={careerGoal}
            onChange={(e) => setCareerGoal(e.target.value)}
            placeholder="Enter your career goal (e.g. Become a Data Scientist at Google)"
            className="mb-4"
            rows={3}
          />
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Career Path"
            )}
          </Button>
        </CardContent>
      </Card>

      {initialLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : paths.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No career paths generated yet</h3>
          <p className="text-muted-foreground">
            Enter a career goal above to get started
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {paths.map((path) => (
            <CareerPathCard key={path.id} path={path.path} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerPathPage;
