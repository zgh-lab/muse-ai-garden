import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create from "./pages/Create";
import Other from "./pages/Other";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Jarvis from "./pages/Jarvis";
import ImageGeneration from "./pages/create/ImageGeneration";
import VideoGeneration from "./pages/create/VideoGeneration";
import AudioGeneration from "./pages/create/AudioGeneration";
import WebhubWorkflow from "./pages/create/WebhubWorkflow";
import WebhubLora from "./pages/create/WebhubLora";
import AIComprehensive from "./pages/create/AIComprehensive";

const queryClient = new QueryClient();

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Jarvis />} />
      <Route path="/jarvis" element={<Jarvis />} />
      <Route path="/create" element={<Create />} />
      <Route path="/create/image" element={<ImageGeneration />} />
      <Route path="/create/video" element={<VideoGeneration />} />
      <Route path="/create/audio" element={<AudioGeneration />} />
      <Route path="/create/webhub-workflow" element={<WebhubWorkflow />} />
      <Route path="/create/webhub-lora" element={<WebhubLora />} />
      <Route path="/create/ai-comprehensive" element={<AIComprehensive />} />
      <Route path="/other" element={<Other />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
