# 🌱 Ecocité – A Narrative Climate Strategy Game Powered by AI

Ecocité is an interactive web game designed to raise awareness about climate and ecological issues. It blends storytelling, data visualization, and generative AI to immerse players in critical environmental decision-making scenarios.

## 🧠 Project Objective

Ecocité leverages the power of Large Language Models (LLMs) and generative image models to:

* Build immersive, branching ecological narratives
* Let players make impactful choices with visible consequences
* Dynamically generate eco-themed quizzes to reinforce learning
* Illustrate the impact of player decisions through evolving AI-generated environments

## 🎮 Core Features

* 🌍 Adaptive ecological storytelling powered by LLMs (GPT / Mistral via Ollama)
* 🧭 Strategic decision-making with four key stats:

  * ecoScore
  * Pollution
  * Urbanization
  * Energy
* 🧠 Quizzes dynamically generated by the AI based on in-game context
* 📈 Timeline dashboard that visualizes player stats using Chart.js
* 🎨 Generative backgrounds that reflect the ecological state (via e-dalle or SD)
* 💾 Save/load system with JSON export/import
* 🔁 Procedurally generated starting scenarios based on different themes (forest, desert, arctic)
* 🧑‍🤝‍🧑 (Optional) Multiplayer mode for debate-based decision-making (with backend)
* 🛠 Powered entirely by the frontend (Vue.js + Vuetify), with optional Python/Node backend for multiplayer or extended AI logic

## 📊 Gameplay: Stats System

Each player’s decisions affect the following environmental stats:

* ecoScore: Overall sustainability
* Pollution: Higher value = worse
* Urbanization: Should remain under control
* Energy: Strive for efficient renewable use

🎯 Goal: Reach a sustainable society with stats like:

* ecoScore ≥ 90
* Pollution ≤ 20
* Urbanization ≤ 60
* Energy ≥ 70

## 🔄 Game Loop

1. AI-generated narration introduces a situation
2. Player chooses between 2–3 options
3. Stats update based on consequences
4. New scene and AI-generated background appear
5. A quiz is shown to reinforce eco-knowledge
6. Game continues until equilibrium is reached — or disaster occurs

## 🧠 Educational Quizzes

* Questions change dynamically based on the environmental context
* Answers influence narrative credibility (optional)
* Example: “What is the most abundant greenhouse gas?” → AI-generated

## 💾 Save & Resume

Players can:

* Export their game state as a .json file
* Re-import it to continue a previous session
* Useful for demos, classrooms, or long-term play
