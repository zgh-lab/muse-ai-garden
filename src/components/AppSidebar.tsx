import { Bot, Sparkles, User, ChevronDown, Menu, Plus, Search, MoreHorizontal, Pencil, Archive, Trash2, Check, X, MessageSquare } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  isArchived?: boolean;
}

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
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
}

export function AppSidebar({ onHoverExpandChange, onNewChat, onSelectChat }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const isCollapsed = state === "collapsed";
  const isJarvisPage = currentPath === "/" || currentPath === "/jarvis";

  // Chat histories state
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>(() => {
    const saved = localStorage.getItem('chatHistories');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: "1", title: "AI图片生成讨论", timestamp: "2小时前", isArchived: false },
      { id: "2", title: "视频剪辑技巧", timestamp: "昨天", isArchived: false },
      { id: "3", title: "音频处理咨询", timestamp: "3天前", isArchived: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
  }, [chatHistories]);

  const handleDeleteHistory = (id: string) => {
    setChatHistories(prev => prev.filter(chat => chat.id !== id));
  };

  const handleStartRename = (id: string, currentTitle: string) => {
    setEditingChatId(id);
    setEditingTitle(currentTitle);
  };

  const handleRenameChat = (id: string) => {
    if (editingTitle.trim()) {
      setChatHistories(prev => 
        prev.map(chat => 
          chat.id === id ? { ...chat, title: editingTitle.trim() } : chat
        )
      );
    }
    setEditingChatId(null);
    setEditingTitle("");
  };

  const handleCancelRename = () => {
    setEditingChatId(null);
    setEditingTitle("");
  };

  const handleArchiveChat = (chatId: string) => {
    setChatHistories(prev => 
      prev.map(chat => 
        chat.id === chatId ? { ...chat, isArchived: true } : chat
      )
    );
  };

  const filteredChats = chatHistories.filter(chat => 
    !chat.isArchived && (
      searchQuery === "" || 
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
            <div className={`flex items-center border-b border-border/30 ${isCollapsed ? 'flex-col py-3 px-1' : 'px-4 py-4 gap-3'}`}>
              {!isCollapsed && (
                <span 
                  className="font-display font-semibold text-primary text-lg cursor-pointer tracking-tight"
                  onClick={() => navigate('/')}
                >
                  BlueWhale
                </span>
              )}
              <SidebarTrigger className={`h-8 w-8 rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center ${isCollapsed ? '' : 'ml-auto'}`}>
                <Menu className="h-4 w-4" />
              </SidebarTrigger>
            </div>
            
            {/* Navigation */}
            <SidebarGroupContent className={`${isCollapsed ? 'py-3 px-1' : 'py-4 px-3'}`}>
              <SidebarMenu className={isCollapsed ? 'space-y-1 flex flex-col items-center' : 'space-y-1'}>
                {navItems.map((item) => {
                  if (item.subItems) {
                    const isActive = isGroupActive(item);
                    const isOpen = openGroups.includes(item.title);
                    
                    if (isCollapsed) {
                      return (
                        <SidebarMenuItem key={item.title} className="w-full flex justify-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                                  isActive 
                                    ? 'bg-primary/15 text-primary' 
                                    : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                                }`}
                              >
                                <item.icon className="h-[18px] w-[18px]" />
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
                      <SidebarMenuItem key={item.title} className="w-full flex justify-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton asChild isActive={isActive}>
                              <NavLink
                                to={item.url}
                                className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                                  isActive 
                                    ? 'bg-primary/15 text-primary' 
                                    : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                                }`}
                                activeClassName="bg-primary/15 text-primary"
                              >
                                <item.icon className="h-[18px] w-[18px]" />
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

          {/* Jarvis Chat History - Only show on Jarvis page and when expanded */}
          {isJarvisPage && !isCollapsed && (
            <SidebarGroup className="flex-1 flex flex-col min-h-0 border-t border-border/30">
              <div className="px-3 py-3">
                <Button 
                  onClick={onNewChat}
                  className="w-full justify-center gap-2 h-9 text-sm"
                  variant="default"
                >
                  <Plus className="h-4 w-4" />
                  新建对话
                </Button>
              </div>
              
              <div className="px-3 pb-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="搜索历史..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 text-xs bg-secondary/40 border-0"
                  />
                </div>
              </div>
              
              <ScrollArea className="flex-1 px-2">
                <div className="space-y-0.5 pb-2">
                  {filteredChats.map((chat) => (
                    <div key={chat.id} className="group relative">
                      {editingChatId === chat.id ? (
                        <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRenameChat(chat.id);
                              else if (e.key === 'Escape') handleCancelRename();
                            }}
                            className="h-7 text-xs border-0 bg-transparent"
                            autoFocus
                          />
                          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => handleRenameChat(chat.id)}>
                            <Check className="h-3 w-3 text-success" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={handleCancelRename}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <button 
                            onClick={() => onSelectChat?.(chat.id)}
                            className="flex-1 text-left px-2.5 py-2 rounded-lg text-xs hover:bg-secondary/60 transition-all duration-200"
                          >
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="truncate text-foreground/90">{chat.title}</span>
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5 ml-5">{chat.timestamp}</div>
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32 rounded-lg">
                              <DropdownMenuItem onClick={() => handleStartRename(chat.id, chat.title)} className="text-xs">
                                <Pencil className="h-3.5 w-3.5 mr-2" />重命名
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleArchiveChat(chat.id)} className="text-xs">
                                <Archive className="h-3.5 w-3.5 mr-2" />归档
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteHistory(chat.id)} className="text-destructive text-xs">
                                <Trash2 className="h-3.5 w-3.5 mr-2" />删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </SidebarGroup>
          )}
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}