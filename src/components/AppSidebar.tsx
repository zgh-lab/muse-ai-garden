import { Bot, Sparkles, User, ChevronDown } from "lucide-react";
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
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarContent className="pt-0 bg-sidebar">
        <SidebarGroup>
          <div className="px-4 py-4 flex items-center gap-3 border-b border-border/40">
            {!isCollapsed && (
              <span 
                className="font-display font-semibold text-primary text-lg cursor-pointer tracking-tight"
                onClick={() => navigate('/')}
              >
                BlueWhale
              </span>
            )}
            <SidebarTrigger className="h-8 w-8 ml-auto rounded-full" />
          </div>
          
          <SidebarGroupContent className={`py-3 ${isCollapsed ? 'px-2' : 'px-3'}`}>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                if (item.subItems) {
                  const isActive = isGroupActive(item);
                  const isOpen = openGroups.includes(item.title);
                  
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
                            className={`flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200 ${
                              isCollapsed ? 'justify-center px-0' : 'px-3'
                            } ${
                              isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                            {!isCollapsed && (
                              <>
                                <span className="flex-1 text-sm font-medium">{item.title}</span>
                                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-5 mt-1 space-y-0.5 border-l border-border/40 pl-3">
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={currentPath === subItem.url}>
                                  <NavLink
                                    to={subItem.url}
                                    className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                      currentPath === subItem.url
                                        ? 'text-primary font-medium'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                    activeClassName="text-primary font-medium"
                                  >
                                    {!isCollapsed && subItem.title}
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
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200 ${
                          isCollapsed ? 'justify-center px-0' : 'px-3'
                        } ${
                          isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                        }`}
                        activeClassName="bg-primary/10 text-primary"
                      >
                        <item.icon className="h-5 w-5" />
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