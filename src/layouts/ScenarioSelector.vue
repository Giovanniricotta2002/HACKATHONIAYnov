<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <h2>Choisissez un scénario de départ</h2>
      </v-col>
      <v-col
        v-for="(sc, i) in scenarios"
        :key="i"
        cols="12" md="4"
      >
        <v-card outlined>
          <v-card-title>{{ sc.nom }}</v-card-title>
          <v-card-text>{{ sc.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="startScenario(sc)">Démarrer</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import router from '@/router';
import { gameStore } from '../stores/gameStore';

const scenarios = [
  {
    nom: "Optimiste écologique",
    description: "Votre ville est un modèle de durabilité...",
    scores: { ecoScore: 70, pollution: 20, urbanisation: 40, energie: 70 },
    narration: "Bienvenue dans une ville durable et florissante.",
    historiqueChoix: []
  },
  {
    nom: "Situation critique",
    description: "Votre ville souffre d'une pollution élevée...",
    scores: { ecoScore: 30, pollution: 60, urbanisation: 55, energie: 40 },
    narration: "La ville est en crise écologique, à vous d'agir !",
    historiqueChoix: ["fezzefzefzefzefzef"]
  },
  {
    nom: "Développement rapide",
    description: "Votre ville grandit rapidement...",
    scores: { ecoScore: 50, pollution: 40, urbanisation: 70, energie: 50 },
    narration: "Le développement urbain est rapide, attention à l'équilibre.",
    historiqueChoix: []
  }
];

function startScenario(scenario) {
  gameStore.scores = { ...scenario.scores };
  gameStore.narration = scenario.narration;
  gameStore.historiqueChoix = [...scenario.historiqueChoix];
  gameStore.currentScene = 0;
  gameStore.scenario = scenario.nom;
  localStorage.setItem('gameState', JSON.stringify(gameStore.$state));
  console.log("Scénario démarré :", scenario.nom, gameStore, {scores: {
    ecoScore: gameStore.scores.ecoScore,
    pollution: gameStore.scores.pollution,
    urbanisation: gameStore.scores.urbanisation,
    energie: gameStore.scores.energie
  },
narration: gameStore.narration,
historiqueChoix: [...gameStore.historiqueChoix],
currentScene: gameStore.currentScene,
scenario: gameStore.scenario}, [...gameStore.historiqueChoix]);
  router.push('/game'); // Redirige vers la vue de jeu
  // On pourrait naviguer vers la vue de jeu principale ici
}
</script>
