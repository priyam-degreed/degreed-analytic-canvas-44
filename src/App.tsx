import React from "react";
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
import SkillTracker from "./pages/analysis/SkillTracker";
import LearningEngagement from "./pages/dashboards/LearningEngagement";
import SkillInsights from "./pages/dashboards/SkillInsights";
import ContentPerformance from "./pages/dashboards/ContentPerformance";
import CareerDevelopment from "./pages/dashboards/CareerDevelopment";
import DrillDownPaths from "./pages/dashboards/DrillDownPaths";
import EngagementOverviewDashboard from "./pages/dashboards/EngagementOverviewDashboard";
import DashboardBuilder from "./pages/DashboardBuilder";
import NotFound from "./pages/NotFound";
import Explore from "./pages/Explore";
import Captures from "./pages/Captures";
import Analyses from "./pages/Analyses";
import SearchPage from "./pages/SearchPage";
import Metrics from "./pages/Metrics";
import Data from "./pages/Data";

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
            {/* Main Navigation Routes */}
            <Route path="metrics" element={<Metrics />} />
            <Route path="data" element={<Data />} />
            {/* Dashboard Routes */}
            <Route path="dashboards/learning-engagement" element={<LearningEngagement />} />
            <Route path="dashboards/skill-insights" element={<SkillInsights />} />
            <Route path="dashboards/content-performance" element={<ContentPerformance />} />
            <Route path="dashboards/career-development" element={<CareerDevelopment />} />
            <Route path="dashboards/drill-down" element={<DrillDownPaths />} />
            <Route path="dashboards/engagement-overview" element={<EngagementOverviewDashboard />} />
            {/* Dashboard Builder Routes */}
            <Route path="dashboard-builder" element={<DashboardBuilder mode="create" />} />
            <Route path="dashboard-builder/:id/edit" element={<DashboardBuilder mode="edit" />} />
            {/* Existing Routes */}
            <Route path="overview/strategic" element={<StrategicOverview />} />
            <Route path="overview/operational" element={<Dashboard />} />
            <Route path="learning/executive" element={<ExecutiveOverview />} />
            <Route path="learning/engagement" element={<Dashboard />} />
            <Route path="learning/impact" element={<Dashboard />} />
            <Route path="learning/assignments" element={<Dashboard />} />
            <Route path="learning/operations" element={<Dashboard />} />
            <Route path="skills/adoption" element={<SkillsAdoption />} />
            <Route path="skills/planning" element={<Dashboard />} />
            <Route path="analysis/skill-tracker" element={<SkillTracker />} />
            <Route path="settings" element={<Dashboard />} />
            <Route path="explore" element={<Explore />} />
            <Route path="captures" element={<Captures />} />
            <Route path="analyses" element={<Analyses />} />
            <Route path="search" element={<SearchPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
