// src/services/storageService.js

import type { GameState } from "@/types/gameTypes";


/**
 * Exporte l'état actuel du jeu sous forme de fichier JSON.
 */
export function exportGame(store: GameState) {
  const dataToExport = {
    ...store,
    // on peut exclure les fonctions si on veut un JSON plus propre :
    resetGame: undefined,
    applyEffects: undefined
  };

  const dataStr = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'partie-ecologie.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

/**
 * Importe un fichier JSON et remplace le contenu du store de jeu.
 */
export function importGame(event: Event, store: GameState) {
  const input = event.target as HTMLInputElement;
  const file = input?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result as string);

      // Assure-toi que le fichier contient les propriétés clés
      if (
        parsed &&
        typeof parsed.scores === 'object' &&
        typeof parsed.narration === 'string' &&
        Array.isArray(parsed.historiqueChoix)
      ) {
        Object.assign(store, parsed);
      } else {
        throw new Error('Format invalide');
      }
    } catch (err) {
      alert('Fichier invalide ou corrompu !');
      console.error(err);
    }
  };

  reader.readAsText(file);
}