// src/services/openaiService.js
// import dotenv from 'dotenv';
// dotenv.config();
import OpenAI from 'openai';


const openai = new OpenAI({
  // apiKey: process.env.OPENAI_API_KEY, // Assure-toi que .env est bien chargé
  dangerouslyAllowBrowser: true,
});

export async function generateNarrationAndChoices(context: any, userChoice: any) {
  const prompt = `
Tu es un assistant qui génère un jeu narratif interactif sur l'écologie.

Contexte actuel : 
Scores : ${JSON.stringify(context.scores)}
Historique des choix : ${context.historique.join(' | ')}
Dernier choix utilisateur : ${userChoice}

Génère :
1. Une nouvelle narration immersive d'environ 2-3 phrases.
2. 2 choix possibles pour le joueur, avec texte et effets sur scores (ecoScore, pollution, urbanisation, energie).

Répond en JSON comme ceci :

{
  "narration": "Texte narration",
  "choices": [
    {"text": "Choix 1", "effects": {"ecoScore": 10, "pollution": -5}},
    {"text": "Choix 2", "effects": {"ecoScore": -10, "pollution": 10}}
  ]
}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("Réponse vide de l'API OpenAI");
    }

    try {
      return JSON.parse(content);
    } catch (parseErr) {
      console.error("Erreur parsing JSON OpenAI:", parseErr, content);
      throw new Error("Format de réponse invalide. Contenu brut : " + content);
    }

  } catch (error) {
    console.error("Erreur OpenAI:", error);
    throw error;
  }
}

