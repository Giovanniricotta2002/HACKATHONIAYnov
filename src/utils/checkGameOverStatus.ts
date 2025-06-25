import type { Scores } from "@/types/gameTypes";

/**
 * Vérifie si une condition de fin de partie est atteinte.
 * @param scores - Les scores actuels du joueur.
 * @returns Un message de fin ou `null` si la partie continue.
 */
export function checkGameOverStatus(scores: Scores): string | null {
  // Pollution critique
  if (scores.pollution >= 90) {
    return "☣️ Le niveau de pollution est devenu insoutenable pour la population.";
  }

  // Si tous les scores sont élevés → victoire
  const scoreValues = Object.values(scores);
  if (scoreValues.every(score => score >= 90)) {
    return "🎉 Bravo, vous avez sauvé la planète !";
  }

  // Autres scores trop faibles → défaite
  const criticalLoss = Object.entries(scores).some(([key, value]) => {
    if (key === 'pollution') return false; // géré séparément
    return value <= 10;
  });

  if (criticalLoss) {
    return "⚠️ Votre gestion a mené à une catastrophe écologique...";
  }

  return null; // Partie continue
}