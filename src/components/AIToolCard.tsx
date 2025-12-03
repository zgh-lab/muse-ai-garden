import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AIToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function AIToolCard({ title, description, icon: Icon, onClick }: AIToolCardProps) {
  return (
    <Card
      onClick={onClick}
      className="group relative overflow-hidden bg-gradient-card backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-base cursor-pointer hover:shadow-glow interactive-lift"
    >
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-all duration-base" />
      
      <div className="relative p-6 flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-base shadow-sm group-hover:shadow-md">
          <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-base" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-gradient-primary transition-all duration-base">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}
