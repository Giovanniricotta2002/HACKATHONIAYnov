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
import { ref, onMounted, watchEffect } from 'vue';
import { gameStore } from '@/stores/gameStore';
import { generateNarrationAndChoices } from '@/services/openaiService';
import { generateImageFromContext } from '@/services/imageGenService';
import { loadGameState } from '@/utils/loadGameState';
import type { Choice, Scores } from '@/types/gameTypes';
import { checkGameOverStatus } from '@/utils/checkGameOverStatus';

// === Refs et états ===
const loading = ref(false);
const currentChoices = ref<Choice[]>([]);
const backgroundImage = ref('');
const gameOver = ref(false);
const gameOverMessage = ref("");

// === Rechargement localStorage si partie existante ===
const saved = localStorage.getItem('gameState');
if (saved) {
  try {
    const savedState = JSON.parse(saved);
    Object.assign(gameStore, savedState);
  } catch (e) {
    console.warn("Échec chargement partie sauvegardée :", e);
  }
}

// === Fonction : Appliquer un choix ===
async function makeChoice(choice: Choice): Promise<void> {
  if (loading.value || gameOver.value) return;
  loading.value = true;

  // Appliquer les effets du choix
  if (choice.effects) {
    for (const [key, value] of Object.entries(choice.effects)) {
      // Sécurise le typage avec keyof Scores
      const k = key as keyof Scores;
      const current = gameStore.scores[k] ?? 50; // fallback si valeur absente
      const newValue = Math.max(0, Math.min(100, current + (value ?? 0)));
      gameStore.scores[k] = newValue;
    }
  }

  // Ajouter le choix à l'historique
  if (choice.text) {
    gameStore.historiqueChoix.push(choice);
  }

  // Vérifier conditions de fin de partie
  const result = checkGameOverStatus(gameStore.scores);
  if (result) {
    gameOverMessage.value = result;
    gameOver.value = true;
    loading.value = false;
    return;
  }

  // Génération de la narration et des nouveaux choix
  try {
    const response = await generateNarrationAndChoices(
      {
        scores: gameStore.scores,
        historique: gameStore.historiqueChoix,
        theme: gameStore.theme,
      },
      choice.text
    );

    gameStore.narration = response.narration;
    currentChoices.value = response.choices;

    // ✅ Génération d’image via les scores et la narration
    backgroundImage.value = await generateImageFromContext(
      gameStore.narration,
      { scores: gameStore.scores }
    );

  } catch (error) {
    console.error("Erreur lors de la génération via OpenAI :", error);
    alert("Une erreur est survenue. Veuillez réessayer.");
  } finally {
    loading.value = false;
  }
}

// === Initialisation à l'ouverture ===
onMounted(async () => {
  loadGameState(); // recharge éventuellement depuis localStorage (si besoin)
  await makeChoice({ text: '', effects: {} }); // déclenche le premier tour
});

// 🔁 Sauvegarde automatique dans localStorage
watchEffect(() => {
  if (gameStore.scores && gameStore.theme) {
    const snapshot = JSON.stringify({
      scores: gameStore.scores,
      narration: gameStore.narration,
      historiqueChoix: gameStore.historiqueChoix,
      theme: gameStore.theme,
      scoresHistory: gameStore.scoresHistory,
      description: gameStore.description,
    });
    localStorage.setItem('gameState', snapshot);
  }
});
</script>