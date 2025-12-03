import { Bot, Sparkles, User, ChevronDown, Menu } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  { title: "个人中心", url: "/profile", icon: User },
];

interface AppSidebarProps {
  onHoverExpandChange?: (isHoverExpanded: boolean) => void;
}

export function AppSidebar({ onHoverExpandChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const isCollapsed = state === "collapsed";

  const isGroupActive = (item: typeof navItems[number]) => {
    if (!item.subItems) return false;
    return item.subItems.some(subItem => currentPath === subItem.url);
  };

  const NavItemContent = ({ item, isActive }: { item: typeof navItems[number]; isActive: boolean }) => (
    <div className={`flex items-center ${isCollapsed ? 'justify-center w-10 h-10' : 'gap-3 w-full px-3'} py-2.5 rounded-xl transition-all duration-200 ${
      isActive 
        ? 'bg-primary/15 text-primary' 
        : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
    }`}>
      <item.icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
    </div>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar collapsible="icon" className="border-r border-border/30 bg-sidebar">
        <SidebarContent className="pt-0">
          <SidebarGroup>
            {/* Header */}
            <div className={`flex items-center border-b border-border/30 ${isCollapsed ? 'justify-center py-4' : 'px-4 py-4 gap-3'}`}>
              {!isCollapsed && (
                <span 
                  className="font-display font-semibold text-primary text-lg cursor-pointer tracking-tight"
                  onClick={() => navigate('/')}
                >
                  BlueWhale
                </span>
              )}
              <SidebarTrigger className={`h-9 w-9 rounded-xl hover:bg-secondary/80 transition-colors ${isCollapsed ? '' : 'ml-auto'}`}>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
            </div>
            
            {/* Navigation */}
            <SidebarGroupContent className={`py-4 ${isCollapsed ? 'px-2' : 'px-3'}`}>
              <SidebarMenu className={isCollapsed ? 'space-y-2' : 'space-y-1'}>
                {navItems.map((item) => {
                  if (item.subItems) {
                    const isActive = isGroupActive(item);
                    const isOpen = openGroups.includes(item.title);
                    
                    if (isCollapsed) {
                      return (
                        <SidebarMenuItem key={item.title}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                className={`flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all duration-200 ${
                                  isActive 
                                    ? 'bg-primary/15 text-primary' 
                                    : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                                }`}
                              >
                                <item.icon className="h-5 w-5" />
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="flex flex-col gap-1 p-2">
                              <span className="font-medium">{item.title}</span>
                              {item.subItems.map(sub => (
                                <NavLink 
                                  key={sub.url} 
                                  to={sub.url}
                                  className="text-sm text-muted-foreground hover:text-foreground py-1"
                                >
                                  {sub.title}
                                </NavLink>
                              ))}
                            </TooltipContent>
                          </Tooltip>
                        </SidebarMenuItem>
                      );
                    }
                    
                    return (
                      <Collapsible
                        key={item.title}
                        open={isOpen}
                        onOpenChange={(open) => {
                          setOpenGroups(prev => 
                            open ? [...prev, item.title] : prev.filter(g => g !== item.title)
                          );
                        }}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem
                          onMouseLeave={() => setOpenGroups(prev => prev.filter(g => g !== item.title))}
                        >
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              onMouseEnter={() => {
                                if (!openGroups.includes(item.title)) {
                                  setOpenGroups(prev => [...prev, item.title]);
                                }
                              }}
                              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 ${
                                isActive 
                                  ? 'bg-primary/15 text-primary' 
                                  : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                              }`}
                            >
                              <item.icon className="h-5 w-5 shrink-0" />
                              <span className="flex-1 text-sm font-medium">{item.title}</span>
                              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="animate-accordion-down">
                            <SidebarMenuSub className="ml-6 mt-1 space-y-0.5 border-l-2 border-border/40 pl-3">
                              {item.subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild isActive={currentPath === subItem.url}>
                                    <NavLink
                                      to={subItem.url}
                                      className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                        currentPath === subItem.url
                                          ? 'text-primary font-medium bg-primary/10'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                                      }`}
                                      activeClassName="text-primary font-medium bg-primary/10"
                                    >
                                      {subItem.title}
                                    </NavLink>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }
                  
                  const isActive = currentPath === item.url;
                  
                  if (isCollapsed) {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton asChild isActive={isActive}>
                              <NavLink
                                to={item.url}
                                className={`flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all duration-200 ${
                                  isActive 
                                    ? 'bg-primary/15 text-primary' 
                                    : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                                }`}
                                activeClassName="bg-primary/15 text-primary"
                              >
                                <item.icon className="h-5 w-5" />
                              </NavLink>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            {item.title}
                          </TooltipContent>
                        </Tooltip>
                      </SidebarMenuItem>
                    );
                  }
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <NavLink
                          to={item.url}
                          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 ${
                            isActive 
                              ? 'bg-primary/15 text-primary' 
                              : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                          }`}
                          activeClassName="bg-primary/15 text-primary"
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          <span className="text-sm font-medium">{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}