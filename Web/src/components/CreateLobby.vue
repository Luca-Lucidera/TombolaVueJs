<template>
    <div class="h-screen flex flex-col items-center text-center">
        <div name="header" class="mt-4">
            <p class="dark:text-white text-3xl">Benvenuto nella creazione della lobby</p>
            <p class="dark:text-white text-2xl mt-2">Username scelto: {{store.getUsername}}</p>
        </div>

        <form @submit.prevent="creaLobby">
            <div name="schede" class="mt-8">
                <p class="dark:text-white text-2xl">Scegli il numero di schede</p>
                <div class="pt-2">
                    <input type="radio" checked id="1" value="1" v-model="gameSettings.schede">
                    <label for="1" class="dark:text-white text-l ml-2">1 scheda</label>
                </div>
                <div class="pt-2">
                    <input type="radio" id="2" value="2" v-model="gameSettings.schede">
                    <label for="2" class="dark:text-white text-l ml-2">2 schede</label>

                </div>
            </div>

            <div name="giocatori" class="pt-2">
                <input class="rounded-lg" type="number" v-model="gameSettings.giocatori" id="numero-giocatori" min="2"
                    max="4">
                <label class="text-white text-xl ml-2" for="numero-giocatori">Numero di giocatori. Tu + Avversario</label>
            </div>

            <div name="crea-lobby" class="mt-8">
                <button type="submit" class="text-white text-2xl bg-green-700 rounded-xl px-6 py-2">Crea la lobby!</button>
            </div>
        </form>
        
        <div name="footer" class="mt-6">
            <RouterLink to="/" class="text-white bg-red-700 text-2xl  rounded-xl px-16 py-2">Home</RouterLink>
        </div>
    </div>
</template>

<script setup>
import { useStorage } from '../stores/index'
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router';
import { io } from "socket.io-client"
const socket = io("https://server-tombola.glitch.me/")
const router = useRouter();
const store = useStorage();
const gameSettings = ref({
    schede: 1,
    giocatori: 2,
})

function creaLobby() {
    store.socket = socket
    socket.emit("crea-lobby", gameSettings.value, store.getUsername)
    gameSettings.value.owner = socket.id
    store.GameSettings = gameSettings.value
    router.push("/lobby")
}
</script>