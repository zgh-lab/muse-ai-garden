import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/UserMenu";
import { JarvisChat } from "@/components/JarvisChat";

const JarvisContent = () => {
  return (
    <>
      <AppSidebar />
      
      <div className="flex-1 flex flex-col relative z-20">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 bg-background/80 backdrop-blur-xl border-b border-border/50 supports-[backdrop-filter]:bg-background/60 px-6 shadow-sm">
          <div className="flex-1" />
          <UserMenu />
        </header>

        <main className="flex-1 overflow-hidden p-6 animate-fade-in">
          <JarvisChat />
        </main>
      </div>
    </>
  );
};

const Jarvis = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-background bg-gradient-to-br from-background via-background to-background/90">
        <JarvisContent />
      </div>
    </SidebarProvider>
  );
};

export default Jarvis;
