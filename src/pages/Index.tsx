import { useState, useCallback } from 'react';
import { GameBoard } from '@/components/game/GameBoard';
import { TimeLoopTimer } from '@/components/game/TimeLoopTimer';
import { KnowledgeLog } from '@/components/game/KnowledgeLog';
import { CombatInterface } from '@/components/game/CombatInterface';
import { GameState, Enemy, Knowledge } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { RotateCcw, Play } from 'lucide-react';

const GRID_SIZE = 8;
const LOOP_DURATION = 1800; // 30 minutes in seconds

const initialGameState: GameState = {
  currentLoop: 1,
  timeRemaining: LOOP_DURATION,
  player: {
    id: 'player',
    name: 'Hero',
    position: { x: 1, y: 7 },
    hp: 100,
    maxHp: 100,
    attack: 15,
    defense: 10,
    range: 1,
    moved: false,
    type: 'player',
  },
  enemies: [
    {
      id: 'enemy1',
      name: 'Shadow',
      position: { x: 6, y: 1 },
      hp: 60,
      maxHp: 60,
      attack: 12,
      defense: 5,
      range: 1,
      moved: false,
      type: 'enemy',
      evolutionLevel: 0,
      behaviorPattern: ['aggressive'],
      adaptedTo: [],
    },
    {
      id: 'enemy2',
      name: 'Sentinel',
      position: { x: 3, y: 3 },
      hp: 80,
      maxHp: 80,
      attack: 10,
      defense: 8,
      range: 2,
      moved: false,
      type: 'enemy',
      evolutionLevel: 0,
      behaviorPattern: ['defensive'],
      adaptedTo: [],
    },
  ],
  knowledge: [],
  actionHistory: [[]],
  turnNumber: 1,
  selectedUnit: null,
};

const Index = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [gameStarted, setGameStarted] = useState(false);

  const handleLoopComplete = useCallback(() => {
    // Evolve enemies based on player actions
    const evolvedEnemies = gameState.enemies.map(enemy => {
      const actionsAgainstThis = gameState.actionHistory.flat().filter(action => 
        action.includes(enemy.name)
      );
      
      const shouldEvolve = actionsAgainstThis.length > 3;
      
      if (shouldEvolve) {
        return {
          ...enemy,
          evolutionLevel: enemy.evolutionLevel + 1,
          hp: enemy.maxHp + 20 * (enemy.evolutionLevel + 1),
          maxHp: enemy.maxHp + 20 * (enemy.evolutionLevel + 1),
          attack: enemy.attack + 3,
          defense: enemy.defense + 2,
          adaptedTo: [...enemy.adaptedTo, 'player_tactics'],
        };
      }
      return enemy;
    });

    // Add knowledge about the loop
    const newKnowledge: Knowledge = {
      id: `knowledge-${Date.now()}`,
      description: `Loop ${gameState.currentLoop} completed. Enemies have adapted to your strategies.`,
      loopDiscovered: gameState.currentLoop,
      category: 'enemy_pattern',
    };

    setGameState({
      ...initialGameState,
      currentLoop: gameState.currentLoop + 1,
      enemies: evolvedEnemies,
      knowledge: [...gameState.knowledge, newKnowledge],
      actionHistory: [...gameState.actionHistory, []],
    });

    toast({
      title: "Loop Reset",
      description: `Starting Loop #${gameState.currentLoop + 1}. Enemies have evolved based on your actions.`,
      variant: "destructive",
    });
  }, [gameState]);

  const handleCellClick = (x: number, y: number) => {
    if (!gameState.selectedUnit || gameState.selectedUnit !== 'player') return;

    const player = gameState.player;
    const distance = Math.abs(player.position.x - x) + Math.abs(player.position.y - y);

    if (distance <= 2 && !player.moved) {
      setGameState({
        ...gameState,
        player: {
          ...player,
          position: { x, y },
          moved: true,
        },
      });

      const action = `Moved to (${x}, ${y})`;
      const currentLoopHistory = [...gameState.actionHistory];
      currentLoopHistory[currentLoopHistory.length - 1].push(action);

      setGameState(prev => ({
        ...prev,
        actionHistory: currentLoopHistory,
      }));

      toast({
        title: "Unit Moved",
        description: action,
      });
    }
  };

  const handleUnitClick = (unitId: string) => {
    setGameState({
      ...gameState,
      selectedUnit: unitId,
    });
  };

  const handleMove = () => {
    toast({
      title: "Move Mode",
      description: "Click on an adjacent cell to move",
    });
  };

  const handleAttack = () => {
    const player = gameState.player;
    const enemiesInRange = gameState.enemies.filter(enemy => {
      const distance = Math.abs(player.position.x - enemy.position.x) + 
                      Math.abs(player.position.y - enemy.position.y);
      return distance <= player.range;
    });

    if (enemiesInRange.length > 0) {
      const target = enemiesInRange[0];
      const damage = Math.max(1, player.attack - target.defense);
      
      const updatedEnemies = gameState.enemies.map(enemy =>
        enemy.id === target.id
          ? { ...enemy, hp: Math.max(0, enemy.hp - damage) }
          : enemy
      );

      setGameState({
        ...gameState,
        enemies: updatedEnemies.filter(e => e.hp > 0),
      });

      const action = `Attacked ${target.name} for ${damage} damage`;
      const currentLoopHistory = [...gameState.actionHistory];
      currentLoopHistory[currentLoopHistory.length - 1].push(action);

      setGameState(prev => ({
        ...prev,
        actionHistory: currentLoopHistory,
      }));

      toast({
        title: "Attack!",
        description: action,
      });

      if (target.hp - damage <= 0) {
        const newKnowledge: Knowledge = {
          id: `knowledge-${Date.now()}`,
          description: `Defeated ${target.name}. They will remember this in the next loop.`,
          loopDiscovered: gameState.currentLoop,
          category: 'enemy_pattern',
        };
        setGameState(prev => ({
          ...prev,
          knowledge: [...prev.knowledge, newKnowledge],
        }));
      }
    }
  };

  const handleEndTurn = () => {
    setGameState({
      ...gameState,
      player: {
        ...gameState.player,
        moved: false,
      },
      turnNumber: gameState.turnNumber + 1,
      selectedUnit: null,
    });

    toast({
      title: "Turn Ended",
      description: "Enemy phase begins...",
    });
  };

  const startGame = () => {
    setGameStarted(true);
    toast({
      title: "Loop Initiated",
      description: "The 30-minute time loop has begun. Use your knowledge wisely.",
    });
  };

  const selectedUnitData = gameState.selectedUnit 
    ? [gameState.player, ...gameState.enemies].find(u => u.id === gameState.selectedUnit) || null
    : null;

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl p-8 border-2 border-primary shadow-glow-primary">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Chrono Tactics
            </h1>
            <p className="text-xl text-muted-foreground">
              A Strategy RPG in Perpetual Loop
            </p>
            <div className="space-y-4 text-left text-foreground bg-muted/50 rounded-lg p-6">
              <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                The Time Loop Mechanic
              </h2>
              <ul className="space-y-2 text-sm">
                <li>• Every loop lasts exactly 30 minutes</li>
                <li>• You keep all knowledge, but lose all items</li>
                <li>• Enemies evolve based on your previous actions</li>
                <li>• Learn patterns, predict placements, manipulate memories</li>
                <li>• Victory requires perfect knowledge across multiple loops</li>
              </ul>
            </div>
            <Button 
              onClick={startGame}
              size="lg"
              className="text-lg px-8 shadow-glow-primary"
            >
              <Play className="w-5 h-5 mr-2" />
              Begin First Loop
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Chrono Tactics
          </h1>
          <TimeLoopTimer 
            timeRemaining={gameState.timeRemaining}
            currentLoop={gameState.currentLoop}
            onLoopComplete={handleLoopComplete}
          />
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Combat Interface */}
          <div className="space-y-4">
            <CombatInterface
              selectedUnit={selectedUnitData}
              canMove={!gameState.player.moved}
              canAttack={true}
              onMove={handleMove}
              onAttack={handleAttack}
              onEndTurn={handleEndTurn}
            />
          </div>

          {/* Center Column - Game Board */}
          <div className="lg:col-span-1">
            <GameBoard
              gridSize={GRID_SIZE}
              player={gameState.player}
              enemies={gameState.enemies}
              selectedUnit={gameState.selectedUnit}
              onCellClick={handleCellClick}
              onUnitClick={handleUnitClick}
            />
          </div>

          {/* Right Column - Knowledge Log */}
          <div>
            <KnowledgeLog knowledge={gameState.knowledge} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
