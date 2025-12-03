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
        <button className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-primary/20 transition-all duration-200 p-0.5">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">U</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-xl p-1">
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex flex-col">
            <span className="font-medium">AI用户</span>
            <span className="text-xs text-muted-foreground font-normal">user@example.com</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem className="cursor-pointer rounded-lg mx-1 px-3 py-2" onClick={() => navigate('/settings')}>
          <Settings className="mr-3 h-4 w-4" />
          账户设置
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-lg mx-1 px-3 py-2" onClick={() => navigate('/profile')}>
          <User className="mr-3 h-4 w-4" />
          个人中心
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem className="cursor-pointer text-destructive rounded-lg mx-1 px-3 py-2">
          <LogOut className="mr-3 h-4 w-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}