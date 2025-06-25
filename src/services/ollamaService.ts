const BASE_URL = import.meta.env.VITE_OLLAMA_API_URL || 'http://localhost:11434';
const MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3';

export async function generateNarrationAndChoices(context: any, userChoice: any) {
    const prompt = `
    Seed/thème : ${context.theme}
    Score actuel : ${JSON.stringify(context.scores)}
    Historique : ${context.historique.join(' | ')}
    Dernier choix : ${userChoice}

    Génère la suite de l’histoire sous forme JSON avec narration et 2 à 3 choix :
    {
        "narration": "Un orage toxique s'approche...",
        "choices": [
            {"text": "Activer les filtres d'air", "effects": {"pollution": -10}},
            {"text": "Fermer les écoles", "effects": {"ecoScore": 5}}
        ]
    }
    `
    console.log(prompt);
    
    const res = await fetch(`${BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            model: MODEL,
            prompt: prompt,
            stream: false,
        }),
    });

    if (res.ok) {
        return await res.json();
    } else {
        const errorText = await res.text();
        console.error('Error generating narration:', errorText);
        throw new Error(`Failed to generate narration: ${res.status} ${res.statusText}`);
    }
}