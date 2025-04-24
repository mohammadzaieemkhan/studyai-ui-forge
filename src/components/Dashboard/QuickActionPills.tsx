
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export const QuickActionPills = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" className="rounded-full bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
        <MapPin className="h-3.5 w-3.5 mr-1" />
        Review Chapter 3: Neural Networks
      </Button>
      <Button variant="outline" size="sm" className="rounded-full bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">
        <MapPin className="h-3.5 w-3.5 mr-1" />
        Practice with last semester's exam questions
      </Button>
      <Button variant="outline" size="sm" className="rounded-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
        <MapPin className="h-3.5 w-3.5 mr-1" />
        Summarize key concepts from today's lecture
      </Button>
    </div>
  );
};
