<template>
  <v-container>
    <v-card class="pa-4" outlined>
      <!-- Empilement des images de fond -->
      <div class="background-stack">
        <img
          v-for="(img, index) in backgroundLayers"
          :key="index"
          :src="getImageUrl(img)"
          class="layer"
        />
      </div>

      <!-- Narration -->
      <div style="min-height: 120px;">
        <p>{{ currentEvent?.narration }}</p>
      </div>

      <!-- Choix -->
      <v-row>
        <v-col
          v-for="(choice, i) in currentEvent?.choices || []"
          :key="i"
          cols="12"
          md="6"
        >
          <v-btn
            :loading="loading"
            :disabled="loading || gameOver"
            color="primary"
            block
            @click="makeChoice(i)"
          >
            {{ choice.text }}
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <!-- Scores -->
      <v-row>
        <v-col
          cols="12"
          md="6"
          v-for="(val, key) in gameStore.scores"
          :key="key"
        >
          <div>{{ key }} : {{ val }}</div>
          <v-progress-linear
            :value="val"
            height="15"
            color="green"
          ></v-progress-linear>
        </v-col>
      </v-row>

      <!-- Fin de partie -->
      <v-alert
        v-if="gameOver"
        type="success"
        class="mt-6"
      >
        {{ gameOverMessage }}
      </v-alert>
    </v-card>
  </v-container>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import type { Scores } from '@/types/gameTypes'
import { checkGameOverStatus } from '@/utils/checkGameOverStatus'
import { getBackgroundLayers } from '@/utils/imageSelector'

// == Store et états ==
const gameStore = useGameStore()
const loading = ref(false)
const gameOver = ref(false)
const gameOverMessage = ref("")
const backgroundLayers = ref<string[]>([])

// Fonction globale accessible dans le template
function getImageUrl(file: string) {
  return `${import.meta.env.BASE_URL}assets/backgrounds/${file}`;
}

// == Computed pour l'événement en cours ==
const currentEvent = computed(() => gameStore.getCurrentEvent())

// == Choisir une option ==
function makeChoice(index: number) {
  if (loading.value || gameOver.value || !currentEvent.value) return
  loading.value = true

  const choice = currentEvent.value.choices[index]

  // Appliquer effets
  for (const [key, value] of Object.entries(choice.effects || {})) {
    const k = key as keyof Scores
    const newValue = Math.max(0, Math.min(100, (gameStore.scores[k] ?? 50) + (value ?? 0)))
    gameStore.scores[k] = newValue
  }

  // Historique
  gameStore.choiceHistory.push(choice)
  gameStore.eventHistory.push(currentEvent.value)
  gameStore.currentEventIndex++

  // Fin de jeu ?
  const result = checkGameOverStatus(gameStore.scores)
  if (result) {
    gameOverMessage.value = result
    gameOver.value = true
  }

  // Mettre à jour les couches d'image
  loading.value = false
}

// == Initialisation ==
onMounted(() => {
  gameStore.initializeGame()
  console.log("getBackgroundLayers: ", getBackgroundLayers(gameStore.scores))
  backgroundLayers.value = getBackgroundLayers(gameStore.scores)
})

// == Sauvegarde automatique ==
watchEffect(() => {
  localStorage.setItem('gameState', JSON.stringify(gameStore.$state))
})
</script>
<style scoped>
.background-stack {
  position: relative;
  height: 300px;
  width: 100%;
  overflow: hidden;
}

.background-stack .layer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  z-index: 0;
  opacity: 0.8;
  transition: opacity 0.5s ease;
}
</style>
