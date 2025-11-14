import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, MapPin, Zap } from 'lucide-react';
import { Knowledge } from '@/types/game';

interface KnowledgeLogProps {
  knowledge: Knowledge[];
}

const categoryIcons = {
  enemy_pattern: Brain,
  npc_memory: Users,
  item_location: MapPin,
  event: Zap,
};

const categoryColors = {
  enemy_pattern: 'bg-enemy-evolve/20 text-enemy-evolve border-enemy-evolve/50',
  npc_memory: 'bg-knowledge/20 text-knowledge border-knowledge/50',
  item_location: 'bg-warning/20 text-warning border-warning/50',
  event: 'bg-secondary/20 text-secondary border-secondary/50',
};

export const KnowledgeLog = ({ knowledge }: KnowledgeLogProps) => {
  return (
    <Card className="p-4 border-2 border-knowledge shadow-glow-secondary h-full">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-knowledge" />
        <h3 className="text-lg font-bold text-knowledge">Knowledge Archive</h3>
        <Badge variant="secondary" className="ml-auto">{knowledge.length}</Badge>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {knowledge.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No knowledge discovered yet. Explore and learn!
            </p>
          ) : (
            knowledge.map((item) => {
              const Icon = categoryIcons[item.category];
              return (
                <Card key={item.id} className={`p-3 border ${categoryColors[item.category]} transition-all hover:scale-[1.02]`}>
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Loop #{item.loopDiscovered}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
