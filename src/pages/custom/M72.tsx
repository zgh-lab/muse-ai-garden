import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
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

const sideMenuItems = [
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
    // 模拟生成过程
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
    // 这里可以集成实际的AI生成API
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        {/* M72 内部侧边栏 */}
        <div className="w-48 bg-sidebar/30 border-r border-sidebar-border flex flex-col">
          <ScrollArea className="flex-1 py-2">
            {sideMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                  activeMenu === item.id
                    ? "bg-primary/15 text-primary border-l-2 border-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-[10px] text-muted-foreground">{item.subtitle}</span>
                </div>
              </button>
            ))}
          </ScrollArea>
          
          {/* 用户信息 */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                G
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Game Master</span>
                <span className="text-[10px] text-muted-foreground">Manage System</span>
              </div>
            </div>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 flex">
          {/* 表单区域 */}
          <div className="flex-1 p-8 max-w-2xl">
            <div className="bg-card/50 border border-border rounded-2xl p-6 space-y-6">
              <div>
                <h1 className="text-xl font-semibold text-foreground">法宝炼制·生成图标</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  选择分类（隐含风格）并输入主体，炼制神兵法宝。
                </p>
              </div>

              {/* 结构参考图 */}
              <div className="space-y-2">
                <Label className="text-sm">上图·结构参考图（可选）</Label>
                <div 
                  className="border border-dashed border-border rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/30 transition-colors"
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
                        className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
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
                <Label className="text-sm">风格参考图（{styleImages.length} 张）</Label>
                <div className="flex gap-3">
                  {styleImages.map((img, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border">
                      <img src={img} alt={`风格${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeStyleImage(index)}
                        className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {styleImages.length < 3 && (
                    <div
                      onClick={() => document.getElementById("style-upload")?.click()}
                      className="w-20 h-20 rounded-xl border border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-secondary/30 transition-colors"
                    >
                      <Upload className="h-5 w-5 text-muted-foreground" />
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
                <Label className="text-sm">物品类别（自动应用风格参考）</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="rounded-xl">
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
                <Label className="text-sm">主体名称/描述</Label>
                <Input
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="例如：万魂幡、九转金丹"
                  className="rounded-xl"
                />
              </div>

              {/* 生成数量 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">生成数量</Label>
                  <span className="text-sm text-muted-foreground">{generateCount[0]}</span>
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
                className="w-full h-11 rounded-xl text-base"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    炼制中...
                  </>
                ) : (
                  "开炉炼制"
                )}
              </Button>
            </div>
          </div>

          {/* 预览区域 */}
          <div className="flex-1 p-8 bg-secondary/20">
            <div className="h-full border border-dashed border-border rounded-2xl flex flex-col items-center justify-center">
              {generatedImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 p-4">
                  {generatedImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`生成结果${index + 1}`}
                      className="rounded-xl border border-border"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-4">
                    <Flame className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-sm text-muted-foreground">丹炉未热，等待投料...</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}