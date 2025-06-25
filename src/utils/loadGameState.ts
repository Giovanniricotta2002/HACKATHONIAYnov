import { gameStore } from '@/stores/gameStore'
import type { GameState } from '@/types/gameTypes';

export function loadGameState(): void {
  const saved = localStorage.getItem('gameState');

  if (!saved) return;

  try {
    const parsed = JSON.parse(saved) as Partial<GameState>;

    if (
      parsed.scores &&
      typeof parsed.scores.ecoScore === 'number' &&
      typeof parsed.scores.pollution === 'number' &&
      typeof parsed.scores.urbanisation === 'number' &&
      typeof parsed.scores.energie === 'number'
    ) {
      gameStore.scores = { ...parsed.scores };
      gameStore.narration = parsed.narration ?? "Bienvenue dans le jeu d'écologie.";
      gameStore.historiqueChoix = parsed.historiqueChoix ?? [];
      gameStore.theme = parsed.theme ?? 'inconnu';
      gameStore.scoresHistory = parsed.scoresHistory ?? [];
    } else {
      console.warn('⛔ Données invalides détectées. Suppression...');
      localStorage.removeItem('gameState');
    }
  } catch (e) {
    console.error('❌ Erreur parsing JSON :', e);
    localStorage.removeItem('gameState');
  }
}
