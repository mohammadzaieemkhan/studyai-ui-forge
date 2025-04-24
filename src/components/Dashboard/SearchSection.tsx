
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Zap } from "lucide-react";
import { toast } from "sonner";

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchSection = ({ searchQuery, onSearchChange }: SearchSectionProps) => {
  const handleAIAction = () => {
    if (searchQuery.trim()) {
      toast.success("Processing your question", {
        description: `"${searchQuery.trim()}"`,
      });
    } else {
      toast.info("Ask a question or upload your syllabus");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Ask a question or upload your syllabus..."
          className="pl-4 pr-10 py-2 w-full"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
          <Upload className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <Button className="gap-2 whitespace-nowrap" onClick={handleAIAction}>
        <Zap className="h-4 w-4" />
        Generate Exam
      </Button>
    </div>
  );
};
