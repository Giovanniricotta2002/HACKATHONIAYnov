// src/store/gameStore.js
import type { GameState, Scores } from '@/types/gameTypes';
import { reactive } from 'vue';



export const gameStore = reactive<GameState>({
  scores: {
    ecoScore: 50,
    pollution: 50,
    urbanisation: 50,
    energie: 50,
  },
  narration: "Bienvenue dans le jeu d'écologie, prenez vos premières décisions !",
  description: "Dans ce jeu, vous devez prendre des décisions pour améliorer l'écologie de votre ville. Chaque choix aura un impact sur l'environnement.",
  historiqueChoix: [],
  theme: 'désert',
  scoresHistory: [
    { ecoScore: 50, pollution: 50, urbanisation: 50, energie: 50 }
  ],

  resetGame(theme = 'désert') {
    this.theme = theme
    this.scores = {
      ecoScore: 50,
      pollution: 50,
      urbanisation: 50,
      energie: 50
    }
    this.narration = "Bienvenue dans le jeu d'écologie, prenez vos premières décisions !"
    this.historiqueChoix = []
    this.scoresHistory = [{ ...this.scores }]
  },

  applyEffects(effects: Partial<Scores>) {
    for (const key in effects) {
      const k = key as keyof Scores
      this.scores[k] += effects[k] ?? 0
    }
    this.scoresHistory.push({ ...this.scores })
  }
})