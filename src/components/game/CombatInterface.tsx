import { Unit, Enemy } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sword, Shield, Heart, Move, TrendingUp, Eye } from 'lucide-react';

interface CombatInterfaceProps {
  selectedUnit: Unit | null;
  canMove: boolean;
  canAttack: boolean;
  onMove: () => void;
  onAttack: () => void;
  onEndTurn: () => void;
}

export const CombatInterface = ({ 
  selectedUnit, 
  canMove, 
  canAttack,
  onMove,
  onAttack,
  onEndTurn 
}: CombatInterfaceProps) => {
  if (!selectedUnit) {
    return (
      <Card className="p-6 border-2 border-muted text-center">
        <p className="text-muted-foreground">Select a unit to view details and actions</p>
      </Card>
    );
  }

  const isPlayer = selectedUnit.type === 'player';
  const enemy = selectedUnit as Enemy;
  const hpPercentage = (selectedUnit.hp / selectedUnit.maxHp) * 100;

  return (
    <Card className={`p-4 border-2 ${isPlayer ? 'border-secondary shadow-glow-secondary' : 'border-enemy-evolve shadow-glow-accent'}`}>
      <div className="space-y-4">
        {/* Unit Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPlayer ? (
              <Shield className="w-5 h-5 text-secondary" />
            ) : (
              <Sword className="w-5 h-5 text-enemy-evolve" />
            )}
            <h3 className="text-lg font-bold">{selectedUnit.name}</h3>
          </div>
          {!isPlayer && enemy.evolutionLevel > 0 && (
            <Badge variant="destructive" className="bg-accent">
              <TrendingUp className="w-3 h-3 mr-1" />
              Evolution {enemy.evolutionLevel}
            </Badge>
          )}
        </div>

        {/* HP Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-destructive" />
              <span className="font-medium">HP</span>
            </div>
            <span className="font-bold">{selectedUnit.hp} / {selectedUnit.maxHp}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${hpPercentage > 50 ? 'bg-success' : hpPercentage > 25 ? 'bg-warning' : 'bg-destructive'}`}
              style={{ width: `${hpPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-muted rounded p-2">
            <Sword className="w-3 h-3 mb-1 text-destructive" />
            <div className="font-bold">{selectedUnit.attack}</div>
            <div className="text-xs text-muted-foreground">ATK</div>
          </div>
          <div className="bg-muted rounded p-2">
            <Shield className="w-3 h-3 mb-1 text-secondary" />
            <div className="font-bold">{selectedUnit.defense}</div>
            <div className="text-xs text-muted-foreground">DEF</div>
          </div>
          <div className="bg-muted rounded p-2">
            <Eye className="w-3 h-3 mb-1 text-knowledge" />
            <div className="font-bold">{selectedUnit.range}</div>
            <div className="text-xs text-muted-foreground">RNG</div>
          </div>
        </div>

        {/* Enemy Adaptations */}
        {!isPlayer && enemy.adaptedTo.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-enemy-evolve flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Adapted To:
            </p>
            <div className="flex flex-wrap gap-1">
              {enemy.adaptedTo.map((adaptation, idx) => (
                <Badge key={idx} variant="outline" className="text-xs border-enemy-evolve/50">
                  {adaptation}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {isPlayer && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={onMove}
                disabled={!canMove || selectedUnit.moved}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                <Move className="w-4 h-4 mr-1" />
                Move
              </Button>
              <Button 
                onClick={onAttack}
                disabled={!canAttack}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <Sword className="w-4 h-4 mr-1" />
                Attack
              </Button>
            </div>
            <Button 
              onClick={onEndTurn}
              variant="outline"
              size="sm"
              className="w-full"
            >
              End Turn
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
