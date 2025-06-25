// src/services/imageGenService.ts

const IMAGE_API_URL = import.meta.env.VITE_IMAGE_API_URL || 'https://api.openai.com/v1/images/generations';
const IMAGE_API_KEY = import.meta.env.VITE_IMAGE_API_KEY || '<TA_CLE_API>'; // OpenAI ou autre

/**
 * Génère une image qui reflète l'état de la ville selon les scores et la narration.
 */
export async function generateImageFromContext(narration: string, context: any): Promise<string> {
  const { pollution = 50, budget: economie = 50, ecoScore = 50, energie = 50, sécurité = 50 } = context.scores || {};

  // Analyse du ton visuel à générer selon les scores
  let ambiance = [];

  if (pollution > 70) ambiance.push("air épais et pollué", "ciel gris");
  else if (pollution < 30) ambiance.push("ciel bleu", "air pur");

  if (ecoScore > 70) ambiance.push("végétation luxuriante", "infrastructures vertes");
  else if (ecoScore < 30) ambiance.push("déforestation", "usines actives");

  if (sécurité < 30) ambiance.push("tensions sociales", "présence policière visible");
  else if (sécurité > 70) ambiance.push("quartiers paisibles", "population détendue");

  if (economie < 20) ambiance.push("bâtiments délabrés", "infrastructures abandonnées");
  else if (economie > 80) ambiance.push("bâtiments modernes", "ville bien entretenue");

  if (energie < 30) ambiance.push("panne d’électricité", "lampadaires éteints");
  else if (energie > 80) ambiance.push("éclairage LED", "infrastructures modernes");

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
      'Authorization': `Bearer ${IMAGE_API_KEY}`
    },
    body: JSON.stringify({
      prompt: finalPrompt,
      n: 1,
      size: "512x512"
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
