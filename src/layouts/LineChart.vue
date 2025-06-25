<template>
  <canvas ref="canvasRef" />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Chart } from 'chart.js/auto'

const props = defineProps({ chartData: Object })
const canvasRef = ref(null)
let chart

onMounted(() => {
  chart = new Chart(canvasRef.value, {
    type: 'line',
    data: props.chartData
  })
})

watch(() => props.chartData, (newData) => {
  chart.data = newData
  chart.update()
})
</script>
