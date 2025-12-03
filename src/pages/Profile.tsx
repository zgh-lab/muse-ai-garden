import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/UserMenu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FolderOpen, Image as ImageIcon, Video, Music, Search, Archive, ArchiveRestore, Trash2, MessageSquare, Tag, ChevronDown, ArrowUpDown, Star, Download, Edit2, X, ArrowUp, ArrowDown, CalendarIcon } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { mockAssets } from "@/data/mockAssets";

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  isArchived?: boolean;
}

export default function Profile() {
  const navigate = useNavigate();
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [selectedArchivedChat, setSelectedArchivedChat] = useState<ChatHistory | null>(null);
  const [assetCategory, setAssetCategory] = useState("images");
  const [searchQuery, setSearchQuery] = useState("");
  const [archivedSearchQuery, setArchivedSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedGenerator, setSelectedGenerator] = useState<string>("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [batchSelectMode, setBatchSelectMode] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<Set<number>>(new Set());
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [currentTaggingAssets, setCurrentTaggingAssets] = useState<number[]>([]);
  const [assetTags, setAssetTags] = useState<Record<number, string[]>>({});
  const [tempSelectedTags, setTempSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>(["M71", "M72", "P36", "M98", "M95"]);
  const [managingTags, setManagingTags] = useState(false);
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [editingTagValue, setEditingTagValue] = useState("");
  const [newTagValue, setNewTagValue] = useState("");
  const [batchSelectChatMode, setBatchSelectChatMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleAssetSelection = (assetId: number) => {
    setSelectedAssets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        newSet.add(assetId);
      }
      return newSet;
    });
  };

  const toggleBatchSelectMode = () => {
    setBatchSelectMode(!batchSelectMode);
    if (batchSelectMode) {
      setSelectedAssets(new Set());
    }
  };

  const handleBatchDelete = () => {
    console.log("批量删除:", Array.from(selectedAssets));
    setSelectedAssets(new Set());
  };

  const handleBatchDownload = () => {
    console.log("批量下载:", Array.from(selectedAssets));
  };

  const handleFavorite = (assetId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('收藏资产:', assetId);
  };

  const handleAddTag = (assetId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTaggingAssets([assetId]);
    setTempSelectedTags(assetTags[assetId] || []);
    setManagingTags(false); // 确保打开时显示选择标签界面
    setTagDialogOpen(true);
  };

  const handleDownload = (assetId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('下载资产:', assetId);
  };

  const handleDelete = (assetId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('删除资产:', assetId);
  };

  const handleBatchFavorite = () => {
    console.log('批量收藏:', Array.from(selectedAssets));
  };

  const handleBatchAddTag = () => {
    const assetsArray = Array.from(selectedAssets);
    setCurrentTaggingAssets(assetsArray);
    // 对于批量操作，显示所有被选中资产共有的标签
    const commonTags = assetsArray.length > 0 
      ? availableTags.filter(tag => 
          assetsArray.every(assetId => assetTags[assetId]?.includes(tag))
        )
      : [];
    setTempSelectedTags(commonTags);
    setManagingTags(false); // 确保打开时显示选择标签界面
    setTagDialogOpen(true);
  };

  const handleSaveTags = () => {
    const newAssetTags = { ...assetTags };
    currentTaggingAssets.forEach(assetId => {
      newAssetTags[assetId] = tempSelectedTags;
    });
    setAssetTags(newAssetTags);
    setTagDialogOpen(false);
    setCurrentTaggingAssets([]);
    setTempSelectedTags([]);
    setManagingTags(false);
    setEditingTagIndex(null);
    setEditingTagValue("");
  };

  const toggleTempTag = (tag: string) => {
    setTempSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleRenameTag = (index: number) => {
    if (editingTagValue.trim() && editingTagValue !== availableTags[index]) {
      const oldTag = availableTags[index];
      const newTags = [...availableTags];
      newTags[index] = editingTagValue.trim();
      setAvailableTags(newTags);
      
      // 更新所有资产中的旧标签名
      const updatedAssetTags = { ...assetTags };
      Object.keys(updatedAssetTags).forEach(assetId => {
        updatedAssetTags[Number(assetId)] = updatedAssetTags[Number(assetId)].map(tag => 
          tag === oldTag ? editingTagValue.trim() : tag
        );
      });
      setAssetTags(updatedAssetTags);
      
      // 更新筛选器中的选中标签
      setSelectedTags(prev => prev.map(tag => tag === oldTag ? editingTagValue.trim() : tag));
    }
    setEditingTagIndex(null);
    setEditingTagValue("");
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setAvailableTags(prev => prev.filter(tag => tag !== tagToDelete));
    
    // 从所有资产中移除该标签
    const updatedAssetTags = { ...assetTags };
    Object.keys(updatedAssetTags).forEach(assetId => {
      updatedAssetTags[Number(assetId)] = updatedAssetTags[Number(assetId)].filter(tag => tag !== tagToDelete);
    });
    setAssetTags(updatedAssetTags);
    
    // 从筛选器中移除该标签
    setSelectedTags(prev => prev.filter(tag => tag !== tagToDelete));
  };

  const startEditingTag = (index: number) => {
    setEditingTagIndex(index);
    setEditingTagValue(availableTags[index]);
  };

  const handleAddNewTag = () => {
    if (newTagValue.trim() && !availableTags.includes(newTagValue.trim())) {
      setAvailableTags(prev => [...prev, newTagValue.trim()]);
      setNewTagValue("");
    }
  };

  // 从 localStorage 读取已归档的聊天
  const [archivedChats, setArchivedChats] = useState<ChatHistory[]>([]);

  useEffect(() => {
    const loadArchivedChats = () => {
      const saved = localStorage.getItem('chatHistories');
      if (saved) {
        const allChats: ChatHistory[] = JSON.parse(saved);
        const archived = allChats.filter(chat => chat.isArchived);
        setArchivedChats(archived);
      }
    };
    
    loadArchivedChats();
    
    // 监听 storage 事件以实时更新
    window.addEventListener('storage', loadArchivedChats);
    
    // 轮询检查更新（用于同一标签页内的更新）
    const interval = setInterval(loadArchivedChats, 1000);
    
    return () => {
      window.removeEventListener('storage', loadArchivedChats);
      clearInterval(interval);
    };
  }, []);

  const handleUnarchive = (chatId: string) => {
    const saved = localStorage.getItem('chatHistories');
    if (saved) {
      const allChats: ChatHistory[] = JSON.parse(saved);
      const updated = allChats.map(chat => 
        chat.id === chatId ? { ...chat, isArchived: false } : chat
      );
      localStorage.setItem('chatHistories', JSON.stringify(updated));
      setArchivedChats(updated.filter(chat => chat.isArchived));
    }
  };

  const handleUnarchiveAndNavigate = (chatId: string) => {
    handleUnarchive(chatId);
    setSelectedArchivedChat(null);
    // 跳转到 Jarvis 页面并加载该聊天
    navigate(`/jarvis?chatId=${chatId}`);
  };

  const handleDeleteArchived = (chatId: string) => {
    const saved = localStorage.getItem('chatHistories');
    if (saved) {
      const allChats: ChatHistory[] = JSON.parse(saved);
      const updated = allChats.filter(chat => chat.id !== chatId);
      localStorage.setItem('chatHistories', JSON.stringify(updated));
      setArchivedChats(updated.filter(chat => chat.isArchived));
    }
  };

  const toggleChatSelection = (chatId: string) => {
    setSelectedChats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chatId)) {
        newSet.delete(chatId);
      } else {
        newSet.add(chatId);
      }
      return newSet;
    });
  };

  const toggleBatchSelectChatMode = () => {
    setBatchSelectChatMode(!batchSelectChatMode);
    if (batchSelectChatMode) {
      setSelectedChats(new Set());
    }
  };

  const handleBatchUnarchive = () => {
    const saved = localStorage.getItem('chatHistories');
    if (saved) {
      const allChats: ChatHistory[] = JSON.parse(saved);
      const updated = allChats.map(chat => 
        selectedChats.has(chat.id) ? { ...chat, isArchived: false } : chat
      );
      localStorage.setItem('chatHistories', JSON.stringify(updated));
      setArchivedChats(updated.filter(chat => chat.isArchived));
      setSelectedChats(new Set());
    }
  };

  const handleBatchDeleteArchived = () => {
    const saved = localStorage.getItem('chatHistories');
    if (saved) {
      const allChats: ChatHistory[] = JSON.parse(saved);
      const updated = allChats.filter(chat => !selectedChats.has(chat.id));
      localStorage.setItem('chatHistories', JSON.stringify(updated));
      setArchivedChats(updated.filter(chat => chat.isArchived));
      setSelectedChats(new Set());
    }
  };

  const filteredArchivedChats = useMemo(() => {
    return archivedChats.filter(chat => 
      archivedSearchQuery === "" || 
      chat.title.toLowerCase().includes(archivedSearchQuery.toLowerCase())
    );
  }, [archivedChats, archivedSearchQuery]);

  return (
    <>
      {/* 标签选择对话框 */}
      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentTaggingAssets.length === 1 ? '为资产打标签' : `为 ${currentTaggingAssets.length} 个资产打标签`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!managingTags ? (
              <>
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
                        id={`dialog-tag-${tag}`}
                        checked={tempSelectedTags.includes(tag)}
                        onCheckedChange={() => toggleTempTag(tag)}
                      />
                      <Label 
                        htmlFor={`dialog-tag-${tag}`} 
                        className={`cursor-pointer flex-1 ${tempSelectedTags.includes(tag) ? 'text-muted-foreground' : ''}`}
                      >
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setTagDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleSaveTags}>
                    保存
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">管理标签</h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setManagingTags(false);
                        setEditingTagIndex(null);
                        setEditingTagValue("");
                        setNewTagValue("");
                      }}
                      className="text-xs h-7"
                    >
                      返回
                    </Button>
                  </div>
                  
                  {/* 新建标签 */}
                  <div className="flex items-center space-x-2 pb-2 border-b">
                    <Input
                      value={newTagValue}
                      onChange={(e) => setNewTagValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddNewTag();
                        }
                      }}
                      placeholder="新建标签..."
                      className="flex-1"
                    />
                    <Button 
                      size="sm"
                      onClick={handleAddNewTag}
                      disabled={!newTagValue.trim() || availableTags.includes(newTagValue.trim())}
                    >
                      添加
                    </Button>
                  </div>

                  {availableTags.map((tag, index) => (
                    <div key={tag} className="flex items-center space-x-2 group">
                      {editingTagIndex === index ? (
                        <>
                          <Input
                            value={editingTagValue}
                            onChange={(e) => setEditingTagValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleRenameTag(index);
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
                            onClick={() => handleRenameTag(index)}
                          >
                            保存
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setEditingTagIndex(null);
                              setEditingTagValue("");
                            }}
                          >
                            取消
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1">{tag}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditingTag(index)}
                            className="opacity-0 group-hover:opacity-100 h-7 w-7 p-0"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTag(tag)}
                            className="opacity-0 group-hover:opacity-100 h-7 w-7 p-0 text-destructive hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Minimal Header */}
          <header className="h-14 border-b border-border/30 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
            <div className="h-full px-6 flex items-center justify-end">
              <UserMenu />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            {/* Profile Header - Cleaner Design */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
              <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center gap-5">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                    <AvatarFallback className="text-lg font-medium bg-primary/10 text-primary">AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-xl font-display font-semibold text-foreground">稳健第一</h1>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">创作 <span className="font-medium text-foreground">0</span></span>
                      <span className="text-muted-foreground">粉丝 <span className="font-medium text-foreground">458</span></span>
                      <span className="text-muted-foreground">作品创作 <span className="font-medium text-foreground">0</span></span>
                      <span className="text-muted-foreground">作品应用 <span className="font-medium text-foreground">0</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="max-w-6xl mx-auto px-6 py-6">
              <Tabs defaultValue="assets" className="w-full">
                {/* Level 1: Main Tab Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <TabsList className="h-10 rounded-xl p-1 bg-secondary/50">
                    <TabsTrigger 
                      value="assets" 
                      className="flex items-center gap-2 px-4 h-8 rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                    >
                      <FolderOpen className="h-4 w-4" />
                      个人资产库
                    </TabsTrigger>
                    <TabsTrigger 
                      value="archived" 
                      className="flex items-center gap-2 px-4 h-8 rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
                    >
                      <Archive className="h-4 w-4" />
                      已归档聊天
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="assets" className="space-y-0">
                  <Tabs value={assetCategory} onValueChange={setAssetCategory}>
                    {/* Level 2: Asset Type Tabs */}
                    <div className="flex items-center justify-between pb-4 border-b border-border/30">
                      <TabsList className="h-9 rounded-lg p-1 bg-secondary/40">
                        <TabsTrigger value="images" className="flex items-center gap-1.5 px-3 h-7 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                          <ImageIcon className="h-4 w-4" />
                          图片
                        </TabsTrigger>
                        <TabsTrigger value="videos" className="flex items-center gap-1.5 px-3 h-7 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                          <Video className="h-4 w-4" />
                          视频
                        </TabsTrigger>
                        <TabsTrigger value="audio" className="flex items-center gap-1.5 px-3 h-7 text-sm rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                          <Music className="h-4 w-4" />
                          音频
                        </TabsTrigger>
                      </TabsList>

                      {/* Right Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                        >
                          {sortOrder === "desc" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                          {sortOrder === "desc" ? "最新" : "最早"}
                        </button>
                        <button 
                          onClick={toggleBatchSelectMode}
                          className={cn(
                            "h-8 px-3 rounded-lg text-sm font-medium transition-colors",
                            batchSelectMode 
                              ? "bg-primary text-primary-foreground" 
                              : "border border-border/50 text-foreground hover:bg-secondary/50"
                          )}
                        >
                          {batchSelectMode ? "取消选择" : "批量选择"}
                        </button>
                      </div>
                    </div>

                    {/* Level 3: Filters Row */}
                    <div className="flex items-center gap-3 py-3">
                      {/* Search */}
                      <div className="relative flex-1 max-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="搜索资产..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 h-9 text-sm bg-secondary/30 border-transparent focus:border-primary/50"
                        />
                      </div>

                      {/* Filter Group */}
                      <div className="flex items-center gap-2">
                        {/* Source Select */}
                        <Select value={selectedSource} onValueChange={setSelectedSource}>
                          <SelectTrigger className="w-[110px] h-9 text-sm bg-secondary/30 border-transparent">
                            <SelectValue placeholder="来源" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">所有来源</SelectItem>
                            <SelectItem value="jarvis">贾维斯</SelectItem>
                            <SelectItem value="webhub">Webhub</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Favorites */}
                        <button 
                          onClick={() => setShowFavorites(!showFavorites)}
                          className={cn(
                            "flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm transition-all",
                            showFavorites 
                              ? "bg-primary/15 text-primary border border-primary/30" 
                              : "bg-secondary/30 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Star className={cn("h-4 w-4", showFavorites && "fill-primary")} />
                          收藏
                        </button>

                        {/* Tags */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className={cn(
                              "flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm transition-all",
                              selectedTags.length > 0
                                ? "bg-primary/15 text-primary border border-primary/30" 
                                : "bg-secondary/30 text-muted-foreground hover:text-foreground"
                            )}>
                              <Tag className="h-4 w-4" />
                              {selectedTags.length === 0 ? "标签" : `标签 (${selectedTags.length})`}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-2">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between px-2 py-1.5 border-b border-border/30">
                                <span className="text-sm font-medium">选择标签</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setManagingTags(true);
                                    setTagDialogOpen(true);
                                  }}
                                  className="h-6 px-2 text-xs"
                                >
                                  管理
                                </Button>
                              </div>
                              {availableTags.map((tag) => (
                                <div key={tag} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary/50">
                                  <Checkbox
                                    id={`tag-${tag}`}
                                    checked={selectedTags.includes(tag)}
                                    onCheckedChange={() => toggleTag(tag)}
                                  />
                                  <Label htmlFor={`tag-${tag}`} className="cursor-pointer text-sm flex-1">
                                    {tag}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Date Range */}
                      <div className="flex items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className={cn(
                              "flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm transition-all",
                              startDate 
                                ? "bg-primary/15 text-primary border border-primary/30" 
                                : "bg-secondary/30 text-muted-foreground hover:text-foreground"
                            )}>
                              <CalendarIcon className="h-4 w-4" />
                              {startDate ? format(startDate, "yyyy-MM-dd") : "开始日期"}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <span className="text-muted-foreground">-</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className={cn(
                              "flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm transition-all",
                              endDate 
                                ? "bg-primary/15 text-primary border border-primary/30" 
                                : "bg-secondary/30 text-muted-foreground hover:text-foreground"
                            )}>
                              <CalendarIcon className="h-4 w-4" />
                              {endDate ? format(endDate, "yyyy-MM-dd") : "结束日期"}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {(startDate || endDate) && (
                          <button
                            className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                            onClick={() => { setStartDate(undefined); setEndDate(undefined); }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <TabsContent value="images" className="mt-6">
                      {batchSelectMode && selectedAssets.size > 0 && (
                        <div className="mb-4 flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                          <span className="text-sm font-medium">已选择 {selectedAssets.size} 项</span>
                          <Button size="sm" variant="outline" onClick={handleBatchFavorite}>
                            <Star className="h-4 w-4 mr-1" />
                            收藏
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleBatchAddTag}>
                            <Tag className="h-4 w-4 mr-1" />
                            打标签
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleBatchDownload}>
                            <Download className="h-4 w-4 mr-1" />
                            下载
                          </Button>
                          <Button size="sm" variant="destructive" onClick={handleBatchDelete}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            删除
                          </Button>
                        </div>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {mockAssets.filter(a => {
                          if (a.type !== "image") return false;
                          if (selectedGenerator !== "all" && !a.software?.toLowerCase().includes(selectedGenerator.toLowerCase())) return false;
                          if (!searchQuery.trim()) return true;
                          const query = searchQuery.toLowerCase();
                          return a.name?.toLowerCase().includes(query) || 
                                 a.prompt?.toLowerCase().includes(query) || 
                                 a.software?.toLowerCase().includes(query);
                        }).map((asset) => (
                          <Card 
                            key={asset.id} 
                            className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden relative group"
                            onClick={(e) => {
                              if (batchSelectMode) {
                                e.stopPropagation();
                                toggleAssetSelection(asset.id);
                              } else {
                                setSelectedAsset(asset);
                              }
                            }}
                          >
                            {batchSelectMode && (
                              <div className="absolute top-2 left-2 z-10">
                                <Checkbox 
                                  checked={selectedAssets.has(asset.id)}
                                  onCheckedChange={() => toggleAssetSelection(asset.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            )}
                            <img src={asset.url} alt="" className="w-full h-48 object-cover" />
                            <CardContent className="p-3">
                              <p className="text-xs text-muted-foreground mb-1">{asset.date}</p>
                              <p className="text-xs text-muted-foreground/80">来源: {asset.software}</p>
                            </CardContent>
                            {!batchSelectMode && (
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button 
                                  size="icon" 
                                  variant="secondary" 
                                  className="h-8 w-8"
                                  onClick={(e) => handleFavorite(asset.id, e)}
                                >
                                  <Star className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="secondary" 
                                  className="h-8 w-8"
                                  onClick={(e) => handleAddTag(asset.id, e)}
                                >
                                  <Tag className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="secondary" 
                                  className="h-8 w-8"
                                  onClick={(e) => handleDownload(asset.id, e)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="destructive" 
                                  className="h-8 w-8"
                                  onClick={(e) => handleDelete(asset.id, e)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="videos" className="mt-6">
                      {batchSelectMode && selectedAssets.size > 0 && (
                        <div className="mb-4 flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                          <span className="text-sm font-medium">已选择 {selectedAssets.size} 项</span>
                          <Button size="sm" variant="outline" onClick={handleBatchFavorite}>
                            <Star className="h-4 w-4 mr-1" />
                            收藏
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleBatchAddTag}>
                            <Tag className="h-4 w-4 mr-1" />
                            打标签
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleBatchDownload}>
                            <Download className="h-4 w-4 mr-1" />
                            下载
                          </Button>
                          <Button size="sm" variant="destructive" onClick={handleBatchDelete}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            删除
                          </Button>
                        </div>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {mockAssets.filter(a => {
                          if (a.type !== "video") return false;
                          if (selectedGenerator !== "all" && !a.software?.toLowerCase().includes(selectedGenerator.toLowerCase())) return false;
                          if (!searchQuery.trim()) return true;
                          const query = searchQuery.toLowerCase();
                          return a.name?.toLowerCase().includes(query) || 
                                 a.prompt?.toLowerCase().includes(query) || 
                                 a.software?.toLowerCase().includes(query);
                        }).map((asset) => (
                          <Card 
                            key={asset.id} 
                            className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden relative group"
                            onClick={(e) => {
                              if (batchSelectMode) {
                                e.stopPropagation();
                                toggleAssetSelection(asset.id);
                              } else {
                                setSelectedAsset(asset);
                              }
                            }}
                          >
                            {batchSelectMode && (
                              <div className="absolute top-2 left-2 z-10">
                                <Checkbox 
                                  checked={selectedAssets.has(asset.id)}
                                  onCheckedChange={() => toggleAssetSelection(asset.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            )}
                            <img src={asset.url} alt="" className="w-full h-48 object-cover" />
                            <CardContent className="p-3">
                              <p className="text-xs text-muted-foreground mb-1">{asset.date}</p>
                              <p className="text-xs text-muted-foreground/80">来源: {asset.software}</p>
                            </CardContent>
                            {!batchSelectMode && (
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button 
                                  size="icon" 
                                  variant="secondary" 
                                  className="h-8 w-8"
                                  onClick={(e) => handleFavorite(asset.id, e)}
                                >
                                  <Star className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="secondary" 
                                  className="h-8 w-8"
                                  onClick={(e) => handleAddTag(asset.id, e)}
                                >
                                  <Tag className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="secondary" 
                                  className="h-8 w-8"
                                  onClick={(e) => handleDownload(asset.id, e)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="destructive" 
                                  className="h-8 w-8"
                                  onClick={(e) => handleDelete(asset.id, e)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="audio" className="mt-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <Card key={i} className="overflow-hidden border-dashed border-2 border-muted-foreground/25">
                            <div className="w-full h-48 bg-muted/50 flex items-center justify-center">
                              <Music className="w-16 h-16 text-muted-foreground/50" />
                            </div>
                            <CardContent className="p-3">
                              <div className="h-4 bg-muted/50 rounded mb-2" />
                              <div className="h-3 bg-muted/30 rounded w-2/3" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                <TabsContent value="archived">
                  <div className="space-y-4">
                    {/* Search Bar and Actions */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="搜索已归档聊天..."
                          value={archivedSearchQuery}
                          onChange={(e) => setArchivedSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      {filteredArchivedChats.length > 0 && (
                        <Button 
                          variant={batchSelectChatMode ? "default" : "outline"}
                          onClick={toggleBatchSelectChatMode}
                        >
                          {batchSelectChatMode ? "取消选择" : "批量选择"}
                        </Button>
                      )}
                    </div>

                    {/* Batch Action Buttons */}
                    {batchSelectChatMode && selectedChats.size > 0 && (
                      <div className="flex gap-2 p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm text-muted-foreground mr-auto self-center">
                          已选择 {selectedChats.size} 个聊天
                        </span>
                        <Button size="sm" variant="outline" onClick={handleBatchUnarchive}>
                          <ArchiveRestore className="h-4 w-4 mr-1" />
                          还原
                        </Button>
                        <Button size="sm" variant="destructive" onClick={handleBatchDeleteArchived}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          删除
                        </Button>
                      </div>
                    )}

                    {filteredArchivedChats.length === 0 ? (
                      <Card className="p-6">
                        <div className="flex flex-col items-center justify-center py-12">
                          <Archive className="h-16 w-16 text-muted-foreground mb-4" />
                          <p className="text-lg font-medium mb-2">暂无归档聊天</p>
                          <p className="text-sm text-muted-foreground">归档的聊天记录将显示在这里</p>
                        </div>
                      </Card>
                    ) : (
                      <div className="grid gap-3">
                        {filteredArchivedChats.map((chat) => (
                          <Card 
                            key={chat.id} 
                            className="p-4 hover:shadow-md transition-shadow cursor-pointer relative"
                            onClick={(e) => {
                              if (batchSelectChatMode) {
                                e.stopPropagation();
                                toggleChatSelection(chat.id);
                              } else {
                                setSelectedArchivedChat(chat);
                              }
                            }}
                          >
                            <div className="flex items-start justify-between gap-4">
                              {batchSelectChatMode && (
                                <div className="shrink-0 pt-0.5">
                                  <Checkbox 
                                    checked={selectedChats.has(chat.id)}
                                    onCheckedChange={() => toggleChatSelection(chat.id)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm mb-1 truncate">{chat.title}</h3>
                                <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                              </div>
                              {!batchSelectChatMode && (
                                <div className="flex items-center gap-2 shrink-0">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUnarchive(chat.id);
                                    }}
                                    title="取消归档"
                                  >
                                    <ArchiveRestore className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteArchived(chat.id);
                                    }}
                                    title="删除"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>

      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent className="max-w-5xl h-[80vh]">
          <div className="grid md:grid-cols-2 gap-6 h-full">
            <div className="flex items-center justify-center bg-muted rounded-lg overflow-hidden">
              <img 
                src={selectedAsset?.url} 
                alt="" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="space-y-4 overflow-auto">
              <DialogHeader>
                <DialogTitle>资产详情</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">生成软件</h4>
                  <p className="text-sm text-muted-foreground">{selectedAsset?.software}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Prompt</h4>
                  <p className="text-sm text-muted-foreground">{selectedAsset?.prompt}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">创建时间</h4>
                  <p className="text-sm text-muted-foreground">{selectedAsset?.date}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedArchivedChat} onOpenChange={() => setSelectedArchivedChat(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {selectedArchivedChat?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
              <p className="text-sm text-muted-foreground text-center py-8">
                聊天记录内容展示区域
              </p>
              <p className="text-xs text-muted-foreground text-center">
                创建时间: {selectedArchivedChat?.timestamp}
              </p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setSelectedArchivedChat(null)}
              >
                关闭
              </Button>
              <Button
                onClick={() => selectedArchivedChat && handleUnarchiveAndNavigate(selectedArchivedChat.id)}
                className="gap-2"
              >
                <ArchiveRestore className="h-4 w-4" />
                取消归档
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
    </>
  );
}
