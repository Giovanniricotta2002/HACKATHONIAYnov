<template>
  <v-container>
    <v-card class="pa-4" outlined>
      <v-img :src="backgroundImage" height="300" class="mb-4" />

      <div style="min-height: 120px;">
        <p>{{ gameStore.narration }}</p>
      </div>

      <v-row>
        <v-col
          v-for="(choice, i) in currentChoices"
          :key="i"
          cols="12" md="6"
        >
          <v-btn
            :loading="loading"
            :disabled="loading || gameOver"
            color="primary"
            block
            @click="makeChoice(choice)"
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
import { ref, onMounted } from 'vue';
import { gameStore } from '@/stores/gameStore';
import { generateNarrationAndChoices, generateBackgroundImage } from '../services/openaiService';
import { loadGameState } from '@/utils/loadGameState';
import type { Choice, Scores } from '@/types/gameTypes';

// Rechargement localStorage si partie existante
const saved = localStorage.getItem('gameState');
if (saved) {
  const savedState = JSON.parse(saved);
  Object.assign(gameStore, savedState);
}

// Refs
const loading = ref(false);
const currentChoices = ref<Choice[]>([]);
const backgroundImage = ref('');
const gameOver = ref(false);
const gameOverMessage = ref("");

// Fonction principale
async function makeChoice(choice: Choice): Promise<void> {
  if (loading.value || gameOver.value) return;
  loading.value = true;

  // Appliquer effets
  if (choice.effects) {
    for (const [k, v] of Object.entries(choice.effects) as [keyof Scores, number][]) {
      gameStore.scores[k] = Math.min(100, Math.max(0, gameStore.scores[k] + v));
    }
  }

  if (choice.text) {
    gameStore.historiqueChoix.push(choice);
  }

  // Fin de partie ?
  if (Object.values(gameStore.scores).every(s => s >= 90)) {
    gameOverMessage.value = "🎉 Bravo, vous avez sauvé la planète !";
    gameOver.value = true;
    loading.value = false;
    return;
  }
  if (Object.values(gameStore.scores).some(s => s <= 10)) {
    gameOverMessage.value = "⚠️ Votre gestion a mené à une catastrophe écologique...";
    gameOver.value = true;
    loading.value = false;
    return;
  }

  try {
    const data = await generateNarrationAndChoices({
      scores: gameStore.scores,
      historique: gameStore.historiqueChoix,
    }, choice.text);

    gameStore.narration = data.narration;
    currentChoices.value = data.choices;

    const promptImage = `Paysage écologique, nature, ${gameStore.narration}, style artistique, lumière naturelle, haute résolution`;
    backgroundImage.value = await generateBackgroundImage(promptImage);

  } catch (e) {
    alert("Erreur lors de la génération via OpenAI");
    console.error(e);
  } finally {
    loading.value = false;
  }
}

// Appel initial
onMounted(async () => {
  loadGameState()
  await makeChoice({ text: '', effects: {} });
});
</script>
