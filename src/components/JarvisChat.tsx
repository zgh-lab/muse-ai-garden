import { useState, useEffect, useMemo, useRef } from "react";
import { mockAssets } from "@/data/mockAssets";
import { Send, Bot, Image, Video, Music, MessageCircle, Library, Tag as TagIcon, ChevronDown, Paperclip, Plus, X, Check, Pencil, Trash2, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";
import jarvisIcon from "@/assets/jarvis-icon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { AssetLibraryFloating } from "@/components/AssetLibraryFloating";
import { WhaleAnimation } from "@/components/WhaleAnimation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type ChatMode = "default" | "qa" | "image" | "video" | "audio" | "other";

const chatModes = [
  { id: "default" as ChatMode, label: "对话", icon: MessageCircle },
  { id: "image" as ChatMode, label: "图片", icon: Image },
  { id: "video" as ChatMode, label: "视频", icon: Video },
  { id: "audio" as ChatMode, label: "音频", icon: Music },
];

interface JarvisChatProps {
  onNewChat?: () => void;
}

export function JarvisChat({ onNewChat }: JarvisChatProps) {
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chatMode, setChatMode] = useState<ChatMode>("default");
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [isAssetLibraryMinimized, setIsAssetLibraryMinimized] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
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
    
    if (message && message.trim()) {
      setMessages(prev => [
        ...prev,
        { role: "user", content: decodeURIComponent(message) }
      ]);
      
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
  
  // Image generation settings
  const [aspectRatio, setAspectRatio] = useState("智能");
  const [resolution, setResolution] = useState("4K");
  const [imageCount, setImageCount] = useState("1");
  const [selectedImageTools, setSelectedImageTools] = useState<string[]>(["即梦4.0"]);
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [promptExpansion, setPromptExpansion] = useState(false);
  
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
  
  const currentModelConfig = selectedImageTools.length === 1 
    ? imageModelConfigs[selectedImageTools[0]] 
    : imageModelConfigs["即梦4.0"];
  
  useEffect(() => {
    if (selectedImageTools.length === 1) {
      const config = imageModelConfigs[selectedImageTools[0]];
      if (config) {
        if (!config.aspectRatios.includes(aspectRatio)) {
          setAspectRatio(config.defaultAspectRatio);
        }
        if (!config.resolutions.includes(resolution)) {
          setResolution(config.defaultResolution);
        }
      }
    }
  }, [selectedImageTools]);
  
  // Video settings
  const [videoMode, setVideoMode] = useState("自编");
  const [selectedVideoModels, setSelectedVideoModels] = useState<string[]>(["即梦"]);
  const [videoResolution, setVideoResolution] = useState("768P·普通");
  const [videoDuration, setVideoDuration] = useState("6s");
  
  const imageToolOptions = ["即梦4.0", "Nano banana pro", "Kontext", "gpt-4o", "Midjourney"];
  const videoModelOptions = ["即梦", "可灵", "Veo", "海螺", "Vidu Q2", "Sora"];
  
  // Tags
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
  
  const filteredTags = useMemo(() => {
    if (!tagSearchQuery.trim()) return availableTags;
    return availableTags.filter(tag => 
      tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
    );
  }, [availableTags, tagSearchQuery]);
  
  useEffect(() => {
    localStorage.setItem('availableTags', JSON.stringify(availableTags));
  }, [availableTags]);
  
  const handleImageToolToggle = (tool: string, isCtrlKey: boolean = false) => {
    setSelectedImageTools(prev => {
      const isSelected = prev.includes(tool);
      if (isCtrlKey) {
        if (isSelected) {
          return prev.length > 1 ? prev.filter(t => t !== tool) : prev;
        } else {
          return [...prev, tool];
        }
      }
      if (isSelected) {
        return prev.length === 1 ? prev : prev.filter(t => t !== tool);
      } else {
        return [tool];
      }
    });
  };
  
  const handleVideoModelToggle = (model: string, isCtrlKey: boolean = false) => {
    setSelectedVideoModels(prev => {
      const isSelected = prev.includes(model);
      if (isCtrlKey) {
        if (isSelected) {
          return prev.length > 1 ? prev.filter(m => m !== model) : prev;
        } else {
          return [...prev, model];
        }
      }
      if (isSelected) {
        return prev.length === 1 ? prev : prev.filter(m => m !== model);
      } else {
        return [model];
      }
    });
  };
  
  useEffect(() => {
    if (selectedImageTools.length > 1) {
      setImageCount("1");
    }
  }, [selectedImageTools]);

  const handleModeChange = (mode: ChatMode) => {
    setChatMode(mode);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      const fileNames = newFiles.map(f => f.name).join(", ");
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `已上传文件: ${fileNames}` }
      ]);
    }
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

  const handleNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "你好！我是G社 贾维斯，有什么可以帮助你的吗？",
      },
    ]);
    setChatMode("default");
    onNewChat?.();
  };

  return (
    <div className="flex h-full w-full bg-living-gradient relative overflow-hidden">
      {/* Ambient glow background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-breathe-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
      </div>

      {/* Asset Library Toggle Button - Top Right */}
      <Button
        variant={showAssetLibrary ? "default" : "outline"}
        size="sm"
        onClick={() => setShowAssetLibrary(!showAssetLibrary)}
        className={`absolute top-4 right-4 z-20 gap-2 transition-all duration-300 living-hover living-active ${
          showAssetLibrary ? "animate-pulse-glow glow-primary-subtle" : "hover:glow-primary-subtle"
        }`}
      >
        <Library className={`h-4 w-4 transition-transform duration-300 ${showAssetLibrary ? "animate-icon-breathe" : ""}`} />
        资产库
      </Button>

      {/* Main Chat Area */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={showAssetLibrary ? 70 : 100} minSize={50}>
          <div className="flex flex-col h-full">
            {/* Messages */}
            <ScrollArea className="flex-1 px-6 py-6 relative">
              <WhaleAnimation />
              <div className="max-w-3xl mx-auto space-y-5 relative z-10">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 animate-scale-in ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {message.role === "assistant" && (
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center shrink-0 animate-gentle-bob glow-primary-subtle">
                        <Bot className="h-5 w-5 text-primary animate-glow-pulse" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-5 py-3 max-w-[75%] text-sm leading-relaxed transition-all duration-300 hover:scale-[1.01] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground glow-primary-subtle"
                          : "bg-secondary/70 hover:bg-secondary/80 card-alive"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border/40 p-5 bg-background/80 backdrop-blur-sm relative">
              {/* Subtle glow line on border */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-breathe" />
              
              <div className="max-w-3xl mx-auto space-y-4">
                {/* Mode Tabs */}
                <div className="flex gap-2">
                  {chatModes.map((mode, idx) => {
                    const Icon = mode.icon;
                    const isActive = chatMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => handleModeChange(mode.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 living-active ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-glow animate-pulse-glow"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 hover:scale-105"
                        }`}
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        <Icon className={`h-4 w-4 transition-all duration-300 ${isActive ? "animate-icon-breathe" : ""}`} />
                        {mode.label}
                      </button>
                    );
                  })}
                </div>

                {/* Input */}
                <div className="flex gap-3 items-center relative group">
                  {/* Input glow effect on focus */}
                  <div className="absolute inset-0 -m-1 rounded-2xl bg-primary/0 group-focus-within:bg-primary/5 transition-all duration-500 blur-xl pointer-events-none" />
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleFileButtonClick} 
                    className="shrink-0 transition-all duration-300 hover:scale-110 hover:text-primary hover:bg-primary/10 living-active"
                  >
                    <Paperclip className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
                  </Button>
                  <Input
                    placeholder={
                      chatMode === "default" ? "输入你的问题..." :
                      chatMode === "image" ? "描述你想生成的图片..." :
                      chatMode === "video" ? "描述你想生成的视频..." :
                      chatMode === "audio" ? "描述你想生成的音频..." : "输入消息..."
                    }
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 h-12 text-base transition-all duration-300 focus:shadow-glow focus:border-primary/50 relative z-10"
                  />
                  <Button 
                    onClick={handleSend} 
                    size="icon" 
                    className="h-11 w-11 shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-glow-lg living-active group/send"
                  >
                    <Send className="h-5 w-5 transition-transform duration-300 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5" />
                  </Button>
                </div>

                {/* Mode Controls */}
                {chatMode === "default" && (
                  <div className="flex gap-2 flex-wrap">
                    <Select defaultValue="gpt4">
                      <SelectTrigger className="h-7 text-xs w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt4">GPT-4.1</SelectItem>
                        <SelectItem value="gpt35">GPT-3.5</SelectItem>
                        <SelectItem value="claude">Claude</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="auto">
                      <SelectTrigger className="h-7 text-xs w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">联网:自动</SelectItem>
                        <SelectItem value="always">联网:始终</SelectItem>
                        <SelectItem value="never">联网:禁用</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {chatMode === "image" && (
                  <div className="flex gap-2 flex-wrap items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          {selectedImageTools.length === 1 ? selectedImageTools[0] : `${selectedImageTools.length}个模型`}
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2" align="start">
                        <div className="flex flex-wrap gap-1">
                          {imageToolOptions.map((tool) => (
                            <Badge
                              key={tool}
                              variant={selectedImageTools.includes(tool) ? "default" : "outline"}
                              className="cursor-pointer text-xs"
                              onClick={(e) => handleImageToolToggle(tool, e.ctrlKey || e.metaKey)}
                            >
                              {selectedImageTools.includes(tool) && <Check className="h-3 w-3 mr-1" />}
                              {tool}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2">按住 Ctrl 可多选</p>
                      </PopoverContent>
                    </Popover>
                    
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger className="h-7 text-xs w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currentModelConfig.aspectRatios.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={resolution} onValueChange={setResolution}>
                      <SelectTrigger className="h-7 text-xs w-14">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currentModelConfig.resolutions.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={imageCount} onValueChange={setImageCount} disabled={selectedImageTools.length > 1}>
                      <SelectTrigger className="h-7 text-xs w-14">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1张</SelectItem>
                        <SelectItem value="2">2张</SelectItem>
                        <SelectItem value="4">4张</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                          <TagIcon className="h-3 w-3" />
                          {selectedTags.length > 0 ? `${selectedTags.length}个标签` : "标签"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2" align="start">
                        <Input
                          placeholder="搜索标签..."
                          value={tagSearchQuery}
                          onChange={(e) => setTagSearchQuery(e.target.value)}
                          className="h-7 text-xs mb-2"
                        />
                        <ScrollArea className="max-h-40">
                          <div className="space-y-1">
                            {filteredTags.map((tag) => (
                              <div key={tag} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-secondary cursor-pointer" onClick={() => toggleTag(tag)}>
                                <Checkbox checked={selectedTags.includes(tag)} />
                                <span className="text-xs">{tag}</span>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <Separator className="my-2" />
                        <Button variant="ghost" size="sm" className="w-full h-7 text-xs" onClick={() => { setTagPopoverOpen(false); setManagingTags(true); setTagDialogOpen(true); }}>
                          管理标签
                        </Button>
                      </PopoverContent>
                    </Popover>
                    
                    <Button 
                      variant={promptExpansion ? "default" : "outline"} 
                      size="sm" 
                      className="h-7 text-xs gap-1"
                      onClick={() => setPromptExpansion(!promptExpansion)}
                    >
                      <Sparkles className="h-3 w-3" />
                      扩写
                    </Button>
                    
                    {selectedTags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {selectedTags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs cursor-pointer" onClick={() => toggleTag(tag)}>
                            {tag}<X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {chatMode === "video" && (
                  <div className="flex gap-2 flex-wrap items-center">
                    <Select value={videoResolution} onValueChange={setVideoResolution}>
                      <SelectTrigger className="h-7 text-xs w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="768P·普通">768P</SelectItem>
                        <SelectItem value="1080P·高清">1080P</SelectItem>
                        <SelectItem value="4K·超清">4K</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={videoDuration} onValueChange={setVideoDuration}>
                      <SelectTrigger className="h-7 text-xs w-14">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3s">3秒</SelectItem>
                        <SelectItem value="6s">6秒</SelectItem>
                        <SelectItem value="10s">10秒</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          {selectedVideoModels.length === 1 ? selectedVideoModels[0] : `${selectedVideoModels.length}个模型`}
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2" align="start">
                        <div className="flex flex-wrap gap-1">
                          {videoModelOptions.map((model) => (
                            <Badge
                              key={model}
                              variant={selectedVideoModels.includes(model) ? "default" : "outline"}
                              className="cursor-pointer text-xs"
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
                )}

                {chatMode === "audio" && (
                  <div className="flex gap-2 flex-wrap">
                    <Select defaultValue="music">
                      <SelectTrigger className="h-7 text-xs w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="music">音乐</SelectItem>
                        <SelectItem value="voice">语音</SelectItem>
                        <SelectItem value="effect">音效</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="mp3">
                      <SelectTrigger className="h-7 text-xs w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp3">MP3</SelectItem>
                        <SelectItem value="wav">WAV</SelectItem>
                        <SelectItem value="flac">FLAC</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="30s">
                      <SelectTrigger className="h-7 text-xs w-14">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15s">15秒</SelectItem>
                        <SelectItem value="30s">30秒</SelectItem>
                        <SelectItem value="60s">60秒</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>
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
      
      {/* Tag Dialog */}
      <Dialog open={tagDialogOpen} onOpenChange={handleCloseTagDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{managingTags ? "管理标签" : "选择标签"}</DialogTitle>
          </DialogHeader>
          
          {!managingTags ? (
            <div className="space-y-4">
              {availableTags.map((tag) => (
                <div key={tag} className="flex items-center gap-2">
                  <Checkbox id={`tag-${tag}`} checked={selectedTags.includes(tag)} onCheckedChange={() => toggleTag(tag)} />
                  <Label htmlFor={`tag-${tag}`} className="cursor-pointer">{tag}</Label>
                </div>
              ))}
              <div className="flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => setManagingTags(true)}>管理标签</Button>
                <Button variant="outline" size="sm" onClick={handleCloseTagDialog}>关闭</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {availableTags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2">
                  {editingTagIndex === index ? (
                    <>
                      <Input value={editingTagValue} onChange={(e) => setEditingTagValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTag(index); else if (e.key === 'Escape') { setEditingTagIndex(null); setEditingTagValue(""); }}} className="flex-1" autoFocus />
                      <Button size="icon" variant="ghost" onClick={() => handleSaveTag(index)}><Check className="h-4 w-4 text-success" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => { setEditingTagIndex(null); setEditingTagValue(""); }}><X className="h-4 w-4" /></Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1">{tag}</span>
                      <Button size="icon" variant="ghost" onClick={() => { setEditingTagIndex(index); setEditingTagValue(tag); }}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteTag(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </>
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Input placeholder="添加新标签" value={newTagValue} onChange={(e) => setNewTagValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddNewTag(); }} className="flex-1" />
                <Button onClick={handleAddNewTag} disabled={!newTagValue.trim()}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={() => setManagingTags(false)}>返回选择</Button>
                <Button variant="outline" size="sm" onClick={handleCloseTagDialog}>关闭</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}