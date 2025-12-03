import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/UserMenu";
import { Music } from "lucide-react";

const AudioGeneration = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <div className="flex-1" />
            <UserMenu />
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container max-w-7xl mx-auto p-6 space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Music className="h-8 w-8 text-primary" />
                  <h1 className="text-3xl font-bold text-foreground">音频生成</h1>
                </div>
                <p className="text-muted-foreground">
                  使用AI技术进行音乐创作和语音合成
                </p>
              </div>
              
              <div className="text-center py-20">
                <p className="text-muted-foreground">音频生成功能即将上线...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AudioGeneration;
