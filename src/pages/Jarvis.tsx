import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/UserMenu";
import { JarvisChat } from "@/components/JarvisChat";

const JarvisContent = () => {
  return (
    <>
      <AppSidebar />
      
      <div className="flex-1 flex flex-col relative z-20">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 glass border-b border-border/30 px-6">
          <div className="flex-1" />
          <UserMenu />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden animate-fade-in">
          <JarvisChat />
        </main>
      </div>
    </>
  );
};

const Jarvis = () => {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <JarvisContent />
      </div>
    </SidebarProvider>
  );
};

export default Jarvis;