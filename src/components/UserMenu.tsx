import { User, Settings, LogOut } from "lucide-react";
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
        <button className="flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">U</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">AI用户</span>
            <span className="text-xs text-muted-foreground font-normal">user@example.com</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          账户设置
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          个人中心
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}