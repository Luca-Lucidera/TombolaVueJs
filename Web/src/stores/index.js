import { io } from 'socket.io-client'
import { defineStore } from 'pinia'
export const useStorage = defineStore('main', {
  state: () => {
    return {
      Username: '',
      GameSettings: {
        schede: 1,
        giocatori: 2,
        owner: ""
      },
      Cartella: [[],[],[]],
      socket: io('https://server-tombola.glitch.me/'),
      GameEvent: {
        ambo: {
          fatto: false,
          combinazioni: []
        },
        terna: {
          fatto: false,
          combinazioni: []
        },
      }
    }
  },
  getters: {
    getGameSettings: (state) => state.GameSettings,
    getUsername: (state) => state.Username,
    getCartella: (state) => state.Cartella,
    getSocket: (state) => state.socket,
    getGameEvent: (state) => state.GameEvent
  }
})