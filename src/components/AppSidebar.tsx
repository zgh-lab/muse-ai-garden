import { Home, Sparkles, MoreHorizontal, User, Bot, ChevronDown } from "lucide-react";
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

  // Check if any subitem is active
  const isGroupActive = (item: typeof navItems[number]) => {
    if (!item.subItems) return false;
    return item.subItems.some(subItem => currentPath === subItem.url);
  };

  return (
    <Sidebar 
      collapsible="icon" 
      className="!border-r border-border/50 backdrop-blur-xl"
    >
      <SidebarContent className="pt-0 flex flex-col justify-start bg-gradient-to-b from-background to-background/95">
        <SidebarGroup>
          <div className="px-2 py-3 flex items-center gap-2 min-w-0 border-b border-border/50">
            {!isCollapsed ? (
              <h2 
                className="text-sm font-bold bg-gradient-primary bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-all duration-base animate-fade-in" 
                onClick={() => navigate('/')}
              >
                BlueWhale
              </h2>
            ) : (
              <div className="w-4" />
            )}
            <SidebarTrigger className="h-6 w-6 shrink-0 hover:bg-sidebar-accent rounded-md transition-all" />
          </div>
          
          <SidebarGroupContent className="px-2 py-2">
            <SidebarMenu className="space-y-1">
              {navItems.map((item, index) => {
                // Items with subItems - Collapsible group
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
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-md transition-all duration-base hover:bg-sidebar-accent hover:translate-x-0.5 ${
                              isActive ? 'bg-sidebar-accent font-medium shadow-sm' : ''
                            }`}
                          >
                            <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                            {!isCollapsed && (
                              <>
                                <span className="flex-1 text-sm">{item.title}</span>
                                <ChevronDown className="h-3 w-3 transition-transform duration-base group-data-[state=open]/collapsible:rotate-180" />
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="animate-slide-down">
                          <SidebarMenuSub className="ml-2 mt-1 space-y-0.5">
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={currentPath === subItem.url}>
                                  <NavLink
                                    to={subItem.url}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-base hover:bg-sidebar-accent hover:translate-x-1"
                                    activeClassName="bg-sidebar-accent text-sidebar-primary font-medium shadow-sm"
                                  >
                                    {!isCollapsed && <span className="text-sm">{subItem.title}</span>}
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
                
                // Regular items without subItems
                return (
                  <SidebarMenuItem 
                    key={item.title}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <SidebarMenuButton asChild isActive={currentPath === item.url}>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-md transition-all duration-base hover:bg-sidebar-accent hover:translate-x-0.5 group"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium shadow-sm"
                      >
                        <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                        {!isCollapsed && <span className="text-sm">{item.title}</span>}
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
