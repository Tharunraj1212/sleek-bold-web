export interface Position {
  x: number;
  y: number;
}

export interface Unit {
  id: string;
  name: string;
  position: Position;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  range: number;
  moved: boolean;
  type: 'player' | 'enemy';
}

export interface Enemy extends Unit {
  evolutionLevel: number;
  behaviorPattern: string[];
  adaptedTo: string[];
}

export interface Knowledge {
  id: string;
  description: string;
  loopDiscovered: number;
  category: 'enemy_pattern' | 'npc_memory' | 'item_location' | 'event';
}

export interface GameState {
  currentLoop: number;
  timeRemaining: number;
  player: Unit;
  enemies: Enemy[];
  knowledge: Knowledge[];
  actionHistory: string[][];
  turnNumber: number;
  selectedUnit: string | null;
}

export interface NPCMemory {
  npcId: string;
  name: string;
  manipulated: boolean;
  originalBehavior: string;
  modifiedBehavior: string;
}
