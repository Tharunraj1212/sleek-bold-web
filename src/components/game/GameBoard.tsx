import { Unit, Enemy } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Sword, Shield, Heart, TrendingUp } from 'lucide-react';

interface GameBoardProps {
  gridSize: number;
  player: Unit;
  enemies: Enemy[];
  selectedUnit: string | null;
  onCellClick: (x: number, y: number) => void;
  onUnitClick: (unitId: string) => void;
}

export const GameBoard = ({ 
  gridSize, 
  player, 
  enemies, 
  selectedUnit,
  onCellClick,
  onUnitClick 
}: GameBoardProps) => {
  const allUnits = [player, ...enemies];

  const getUnitAtPosition = (x: number, y: number) => {
    return allUnits.find(u => u.position.x === x && u.position.y === y);
  };

  const isSelected = (unitId: string) => selectedUnit === unitId;

  return (
    <div className="relative">
      <div 
        className="grid gap-1 p-4 bg-card rounded-lg border-2 border-border"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
          const x = idx % gridSize;
          const y = Math.floor(idx / gridSize);
          const unit = getUnitAtPosition(x, y);
          const isPlayerUnit = unit?.type === 'player';
          const isEnemyUnit = unit?.type === 'enemy';
          const selected = unit && isSelected(unit.id);

          return (
            <button
              key={idx}
              onClick={() => unit ? onUnitClick(unit.id) : onCellClick(x, y)}
              className={`
                aspect-square rounded-md border-2 transition-all
                ${(x + y) % 2 === 0 ? 'bg-grid-dark' : 'bg-grid-light'}
                ${selected ? 'border-primary shadow-glow-primary scale-105' : 'border-border/50'}
                ${unit ? 'cursor-pointer hover:border-primary/50' : 'cursor-default hover:bg-muted/50'}
              `}
            >
              {isPlayerUnit && (
                <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-secondary/20 rounded">
                  <Shield className="w-6 h-6 text-secondary" />
                  <div className="text-[10px] font-bold text-secondary mt-1">
                    {unit.hp}/{unit.maxHp}
                  </div>
                </div>
              )}
              {isEnemyUnit && (
                <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-enemy-evolve/20 rounded relative">
                  <Sword className="w-6 h-6 text-enemy-evolve" />
                  <div className="text-[10px] font-bold text-enemy-evolve mt-1">
                    {unit.hp}/{unit.maxHp}
                  </div>
                  {(unit as Enemy).evolutionLevel > 0 && (
                    <div className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold">
                      {(unit as Enemy).evolutionLevel}
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
