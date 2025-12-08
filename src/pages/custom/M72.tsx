import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Flame,
  Image as ImageIcon,
  Layers,
  Palette,
  Shirt,
  Box,
  History,
  Wrench,
  Upload,
  X,
  Loader2,
} from "lucide-react";

const menuItems = [
  { id: "generate", title: "法宝炼制", subtitle: "生成图标", icon: Flame },
  { id: "threeview", title: "仙姿绘卷", subtitle: "THREE VIEW", icon: Layers },
  { id: "fusion", title: "万象融合", subtitle: "FUSION", icon: Box },
  { id: "colorshift", title: "灵韵染坊", subtitle: "COLOR SHIFT", icon: Palette },
  { id: "texture", title: "云裳织造", subtitle: "TEXTURE", icon: Shirt },
  { id: "relief", title: "金石篆刻", subtitle: "RELIEF", icon: Box },
  { id: "history", title: "藏经阁", subtitle: "HISTORY", icon: History },
  { id: "workshop", title: "天工坊", subtitle: "WORKSHOP", icon: Wrench },
];

const itemCategories = [
  "神兵/武器",
  "法宝/道具",
  "坐骑/灵兽",
  "服饰/时装",
  "建筑/场景",
  "角色/NPC",
];

export default function M72() {
  const [activeMenu, setActiveMenu] = useState("generate");
  const [structureImage, setStructureImage] = useState<string | null>(null);
  const [styleImages, setStyleImages] = useState<string[]>([]);
  const [category, setCategory] = useState("神兵/武器");
  const [itemName, setItemName] = useState("");
  const [generateCount, setGenerateCount] = useState([1]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleStructureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStructureImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStyleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).slice(0, 3 - styleImages.length).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === Math.min(files.length, 3 - styleImages.length)) {
            setStyleImages((prev) => [...prev, ...newImages].slice(0, 3));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeStyleImage = (index: number) => {
    setStyleImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border/40 flex items-center px-5 bg-background/80 backdrop-blur-sm">
          <h1 className="text-lg font-medium text-foreground">M72 · 法宝炼制</h1>
          <div className="flex-1" />
          <UserMenu />
        </header>

        <main className="flex-1 overflow-hidden flex">
          {/* 功能标签页 */}
          <div className="w-48 border-r border-border/40 bg-sidebar/30">
            <ScrollArea className="h-full py-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                    activeMenu === item.id
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-l-2 border-transparent"
                  }`}
                >
                  <item.icon className={`h-4 w-4 shrink-0 ${activeMenu === item.id ? 'text-primary' : ''}`} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">{item.title}</span>
                    <span className="text-[10px] text-muted-foreground truncate">{item.subtitle}</span>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* 主内容区 */}
          <div className="flex-1 flex overflow-hidden">
            {/* 表单区域 */}
            <ScrollArea className="flex-1 p-6">
              <div className="max-w-xl mx-auto space-y-6">
                <div className="bg-card/30 border border-border/40 rounded-2xl p-6 space-y-6">
                  {/* 根据activeMenu显示不同内容 */}
                  {activeMenu === "generate" && (
                    <>
                      <div>
                        <h2 className="text-lg font-medium text-foreground">法宝炼制·生成图标</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          选择分类（隐含风格）并输入主体，炼制神兵法宝。
                        </p>
                      </div>

                      {/* 结构参考图 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">上图·结构参考图（可选）</Label>
                        <div 
                          className="border border-dashed border-border/60 rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/20 hover:border-primary/40 transition-all duration-200"
                          onClick={() => document.getElementById("structure-upload")?.click()}
                        >
                          {structureImage ? (
                            <div className="relative w-full h-full p-2">
                              <img 
                                src={structureImage} 
                                alt="结构参考" 
                                className="w-full h-full object-contain rounded-lg"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setStructureImage(null);
                                }}
                                className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <ImageIcon className="h-6 w-6 text-muted-foreground/50 mb-2" />
                              <span className="text-xs text-muted-foreground">点击上传 或 Ctrl+V 粘贴</span>
                            </>
                          )}
                        </div>
                        <input
                          id="structure-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleStructureUpload}
                        />
                      </div>

                      {/* 风格参考图 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">风格参考图（{styleImages.length}/3 张）</Label>
                        <div className="flex gap-3 flex-wrap">
                          {styleImages.map((img, index) => (
                            <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border/60 group">
                              <img src={img} alt={`风格${index + 1}`} className="w-full h-full object-cover" />
                              <button
                                onClick={() => removeStyleImage(index)}
                                className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          {styleImages.length < 3 && (
                            <div
                              onClick={() => document.getElementById("style-upload")?.click()}
                              className="w-20 h-20 rounded-xl border border-dashed border-border/60 flex items-center justify-center cursor-pointer hover:bg-secondary/20 hover:border-primary/40 transition-all duration-200"
                            >
                              <Upload className="h-5 w-5 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">这些参考图将自动应用于生成</p>
                        <input
                          id="style-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleStyleUpload}
                        />
                      </div>

                      {/* 物品类别 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">物品类别（自动应用风格参考）</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="rounded-xl bg-secondary/30 border-border/40 hover:border-primary/40 transition-colors">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {itemCategories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 主体名称/描述 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">主体名称/描述</Label>
                        <Input
                          value={itemName}
                          onChange={(e) => setItemName(e.target.value)}
                          placeholder="例如：万魂幡、九转金丹"
                          className="rounded-xl bg-secondary/30 border-border/40 hover:border-primary/40 focus:border-primary transition-colors"
                        />
                      </div>

                      {/* 生成数量 */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm text-muted-foreground">生成数量</Label>
                          <span className="text-sm font-medium text-primary">{generateCount[0]}</span>
                        </div>
                        <Slider
                          value={generateCount}
                          onValueChange={setGenerateCount}
                          min={1}
                          max={4}
                          step={1}
                          className="py-2"
                        />
                      </div>

                      {/* 生成按钮 */}
                      <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !itemName.trim()}
                        className="w-full h-11 rounded-xl text-base font-medium"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            炼制中...
                          </>
                        ) : (
                          <>
                            <Flame className="h-4 w-4 mr-2" />
                            开炉炼制
                          </>
                        )}
                      </Button>
                    </>
                  )}

                  {activeMenu === "threeview" && (
                    <div className="text-center py-12">
                      <Layers className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h2 className="text-lg font-medium text-foreground">仙姿绘卷</h2>
                      <p className="text-sm text-muted-foreground mt-2">THREE VIEW · 多视角生成功能</p>
                      <p className="text-xs text-muted-foreground/60 mt-4">功能开发中...</p>
                    </div>
                  )}

                  {activeMenu === "fusion" && (
                    <div className="text-center py-12">
                      <Box className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h2 className="text-lg font-medium text-foreground">万象融合</h2>
                      <p className="text-sm text-muted-foreground mt-2">FUSION · 图像融合功能</p>
                      <p className="text-xs text-muted-foreground/60 mt-4">功能开发中...</p>
                    </div>
                  )}

                  {activeMenu === "colorshift" && (
                    <div className="text-center py-12">
                      <Palette className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h2 className="text-lg font-medium text-foreground">灵韵染坊</h2>
                      <p className="text-sm text-muted-foreground mt-2">COLOR SHIFT · 色彩调整功能</p>
                      <p className="text-xs text-muted-foreground/60 mt-4">功能开发中...</p>
                    </div>
                  )}

                  {activeMenu === "texture" && (
                    <div className="text-center py-12">
                      <Shirt className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h2 className="text-lg font-medium text-foreground">云裳织造</h2>
                      <p className="text-sm text-muted-foreground mt-2">TEXTURE · 纹理生成功能</p>
                      <p className="text-xs text-muted-foreground/60 mt-4">功能开发中...</p>
                    </div>
                  )}

                  {activeMenu === "relief" && (
                    <div className="text-center py-12">
                      <Box className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h2 className="text-lg font-medium text-foreground">金石篆刻</h2>
                      <p className="text-sm text-muted-foreground mt-2">RELIEF · 浮雕效果功能</p>
                      <p className="text-xs text-muted-foreground/60 mt-4">功能开发中...</p>
                    </div>
                  )}

                  {activeMenu === "history" && (
                    <div className="text-center py-12">
                      <History className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h2 className="text-lg font-medium text-foreground">藏经阁</h2>
                      <p className="text-sm text-muted-foreground mt-2">HISTORY · 历史记录</p>
                      <p className="text-xs text-muted-foreground/60 mt-4">功能开发中...</p>
                    </div>
                  )}

                  {activeMenu === "workshop" && (
                    <div className="text-center py-12">
                      <Wrench className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h2 className="text-lg font-medium text-foreground">天工坊</h2>
                      <p className="text-sm text-muted-foreground mt-2">WORKSHOP · 高级工作坊</p>
                      <p className="text-xs text-muted-foreground/60 mt-4">功能开发中...</p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            {/* 预览区域 */}
            <div className="w-[400px] border-l border-border/40 bg-secondary/10 p-6 flex flex-col">
              <div className="flex-1 border border-dashed border-border/40 rounded-2xl flex flex-col items-center justify-center">
                {generatedImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 p-4 w-full">
                    {generatedImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`生成结果${index + 1}`}
                        className="rounded-xl border border-border/40"
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/20 flex items-center justify-center mb-4">
                      <Flame className="h-7 w-7 text-muted-foreground/20" />
                    </div>
                    <p className="text-sm text-muted-foreground/60">丹炉未热，等待投料...</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}