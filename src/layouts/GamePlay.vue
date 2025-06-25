<template>
  <v-container>
    <v-card class="pa-4">
      <h2 class="text-h5">{{ narration }}</h2>

      <v-row class="my-4" dense>
        <v-col
          v-for="(choice, index) in choices"
          :key="index"
          cols="12"
          sm="6"
        >
          <v-btn @click="handleChoice(choice)" block color="primary">
            {{ choice.text }}
          </v-btn>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <v-card class="mt-4 pa-2" color="grey lighten-4">
        <h3 class="text-h6">Mini-Quizz</h3>
        <p>{{ quiz.question }}</p>
        <v-btn
          v-for="(opt, i) in quiz.options"
          :key="i"
          @click="handleQuiz(opt)"
          class="ma-1"
          :color="opt === quiz.correct ? 'success' : 'info'"
        >
          {{ opt }}
        </v-btn>
      </v-card>

      <v-divider class="my-4"></v-divider>

      <h3 class="text-h6 mb-2">Historique des Scores</h3>
      <!-- <line-chart :chart-data="chartData" /> -->
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { generateNarrationAndChoices } from '@/services/ollamaService'
import { generateQuiz } from '@/services/quizService'
import LineChart from './LineChart.vue'

const narration = ref("Bienvenue dans votre aventure écologique !")
const choices = ref([])
const quiz = ref({ question: '', options: [], correct: '' })
const scoresHistory = ref([{ ecoScore: 50, pollution: 20, urbanisation: 40, énergie: 50 }])

const currentStats = ref({
  ecoScore: 50,
  pollution: 20,
  urbanisation: 40,
  énergie: 50
})

async function nextEvent(userChoice) {
  const res = await generateNarrationAndChoices({
    scores: currentStats.value,
    historique: [],
    theme: 'désert'
  }, userChoice.text)
  narration.value = res.narration
  choices.value = res.choices
  applyEffects(userChoice.effects)
  quiz.value = await generateQuiz(currentStats.value)
}

function applyEffects(effects) {
  for (const key in effects) {
    currentStats.value[key] += effects[key]
  }
  scoresHistory.value.push({ ...currentStats.value })
}

function handleChoice(choice) {
  nextEvent(choice)
}

function handleQuiz(option) {
  // Optionnel : réaction à la réponse
}

const chartData = computed(() => ({
  labels: scoresHistory.value.map((_, i) => `Tour ${i + 1}`),
  datasets: [
    {
      label: 'ÉcoScore',
      borderColor: '#4caf50',
      data: scoresHistory.value.map(s => s.ecoScore)
    },
    {
      label: 'Pollution',
      borderColor: '#f44336',
      data: scoresHistory.value.map(s => s.pollution)
    },
    {
      label: 'Urbanisation',
      borderColor: '#ff9800',
      data: scoresHistory.value.map(s => s.urbanisation)
    },
    {
      label: 'Énergie',
      borderColor: '#2196f3',
      data: scoresHistory.value.map(s => s.énergie)
    }
  ]
}))
</script>
