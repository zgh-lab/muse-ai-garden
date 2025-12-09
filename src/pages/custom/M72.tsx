import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/UserMenu";
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
    <div className="space-y-2 flex-1">
      {label && <Label className="text-sm text-muted-foreground">{label}</Label>}
      <div 
        className="border border-dashed border-border/60 rounded-xl aspect-[4/5] flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/20 hover:border-primary/40 transition-all duration-200 relative"
        onClick={() => document.getElementById(id)?.click()}
      >
        {image ? (
          <>
            <img src={image} alt="上传图片" className="w-full h-full object-contain rounded-xl p-2" />
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <X className="h-3 w-3" />
            </button>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <span className="text-sm text-muted-foreground">点击上传 或 Ctrl+V 粘贴</span>
            <span className="text-xs text-muted-foreground/60 mt-1">{hint}</span>
          </>
        )}
      </div>
      <input id={id} type="file" accept="image/*" className="hidden" onChange={onUpload} />
    </div>
  );

  // 渲染结果预览区域
  const ResultPanel = ({ title, emptyText = "等待输入数据" }: { title: string; emptyText?: string }) => (
    <div className="flex-1 flex flex-col">
      <Label className="text-sm text-muted-foreground mb-2">{title}</Label>
      <div className="flex-1 border border-border/40 rounded-xl bg-secondary/10 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground/40">
          <div className="w-1 h-1 bg-primary rounded-full mx-auto mb-2 animate-pulse" />
          <span className="text-sm">{emptyText}</span>
        </div>
      </div>
    </div>
  );

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
          <ScrollArea className="flex-1">
            <div className="p-6">
              {/* 法宝炼制 */}
              {activeMenu === "generate" && (
                <div className="flex gap-6">
                  <div className="flex-1 max-w-xl">
                    <div className="mb-6">
                      <h2 className="text-xl font-medium text-primary">法宝炼制·生成图标</h2>
                      <p className="text-sm text-muted-foreground mt-1">选择分类（隐含风格）并输入主体，炼制神兵法宝。</p>
                    </div>
                    <div className="bg-card/30 border border-border/40 rounded-2xl p-6 space-y-6">
                      {/* 结构参考图 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">上图·结构参考图（可选）</Label>
                        <div 
                          className="border border-dashed border-border/60 rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/20 hover:border-primary/40 transition-all duration-200"
                          onClick={() => document.getElementById("structure-upload")?.click()}
                        >
                          {structureImage ? (
                            <div className="relative w-full h-full p-2">
                              <img src={structureImage} alt="结构参考" className="w-full h-full object-contain rounded-lg" />
                              <button
                                onClick={(e) => { e.stopPropagation(); setStructureImage(null); }}
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
                        <input id="structure-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setStructureImage)} />
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
                        <input id="style-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleStyleUpload} />
                      </div>

                      {/* 物品类别 */}
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">物品类别</Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="rounded-xl bg-secondary/30 border-border/40">
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
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">主体名称/描述</Label>
                        <Input
                          value={itemName}
                          onChange={(e) => setItemName(e.target.value)}
                          placeholder="例如：万魂幡、九转金丹"
                          className="rounded-xl bg-secondary/30 border-border/40"
                        />
                      </div>

                      {/* 生成数量 */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm text-muted-foreground">生成数量</Label>
                          <span className="text-sm font-medium text-primary">{generateCount[0]}</span>
                        </div>
                        <Slider value={generateCount} onValueChange={setGenerateCount} min={1} max={4} step={1} />
                      </div>

                      <Button onClick={handleGenerate} disabled={isGenerating || !itemName.trim()} className="w-full h-11 rounded-xl">
                        {isGenerating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />炼制中...</> : <><Flame className="h-4 w-4 mr-2" />开炉炼制</>}
                      </Button>
                    </div>
                  </div>
                  <div className="w-[400px]">
                    <ResultPanel title="生成结果" emptyText="等待输入数据" />
                  </div>
                </div>
              )}

              {/* 仙姿绘卷 - 三视图 */}
              {activeMenu === "threeview" && (
                <div className="flex gap-6">
                  <div className="flex-1 max-w-md">
                    <div className="mb-6">
                      <h2 className="text-xl font-medium text-primary">仙姿绘卷·三视定型</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        上传角色正视图，AI将分别生成侧视图与背视图。<span className="text-primary">经由8K级细节注入重绘后，自动按最高分辨率无损拼接。</span>
                      </p>
                    </div>
                    <div className="bg-card/30 border border-border/40 rounded-2xl p-6">
                      <ImageUploadBox
                        image={threeViewImage}
                        onUpload={(e) => handleImageUpload(e, setThreeViewImage)}
                        onRemove={() => setThreeViewImage(null)}
                        id="threeview-upload"
                        label="原画输入（正视图）"
                      />
                      <Button className="w-full h-11 rounded-xl mt-6" disabled={!threeViewImage}>
                        <Layers className="h-4 w-4 mr-2" />
                        生成高清三视图
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <ResultPanel title="结构拆解结果" emptyText="等待输入数据" />
                  </div>
                </div>
              )}

              {/* 万象融合 */}
              {activeMenu === "fusion" && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-medium text-primary">万象融合·灵感引擎</h2>
                    <p className="text-sm text-muted-foreground mt-1">上传两张图片，AI自动进行元素重组与风格融合。</p>
                  </div>
                  <div className="bg-card/30 border border-border/40 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1 relative">
                        <span className="absolute -top-2 left-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded z-10">图 1</span>
                        <div 
                          className="border border-dashed border-border/60 rounded-xl aspect-[4/3] flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/20 hover:border-primary/40 transition-all"
                          onClick={() => document.getElementById("fusion1-upload")?.click()}
                        >
                          {fusionImage1 ? (
                            <div className="relative w-full h-full">
                              <img src={fusionImage1} alt="图1" className="w-full h-full object-contain rounded-xl p-2" />
                              <button onClick={(e) => { e.stopPropagation(); setFusionImage1(null); }} className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <ImageIcon className="h-8 w-8 text-muted-foreground/40 mb-2" />
                              <span className="text-sm text-muted-foreground">点击上传 或 Ctrl+V 粘贴</span>
                            </>
                          )}
                        </div>
                        <input id="fusion1-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setFusionImage1)} />
                      </div>
                      
                      <button onClick={swapFusionImages} className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center hover:bg-secondary/50 transition-colors shrink-0">
                        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                      
                      <div className="flex-1 relative">
                        <span className="absolute -top-2 right-2 px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded z-10">图 2</span>
                        <div 
                          className="border border-dashed border-border/60 rounded-xl aspect-[4/3] flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/20 hover:border-primary/40 transition-all"
                          onClick={() => document.getElementById("fusion2-upload")?.click()}
                        >
                          {fusionImage2 ? (
                            <div className="relative w-full h-full">
                              <img src={fusionImage2} alt="图2" className="w-full h-full object-contain rounded-xl p-2" />
                              <button onClick={(e) => { e.stopPropagation(); setFusionImage2(null); }} className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <ImageIcon className="h-8 w-8 text-muted-foreground/40 mb-2" />
                              <span className="text-sm text-muted-foreground">点击上传 或 Ctrl+V 粘贴</span>
                            </>
                          )}
                        </div>
                        <input id="fusion2-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setFusionImage2)} />
                      </div>
                    </div>
                    
                    <div className="space-y-4 max-w-2xl mx-auto">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">融合指令 / 提示词（可选）</Label>
                        <Input
                          value={fusionPrompt}
                          onChange={(e) => setFusionPrompt(e.target.value)}
                          placeholder="例如：将 图1 的金属质感应用在 图2 的生物形态上，生成一个机械生物..."
                          className="rounded-xl bg-secondary/30 border-border/40"
                        />
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex-1 space-y-2">
                          <Label className="text-sm text-muted-foreground">输出比例</Label>
                          <Select value={fusionRatio} onValueChange={setFusionRatio}>
                            <SelectTrigger className="rounded-xl bg-secondary/30 border-border/40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="keep1">和图1保持一致</SelectItem>
                              <SelectItem value="keep2">和图2保持一致</SelectItem>
                              <SelectItem value="1:1">1:1 正方形</SelectItem>
                              <SelectItem value="16:9">16:9 横版</SelectItem>
                              <SelectItem value="9:16">9:16 竖版</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="h-11 px-8 rounded-xl" disabled={!fusionImage1 || !fusionImage2}>
                          开始融合
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 灵韵染坊 - 风格换色 */}
              {activeMenu === "colorshift" && (
                <div className="flex gap-6">
                  <div className="flex-1 max-w-md">
                    <div className="mb-6">
                      <h2 className="text-xl font-medium text-primary">灵韵染坊·风格换色</h2>
                      <p className="text-sm text-muted-foreground mt-1">保留原作笔触与光影结构，仅改变色相与氛围。</p>
                    </div>
                    <div className="bg-card/30 border border-border/40 rounded-2xl p-6">
                      <ImageUploadBox
                        image={colorShiftImage}
                        onUpload={(e) => handleImageUpload(e, setColorShiftImage)}
                        onRemove={() => setColorShiftImage(null)}
                        id="colorshift-upload"
                        label="底稿输入"
                        hint=""
                      />
                      <div className="space-y-2 mt-4">
                        <Label className="text-sm text-muted-foreground">目标色调 / 氛围</Label>
                        <Input
                          value={colorShiftTarget}
                          onChange={(e) => setColorShiftTarget(e.target.value)}
                          placeholder="例如：赤金火焰、幽蓝寒冰、暗紫虚空..."
                          className="rounded-xl bg-secondary/30 border-border/40"
                        />
                      </div>
                      <Button className="w-full h-11 rounded-xl mt-6 bg-gradient-to-r from-primary to-cyan-500" disabled={!colorShiftImage}>
                        <Palette className="h-4 w-4 mr-2" />
                        开始提染
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <ResultPanel title="成品展示" emptyText="等待注入灵韵" />
                  </div>
                </div>
              )}

              {/* 云裳织造 - 纹理生成 */}
              {activeMenu === "texture" && (
                <div className="flex gap-6">
                  <div className="flex-1 max-w-lg">
                    <div className="mb-6">
                      <h2 className="text-xl font-medium text-primary">云裳织造·四方连续</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="text-primary">生成可无缝平铺的高清纹理，</span>适用于服装布料或环境贴图。
                      </p>
                    </div>
                    <div className="bg-card/30 border border-border/40 rounded-2xl p-6 space-y-6">
                      <div className="space-y-3">
                        <Label className="text-sm text-muted-foreground">纹理参数</Label>
                        <div className="space-y-2">
                          <span className="text-xs text-muted-foreground">常用材质</span>
                          <div className="flex flex-wrap gap-2">
                            {materialTags.map((mat) => (
                              <button
                                key={mat}
                                onClick={() => toggleMaterial(mat)}
                                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                                  selectedMaterials.includes(mat)
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border/60 text-muted-foreground hover:bg-secondary/50"
                                }`}
                              >
                                {mat}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">材质类型（自定义）</Label>
                        <Input
                          value={materialType}
                          onChange={(e) => setMaterialType(e.target.value)}
                          className="rounded-xl bg-secondary/30 border-border/40"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">纹样描述 / 细节</Label>
                        <Textarea
                          value={patternDesc}
                          onChange={(e) => setPatternDesc(e.target.value)}
                          placeholder="例如：金线绣制的祥云图案，深红色底色，微泛细节..."
                          className="rounded-xl bg-secondary/30 border-border/40 min-h-[100px] resize-none"
                        />
                      </div>
                      
                      <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                        <Shirt className="h-4 w-4 mr-2" />
                        织造纹理
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm text-muted-foreground mb-2 block">锦缎预览</Label>
                    <div className="border border-border/40 rounded-xl bg-secondary/10 min-h-[500px] flex flex-col items-center justify-center">
                      <Grid2X2 className="h-12 w-12 text-muted-foreground/20 mb-3" />
                      <span className="text-sm text-muted-foreground/40">等待织造指令</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 金石篆刻 - 灰度图生成 */}
              {activeMenu === "relief" && (
                <div className="flex gap-6">
                  <div className="flex-1 max-w-md">
                    <div className="mb-6">
                      <h2 className="text-xl font-medium text-amber-400">金石篆刻·灰度图生成</h2>
                      <p className="text-sm text-muted-foreground mt-1">上传线稿图片，AI将转换为黑色底、带体积的灰度图，可用于生成 Normal Map 或浮雕效果。</p>
                    </div>
                    <div className="bg-card/30 border border-amber-500/30 rounded-2xl p-6">
                      <ImageUploadBox
                        image={reliefImage}
                        onUpload={(e) => handleImageUpload(e, setReliefImage)}
                        onRemove={() => setReliefImage(null)}
                        id="relief-upload"
                        label="线稿输入"
                      />
                      
                      <div className="mt-4 p-3 bg-secondary/20 rounded-xl">
                        <p className="text-xs text-muted-foreground font-medium mb-2">输出说明:</p>
                        <ul className="text-xs text-muted-foreground/80 space-y-1 list-disc list-inside">
                          <li>纯灰度图（无颜色）</li>
                          <li>黑色背景</li>
                          <li>灰度值表示体积深度</li>
                          <li>可用于生成 Normal Map</li>
                        </ul>
                      </div>
                      
                      <Button className="w-full h-11 rounded-xl mt-6" disabled={!reliefImage}>
                        <Box className="h-4 w-4 mr-2" />
                        生成高度图
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <ResultPanel title="高度图输出" emptyText="等待输入线稿" />
                  </div>
                </div>
              )}

              {/* 藏经阁 - 历史记录 */}
              {activeMenu === "history" && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-medium text-primary">藏经阁·历史图鉴</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="text-primary">查看过往的生成记录，回溯灵感源泉。</span>
                    </p>
                  </div>
                  
                  <div className="flex gap-2 mb-6">
                    {historyTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setHistoryTab(tab)}
                        className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                          historyTab === tab
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-secondary/50"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground/40">
                    <BookOpen className="h-16 w-16 mb-4" />
                    <span className="text-sm">此分类下暂无记录</span>
                  </div>
                </div>
              )}

              {/* 天工坊 - 全局设置 */}
              {activeMenu === "workshop" && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-medium text-primary">天工坊·全局设置</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="text-primary">调整生成参数，提示词模板及系统连接。</span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="rounded-xl">恢复默认</Button>
                      <Button className="rounded-xl">保存设置</Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-6 flex-wrap">
                    {workshopTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setWorkshopTab(tab)}
                        className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                          workshopTab === tab
                            ? "bg-secondary border-border text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  
                  {workshopTab === "通用设置" && (
                    <div className="bg-card/30 border border-border/40 rounded-2xl p-6 space-y-6 max-w-4xl">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">游戏名称 (Project Name)</Label>
                          <Input
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="rounded-xl bg-secondary/30 border-border/40"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm text-muted-foreground">游戏类型 (Genre)</Label>
                          <Input
                            value={gameGenre}
                            onChange={(e) => setGameGenre(e.target.value)}
                            className="rounded-xl bg-secondary/30 border-border/40"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground flex items-center gap-1">
                          全局世界观 (Custom Context)
                          <span className="w-4 h-4 rounded-full border border-muted-foreground/40 flex items-center justify-center text-[10px]">?</span>
                        </Label>
                        <Textarea
                          value={worldContext}
                          onChange={(e) => setWorldContext(e.target.value)}
                          className="rounded-xl bg-secondary/30 border-border/40 min-h-[100px] resize-none"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">创造力 (Temperature)</Label>
                            <p className="text-xs text-muted-foreground mt-1">值越高越有创意，但也可能越不稳定</p>
                          </div>
                          <span className="text-sm font-medium text-primary">{creativity[0].toFixed(1)}</span>
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
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground/40">
                      <Wrench className="h-12 w-12 mb-3" />
                      <span className="text-sm">{workshopTab} 设置开发中...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
