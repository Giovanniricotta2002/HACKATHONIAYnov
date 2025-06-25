import type { LayerCondition, Scores } from "@/types/gameTypes";

const layerConditions: LayerCondition[] = [
  {
    key: 'pollution',
    thresholdHigh: 70,
    thresholdLow: 30,
    highImage: 'niveau3.png',
    lowImage: 'niveau2.png',
  },
  {
    key: 'ecoScore',
    thresholdHigh: 70,
    thresholdLow: 30,
    highImage: 'niveau1.png',
    lowImage: 'niveau2.png',
  },
  {
    key: 'urbanisation',
    thresholdHigh: 70,
    thresholdLow: 30,
    highImage: 'niveau3.png',
    lowImage: 'niveau1.png',
  },
  // Ajoute d’autres si nécessaire
];

export function getBackgroundLayers(scores: Scores): string[] {
  const layers: string[] = [];

  for (const { key, thresholdHigh, thresholdLow, highImage, lowImage } of layerConditions) {
    const val = scores[key];
    console.log(val, key, thresholdHigh, thresholdLow, highImage, lowImage);
    
    if (val !== undefined) {
      if (val >= thresholdHigh && highImage) {
        layers.push(highImage);
      } else if (val <= thresholdLow && lowImage) {
        layers.push(lowImage);
      }
    }
  }
  console.log("Background layers:", layers);
  
  return layers;
}