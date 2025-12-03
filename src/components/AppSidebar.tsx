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
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="pt-0 bg-sidebar">
        <SidebarGroup>
          <div className="px-3 py-3 flex items-center gap-2 border-b border-border">
            {!isCollapsed && (
              <span 
                className="font-semibold text-primary cursor-pointer"
                onClick={() => navigate('/')}
              >
                BlueWhale
              </span>
            )}
            <SidebarTrigger className="h-7 w-7 ml-auto" />
          </div>
          
          <SidebarGroupContent className="px-2 py-2">
            <SidebarMenu className="space-y-0.5">
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
                            className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-colors ${
                              isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                            {!isCollapsed && (
                              <>
                                <span className="flex-1 text-sm">{item.title}</span>
                                <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-4 mt-1 space-y-0.5 border-l border-border pl-2">
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={currentPath === subItem.url}>
                                  <NavLink
                                    to={subItem.url}
                                    className={`px-2 py-1.5 rounded text-sm transition-colors ${
                                      currentPath === subItem.url
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                    activeClassName="text-primary"
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
                        className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-colors ${
                          isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }`}
                        activeClassName="bg-secondary text-foreground"
                      >
                        <item.icon className="h-4 w-4" />
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