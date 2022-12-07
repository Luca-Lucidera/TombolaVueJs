import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/Home.vue'
import CreateLobby from '../components/CreateLobby.vue'
import JoinLobby from '../components/JoinLobby.vue'
import Lobby from '../components/Lobby.vue'
import Game from '../components/Game.vue'
import Test from '../components/Test.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/create-lobby',
      name: 'create-lobby',
      component: CreateLobby,
    },
    {
      path: '/join-lobby',
      name: 'join-lobby',
      component: JoinLobby,
    },
    {
      path: "/lobby",
      name: "lobby",
      component: Lobby
    },
    {
      path: '/game',
      name: 'game',
      component: Game
    },
    {
      path: '/test',
      component: Test
    }
  ]
})

export default router
