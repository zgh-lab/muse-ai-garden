import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FolderOpen, Image as ImageIcon, Video, Music, Minimize2, X, Search, Tag, ChevronDown, Star, Download, Trash2, Edit2, X as XIcon, ArrowUpDown, Filter, CalendarIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { mockAssets } from "@/data/mockAssets";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AssetLibraryFloatingProps {
  isMinimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
}

export function AssetLibraryFloating({ isMinimized, onMinimize, onClose }: AssetLibraryFloatingProps) {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [assetCategory, setAssetCategory] = useState("images");
  const [searchQuery, setSearchQuery] = useState("");
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
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);
  const [isDateExpanded, setIsDateExpanded] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

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
    const commonTags = assetsArray.length > 0 
      ? availableTags.filter(tag => 
          assetsArray.every(assetId => assetTags[assetId]?.includes(tag))
        )
      : [];
    setTempSelectedTags(commonTags);
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
      
      const updatedAssetTags = { ...assetTags };
      Object.keys(updatedAssetTags).forEach(assetId => {
        updatedAssetTags[Number(assetId)] = updatedAssetTags[Number(assetId)].map(tag => 
          tag === oldTag ? editingTagValue.trim() : tag
        );
      });
      setAssetTags(updatedAssetTags);
      
      setSelectedTags(prev => prev.map(tag => tag === oldTag ? editingTagValue.trim() : tag));
    }
    setEditingTagIndex(null);
    setEditingTagValue("");
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setAvailableTags(prev => prev.filter(tag => tag !== tagToDelete));
    
    const updatedAssetTags = { ...assetTags };
    Object.keys(updatedAssetTags).forEach(assetId => {
      updatedAssetTags[Number(assetId)] = updatedAssetTags[Number(assetId)].filter(tag => tag !== tagToDelete);
    });
    setAssetTags(updatedAssetTags);
    
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

  // Check if there are any active filters
  const hasActiveFilters = 
    selectedTags.length > 0 || 
    showFavorites || 
    selectedSource !== "all" || 
    selectedGenerator !== "all" ||
    startDate !== undefined ||
    endDate !== undefined;

  // Clear individual filter
  const clearFilter = (filterType: string, value?: string) => {
    switch(filterType) {
      case "tag":
        if (value) {
          setSelectedTags(prev => prev.filter(t => t !== value));
        }
        break;
      case "favorites":
        setShowFavorites(false);
        break;
      case "source":
        setSelectedSource("all");
        break;
      case "generator":
        setSelectedGenerator("all");
        break;
      case "date":
        setStartDate(undefined);
        setEndDate(undefined);
        break;
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedTags([]);
    setShowFavorites(false);
    setSelectedSource("all");
    setSelectedGenerator("all");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  // Get source label
  const getSourceLabel = () => {
    if (selectedSource === "jarvis") return "来自G社贾维斯";
    if (selectedSource === "webhub") return "来自Webhub";
    return "";
  };

  // Get generator label
  const getGeneratorLabel = () => {
    const generatorLabels: Record<string, string> = {
      "seedream": "即梦4.0",
      "nano-banana": "Nano banana pro",
      "kontext": "Kontext",
      "gpt-4o": "gpt-4o",
      "midjourney": "Midjourney",
      "jimeng": "即梦",
      "kling": "可灵",
      "veo": "Veo",
      "hailuo": "海螺",
      "vidu-q2": "Vidu Q2",
      "sora": "Sora",
    };
    return generatorLabels[selectedGenerator] || "";
  };

  const filteredAssets = useMemo(() => {
    return mockAssets.filter(asset => {
      if (assetCategory === "images" && asset.type !== "image") return false;
      if (assetCategory === "videos" && asset.type !== "video") return false;
      if (assetCategory === "audio" && asset.type !== "audio") return false;
      
      if (selectedGenerator !== "all" && !asset.software?.toLowerCase().includes(selectedGenerator.toLowerCase())) return false;
      
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return asset.name?.toLowerCase().includes(query) || 
             asset.prompt?.toLowerCase().includes(query) || 
             asset.software?.toLowerCase().includes(query);
    }).sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [assetCategory, selectedGenerator, searchQuery, sortOrder]);

  if (isMinimized) {
    return (
      <div className="fixed right-4 bottom-4 z-50">
        <Button
          onClick={onMinimize}
          className="h-12 px-4 shadow-lg"
          variant="default"
        >
          <FolderOpen className="h-4 w-4 mr-2" />
          个人资产库
        </Button>
      </div>
    );
  }

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
                    {tempSelectedTags.length === 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setManagingTags(true)}
                        className="text-xs h-7"
                      >
                        管理标签
                      </Button>
                    )}
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
                            <XIcon className="h-3 w-3" />
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

      <div className="h-full flex flex-col bg-background border-l border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">个人资产库</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMinimize}
              className="h-8 w-8"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <Tabs value={assetCategory} onValueChange={setAssetCategory} className="w-full">
            <div className="flex items-center justify-between gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="images" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  图片
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  视频
                </TabsTrigger>
                <TabsTrigger value="audio" className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  音频
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  title={sortOrder === "desc" ? "最新在前" : "最早在前"}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>

                <Button 
                  variant={batchSelectMode ? "default" : "outline"}
                  onClick={toggleBatchSelectMode}
                  size="sm"
                >
                  {batchSelectMode ? "取消选择" : "批量选择"}
                </Button>
              </div>
            </div>

            {/* Search Bar and Filters */}
            <div className="flex items-center gap-3 mb-4">
              {/* Search bar - shrinks when filters are active */}
              <div className={cn("relative transition-all", hasActiveFilters ? "w-48" : "flex-1")}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="搜索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Active filters display */}
              {hasActiveFilters && (
                <div className="flex-1 flex items-center gap-2 flex-wrap">
                  {(startDate || endDate) && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                      <CalendarIcon className="h-3 w-3" />
                      <span>
                        {startDate ? format(startDate, "yyyy-MM-dd") : "开始"} - {endDate ? format(endDate, "yyyy-MM-dd") : "结束"}
                      </span>
                      <button 
                        onClick={() => clearFilter("date")}
                        className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {selectedSource !== "all" && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                      <span>{getSourceLabel()}</span>
                      <button 
                        onClick={() => clearFilter("source")}
                        className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {selectedGenerator !== "all" && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                      <span>{getGeneratorLabel()}</span>
                      <button 
                        onClick={() => clearFilter("generator")}
                        className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {showFavorites && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                      <Star className="h-3 w-3" />
                      <span>我的收藏</span>
                      <button 
                        onClick={() => clearFilter("favorites")}
                        className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {selectedTags.map(tag => (
                    <div key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                      <button 
                        onClick={() => clearFilter("tag", tag)}
                        className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-7 text-xs"
                  >
                    清除全部
                  </Button>
                </div>
              )}

              {/* Filter Popover with All Options */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" title="筛选">
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm mb-3">筛选选项</h4>
                    
                    {/* Date Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">日期范围</Label>
                      <div className="flex items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "flex-1 justify-start text-left font-normal",
                                !startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "yyyy-MM-dd") : "开始日期"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <span className="text-muted-foreground">→</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "flex-1 justify-start text-left font-normal",
                                !endDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "yyyy-MM-dd") : "结束日期"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Source Filter - Hidden for audio */}
                    {assetCategory !== "audio" && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">来源</Label>
                        <Select value={selectedSource} onValueChange={setSelectedSource}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择来源" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              {assetCategory === "images" && "所有图片"}
                              {assetCategory === "videos" && "所有视频"}
                            </SelectItem>
                            <SelectItem value="jarvis">来自G社贾维斯</SelectItem>
                            <SelectItem value="webhub">来自Webhub</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Generator/Model Filter - Hidden for audio */}
                    {assetCategory !== "audio" && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">模型</Label>
                        <Select value={selectedGenerator} onValueChange={setSelectedGenerator}>
                          <SelectTrigger>
                            <SelectValue placeholder={
                              assetCategory === "images" ? "图片模型" : "视频模型"
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            {assetCategory === "images" && (
                              <>
                                <SelectItem value="all">全部模型</SelectItem>
                                <SelectItem value="seedream">即梦4.0</SelectItem>
                                <SelectItem value="nano-banana">Nano banana pro</SelectItem>
                                <SelectItem value="kontext">Kontext</SelectItem>
                                <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                                <SelectItem value="midjourney">Midjourney</SelectItem>
                              </>
                            )}
                            {assetCategory === "videos" && (
                              <>
                                <SelectItem value="all">全部模型</SelectItem>
                                <SelectItem value="jimeng">即梦</SelectItem>
                                <SelectItem value="kling">可灵</SelectItem>
                                <SelectItem value="veo">Veo</SelectItem>
                                <SelectItem value="hailuo">海螺</SelectItem>
                                <SelectItem value="vidu-q2">Vidu Q2</SelectItem>
                                <SelectItem value="sora">Sora</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Favorites Checkbox */}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="favorites-filter" 
                        checked={showFavorites}
                        onCheckedChange={(checked) => setShowFavorites(checked as boolean)}
                      />
                      <Label htmlFor="favorites-filter" className="cursor-pointer">我的收藏</Label>
                    </div>

                    {/* Tags Filter */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">标签</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setManagingTags(true);
                            setTagDialogOpen(true);
                          }}
                          className="h-auto py-1 px-2 text-xs"
                        >
                          管理标签
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {availableTags.map((tag) => (
                          <div key={tag} className="flex items-center space-x-2">
                            <Checkbox
                              id={`filter-tag-${tag}`}
                              checked={selectedTags.includes(tag)}
                              onCheckedChange={() => toggleTag(tag)}
                            />
                            <Label htmlFor={`filter-tag-${tag}`} className="cursor-pointer flex-1">
                              {tag}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <TabsContent value="images" className="mt-0">
              {batchSelectMode && selectedAssets.size > 0 && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-primary/10 rounded-lg flex-wrap">
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
              <ScrollArea className="h-[calc(100vh-420px)]">
                <div className="grid grid-cols-2 gap-3 pr-4">
                  {filteredAssets.length === 0 ? (
                    <div className="col-span-2 text-center py-12 text-muted-foreground">
                      暂无图片资产
                    </div>
                  ) : (
                    filteredAssets.map((asset) => (
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
                        <CardContent className="p-0">
                          <div className="aspect-square relative overflow-hidden">
                            <img
                              src={asset.url}
                              alt={asset.prompt}
                              className="w-full h-full object-cover"
                            />
                            {!batchSelectMode && (
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="videos" className="mt-0">
              {batchSelectMode && selectedAssets.size > 0 && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-primary/10 rounded-lg flex-wrap">
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
              <ScrollArea className="h-[calc(100vh-420px)]">
                <div className="grid grid-cols-2 gap-3 pr-4">
                  {filteredAssets.length === 0 ? (
                    <div className="col-span-2 text-center py-12 text-muted-foreground">
                      暂无视频资产
                    </div>
                  ) : (
                    filteredAssets.map((asset) => (
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
                        <CardContent className="p-0">
                          <div className="aspect-square relative overflow-hidden">
                            <img
                              src={asset.url}
                              alt={asset.prompt}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Video className="h-12 w-12 text-white" />
                            </div>
                            {!batchSelectMode && (
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="audio" className="mt-0">
              <ScrollArea className="h-[calc(100vh-420px)]">
                <div className="grid grid-cols-2 gap-3 pr-4">
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                          <Music className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                        <div className="p-3 space-y-1">
                          <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                          <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Asset Detail Dialog */}
      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent className="max-w-5xl h-[80vh]">
          <div className="grid md:grid-cols-2 gap-6 h-full">
            <div className="flex items-center justify-center bg-muted rounded-lg overflow-hidden">
              {selectedAsset?.type === "video" ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="h-16 w-16 text-muted-foreground" />
                </div>
              ) : selectedAsset?.type === "audio" ? (
                <div className={`w-full h-full flex items-center justify-center ${selectedAsset?.preview}`}>
                  <Music className="h-16 w-16 text-white" />
                </div>
              ) : (
                <img 
                  src={selectedAsset?.url} 
                  alt="" 
                  className="max-w-full max-h-full object-contain"
                />
              )}
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
    </>
  );
}