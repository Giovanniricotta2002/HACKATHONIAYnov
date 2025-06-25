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

<script setup>
import { ref } from 'vue';
import { generateNarrationAndChoices, generateBackgroundImage } from '../services/openaiService';
import { gameStore } from '@/stores/gameStore';

if (localStorage.getItem('gameState')) {
  const savedState = JSON.parse(localStorage.getItem('gameState'));
  gameStore.$patch(savedState);
}

const loading = ref(false);
const currentChoices = ref([{ text: "Commencer le jeu", effects: {} }]);
const backgroundImage = ref('');
const gameOver = ref(false);
const gameOverMessage = ref("");

async function makeChoice(choice) {
  if (loading.value || gameOver.value) return;
  loading.value = true;

  // Appliquer effets au score
  for (const [k, v] of Object.entries(choice.effects)) {
    gameStore.scores[k] = Math.min(100, Math.max(0, gameStore.scores[k] + v));
  }
  gameStore.historiqueChoix.push(choice.text);

  // Vérifier fin de partie
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
    // Générer narration & choix par GPT
    const data = await generateNarrationAndChoices({
      scores: gameStore.scores,
      historique: gameStore.historiqueChoix,
    }, choice.text);

    gameStore.narration = data.narration;
    currentChoices.value = data.choices;

    // Générer image background selon narration + scores
    const promptImage = `Paysage écologique, nature, ${gameStore.narration}, style artistique, lumière naturelle, haute résolution`;
    backgroundImage.value = await generateBackgroundImage(promptImage);

  } catch (e) {
    alert("Erreur lors de la génération via OpenAI");
    console.error(e);
  } finally {
    loading.value = false;
  }
}
</script>
