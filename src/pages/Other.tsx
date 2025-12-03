import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/UserMenu";
import { Card } from "@/components/ui/card";

const Other = () => {

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-background/95">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-6 shadow-sm">
            <div className="flex-1" />
            <UserMenu />
          </header>
          
          <main className="flex-1 p-6 space-y-6 animate-fade-in">
            <div className="space-y-2 animate-slide-up">
              <h1 className="text-3xl font-bold text-gradient-primary">
                其他功能
              </h1>
              <p className="text-muted-foreground">探索更多强大的功能特性</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card 
                  key={i} 
                  className="h-40 card-elevated interactive-lift cursor-pointer group animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 mx-auto flex items-center justify-center transition-all duration-base shadow-sm group-hover:shadow-md">
                        <span className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">
                          {i}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">功能 #{i}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Other;
