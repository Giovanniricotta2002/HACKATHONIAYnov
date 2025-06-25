// src/services/openaiService.js

const OPENAI_API_KEY = '<TA_CLE_API_ICI>';  // Remplace par ta clé

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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 300,
        })
    })

    if (response.ok) {
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
          return JSON.parse(content);
        } catch (e) {
          console.error("Erreur parsing JSON OpenAI:", e, content);
          throw new Error("Format de réponse invalide");
        }
    }

    // Tenter de parser JSON

  } catch (error) {
    console.error("Erreur OpenAI:", error);
    throw error;
  }
}

export async function generateBackgroundImage(prompt: any) {
     const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt,
            n: 1,
            size: "512x512"
        })
    })

    if (response.ok) {
        const data = await response.json();
        const content = data.data[0].url;
        
        try {
          return content;
        } catch (e) {
          console.error("Erreur parsing JSON OpenAI:", e, content);
          throw new Error("Format de réponse invalide");
        }
    }
}
