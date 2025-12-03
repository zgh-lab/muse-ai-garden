import { Home, Sparkles, MoreHorizontal, User, Bot, ChevronDown, Zap } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

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

  return (
    <Sidebar 
      collapsible="icon" 
      className="!border-r border-border/30 bg-sidebar/80 backdrop-blur-xl"
    >
      <SidebarContent className="pt-0 flex flex-col justify-start bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95">
        <SidebarGroup>
          {/* Logo Area */}
          <div className="px-3 py-4 flex items-center gap-3 min-w-0 border-b border-border/30">
            {!isCollapsed ? (
              <div className="flex items-center gap-2 animate-fade-in">
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                    <Zap className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-gradient-primary opacity-50 blur-md -z-10" />
                </div>
                <h2 
                  className="text-base font-display font-bold text-gradient-primary cursor-pointer hover:opacity-90 transition-opacity" 
                  onClick={() => navigate('/')}
                >
                  BlueWhale
                </h2>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow mx-auto">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <SidebarTrigger className="h-7 w-7 shrink-0 ml-auto hover:bg-sidebar-accent rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground" />
          </div>
          
          <SidebarGroupContent className="px-2 py-3">
            <SidebarMenu className="space-y-1">
              {navItems.map((item, index) => {
                if (item.subItems) {
                  const isActive = isGroupActive(item);
                  const isOpen = openGroups.includes(item.title);
                  
                  return (
                    <Collapsible
                      key={item.title}
                      open={isOpen}
                      onOpenChange={(open) => {
                        setOpenGroups(prev => 
                          open 
                            ? [...prev, item.title]
                            : prev.filter(g => g !== item.title)
                        );
                      }}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem
                        onMouseLeave={() => {
                          setOpenGroups(prev => prev.filter(g => g !== item.title));
                        }}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            onMouseEnter={() => {
                              if (!openGroups.includes(item.title)) {
                                setOpenGroups(prev => [...prev, item.title]);
                              }
                            }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                              isActive 
                                ? 'bg-gradient-primary-soft border border-primary/20 text-foreground shadow-sm' 
                                : 'hover:bg-sidebar-accent/80 text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <item.icon className={`h-4 w-4 shrink-0 transition-all duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                            {!isCollapsed && (
                              <>
                                <span className="flex-1 text-sm font-medium">{item.title}</span>
                                <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="animate-accordion-down">
                          <SidebarMenuSub className="ml-3 mt-1 space-y-0.5 border-l border-border/30 pl-3">
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={currentPath === subItem.url}>
                                  <NavLink
                                    to={subItem.url}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                                      currentPath === subItem.url
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground'
                                    }`}
                                    activeClassName="bg-primary/10 text-primary font-medium"
                                  >
                                    {!isCollapsed && <span>{subItem.title}</span>}
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
                return (
                  <SidebarMenuItem 
                    key={item.title}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                          isActive 
                            ? 'bg-gradient-primary-soft border border-primary/20 text-foreground shadow-sm' 
                            : 'hover:bg-sidebar-accent/80 text-muted-foreground hover:text-foreground'
                        }`}
                        activeClassName="bg-gradient-primary-soft border border-primary/20 text-foreground shadow-sm"
                      >
                        <item.icon className={`h-4 w-4 shrink-0 transition-all duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                        {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
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
  );
}