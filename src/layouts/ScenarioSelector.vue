<template>
  <v-container class="pa-4">
    <v-row>
      <v-col cols="12">
        <h2>Choisissez un scénario de départ</h2>
      </v-col>
      <v-col
        v-for="(sc, i) in scenarios"
        :key="i"
        cols="12"
        md="4"
      >
        <v-card outlined>
          <v-card-title>{{ sc.theme }}</v-card-title>
          <v-card-text>{{ sc.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="startScenario(sc)">Démarrer</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { gameStore } from '@/stores/gameStore'
import type { Scenario } from '@/types/gameTypes'
import { useRouter } from 'vue-router'

localStorage.clear()

const router = useRouter()

const scenarios: Scenario[] = [
  {
    theme: 'Optimiste écologique',
    description: 'Votre ville est un modèle de durabilité...',
    scores: { ecoScore: 70, pollution: 20, urbanisation: 40, energie: 70 },
    narration: 'Bienvenue dans une ville durable et florissante.',
    historiqueChoix: [],
    scoresHistory: [{ ecoScore: 70, pollution: 20, urbanisation: 40, energie: 70 }]
  },
  {
    theme: 'Situation critique',
    description: 'Votre ville souffre d\'une pollution élevée...',
    scores: { ecoScore: 30, pollution: 60, urbanisation: 55, energie: 40 },
    narration: 'La ville est en crise écologique, à vous d\'agir !',
    historiqueChoix: [{text: "Un événement critique est survenu.", effects: { pollution: +5 } }],
    scoresHistory: [{ ecoScore: 30, pollution: 60, urbanisation: 55, energie: 40 }]
  },
  {
    theme: 'Développement rapide',
    description: 'Votre ville grandit rapidement...',
    scores: { ecoScore: 50, pollution: 40, urbanisation: 70, energie: 50 },
    narration: 'Le développement urbain est rapide, attention à l\'équilibre.',
    historiqueChoix: [],
    scoresHistory: [{ ecoScore: 50, pollution: 40, urbanisation: 70, energie: 50 }]
  }
]

function startScenario(scenario: Scenario) {
  // Appliquer les valeurs du scénario au store
  const scores = structuredClone(scenario.scores)
  const historiqueChoix = structuredClone(scenario.historiqueChoix)

  Object.assign(gameStore, {
    scores,
    narration: scenario.narration,
    historiqueChoix,
    theme: scenario.theme,
    scoresHistory: [scores]
  })

  saveGameState()
  router.push('/game')
}

function saveGameState() {
  const stateToSave = {
    scores: { ...gameStore.scores },
    narration: gameStore.narration,
    historiqueChoix: [...gameStore.historiqueChoix],
    theme: gameStore.theme,
    scoresHistory: [...gameStore.scoresHistory]
  }
  localStorage.setItem('gameState', JSON.stringify(stateToSave))
}
</script>
