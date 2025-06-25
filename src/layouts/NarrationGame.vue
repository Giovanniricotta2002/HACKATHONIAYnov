    <template>
  <v-container>
    <v-card class="pa-4" outlined>
      <v-img :src="backgroundImage" height="300" class="mb-4" />

      <div style="min-height: 120px;">
        <p>{{ currentEvent?.narration }}</p>
      </div>

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

      <v-row>
        <v-col cols="12" md="6" v-for="(val, key) in gameStore.scores" :key="key">
          <div>{{ key }} : {{ val }}</div>
          <v-progress-linear :value="val" height="15" color="green"></v-progress-linear>
        </v-col>
      </v-row>

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

// == Store et états ==
const gameStore = useGameStore()
const loading = ref(false)
const backgroundImage = ref('https://source.unsplash.com/1600x400/?city,chaos') // image par défaut statique
const gameOver = ref(false)
const gameOverMessage = ref("")

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

  // Image aléatoire (peut être personnalisé selon contexte/scores)
  backgroundImage.value = `https://source.unsplash.com/1600x400/?city,urban,${Math.random()}`

  loading.value = false
}

// == Initialisation ==
onMounted(() => {
  gameStore.initializeGame()
})

// == Sauvegarde automatique ==
watchEffect(() => {
  localStorage.setItem('gameState', JSON.stringify(gameStore.$state))
})
</script>
