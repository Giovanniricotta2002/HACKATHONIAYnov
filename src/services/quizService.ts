
export async function generateQuiz(context: any) {
  const prompt = `
Crée un mini-quizz écologique basé sur l'état actuel :
${JSON.stringify(context)}

Format JSON :
{
  "question": "Quel est le principal gaz à effet de serre ?",
  "options": ["Oxygène", "CO2", "Hélium", "Hydrogène"],
  "correct": "CO2"
}
`
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistral',
      prompt: prompt,
      stream: false,
    })
})

  try {
    return JSON.parse(res.ok ? await res.text() : '{}');
  } catch {
    return {
      question: "Erreur dans la génération du quizz.",
      options: [],
      correct: ''
    }
  }
}
