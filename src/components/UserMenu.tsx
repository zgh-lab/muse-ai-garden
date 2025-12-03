import { User, Settings, LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserMenu() {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-full p-1 hover:bg-muted/50 transition-all duration-200 interactive-scale group">
          <div className="relative">
            <Avatar className="h-9 w-9 ring-2 ring-primary/30 ring-offset-2 ring-offset-background transition-all duration-200 group-hover:ring-primary/50">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground font-medium">U</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-background" />
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-60 glass-strong border-border/30 shadow-xl animate-scale-in p-2"
      >
        <DropdownMenuLabel className="px-3 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-semibold font-display">AI用户</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/30 my-2" />
        <DropdownMenuItem 
          className="cursor-pointer px-3 py-2.5 rounded-lg hover:bg-muted/80 transition-all focus:bg-muted/80 gap-3" 
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span>账户设置</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer px-3 py-2.5 rounded-lg hover:bg-muted/80 transition-all focus:bg-muted/80 gap-3" 
          onClick={() => navigate('/profile')}
        >
          <User className="h-4 w-4 text-muted-foreground" />
          <span>个人中心</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/30 my-2" />
        <DropdownMenuItem 
          className="cursor-pointer px-3 py-2.5 rounded-lg hover:bg-destructive/10 transition-all focus:bg-destructive/10 text-destructive gap-3"
        >
          <LogOut className="h-4 w-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}