import { Bot, Sparkles, User, Plus, Search, MoreHorizontal, Pencil, Archive, Trash2, Check, X, MessageSquare, PanelLeftClose, PanelLeft } from "lucide-react";
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
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen">
        {/* Left Column - Icon Navigation (Always visible) */}
        <div className="w-14 bg-sidebar flex flex-col border-r border-sidebar-border shrink-0">
          {/* Logo */}
          <div className="h-14 flex items-center justify-center border-b border-sidebar-border">
            <button 
              onClick={() => navigate('/')}
              className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center hover:bg-primary/25 transition-colors"
            >
              <span className="font-display font-bold text-primary text-sm">B</span>
            </button>
          </div>

          {/* Navigation Icons */}
          <nav className="flex-1 flex flex-col items-center py-3 gap-1">
            {navItems.map((item) => {
              const isActive = item.url ? currentPath === item.url : isGroupActive(item);
              const hasSubItems = !!item.subItems;
              
              return (
                <div 
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => hasSubItems && setHoveredItem(item.title)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {item.url ? (
                        <NavLink
                          to={item.url}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                            isActive 
                              ? 'bg-primary/15 text-primary' 
                              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                          }`}
                          activeClassName="bg-primary/15 text-primary"
                        >
                          <item.icon className="h-5 w-5" />
                        </NavLink>
                      ) : (
                        <button
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                            isActive 
                              ? 'bg-primary/15 text-primary' 
                              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                        </button>
                      )}
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      {item.title}
                    </TooltipContent>
                  </Tooltip>

                  {/* Sub-items dropdown on hover */}
                  {hasSubItems && hoveredItem === item.title && (
                    <div className="absolute left-full top-0 ml-2 z-50 animate-fade-in">
                      <div className="bg-popover border border-border rounded-xl p-2 shadow-lg min-w-[160px]">
                        {item.subItems?.map((subItem) => (
                          <NavLink
                            key={subItem.url}
                            to={subItem.url}
                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                              currentPath === subItem.url
                                ? 'bg-primary/15 text-primary font-medium'
                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }`}
                          >
                            {subItem.title}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Panel Toggle (only on Jarvis page) */}
          {isJarvisPage && (
            <div className="pb-3 flex justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsPanelOpen(!isPanelOpen)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-all duration-200"
                  >
                    {isPanelOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {isPanelOpen ? '收起面板' : '展开面板'}
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Right Column - Context Panel (Chat History) */}
        {isJarvisPage && isPanelOpen && (
          <div className="w-56 bg-sidebar/50 flex flex-col border-r border-sidebar-border animate-fade-in">
            {/* Panel Header */}
            <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
              <span className="text-sm font-medium text-foreground">对话历史</span>
            </div>

            {/* New Chat Button */}
            <div className="p-3">
              <Button 
                onClick={onNewChat}
                className="w-full justify-center gap-2 h-9 text-sm rounded-xl"
                variant="default"
              >
                <Plus className="h-4 w-4" />
                新建对话
              </Button>
            </div>
            
            {/* Search */}
            <div className="px-3 pb-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="搜索历史..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs bg-secondary/40 border-0 rounded-lg"
                />
              </div>
            </div>
            
            {/* Chat List */}
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
                            <DropdownMenuItem 
                              onClick={() => handleDeleteHistory(chat.id)} 
                              className="text-xs text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                ))}
                
                {filteredChats.length === 0 && (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    暂无对话记录
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
