const Create = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-background/90 animate-fade-in">
      <div className="text-center space-y-6 max-w-lg mx-auto px-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-20 animate-glow-pulse" />
          <h1 className="relative text-5xl font-bold text-gradient-primary animate-slide-up">
            创作页面
          </h1>
        </div>
        <p className="text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '100ms' }}>
          创作功能正在开发中...
        </p>
        <div className="flex flex-wrap gap-2 justify-center pt-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20">
            即将推出
          </div>
          <div className="px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium backdrop-blur-sm border border-accent/20">
            敬请期待
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
