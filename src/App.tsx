import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import StrategicOverview from "./pages/overview/StrategicOverview";
import ExecutiveOverview from "./pages/learning/ExecutiveOverview";
import SkillsAdoption from "./pages/skills/SkillsAdoption";
import AIInsights from "./pages/ai/AIInsights";
import SkillTracker from "./pages/analysis/SkillTracker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="overview/strategic" element={<StrategicOverview />} />
            <Route path="overview/operational" element={<Dashboard />} />
            <Route path="learning/executive" element={<ExecutiveOverview />} />
            <Route path="learning/engagement" element={<Dashboard />} />
            <Route path="learning/impact" element={<Dashboard />} />
            <Route path="learning/assignments" element={<Dashboard />} />
            <Route path="learning/operations" element={<Dashboard />} />
            <Route path="skills/adoption" element={<SkillsAdoption />} />
            <Route path="skills/planning" element={<Dashboard />} />
            <Route path="ai/insights" element={<AIInsights />} />
            <Route path="ai/search" element={<AIInsights />} />
            <Route path="analysis/skill-tracker" element={<SkillTracker />} />
            <Route path="settings" element={<Dashboard />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
