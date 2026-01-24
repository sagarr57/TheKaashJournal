import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight, DollarSign, Search, TrendingUp } from "lucide-react";

interface NicheCardProps {
  rank: number;
  name: string;
  searchVolume: number;
  cpc: number;
  difficulty: number;
  growth: number;
  description: string;
  overallScore: number;
}

export function NicheCard({
  rank,
  name,
  searchVolume,
  cpc,
  difficulty,
  growth,
  description,
  overallScore,
}: NicheCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="h-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-200 bg-white overflow-hidden rounded-none">
        <CardHeader className="border-b-2 border-black bg-secondary p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground font-oswald font-bold text-xl border-2 border-black">
                {rank}
              </div>
              <CardTitle className="font-oswald text-xl uppercase tracking-tight">
                {name}
              </CardTitle>
            </div>
            <Badge variant="outline" className="bg-white text-black border-2 border-black font-bold rounded-none">
              Score: {overallScore}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <p className="font-inter text-muted-foreground leading-relaxed">
            {description}
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Search className="w-3 h-3" /> Volume
              </div>
              <div className="font-oswald text-lg font-medium">
                {searchVolume.toLocaleString()}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <DollarSign className="w-3 h-3" /> CPC
              </div>
              <div className="font-oswald text-lg font-medium">
                ${cpc.toFixed(2)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <TrendingUp className="w-3 h-3" /> Growth
              </div>
              <div className={cn("font-oswald text-lg font-medium", growth > 100 ? "text-green-600" : "")}>
                +{growth}%
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <ArrowUpRight className="w-3 h-3" /> Difficulty
              </div>
              <div className="w-full bg-gray-200 h-2 mt-2 border border-black">
                <div 
                  className={cn("h-full border-r border-black", difficulty > 80 ? "bg-red-500" : difficulty > 50 ? "bg-yellow-400" : "bg-green-500")} 
                  style={{ width: `${difficulty}%` }}
                />
              </div>
              <div className="text-xs font-bold text-right mt-1">{difficulty}%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
