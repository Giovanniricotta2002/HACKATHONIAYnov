// src/services/imageGenService.ts
import type { ScoreEvaluationCriteria, Scores } from "@/types/gameTypes";

const IMAGE_API_URL = import.meta.env.VITE_IMAGE_API_URL || 'https://api.openai.com/v1/images/generations';
const IMAGE_API_KEY = import.meta.env.VITE_IMAGE_API_KEY || '<TA_CLE_API>'; // OpenAI ou autre


const scoreConditions: ScoreEvaluationCriteria[] = [
  {
    key: 'pollution',
    lowThreshold: 30,
    highThreshold: 70,
    lowDescriptions: ["ciel bleu", "air pur"],
    highDescriptions: ["air épais et pollué", "ciel gris"],
  },
  {
    key: 'ecoScore',
    lowThreshold: 30,
    highThreshold: 70,
    lowDescriptions: ["déforestation", "usines actives"],
    highDescriptions: ["végétation luxuriante", "infrastructures vertes"],
  },
  {
    key: 'securite',  // attention à bien écrire 'securite' sans accent pour correspondre à l'interface
    lowThreshold: 30,
    highThreshold: 70,
    lowDescriptions: ["tensions sociales", "présence policière visible"],
    highDescriptions: ["quartiers paisibles", "population détendue"],
  },
  {
    key: 'budget',
    lowThreshold: 20,
    highThreshold: 80,
    lowDescriptions: ["bâtiments délabrés", "infrastructures abandonnées"],
    highDescriptions: ["bâtiments modernes", "ville bien entretenue"],
  },
  {
    key: 'energie',
    lowThreshold: 30,
    highThreshold: 80,
    lowDescriptions: ["panne d’électricité", "lampadaires éteints"],
    highDescriptions: ["éclairage LED", "infrastructures modernes"],
  },
]

/**
 * Génère une image qui reflète l'état de la ville selon les scores et la narration.
 */
export async function generateImageFromContext(
  narration: string,
  context: { scores: Scores }
): Promise<string> {
  const ambiance: string[] = [];

  scoreConditions.forEach(({ key, lowThreshold, highThreshold, lowDescriptions, highDescriptions }) => {
    const scoreValue = context.scores[key];
    if (scoreValue !== undefined) {
      if (scoreValue <= lowThreshold) {
        ambiance.push(...lowDescriptions);
      } else if (scoreValue >= highThreshold) {
        ambiance.push(...highDescriptions);
      }
    }
  });

  const finalPrompt = `
    Vue panoramique d'une ville gérée par un maire.
    Contexte narratif : ${narration}
    État visuel suggéré : ${ambiance.join(", ")}.
    Style semi-réaliste, cohérent avec une ville en gestion.
  `;

  const response = await fetch(IMAGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${IMAGE_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: finalPrompt,
      n: 1,
      size: "512x512",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Erreur image :', err);
    throw new Error(`Échec génération image : ${response.status}`);
  }

  const data = await response.json();
  return data.data[0].url;
}
