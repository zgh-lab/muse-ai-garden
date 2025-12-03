import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-background/90 animate-fade-in">
      <div className="text-center space-y-8 max-w-lg mx-auto px-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-destructive/30 blur-3xl opacity-30 animate-glow-pulse" />
          <h1 className="relative text-8xl font-bold text-gradient-primary animate-scale-in">404</h1>
        </div>
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <p className="text-2xl font-semibold text-foreground">页面未找到</p>
          <p className="text-lg text-muted-foreground">
            抱歉，您访问的页面不存在或已被移除
          </p>
        </div>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-base shadow-md hover:shadow-lg hover:shadow-primary/20 interactive-scale animate-slide-up"
          style={{ animationDelay: '400ms' }}
        >
          返回首页
        </a>
      </div>
    </div>
  );
};

export default NotFound;
