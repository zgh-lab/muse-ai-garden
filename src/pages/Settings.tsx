import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/UserMenu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="h-full px-5 flex items-center justify-between">
              <div className="flex-1" />
              <UserMenu />
            </div>
          </header>

          <main className="flex-1 p-6 animate-fade-in">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="space-y-1 animate-slide-up">
                <h1 className="text-2xl font-display font-semibold">账户设置</h1>
                <p className="text-muted-foreground text-sm">管理您的账户信息和偏好设置</p>
              </div>

              <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <CardHeader>
                  <CardTitle className="text-lg">安全设置</CardTitle>
                  <CardDescription>管理您的密码和安全选项</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">当前密码</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">新密码</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">确认新密码</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>更新密码</Button>
                </CardContent>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                <CardHeader>
                  <CardTitle className="text-lg">通知设置</CardTitle>
                  <CardDescription>选择您想要接收的通知类型</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                    <div>
                      <Label htmlFor="email-notifications" className="cursor-pointer font-medium">邮件通知</Label>
                      <p className="text-sm text-muted-foreground">接收重要更新的邮件通知</p>
                    </div>
                    <Switch id="email-notifications" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                    <div>
                      <Label htmlFor="push-notifications" className="cursor-pointer font-medium">推送通知</Label>
                      <p className="text-sm text-muted-foreground">接收浏览器推送通知</p>
                    </div>
                    <Switch id="push-notifications" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
