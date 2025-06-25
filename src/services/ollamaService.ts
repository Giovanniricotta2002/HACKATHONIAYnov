const BASE_URL = import.meta.env.VITE_OLLAMA_API_URL || 'http://localhost:11434';
const MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3';

export async function generateNarrationAndChoices(context: any, userChoice: any) {
    const prompt = `
    Tu es un moteur narratif interactif pour un jeu de gestion où le joueur incarne le nouveau maire d'une ville.

    Contexte du joueur :
    - Thème principal : ${context.theme}
    - Scores actuels de la ville (ex. pollution, budget, sécurité, écoScore, etc.) : ${JSON.stringify(context.scores)}
    - Historique des événements et décisions municipales : ${context.historique.join(' | ')}
    - Dernière décision prise par le maire : ${userChoice}

    Ta tâche :
    1. Génère la suite logique de l’histoire municipale sous forme d'une **narration immersive, crédible et engageante**, en tenant compte du rôle du joueur comme **maire de la ville**.
    2. Il y a une **probabilité modérée (30 à 40 %)** qu’un événement imprévu survienne dans la narration (par exemple : une météorite, une panne électrique, une rupture de canalisation, une cyberattaque, un glissement de terrain, etc.). L’événement doit rester **plausible dans le ton et le contexte**, mais apporter une tension ou un imprévu dans la gestion municipale.
    3. Propose ensuite **2 à 3 choix de décisions politiques ou administratives** que le maire pourrait prendre pour gérer la situation.

    Chaque choix doit inclure :
    - Un champ "text" décrivant clairement l’action proposée
    - Un objet "effects" listant les **impacts chiffrés** sur les scores de la ville (ex : {"pollution": -10, "budget": -5})

    Contraintes :
    - Le ton doit rester **professionnel**, avec une touche narrative et stratégique.
    - La narration doit être rédigée **en français**.
    - La réponse doit être **strictement** un objet JSON **valide**, sans texte supplémentaire, sans explication, sans balises Markdown.

    Réponds uniquement sous le format suivant :

    {
    "narration": "Texte immersif ici, décrivant la situation municipale...",
    "choices": [
        {
        "text": "Texte du choix 1 (ex. Lancer une campagne de sensibilisation)",
        "effects": {
            "score1": valeur,
            "score2": valeur
        }
        },
        {
        "text": "Texte du choix 2",
        "effects": {
            ...
        }
        }
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