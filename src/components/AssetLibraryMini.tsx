import { FolderOpen, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockAssets } from "@/data/mockAssets";

interface AssetLibraryMiniProps {
  onExpand?: () => void;
}

export function AssetLibraryMini({ onExpand }: AssetLibraryMiniProps) {
  // 只显示最近的图片资产
  const recentImages = mockAssets
    .filter(asset => asset.type === "image")
    .slice(0, 6);

  return (
    <div className="bg-card/50 border border-border/30 rounded-2xl p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <FolderOpen className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">个人资产库</span>
        </div>
        {onExpand && (
          <button 
            onClick={onExpand}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            展开
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Recent Assets Grid */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-3 gap-2">
          {recentImages.map((asset) => (
            <div 
              key={asset.id}
              className="aspect-square rounded-xl overflow-hidden border border-border/30 cursor-pointer hover:border-primary/50 transition-all group"
            >
              <img 
                src={asset.url} 
                alt={asset.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer hint */}
      <div className="mt-3 pt-3 border-t border-border/20 text-center">
        <span className="text-xs text-muted-foreground">拖拽图片到输入框使用</span>
      </div>
    </div>
  );
}
