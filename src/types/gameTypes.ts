interface Scores {
  ecoScore: number
  pollution: number
  urbanisation: number
  energie: number
  budget?: number;
  securite?: number;
}

interface Choice {
  text: string
  effects: Partial<Scores>
}

interface GameState {
  scores: Scores
  narration: string
  historiqueChoix: Choice[]
  theme: string
  scoresHistory: Scores[]
  description: string,
  resetGame: (theme?: string) => void
  applyEffects: (effects: Partial<Scores>) => void
}

interface GameContext {
  theme: string;
  scores: Scores;
  historiqueChoix: Choice[];
}

interface NarrationResponse {
  narration: string;
  choices: Choice[];
}

type Scenario = Omit<GameState, 'resetGame' | 'applyEffects'>

interface ScoreEvaluationCriteria {
  key: keyof Scores,
  lowThreshold: number,
  highThreshold: number,
  lowDescriptions: string[],
  highDescriptions: string[],
}

interface Event {
  narration: string
  choices: Choice[]
}

export type { Scores, Choice, GameState, Scenario, GameContext, NarrationResponse, ScoreEvaluationCriteria, Event };