export type ObjectKind =
  | 'apple'
  | 'frog'
  | 'turtle'
  | 'star'
  | 'rocket'
  | 'submarine'
  | 'gem'
  | 'compass'
  | 'telescope'
  | 'chest'
  | 'planet'
  | 'owl';

export interface LandmarkItem {
  id: string;
  position: number;
  objectKind: ObjectKind;
  name: string;
  hideTickLabel?: boolean;
}

export type TokenCategory = 'number' | 'object' | 'decimal' | 'fraction' | 'expression';

export interface DraggableToken {
  id: string;
  targetPosition: number;
  category: TokenCategory;
  displayLabel: string;
  clueLabel: string;
  objectKind?: ObjectKind;
  hint: string;
  jumpFrom?: number;
}

export interface IdentificationOption {
  id: string;
  label: string;
  value: string;
  objectKind?: ObjectKind;
}

export interface IdentificationQuestion {
  id: string;
  prompt: string;
  focusPosition: number;
  options: IdentificationOption[];
  correctValue: string;
  explanation: string;
}

export interface GameLevel {
  id: number;
  title: string;
  subtitle: string;
  difficultyLabel: string;
  bnccCode: string;
  pedagogicalGoal: string;
  min: number;
  max: number;
  majorStep: number;
  minorStep: number;
  formatTick?: (val: number) => string;
  hiddenTicks: number[];
  dropPositions: number[];
  landmarks: LandmarkItem[];
  tokens: DraggableToken[];
  questions: IdentificationQuestion[];
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  stars: number;
  bestScore: number;
  attempts: number;
}

export interface CustomLabConfig {
  mode: 'integers_pos' | 'integers_neg' | 'tens' | 'decimals' | 'fractions';
  difficulty: 'easy' | 'medium' | 'hard';
}
