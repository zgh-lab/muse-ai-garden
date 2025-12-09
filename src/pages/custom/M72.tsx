import { useState } from "react";
import { TopNavbar } from "@/components/TopNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
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
  ArrowLeftRight,
  BookOpen,
  Grid2X2,
} from "lucide-react";
import { AssetLibraryMini } from "@/components/AssetLibraryMini";

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

const materialTags = ["云锦", "苏绣锦绸", "粗麻布", "走兽甲", "青铜纹", "做旧皮革", "灵兽皮毛", "玉石纹理", "纯白底"];

const historyTabs = ["全部记录", "法宝炼制", "仙姿绘卷", "万象融合", "灵韵染坊", "云裳织造"];

const workshopTabs = ["通用设置", "法宝炼制", "仙姿绘卷", "万象融合", "灵韵染坊", "云裳织造", "金石篆刻", "运行日志"];

export default function M72() {
  const [activeMenu, setActiveMenu] = useState("generate");
  
  // 法宝炼制状态
  const [structureImage, setStructureImage] = useState<string | null>(null);
  const [styleImages, setStyleImages] = useState<string[]>([]);
  const [category, setCategory] = useState("神兵/武器");
  const [itemName, setItemName] = useState("");
  const [generateCount, setGenerateCount] = useState([1]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  
  // 仙姿绘卷状态
  const [threeViewImage, setThreeViewImage] = useState<string | null>(null);
  
  // 万象融合状态
  const [fusionImage1, setFusionImage1] = useState<string | null>(null);
  const [fusionImage2, setFusionImage2] = useState<string | null>(null);
  const [fusionPrompt, setFusionPrompt] = useState("");
  const [fusionRatio, setFusionRatio] = useState("keep1");
  
  // 灵韵染坊状态
  const [colorShiftImage, setColorShiftImage] = useState<string | null>(null);
  const [colorShiftTarget, setColorShiftTarget] = useState("");
  
  // 云裳织造状态
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(["云锦"]);
  const [materialType, setMaterialType] = useState("云锦 (Cloud Brocade)");
  const [patternDesc, setPatternDesc] = useState("");
  
  // 金石篆刻状态
  const [reliefImage, setReliefImage] = useState<string | null>(null);
  
  // 藏经阁状态
  const [historyTab, setHistoryTab] = useState("全部记录");
  
  // 天工坊状态
  const [workshopTab, setWorkshopTab] = useState("通用设置");
  const [projectName, setProjectName] = useState("问剑长生");
  const [gameGenre, setGameGenre] = useState("东方玄幻/仙侠 RPG");
  const [worldContext, setWorldContext] = useState("世界观设定为修真界与凡间交织，美术风格强调气韵生动，材质多用玉石、青铜、丝绸。");
  const [creativity, setCreativity] = useState([1.0]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
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

  const toggleMaterial = (mat: string) => {
    setSelectedMaterials(prev => {
      if (prev.includes(mat)) {
        return prev.filter(m => m !== mat);
      }
      return [...prev, mat];
    });
  };

  const swapFusionImages = () => {
    const temp = fusionImage1;
    setFusionImage1(fusionImage2);
    setFusionImage2(temp);
  };

  // 渲染上传区域组件
  const ImageUploadBox = ({ 
    image, 
    onUpload, 
    onRemove, 
    id,
    label,
    hint = "支持 JPG, PNG"
  }: { 
    image: string | null; 
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    id: string;
    label?: string;
    hint?: string;
  }) => (
    <div className="space-y-3 flex-1">
      {label && <Label className="text-sm font-medium text-foreground/80">{label}</Label>}
      <div 
        className="border-2 border-dashed border-border/50 rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 relative group"
        onClick={() => document.getElementById(id)?.click()}
      >
        {image ? (
          <>
            <img src={image} alt="上传图片" className="w-full h-full object-contain rounded-2xl p-3" />
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="absolute top-3 right-3 w-7 h-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Upload className="h-6 w-6 text-primary/60 group-hover:text-primary transition-colors" />
            </div>
            <span className="text-sm font-medium text-foreground/70">点击上传</span>
            <span className="text-xs text-muted-foreground mt-1">或 Ctrl+V 粘贴</span>
            {hint && <span className="text-xs text-muted-foreground/50 mt-2">{hint}</span>}
          </div>
        )}
      </div>
      <input id={id} type="file" accept="image/*" className="hidden" onChange={onUpload} />
    </div>
  );

  // 渲染右侧面板（结果+资产库）
  const RightPanel = ({ 
    title, 
    emptyText = "等待输入数据",
    children 
  }: { 
    title: string; 
    emptyText?: string;
    children?: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-6 h-full">
      {/* 结果面板 */}
      <div className="flex-1 flex flex-col min-h-0">
        <Label className="text-sm font-medium text-foreground/80 mb-3">{title}</Label>
        <div className="flex-1 border border-border/30 rounded-2xl bg-card/50 flex flex-col items-center justify-center min-h-[320px]">
          {children || (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>
              <span className="text-sm text-muted-foreground">{emptyText}</span>
            </div>
          )}
        </div>
      </div>
      {/* 资产库缩略控件 */}
      <div className="h-[280px] shrink-0">
        <AssetLibraryMini />
      </div>
    </div>
  );

  // 页面标题组件
  const PageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="mb-6">
      <h2 className="text-2xl font-medium text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <TopNavbar />
      
      <main className="flex-1 overflow-hidden flex">
          {/* 功能标签页 */}
          <div className="w-52 border-r border-border/30 bg-card/30">
            <ScrollArea className="h-full py-4">
              <div className="px-3 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeMenu === item.id
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      activeMenu === item.id ? 'bg-primary/20' : 'bg-secondary/50'
                    }`}>
                      <item.icon className={`h-4 w-4 ${activeMenu === item.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">{item.title}</span>
                      <span className="text-[10px] text-muted-foreground/70 truncate">{item.subtitle}</span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* 主内容区 */}
          <ScrollArea className="flex-1">
            <div className="p-8">
              {/* 法宝炼制 */}
              {activeMenu === "generate" && (
                <div className="max-w-6xl">
                  <div className="mb-6">
                    <h2 className="text-2xl font-medium text-foreground">法宝炼制</h2>
                    <p className="text-sm text-muted-foreground mt-2">选择分类并输入主体描述，生成神兵法宝图标</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card/50 border border-border/30 rounded-2xl p-6 space-y-6">
                      {/* 结构参考图 */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/80">结构参考图（可选）</Label>
                        <div 
                          className="border-2 border-dashed border-border/50 rounded-2xl h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group"
                          onClick={() => document.getElementById("structure-upload")?.click()}
                        >
                          {structureImage ? (
                            <div className="relative w-full h-full p-3">
                              <img src={structureImage} alt="结构参考" className="w-full h-full object-contain rounded-xl" />
                              <button
                                onClick={(e) => { e.stopPropagation(); setStructureImage(null); }}
                                className="absolute top-2 right-2 w-7 h-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <ImageIcon className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors" />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-foreground/70">点击上传</span>
                                <span className="text-xs text-muted-foreground block">或 Ctrl+V 粘贴</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <input id="structure-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setStructureImage)} />
                      </div>

                      {/* 风格参考图 */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/80">风格参考图（{styleImages.length}/3 张）</Label>
                        <div className="flex gap-3 flex-wrap">
                          {styleImages.map((img, index) => (
                            <div key={index} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border/30 group shadow-sm">
                              <img src={img} alt={`风格${index + 1}`} className="w-full h-full object-cover" />
                              <button
                                onClick={() => removeStyleImage(index)}
                                className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          {styleImages.length < 3 && (
                            <div
                              onClick={() => document.getElementById("style-upload")?.click()}
                              className="w-24 h-24 rounded-2xl border-2 border-dashed border-border/50 flex items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group"
                            >
                              <Upload className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                            </div>
                          )}
                        </div>
                        <input id="style-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleStyleUpload} />
                      </div>

                      {/* 物品类别 */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/80">物品类别</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="h-11 rounded-xl bg-secondary/30 border-border/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {itemCategories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 主体名称 */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/80">主体名称/描述</Label>
                        <Input
                          value={itemName}
                          onChange={(e) => setItemName(e.target.value)}
                          placeholder="例如：万魂幡、九转金丹"
                          className="h-11 rounded-xl bg-secondary/30 border-border/30"
                        />
                      </div>

                      {/* 生成数量 */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-foreground/80">生成数量</Label>
                          <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{generateCount[0]}</span>
                        </div>
                        <Slider value={generateCount} onValueChange={setGenerateCount} min={1} max={4} step={1} />
                      </div>

                      <Button onClick={handleGenerate} disabled={isGenerating || !itemName.trim()} className="w-full h-12 rounded-xl text-base font-medium">
                        {isGenerating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />炼制中...</> : <><Flame className="h-4 w-4 mr-2" />开炉炼制</>}
                      </Button>
                    </div>
                    <div>
                      <RightPanel title="生成结果" emptyText="等待输入数据" />
                    </div>
                  </div>
                </div>
              )}

              {/* 仙姿绘卷 - 三视图 */}
              {activeMenu === "threeview" && (
                <div className="max-w-6xl">
                  <div className="mb-6">
                    <h2 className="text-2xl font-medium text-foreground">仙姿绘卷</h2>
                    <p className="text-sm text-muted-foreground mt-2">上传角色正视图，AI自动生成侧视图与背视图，8K级细节无损拼接</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card/50 border border-border/30 rounded-2xl p-6">
                      <ImageUploadBox
                        image={threeViewImage}
                        onUpload={(e) => handleImageUpload(e, setThreeViewImage)}
                        onRemove={() => setThreeViewImage(null)}
                        id="threeview-upload"
                        label="原画输入（正视图）"
                      />
                      <Button className="w-full h-12 rounded-xl mt-6 text-base font-medium" disabled={!threeViewImage}>
                        <Layers className="h-4 w-4 mr-2" />
                        生成高清三视图
                      </Button>
                    </div>
                    <div>
                      <RightPanel title="三视图结果" emptyText="等待上传原画" />
                    </div>
                  </div>
                </div>
              )}

              {/* 万象融合 */}
              {activeMenu === "fusion" && (
                <div className="max-w-6xl">
                  <div className="mb-6">
                    <h2 className="text-2xl font-medium text-foreground">万象融合</h2>
                    <p className="text-sm text-muted-foreground mt-2">上传两张图片，AI自动进行元素重组与风格融合</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-card/50 border border-border/30 rounded-2xl p-6 space-y-6">
                      <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4">
                        <div className="relative">
                          <span className="absolute -top-3 left-3 px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full z-10">图 1</span>
                          <div className="border-2 border-dashed border-border/50 rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group" onClick={() => document.getElementById("fusion1-upload")?.click()}>
                            {fusionImage1 ? (
                              <div className="relative w-full h-full">
                                <img src={fusionImage1} alt="图1" className="w-full h-full object-contain rounded-2xl p-3" />
                                <button onClick={(e) => { e.stopPropagation(); setFusionImage1(null); }} className="absolute top-3 right-3 w-7 h-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-lg"><X className="h-3.5 w-3.5" /></button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center p-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors"><ImageIcon className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors" /></div>
                                <span className="text-xs font-medium text-foreground/70">点击上传</span>
                              </div>
                            )}
                          </div>
                          <input id="fusion1-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setFusionImage1)} />
                        </div>
                        <button onClick={swapFusionImages} className="w-10 h-10 rounded-xl border border-border/30 bg-card/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/50 transition-all"><ArrowLeftRight className="h-4 w-4 text-muted-foreground" /></button>
                        <div className="relative">
                          <span className="absolute -top-3 right-3 px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full z-10">图 2</span>
                          <div className="border-2 border-dashed border-border/50 rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group" onClick={() => document.getElementById("fusion2-upload")?.click()}>
                            {fusionImage2 ? (
                              <div className="relative w-full h-full">
                                <img src={fusionImage2} alt="图2" className="w-full h-full object-contain rounded-2xl p-3" />
                                <button onClick={(e) => { e.stopPropagation(); setFusionImage2(null); }} className="absolute top-3 right-3 w-7 h-7 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-lg"><X className="h-3.5 w-3.5" /></button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center p-4">
                                <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center mb-3 group-hover:bg-secondary transition-colors"><ImageIcon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" /></div>
                                <span className="text-xs font-medium text-foreground/70">点击上传</span>
                              </div>
                            )}
                          </div>
                          <input id="fusion2-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setFusionImage2)} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/80">融合指令（可选）</Label>
                        <Input value={fusionPrompt} onChange={(e) => setFusionPrompt(e.target.value)} placeholder="例如：将 图1 的金属质感应用在 图2 的生物形态上..." className="h-11 rounded-xl bg-secondary/30 border-border/30" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-foreground/80">输出比例</Label>
                          <Select value={fusionRatio} onValueChange={setFusionRatio}>
                            <SelectTrigger className="h-11 rounded-xl bg-secondary/30 border-border/30"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="keep1">和图1保持一致</SelectItem>
                              <SelectItem value="keep2">和图2保持一致</SelectItem>
                              <SelectItem value="1:1">1:1 正方形</SelectItem>
                              <SelectItem value="16:9">16:9 横版</SelectItem>
                              <SelectItem value="9:16">9:16 竖版</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="h-11 rounded-xl self-end text-base font-medium" disabled={!fusionImage1 || !fusionImage2}>开始融合</Button>
                      </div>
                    </div>
                    <div>
                      <RightPanel title="融合结果" emptyText="等待输入两张图片" />
                    </div>
                  </div>
                </div>
              )}

              {/* 灵韵染坊 - 风格换色 */}
              {activeMenu === "colorshift" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
                  <div>
                    <div className="mb-8">
                      <h2 className="text-2xl font-medium text-foreground">灵韵染坊</h2>
                      <p className="text-sm text-muted-foreground mt-2">保留原作笔触与光影结构，仅改变色相与氛围</p>
                    </div>
                    <div className="bg-card/50 border border-border/30 rounded-2xl p-6 space-y-6">
                      <ImageUploadBox
                        image={colorShiftImage}
                        onUpload={(e) => handleImageUpload(e, setColorShiftImage)}
                        onRemove={() => setColorShiftImage(null)}
                        id="colorshift-upload"
                        label="底稿输入"
                        hint=""
                      />
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/80">目标色调 / 氛围</Label>
                        <Input
                          value={colorShiftTarget}
                          onChange={(e) => setColorShiftTarget(e.target.value)}
                          placeholder="例如：赤金火焰、幽蓝寒冰、暗紫虚空..."
                          className="h-11 rounded-xl bg-secondary/30 border-border/30"
                        />
                      </div>
                      <Button className="w-full h-12 rounded-xl text-base font-medium" disabled={!colorShiftImage}>
                        <Palette className="h-4 w-4 mr-2" />
                        开始提染
                      </Button>
                    </div>
                  </div>
                  <div className="pt-[76px]">
                    <RightPanel title="成品展示" emptyText="等待注入灵韵" />
                  </div>
                </div>
              )}

              {/* 云裳织造 - 纹理生成 */}
              {activeMenu === "texture" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
                  <div>
                    <div className="mb-8">
                      <h2 className="text-2xl font-medium text-foreground">云裳织造</h2>
                      <p className="text-sm text-muted-foreground mt-2">生成可无缝平铺的高清纹理，适用于服装布料或环境贴图</p>
                    </div>
                    <div className="bg-card/50 border border-border/30 rounded-2xl p-6 space-y-6">
                      <div className="space-y-4">
                        <Label className="text-sm font-medium text-foreground/80">常用材质</Label>
                        <div className="flex flex-wrap gap-2">
                          {materialTags.map((mat) => (
                            <button
                              key={mat}
                              onClick={() => toggleMaterial(mat)}
                              className={`px-4 py-2 text-sm rounded-xl border transition-all duration-200 ${
                                selectedMaterials.includes(mat)
                                  ? "bg-primary/15 text-primary border-primary/50"
                                  : "border-border/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                              }`}
                            >
                              {mat}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/80">材质类型（自定义）</Label>
                        <Input
                          value={materialType}
                          onChange={(e) => setMaterialType(e.target.value)}
                          className="h-11 rounded-xl bg-secondary/30 border-border/30"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/80">纹样描述</Label>
                        <Textarea
                          value={patternDesc}
                          onChange={(e) => setPatternDesc(e.target.value)}
                          placeholder="例如：金线绣制的祥云图案，深红色底色..."
                          className="rounded-xl bg-secondary/30 border-border/30 min-h-[100px] resize-none"
                        />
                      </div>
                      
                      <Button className="w-full h-12 rounded-xl text-base font-medium">
                        <Shirt className="h-4 w-4 mr-2" />
                        织造纹理
                      </Button>
                    </div>
                  </div>
                  <div className="pt-[76px]">
                    <RightPanel title="锦缎预览" emptyText="等待织造指令">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <Grid2X2 className="h-8 w-8 text-primary/40" />
                      </div>
                      <span className="text-sm text-muted-foreground">等待织造指令</span>
                    </RightPanel>
                  </div>
                </div>
              )}

              {/* 金石篆刻 - 灰度图生成 */}
              {activeMenu === "relief" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
                  <div>
                    <div className="mb-8">
                      <h2 className="text-2xl font-medium text-foreground">金石篆刻</h2>
                      <p className="text-sm text-muted-foreground mt-2">上传线稿图片，转换为灰度高度图，可用于生成 Normal Map 或浮雕效果</p>
                    </div>
                    <div className="bg-card/50 border border-border/30 rounded-2xl p-6 space-y-6">
                      <ImageUploadBox
                        image={reliefImage}
                        onUpload={(e) => handleImageUpload(e, setReliefImage)}
                        onRemove={() => setReliefImage(null)}
                        id="relief-upload"
                        label="线稿输入"
                      />
                      
                      <div className="p-4 bg-secondary/30 rounded-xl border border-border/20">
                        <p className="text-sm font-medium text-foreground/80 mb-3">输出说明</p>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            纯灰度图（无颜色）
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            黑色背景
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            灰度值表示体积深度
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            可用于生成 Normal Map
                          </li>
                        </ul>
                      </div>
                      
                      <Button className="w-full h-12 rounded-xl text-base font-medium" disabled={!reliefImage}>
                        <Box className="h-4 w-4 mr-2" />
                        生成高度图
                      </Button>
                    </div>
                  </div>
                  <div className="pt-[76px]">
                    <RightPanel title="高度图输出" emptyText="等待输入线稿" />
                  </div>
                </div>
              )}

              {/* 藏经阁 - 历史记录 */}
              {activeMenu === "history" && (
                <div className="max-w-5xl">
                  <div className="mb-8">
                    <h2 className="text-2xl font-medium text-foreground">藏经阁</h2>
                    <p className="text-sm text-muted-foreground mt-2">查看过往的生成记录，回溯灵感源泉</p>
                  </div>
                  
                  <div className="flex gap-2 mb-8 flex-wrap">
                    {historyTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setHistoryTab(tab)}
                        className={`px-5 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                          historyTab === tab
                            ? "bg-primary/15 text-primary font-medium"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  
                  <div className="bg-card/50 border border-border/30 rounded-2xl min-h-[400px] flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <BookOpen className="h-10 w-10 text-primary/40" />
                    </div>
                    <span className="text-sm text-muted-foreground">此分类下暂无记录</span>
                  </div>
                </div>
              )}

              {/* 天工坊 - 全局设置 */}
              {activeMenu === "workshop" && (
                <div className="max-w-5xl">
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-medium text-foreground">天工坊</h2>
                      <p className="text-sm text-muted-foreground mt-2">调整生成参数、提示词模板及系统连接</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="h-11 rounded-xl border-border/30">恢复默认</Button>
                      <Button className="h-11 rounded-xl">保存设置</Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-8 flex-wrap">
                    {workshopTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setWorkshopTab(tab)}
                        className={`px-5 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                          workshopTab === tab
                            ? "bg-primary/15 text-primary font-medium"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  
                  {workshopTab === "通用设置" && (
                    <div className="bg-card/50 border border-border/30 rounded-2xl p-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-foreground/80">游戏名称</Label>
                          <Input
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="h-11 rounded-xl bg-secondary/30 border-border/30"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-foreground/80">游戏类型</Label>
                          <Input
                            value={gameGenre}
                            onChange={(e) => setGameGenre(e.target.value)}
                            className="h-11 rounded-xl bg-secondary/30 border-border/30"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground/80">全局世界观</Label>
                        <Textarea
                          value={worldContext}
                          onChange={(e) => setWorldContext(e.target.value)}
                          className="rounded-xl bg-secondary/30 border-border/30 min-h-[120px] resize-none"
                        />
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium text-foreground/80">创造力 (Temperature)</Label>
                            <p className="text-xs text-muted-foreground mt-1">值越高越有创意，但也可能越不稳定</p>
                          </div>
                          <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{creativity[0].toFixed(1)}</span>
                        </div>
                        <Slider
                          value={creativity}
                          onValueChange={setCreativity}
                          min={0}
                          max={2}
                          step={0.1}
                        />
                      </div>
                    </div>
                  )}
                  
                  {workshopTab !== "通用设置" && (
                    <div className="bg-card/50 border border-border/30 rounded-2xl min-h-[300px] flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <Wrench className="h-8 w-8 text-primary/40" />
                      </div>
                      <span className="text-sm text-muted-foreground">{workshopTab} 设置开发中...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </main>
    </div>
  );
}
