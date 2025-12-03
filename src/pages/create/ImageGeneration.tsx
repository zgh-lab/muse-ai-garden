import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/UserMenu";
import { Image } from "lucide-react";

const ImageGeneration = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-background/95">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-6 shadow-sm">
            <div className="flex-1" />
            <UserMenu />
          </header>

          <main className="flex-1 overflow-auto animate-fade-in">
            <div className="container max-w-7xl mx-auto p-6 space-y-8">
              <div className="space-y-2 animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Image className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold text-gradient-primary">图片生成</h1>
                </div>
                <p className="text-muted-foreground">
                  使用AI技术生成精美的图片
                </p>
              </div>
              
              <div className="text-center py-20 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-primary blur-2xl opacity-20 animate-glow-pulse" />
                  <Image className="relative h-16 w-16 text-primary mx-auto" />
                </div>
                <p className="text-lg text-muted-foreground">图片生成功能即将上线...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ImageGeneration;
