import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/UserMenu";
import { JarvisChat } from "@/components/JarvisChat";
import { useCallback } from "react";

const JarvisContent = () => {
  const handleNewChat = useCallback(() => {
    // Chat reset is handled internally by JarvisChat
  }, []);

  return (
    <>
      <AppSidebar onNewChat={handleNewChat} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border/40 flex items-center px-5 bg-background/80 backdrop-blur-sm">
          <div className="flex-1" />
          <UserMenu />
        </header>

        <main className="flex-1 overflow-hidden">
          <JarvisChat />
        </main>
      </div>
    </>
  );
};

const Jarvis = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <JarvisContent />
      </div>
    </SidebarProvider>
  );
};

export default Jarvis;