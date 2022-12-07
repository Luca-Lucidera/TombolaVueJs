<script setup>
import { useStorage } from '../stores/index'
import { io } from 'socket.io-client'
import { useRouter, RouterLink } from 'vue-router'
import { ref } from 'vue'

const router = useRouter();
const lobbyPiena = ref(false);
const erroreConnessione = ref(false)
const store = useStorage();
const socket = io('http://localhost:3000')

socket.io.on('error', (err) => {
    console.log('Error connecting to server');
    erroreConnessione.value = true
});

socket.on('done', (gameSettings) => {
    store.GameSettings = gameSettings
    store.socket = socket
    router.push('/lobby')
})
socket.on('lobbyPiena', (msg) => {
    console.debug(msg)
    lobbyPiena.value = true
})
socket.emit('join-lobby', store.getUsername)


</script>

<template>
    <div class="flex flex-col items-center justify-center text-center h-screen">
        <div v-show="!lobbyPiena && !erroreConnessione">
            <p class="text-white text-3xl">Caricamento</p>
        </div>
        <div v-if="lobbyPiena">
            <p class="text-red-700 text-3xl">Errore, la lobby è già piena :(</p>
        </div>
        <div v-else-if="erroreConnessione">
            <p class="text-red-700 text-3xl">Non siamo riusciti a connetterci al server :(</p>
        </div>
        <div v-show="!lobbyPiena || !erroreConnessione" class="mt-8">
            <RouterLink to="/" class="text-white text-2xl rounded-xl bg-green-600 py-2 px-8">Torna alla home
            </RouterLink>
        </div>
    </div>
</template>