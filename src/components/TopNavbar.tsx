import { Bot, Sparkles, User, FolderCog, ChevronDown } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenu } from "@/components/UserMenu";

const navItems = [
  { title: "G社 贾维斯", url: "/jarvis", icon: Bot },
  { 
    title: "专业工具", 
    icon: Sparkles,
    subItems: [
      { title: "Webhub工作流", url: "/create/webhub-workflow" },
      { title: "Webhub Lora训练", url: "/create/webhub-lora" },
    ]
  },
  { 
    title: "项目定制工具库", 
    icon: FolderCog,
    subItems: [
      { title: "M72", url: "/custom/m72" },
      { title: "M71", url: "/custom/m71" },
      { title: "M98", url: "/custom/m98" },
    ]
  },
  { title: "个人中心", url: "/profile", icon: User },
];

export function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isGroupActive = (item: typeof navItems[number]) => {
    if (!item.subItems) return false;
    return item.subItems.some(subItem => currentPath === subItem.url);
  };

  return (
    <header className="h-14 border-b border-border/40 flex items-center px-5 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      {/* Logo */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-1 mr-8 group"
      >
        <span className="font-display font-bold text-primary text-lg transition-transform duration-300 group-hover:scale-110">B</span>
        <span className="font-display font-medium text-primary text-base">lueWhale</span>
      </button>

      {/* Navigation */}
      <nav className="flex items-center gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = item.url ? currentPath === item.url : isGroupActive(item);
          const hasSubItems = !!item.subItems;

          if (hasSubItems) {
            return (
              <DropdownMenu key={item.title}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`h-9 px-4 rounded-full flex items-center gap-2 text-sm transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary/15 text-primary' 
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[160px] rounded-xl">
                  {item.subItems?.map((subItem) => (
                    <DropdownMenuItem 
                      key={subItem.url}
                      onClick={() => navigate(subItem.url)}
                      className={`text-sm cursor-pointer ${
                        currentPath === subItem.url ? 'bg-primary/15 text-primary' : ''
                      }`}
                    >
                      {subItem.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <NavLink
              key={item.title}
              to={item.url!}
              className={`h-9 px-4 rounded-full flex items-center gap-2 text-sm transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/15 text-primary' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
              activeClassName="bg-primary/15 text-primary"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Menu */}
      <UserMenu />
    </header>
  );
}
