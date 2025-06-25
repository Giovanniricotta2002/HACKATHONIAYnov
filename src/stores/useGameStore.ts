import type { Choice, Scores, Event } from '@/types/gameTypes'
import { defineStore } from 'pinia'

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export const useGameStore = defineStore('game', {
  state: () => ({
    scores: {
      ecoScore: 60,
      pollution: 45,
      urbanisation: 70,
      energie: 55,
      budget: 40,
      securite: 65
    } as Scores,
    currentEventIndex: 0,
    availableEvents: [] as Event[],
    eventHistory: [] as Event[],
    choiceHistory: [] as Choice[],
  }),

  actions: {
    initializeGame() {
      const allEvents: Event[] = clone([
        {
          narration: "Alors que les travaux de création de la nouvelle zone verte avancent, un incident inattendu survient : une fuite importante dans le réseau d'irrigation inonde une partie du chantier...",
          choices: [
            {
              text: "Allouer un budget d'urgence pour réparer rapidement le réseau d'irrigation",
              effects: { budget: -10, ecoScore: 5, urbanisation: 2 }
            },
            {
              text: "Mettre en pause le projet et rediriger les ressources vers des infrastructures plus urgentes",
              effects: { ecoScore: -5, budget: 5, urbanisation: -3 }
            },
            {
              text: "Organiser un appel d’offres pour trouver un prestataire moins coûteux",
              effects: { budget: -3, ecoScore: 2, urbanisation: 1 }
            }
          ]
        },
        {
          narration: "Quelques semaines plus tard, la ville est la cible d’une cyberattaque...",
          choices: [
            {
              text: "Payer la rançon discrètement",
              effects: { budget: -15, securite: -5, energie: -2 }
            },
            {
              text: "Refuser de payer et renforcer la cybersécurité",
              effects: { budget: -10, securite: 5, energie: -1 }
            },
            {
              text: "Faire appel à une agence gouvernementale",
              effects: { budget: -8, securite: 3, ecoScore: 1 }
            }
          ]
        },
        {
          narration: "L’été s’installe avec une canicule précoce...",
          choices: [
            {
              text: "Instaurer une politique de coupures programmées",
              effects: { energie: 10, securite: -5, ecoScore: 3 }
            },
            {
              text: "Distribuer des kits d’isolation thermique",
              effects: { budget: -12, energie: 8, ecoScore: 4 }
            },
            {
              text: "Faire appel à un fournisseur privé",
              effects: { budget: -7, energie: 5, pollution: 6 }
            }
          ]
        },
        {
          narration: "Une émeute éclate dans le quartier des Hauts-Plateaux...",
          choices: [
            {
              text: "Déployer massivement la police",
              effects: { securite: 10, budget: -5, ecoScore: -2 }
            },
            {
              text: "Organiser une médiation citoyenne",
              effects: { securite: 5, budget: -3, urbanisation: 1 }
            },
            {
              text: "Promettre un plan d’investissement urbain",
              effects: { budget: -10, urbanisation: 5, ecoScore: 2 }
            }
          ]
        },
        {
          narration: "Une explosion retentit dans la station électrique...",
          choices: [
            {
              text: "Faire appel à l’armée pour sécuriser",
              effects: { securite: 8, budget: -6, energie: -2 }
            },
            {
              text: "Mobiliser les techniciens locaux",
              effects: { energie: 10, budget: -4, pollution: 2 }
            },
            {
              text: "Déclarer l’état d’urgence",
              effects: { securite: 5, budget: -10, ecoScore: 1 }
            }
          ]
        },
        {
          narration: "Des pluies diluviennes s’abattent sur la ville...",
          choices: [
            {
              text: "Évacuer les sinistrés et installer des abris",
              effects: { budget: -12, securite: 7, ecoScore: 2 }
            },
            {
              text: "Lancer un audit complet des infrastructures",
              effects: { budget: -5, urbanisation: 2, pollution: -3 }
            },
            {
              text: "Réaffirmer votre plan climat",
              effects: { ecoScore: 4, securite: 2, budget: -3 }
            }
          ]
        }
      ])

      // Shuffle events with chaos escalation preserved
      this.availableEvents = allEvents.sort(() => Math.random() - 0.5)
      this.currentEventIndex = 0
      this.eventHistory = []
      this.choiceHistory = []
    },

    getCurrentEvent(): Event | null {
      return this.availableEvents[this.currentEventIndex] || null
    },

    choose(choiceIndex: number) {
      const event = this.getCurrentEvent()
      if (!event) return

      const choice = event.choices[choiceIndex]
      this.applyEffects(choice.effects)

      this.choiceHistory.push(choice)
      this.eventHistory.push(event)
      this.currentEventIndex++
    },

    applyEffects(effects: Partial<Scores>) {
      for (const key in effects) {
        const k = key as keyof Scores
        this.scores[k] += effects[k] ?? 0
      }
    }
  }
})