import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useState } from "react";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ExamCreation from "./pages/ExamCreation";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import NotFound from "./pages/NotFound";
import Subjects from './pages/Subjects';

const App = () => {
  // Create a client
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Dashboard routes */}
              <Route path="/" element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/exam-creation" element={<ExamCreation />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/performance" element={<Dashboard />} /> {/* Placeholder */}
                <Route path="/schedule" element={<Dashboard />} /> {/* Placeholder */}
                <Route path="/materials/:subject" element={<Dashboard />} /> {/* Placeholder */}
                <Route path="/materials" element={<Dashboard />} /> {/* Placeholder */}
                <Route path="/past-exams" element={<Dashboard />} /> {/* Placeholder */}
                <Route path="/saved-questions" element={<Dashboard />} /> {/* Placeholder */}
                <Route path="/smart-notes" element={<Dashboard />} /> {/* Placeholder */}
                <Route path="/profile" element={<Dashboard />} /> {/* Placeholder */}
                <Route path="/settings" element={<Dashboard />} /> {/* Placeholder */}
              </Route>
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
