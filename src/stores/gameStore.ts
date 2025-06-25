// src/store/gameStore.js
import { reactive } from 'vue';

export const gameStore = reactive({
  scores: {
    ecoScore: 50,
    pollution: 50,
    urbanisation: 50,
    energie: 50,
  },
  narration: "Bienvenue dans le jeu d'écologie, prenez vos premières décisions !",
  historiqueChoix: [],
});
