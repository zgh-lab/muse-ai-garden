import { useState, useEffect, useMemo, useRef } from "react";
import { mockAssets } from "@/data/mockAssets";
import { Send, Bot, Plus, Image, Video, Music, Sparkles, MoreHorizontal, MessageSquarePlus, Search, Clock, MessageCircle, ImagePlus, Languages, Check, Library, X, FileText, Trash2, Pencil, Share2, Archive, Tag as TagIcon, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import jarvisIcon from "@/assets/jarvis-icon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetLibraryFloating } from "@/components/AssetLibraryFloating";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type ChatMode = "default" | "qa" | "image" | "video" | "audio" | "other";

const chatModes = [
  { id: "default" as ChatMode, label: "对话模式", icon: MessageCircle, color: "text-accent", hoverColor: "hover:bg-muted/60 hover:border-accent/40", activeColor: "bg-white/15 border-accent/60 shadow-lg shadow-accent/20" },
  { id: "image" as ChatMode, label: "AI图片模式", icon: Image, color: "text-primary", hoverColor: "hover:bg-muted/60 hover:border-primary/40", activeColor: "bg-white/15 border-primary/60 shadow-lg shadow-primary/20" },
  { id: "video" as ChatMode, label: "AI视频模式", icon: Video, color: "text-destructive", hoverColor: "hover:bg-muted/60 hover:border-destructive/40", activeColor: "bg-white/15 border-destructive/60 shadow-lg shadow-destructive/20" },
  { id: "audio" as ChatMode, label: "AI音频模式", icon: Music, color: "text-emerald-400", hoverColor: "hover:bg-muted/60 hover:border-emerald-400/40", activeColor: "bg-white/15 border-emerald-400/60 shadow-lg shadow-emerald-400/20" },
];

const modeThemes = {
  default: { iconColor: "text-blue-500", bgColor: "bg-gradient-card" },
  qa: { iconColor: "text-blue-500", bgColor: "bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20" },
  image: { iconColor: "text-purple-500", bgColor: "bg-gradient-to-br from-purple-50 to-background dark:from-purple-950/20" },
  video: { iconColor: "text-red-500", bgColor: "bg-gradient-to-br from-red-50 to-background dark:from-red-950/20" },
  audio: { iconColor: "text-green-500", bgColor: "bg-gradient-to-br from-green-50 to-background dark:from-green-950/20" },
  other: { iconColor: "text-gray-500", bgColor: "bg-gradient-to-br from-gray-50 to-background dark:from-gray-950/20" },
};

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  isArchived?: boolean;
}

export function JarvisChat() {
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chatMode, setChatMode] = useState<ChatMode>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [isAssetLibraryMinimized, setIsAssetLibraryMinimized] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // Handle URL parameters to set initial mode and message
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "你好！我是G社 贾维斯，有什么可以帮助你的吗？",
    },
  ]);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    const message = params.get("message");
    
    if (mode === "image") setChatMode("image");
    else if (mode === "video") setChatMode("video");
    else if (mode === "audio") setChatMode("audio");
    else if (mode === "chat") setChatMode("qa");
    else if (mode === "other") setChatMode("other");
    
    // Add user message from URL if exists
    if (message && message.trim()) {
      setMessages(prev => [
        ...prev,
        { role: "user", content: decodeURIComponent(message) }
      ]);
      
      // Simulate AI response
      setTimeout(() => {
        const modePrefix = mode && mode !== "chat" && mode !== "default" ? `[${mode}功能] ` : "";
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: `${modePrefix}收到您的消息。在实际应用中，这里会连接到真实的AI模型进行回复。`,
          },
        ]);
      }, 1000);
    }
  }, [location.search]);
  const [input, setInput] = useState("");
  
  // Image generation specific settings
  const [aspectRatio, setAspectRatio] = useState("智能");
  const [resolution, setResolution] = useState("4K");
  const [imageCount, setImageCount] = useState("1");
  const [selectedImageTools, setSelectedImageTools] = useState<string[]>(["即梦4.0"]);
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  
  // Image model configurations
  const imageModelConfigs: Record<string, { aspectRatios: string[], resolutions: string[], defaultAspectRatio: string, defaultResolution: string }> = {
    "即梦4.0": {
      aspectRatios: ["智能", "21:9", "16:9", "3:2", "4:3", "1:1", "3:4", "2:3", "9:16"],
      resolutions: ["1K", "2K", "4K"],
      defaultAspectRatio: "智能",
      defaultResolution: "4K"
    },
    "Nano banana pro": {
      aspectRatios: ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"],
      resolutions: ["1K", "2K", "4K"],
      defaultAspectRatio: "16:9",
      defaultResolution: "4K"
    },
    "Kontext": {
      aspectRatios: ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9", "9:21"],
      resolutions: ["1K"],
      defaultAspectRatio: "1:1",
      defaultResolution: "1K"
    },
    "gpt-4o": {
      aspectRatios: ["1:1", "2:3", "3:2"],
      resolutions: ["1K"],
      defaultAspectRatio: "1:1",
      defaultResolution: "1K"
    },
    "Midjourney": {
      aspectRatios: ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9", "9:21"],
      resolutions: ["1K"],
      defaultAspectRatio: "1:1",
      defaultResolution: "1K"
    }
  };
  
  // Get current model config
  const currentModelConfig = selectedImageTools.length === 1 
    ? imageModelConfigs[selectedImageTools[0]] 
    : imageModelConfigs["即梦4.0"]; // Default config when multiple models selected
  
  // Update aspect ratio and resolution when model changes
  useEffect(() => {
    if (selectedImageTools.length === 1) {
      const config = imageModelConfigs[selectedImageTools[0]];
      if (config) {
        // Only update if current value is not in the new options
        if (!config.aspectRatios.includes(aspectRatio)) {
          setAspectRatio(config.defaultAspectRatio);
        }
        if (!config.resolutions.includes(resolution)) {
          setResolution(config.defaultResolution);
        }
      }
    }
  }, [selectedImageTools]);
  
  // Video generation specific settings
  const [videoMode, setVideoMode] = useState("自编");
  const [selectedVideoModels, setSelectedVideoModels] = useState<string[]>(["即梦"]);
  const [videoResolution, setVideoResolution] = useState("768P·普通");
  const [videoDuration, setVideoDuration] = useState("6s");
  
  const imageToolOptions = ["即梦4.0", "Nano banana pro", "Kontext", "gpt-4o", "Midjourney"];
  const videoModelOptions = ["即梦", "可灵", "Veo", "海螺", "Vidu Q2", "Sora"];
  
  // 标签系统 - 与Profile页面共享
  const [availableTags, setAvailableTags] = useState<string[]>(() => {
    const saved = localStorage.getItem('availableTags');
    return saved ? JSON.parse(saved) : ["M71", "M72", "P36", "M98", "M95"];
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [managingTags, setManagingTags] = useState(false);
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [editingTagValue, setEditingTagValue] = useState("");
  const [newTagValue, setNewTagValue] = useState("");
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);
  
  // 筛选标签
  const filteredTags = useMemo(() => {
    if (!tagSearchQuery.trim()) return availableTags;
    return availableTags.filter(tag => 
      tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
    );
  }, [availableTags, tagSearchQuery]);
  
  // 保存标签到 localStorage
  useEffect(() => {
    localStorage.setItem('availableTags', JSON.stringify(availableTags));
  }, [availableTags]);
  
  const handleImageToolToggle = (tool: string, isCtrlKey: boolean = false) => {
    setSelectedImageTools(prev => {
      const isSelected = prev.includes(tool);
      
      // If Ctrl/Cmd key is pressed, toggle in multi-select mode
      if (isCtrlKey) {
        if (isSelected) {
          // Remove if selected, but keep at least one
          return prev.length > 1 ? prev.filter(t => t !== tool) : prev;
        } else {
          // Add to selection
          return [...prev, tool];
        }
      }
      
      // Default behavior (without Ctrl): single selection mode
      if (isSelected) {
        // Keep selected if it's the only one
        return prev.length === 1 ? prev : prev.filter(t => t !== tool);
      } else {
        // Replace selection with this tool
        return [tool];
      }
    });
  };
  
  const handleVideoModelToggle = (model: string, isCtrlKey: boolean = false) => {
    setSelectedVideoModels(prev => {
      const isSelected = prev.includes(model);
      
      // If Ctrl/Cmd key is pressed, toggle in multi-select mode
      if (isCtrlKey) {
        if (isSelected) {
          // Remove if selected, but keep at least one
          return prev.length > 1 ? prev.filter(m => m !== model) : prev;
        } else {
          // Add to selection
          return [...prev, model];
        }
      }
      
      // Default behavior (without Ctrl): single selection mode
      if (isSelected) {
        // Keep selected if it's the only one
        return prev.length === 1 ? prev : prev.filter(m => m !== model);
      } else {
        // Replace selection with this model
        return [model];
      }
    });
  };
  
  // 当选择多个图片模型时，强制张数为1
  useEffect(() => {
    if (selectedImageTools.length > 1) {
      setImageCount("1");
    }
  }, [selectedImageTools]);
  
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>(() => {
    const saved = localStorage.getItem('chatHistories');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: "1", title: "AI图片生成讨论", timestamp: "2小时前", isArchived: false },
      { id: "2", title: "视频剪辑技巧", timestamp: "昨天", isArchived: false },
      { id: "3", title: "音频处理咨询", timestamp: "3天前", isArchived: false },
      { id: "4", title: "应用开发建议", timestamp: "1周前", isArchived: false },
    ];
  });

  // 保存聊天历史到 localStorage
  useEffect(() => {
    localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
  }, [chatHistories]);
  
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  
  const currentTheme = modeThemes[chatMode];

  const handleNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "你好！我是G社 贾维斯，有什么可以帮助你的吗？",
      },
    ]);
    setChatMode("default");
  };

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

  const handleShareChat = (chatId: string) => {
    // TODO: 实现分享功能
    console.log("分享对话:", chatId);
  };

  const handleArchiveChat = (chatId: string) => {
    setChatHistories(prev => 
      prev.map(chat => 
        chat.id === chatId ? { ...chat, isArchived: true } : chat
      )
    );
  };

  const handleModeChange = (mode: ChatMode) => {
    setChatMode(mode);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // 显示上传成功提示
      const fileNames = newFiles.map(f => f.name).join(", ");
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `已上传文件: ${fileNames}` }
      ]);
    }
    // 重置input，允许重复上传同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };


  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    
    setTimeout(() => {
      const modePrefix = chatMode !== "default" ? `[${chatMode}功能] ` : "";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `${modePrefix}这是一个模拟回复。在实际应用中，这里会连接到真实的AI模型。`,
        },
      ]);
    }, 1000);

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // 标签管理函数
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };
  
  const handleSaveTag = (index: number) => {
    if (editingTagValue.trim() && index >= 0 && index < availableTags.length) {
      const newTags = [...availableTags];
      newTags[index] = editingTagValue.trim();
      setAvailableTags(newTags);
      setEditingTagIndex(null);
      setEditingTagValue("");
    }
  };
  
  const handleDeleteTag = (index: number) => {
    setAvailableTags(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleAddNewTag = () => {
    if (newTagValue.trim() && !availableTags.includes(newTagValue.trim())) {
      setAvailableTags(prev => [...prev, newTagValue.trim()]);
      setNewTagValue("");
    }
  };
  
  const handleCloseTagDialog = () => {
    setTagDialogOpen(false);
    setManagingTags(false);
    setEditingTagIndex(null);
    setEditingTagValue("");
    setNewTagValue("");
  };

  return (
    <div className="flex h-full w-full gap-4 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10 pointer-events-none" />
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent pointer-events-none animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary) / 0.2) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div 
        className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: '15s' }}
      />
      <div 
        className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: '20s', animationDelay: '5s' }}
      />
      
      {/* Left Sidebar */}
      <Card className="w-64 flex flex-col bg-card/50 backdrop-blur-sm border-border relative z-10">
        <div className="p-4 space-y-4">
          <Button 
            onClick={handleNewChat}
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            新对话
          </Button>
          
          <Separator />
          
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 h-9"
                >
                  <Search className="h-4 w-4" />
                  搜索聊天
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索聊天..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <Separator />
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              更多对话
            </div>
            <ScrollArea className="h-[300px]">
              {chatHistories
                .filter(chat => 
                  !chat.isArchived && (
                    searchQuery === "" || 
                    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                )
                .map((chat) => (
                  <div key={chat.id} className="relative group mb-1">
                    {editingChatId === chat.id ? (
                      <div className="flex items-center gap-2 px-2 py-2">
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleRenameChat(chat.id);
                            } else if (e.key === 'Escape') {
                              handleCancelRename();
                            }
                          }}
                          className="h-8 text-sm"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => handleRenameChat(chat.id)}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={handleCancelRename}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left h-auto py-2 px-2 pr-20"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{chat.title}</div>
                            <div className="text-xs text-muted-foreground">{chat.timestamp}</div>
                          </div>
                        </Button>
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShareChat(chat.id);
                                }}
                              >
                                <Share2 className="h-4 w-4 mr-2" />
                                共享
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartRename(chat.id, chat.title);
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                重命名
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArchiveChat(chat.id);
                                }}
                              >
                                <Archive className="h-4 w-4 mr-2" />
                                归档
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteHistory(chat.id);
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </>
                    )}
                  </div>
                ))}
            </ScrollArea>
          </div>
        </div>
      </Card>

      {/* Main Chat Area and Asset Library */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 relative z-10">
        <ResizablePanel defaultSize={showAssetLibrary ? 70 : 100} minSize={40} className="overflow-visible">
          <Card className={`h-full flex flex-col ${currentTheme.bgColor} border-border relative overflow-visible`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={jarvisIcon} alt="Jarvis" className="h-10 w-10 rounded-full" />
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 border-2 border-background rounded-full" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">G社 贾维斯</h3>
              <p className="text-xs text-muted-foreground">AI助手</p>
            </div>
          </div>
          
          {/* 右侧资产库按钮 */}
          <Button
            variant={showAssetLibrary ? "default" : "outline"}
            onClick={() => setShowAssetLibrary(!showAssetLibrary)}
            className="gap-2 shadow-sm hover:shadow-md transition-all"
          >
            <Library className="h-4 w-4" />
            <span className="font-medium">个人资产库</span>
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 pb-40">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <Bot className={`h-8 w-8 ${currentTheme.iconColor}`} />
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[70%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area - Floating */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6">
          {/* Mode Selector Bar - Above Input - File Tab Style */}
          <div className="mb-1 backdrop-blur-lg rounded-t-xl pb-0">
            <div className="flex items-end gap-0.5">
              {chatModes.map((mode, index) => {
                const Icon = mode.icon;
                const isActive = chatMode === mode.id;
                return (
                  <Button
                    key={mode.id}
                    variant="ghost"
                    size="sm"
                    className={`group whitespace-nowrap transition-all duration-300 ease-out rounded-t-xl rounded-b-none relative border-2 border-b-0 backdrop-blur-sm overflow-hidden ${
                      isActive 
                        ? `${mode.activeColor} ${mode.color} px-4 py-2 h-11 z-20 font-medium gap-2` 
                        : `bg-card/40 border-border/20 px-0 py-1.5 h-8 hover:h-10 hover:py-2 hover:px-4 hover:z-10 ${mode.hoverColor} ${mode.color} w-[24px] hover:w-auto hover:gap-2 hover:backdrop-blur-md`
                    }`}
                    onClick={() => handleModeChange(mode.id)}
                  >
                    <Icon className={`h-4 w-4 flex-shrink-0 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-70 scale-90 group-hover:opacity-100 group-hover:scale-100'}`} />
                    <span className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${isActive ? 'opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-2 group-hover:w-auto group-hover:opacity-100 group-hover:translate-x-0'}`}>
                      {mode.label}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
          {/* Input Container */}
          <div className="bg-background/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-border/50 p-4">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              />
              
              <Button 
                onClick={handleFileButtonClick}
                size="icon"
                variant="ghost"
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>

              <Input
                placeholder={
                  chatMode === "default"
                    ? "输入消息..."
                    : chatMode === "image"
                    ? "描述你想生成的图片..."
                    : chatMode === "video"
                    ? "描述你想生成的视频..."
                    : chatMode === "audio"
                    ? "描述你想生成的音频..."
                    : "输入消息..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Mode-specific Controls Container */}
            <div className="mt-2 pt-2 border-t border-border/50">
              <div>
                  {/* Default Mode Controls */}
                  {chatMode === "default" && (
                    <div>
                      <div className="flex items-end gap-2 flex-wrap">
                        <div className="space-y-1">
                          <Label className="text-xs">AI模型</Label>
                          <Select defaultValue="gpt4">
                            <SelectTrigger className="h-8 text-xs w-[100px]">
                              <SelectValue placeholder="GPT-4.1" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gpt4">GPT-4.1</SelectItem>
                              <SelectItem value="gpt35">GPT-3.5</SelectItem>
                              <SelectItem value="claude">Claude</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">联网</Label>
                          <Select defaultValue="auto">
                            <SelectTrigger className="h-8 text-xs w-[80px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto">自动</SelectItem>
                              <SelectItem value="always">始终</SelectItem>
                              <SelectItem value="never">禁用</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">思考</Label>
                          <Select defaultValue="normal">
                            <SelectTrigger className="h-8 text-xs w-[80px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">直接</SelectItem>
                              <SelectItem value="deep">深度</SelectItem>
                              <SelectItem value="fast">快速</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Mode Controls */}
                  {chatMode === "image" && (
                    <div className="space-y-2">
                      <div className="flex items-end gap-2 flex-wrap">
                        <div className="space-y-1">
                          <Label className="text-xs">模型 <span className="text-[9px] text-muted-foreground">Ctrl多选</span></Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="h-8 text-xs w-[100px] justify-between">
                                <span className="truncate">
                                  {selectedImageTools.length === 1 
                                    ? selectedImageTools[0] 
                                    : `${selectedImageTools.length}个模型`}
                                </span>
                                <ChevronDown className="h-3 w-3 ml-1 shrink-0" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[280px] p-2" align="start">
                              <div className="flex flex-wrap gap-1.5">
                                {imageToolOptions.map((tool) => (
                                  <Badge
                                    key={tool}
                                    variant={selectedImageTools.includes(tool) ? "default" : "outline"}
                                    className="cursor-pointer hover:bg-primary/90 transition-colors text-xs py-0.5"
                                    onClick={(e) => handleImageToolToggle(tool, e.ctrlKey || e.metaKey)}
                                  >
                                    {selectedImageTools.includes(tool) && <Check className="h-3 w-3 mr-1" />}
                                    {tool}
                                  </Badge>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">比例</Label>
                          <Select value={aspectRatio} onValueChange={setAspectRatio}>
                            <SelectTrigger className="h-8 text-xs w-[70px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {currentModelConfig.aspectRatios.map((ratio) => (
                                <SelectItem key={ratio} value={ratio}>{ratio}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">清晰度</Label>
                          <Select value={resolution} onValueChange={setResolution}>
                            <SelectTrigger className="h-8 text-xs w-[55px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {currentModelConfig.resolutions.map((res) => (
                                <SelectItem key={res} value={res}>{res}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">张数</Label>
                          <Select 
                            value={imageCount} 
                            onValueChange={setImageCount}
                            disabled={selectedImageTools.length > 1}
                          >
                            <SelectTrigger className="h-8 text-xs w-[55px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1张</SelectItem>
                              <SelectItem value="2">2张</SelectItem>
                              <SelectItem value="4">4张</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="h-6 w-px bg-border/50" />
                        
                        <div className="space-y-1 flex-1 min-w-[100px]">
                          <Label className="text-xs">标签</Label>
                          <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
                            <PopoverTrigger asChild>
                              <div className="relative">
                                <TagIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                  placeholder="搜索标签..."
                                  value={tagSearchQuery}
                                  onChange={(e) => setTagSearchQuery(e.target.value)}
                                  onFocus={() => setTagPopoverOpen(true)}
                                  className="h-8 pl-8 text-xs"
                                />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-2" align="start">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between px-2">
                                  <span className="text-xs font-medium">选择标签</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setTagPopoverOpen(false);
                                      setManagingTags(true);
                                      setTagDialogOpen(true);
                                    }}
                                    className="h-6 text-xs"
                                  >
                                    管理标签
                                  </Button>
                                </div>
                                <Separator />
                                <ScrollArea className="max-h-[200px]">
                                  <div className="space-y-1">
                                    {filteredTags.length > 0 ? (
                                      filteredTags.map((tag) => (
                                        <div
                                          key={tag}
                                          className="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
                                          onClick={() => toggleTag(tag)}
                                        >
                                          <Checkbox
                                            id={`tag-popover-${tag}`}
                                            checked={selectedTags.includes(tag)}
                                            onCheckedChange={() => toggleTag(tag)}
                                          />
                                          <Label
                                            htmlFor={`tag-popover-${tag}`}
                                            className="flex-1 cursor-pointer text-xs"
                                          >
                                            {tag}
                                          </Label>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-xs text-muted-foreground text-center py-4">
                                        未找到匹配的标签
                                      </div>
                                    )}
                                  </div>
                                </ScrollArea>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      {/* 已选标签显示 */}
                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {selectedTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs cursor-pointer"
                              onClick={() => toggleTag(tag)}
                            >
                              {tag}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}


                  {/* Video Mode Controls */}
                  {chatMode === "video" && (
                    <div className="space-y-2">
                      <div className="flex items-end gap-2 flex-wrap">
                        <div className="space-y-1">
                          <Label className="text-xs">清晰度</Label>
                          <Select value={videoResolution} onValueChange={setVideoResolution}>
                            <SelectTrigger className="h-8 text-xs w-[90px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="768P·普通">768P</SelectItem>
                              <SelectItem value="1080P·高清">1080P</SelectItem>
                              <SelectItem value="4K·超清">4K</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">时长</Label>
                          <Select value={videoDuration} onValueChange={setVideoDuration}>
                            <SelectTrigger className="h-8 text-xs w-[55px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3s">3秒</SelectItem>
                              <SelectItem value="6s">6秒</SelectItem>
                              <SelectItem value="10s">10秒</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">模型 <span className="text-[9px] text-muted-foreground">Ctrl多选</span></Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="h-8 text-xs w-[100px] justify-between">
                                <span className="truncate">
                                  {selectedVideoModels.length === 1 
                                    ? selectedVideoModels[0] 
                                    : `${selectedVideoModels.length}个模型`}
                                </span>
                                <ChevronDown className="h-3 w-3 ml-1 shrink-0" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[280px] p-2" align="start">
                              <div className="flex flex-wrap gap-1.5">
                                {videoModelOptions.map((model) => (
                                  <Badge
                                    key={model}
                                    variant={selectedVideoModels.includes(model) ? "default" : "outline"}
                                    className="cursor-pointer hover:bg-primary/90 transition-colors text-xs py-0.5"
                                    onClick={(e) => handleVideoModelToggle(model, e.ctrlKey || e.metaKey)}
                                  >
                                    {selectedVideoModels.includes(model) && <Check className="h-3 w-3 mr-1" />}
                                    {model}
                                  </Badge>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="h-6 w-px bg-border/50" />
                        
                        <div className="space-y-1 flex-1 min-w-[100px]">
                          <Label className="text-xs">标签</Label>
                          <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
                            <PopoverTrigger asChild>
                              <div className="relative">
                                <TagIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                  placeholder="搜索标签..."
                                  value={tagSearchQuery}
                                  onChange={(e) => setTagSearchQuery(e.target.value)}
                                  onFocus={() => setTagPopoverOpen(true)}
                                  className="h-8 pl-8 text-xs"
                                />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-2" align="start">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between px-2">
                                  <span className="text-xs font-medium">选择标签</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setTagPopoverOpen(false);
                                      setManagingTags(true);
                                      setTagDialogOpen(true);
                                    }}
                                    className="h-6 text-xs"
                                  >
                                    管理标签
                                  </Button>
                                </div>
                                <Separator />
                                <ScrollArea className="max-h-[200px]">
                                  <div className="space-y-1">
                                    {filteredTags.length > 0 ? (
                                      filteredTags.map((tag) => (
                                        <div
                                          key={tag}
                                          className="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
                                          onClick={() => toggleTag(tag)}
                                        >
                                          <Checkbox
                                            id={`tag-popover-video-${tag}`}
                                            checked={selectedTags.includes(tag)}
                                            onCheckedChange={() => toggleTag(tag)}
                                          />
                                          <Label
                                            htmlFor={`tag-popover-video-${tag}`}
                                            className="flex-1 cursor-pointer text-xs"
                                          >
                                            {tag}
                                          </Label>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-xs text-muted-foreground text-center py-4">
                                        未找到匹配的标签
                                      </div>
                                    )}
                                  </div>
                                </ScrollArea>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      {/* 已选标签显示 */}
                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {selectedTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs cursor-pointer"
                              onClick={() => toggleTag(tag)}
                            >
                              {tag}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
            
                  {/* Audio Mode Controls */}
                  {chatMode === "audio" && (
                    <div className="space-y-2">
                      <div className="flex items-end gap-2 flex-wrap">
                        <div className="space-y-1">
                          <Label className="text-xs">类型</Label>
                          <Select defaultValue="music">
                            <SelectTrigger className="h-8 text-xs w-[80px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="music">音乐</SelectItem>
                              <SelectItem value="voice">语音</SelectItem>
                              <SelectItem value="effect">音效</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">格式</Label>
                          <Select defaultValue="mp3">
                            <SelectTrigger className="h-8 text-xs w-[60px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mp3">MP3</SelectItem>
                              <SelectItem value="wav">WAV</SelectItem>
                              <SelectItem value="flac">FLAC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">时长</Label>
                          <Select defaultValue="30s">
                            <SelectTrigger className="h-8 text-xs w-[55px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15s">15秒</SelectItem>
                              <SelectItem value="30s">30秒</SelectItem>
                              <SelectItem value="60s">60秒</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="h-6 w-px bg-border/50" />
                        
                        <div className="space-y-1 flex-1 min-w-[100px]">
                          <Label className="text-xs">标签</Label>
                          <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
                            <PopoverTrigger asChild>
                              <div className="relative">
                                <TagIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                  placeholder="搜索标签..."
                                  value={tagSearchQuery}
                                  onChange={(e) => setTagSearchQuery(e.target.value)}
                                  onFocus={() => setTagPopoverOpen(true)}
                                  className="h-8 pl-8 text-xs"
                                />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-2" align="start">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between px-2">
                                  <span className="text-xs font-medium">选择标签</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setTagPopoverOpen(false);
                                      setManagingTags(true);
                                      setTagDialogOpen(true);
                                    }}
                                    className="h-6 text-xs"
                                  >
                                    管理标签
                                  </Button>
                                </div>
                                <Separator />
                                <ScrollArea className="max-h-[200px]">
                                  <div className="space-y-1">
                                    {filteredTags.length > 0 ? (
                                      filteredTags.map((tag) => (
                                        <div
                                          key={tag}
                                          className="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer"
                                          onClick={() => toggleTag(tag)}
                                        >
                                          <Checkbox
                                            id={`tag-audio-${tag}`}
                                            checked={selectedTags.includes(tag)}
                                            onCheckedChange={() => toggleTag(tag)}
                                          />
                                          <Label
                                            htmlFor={`tag-audio-${tag}`}
                                            className="flex-1 cursor-pointer text-xs"
                                          >
                                            {tag}
                                          </Label>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-xs text-muted-foreground text-center py-4">
                                        未找到匹配的标签
                                      </div>
                                    )}
                                  </div>
                                </ScrollArea>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      {/* 已选标签显示 */}
                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {selectedTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs cursor-pointer"
                              onClick={() => toggleTag(tag)}
                            >
                              {tag}
                              <X className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </Card>
        </ResizablePanel>
        
        {showAssetLibrary && (
          <>
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
              <AssetLibraryFloating
                isMinimized={isAssetLibraryMinimized}
                onMinimize={() => setIsAssetLibraryMinimized(!isAssetLibraryMinimized)}
                onClose={() => setShowAssetLibrary(false)}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
      
      {/* 标签管理对话框 */}
      <Dialog open={tagDialogOpen} onOpenChange={handleCloseTagDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {managingTags ? "管理标签" : "选择标签"}
            </DialogTitle>
          </DialogHeader>
          
          {!managingTags ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm">选择标签</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setManagingTags(true)}
                    className="text-xs h-7"
                  >
                    管理标签
                  </Button>
                </div>
                {availableTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <Label
                      htmlFor={`tag-${tag}`}
                      className="flex-1 cursor-pointer"
                    >
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCloseTagDialog}>
                  关闭
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {availableTags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {editingTagIndex === index ? (
                      <>
                        <Input
                          value={editingTagValue}
                          onChange={(e) => setEditingTagValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveTag(index);
                            } else if (e.key === 'Escape') {
                              setEditingTagIndex(null);
                              setEditingTagValue("");
                            }
                          }}
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSaveTag(index)}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingTagIndex(null);
                            setEditingTagValue("");
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1">{tag}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingTagIndex(index);
                            setEditingTagValue(tag);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTag(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
                
                <div className="flex items-center gap-2 pt-2">
                  <Input
                    placeholder="添加新标签"
                    value={newTagValue}
                    onChange={(e) => setNewTagValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddNewTag();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleAddNewTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setManagingTags(false)}>
                  返回
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
