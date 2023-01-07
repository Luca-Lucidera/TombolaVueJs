<template>
    <div class="h-screen flex flex-col items-center text-center">
        <div name="header" class="mt-4">
            <h2 class="text-white text-3xl">Benvenuto nella lobby, l'owner è {{store.getGameSettings.owner}} </h2>
        </div>
        <div name="body" class="mt-8">
            <p class="text-white text-2xl">Utenti connessi: {{lobby.length}}/{{store.getGameSettings.giocatori}} {{lobby.length
            ==
            store.GameSettings.giocatori ? "Lobby piena, partita pronta!" : ""}} </p>
            <p v-for="(item, index) in lobby" :key="index" class="text-white text-2xl mt-4">{{item}}</p>
        </div>

        <div name="footer" class="mt-8" v-if="store.GameSettings.owner == store.socket.id">
            <button class="text-white rounded-xl bg-green-700 px-8 py-2" @click="generaSchede" :disabled="!lobbyPiena">Gioca!</button>
        </div>

        <div name="footer" class="mt-8" v-else-if="lobbyPiena && store.GameSettings.owner != store.socket.id">
            <p class="text-white text-2xl">La lobby è piena, aspetta che l'owner starti il game!</p>
            
        </div>
        
        <div class="mt-8">
            <RouterLink to="/" class="text-white rounded-xl py-2 px-8 bg-red-600 ">Home</RouterLink>
        </div>
    </div>
</template>

<script setup>
import { useStorage } from '../stores/index'
import { ref, onMounted } from "vue"
import { useRouter, RouterLink } from 'vue-router'
import axios from 'axios'

const store = useStorage()
const router = useRouter();
const lobby = ref([])
const lobbyPiena = ref(false)
const socket = store.getSocket


onMounted(() => {
    updateLobby();
})

function updateLobby() {
    setInterval(function () {
        if (!lobbyPiena.value) {
            axios.get('https://server-tombola.glitch.me/getUser')
                .then((resp) => {
                    const { data, status } = resp
                    if (data && status == 200) {
                        lobby.value = [];
                        data.forEach(element => {
                            lobby.value.push(element.username)
                        });
                        if (lobby.value.length == store.getGameSettings.giocatori) {
                            lobbyPiena.value = true;
                        }
                    }
                })
                .catch(exp => {
                    console.error(exp)
                })
        }

    }, 1000)
}

function generaSchede() {
    socket.emit('genera-scheda')
}

socket.on('scheda-generata', (scheda) => {
    store.Cartella = scheda;
    let gameEvent = {
        ambo: {
            combinazioni: [],
            fatta: false
        },
        terna: {
            combinazioni: [],
            fatta: false
        }
    }
    scheda.forEach(riga => {
        //genero gli ambo
        for (let i = 0; i < riga.length - 1; i++) {
            const primoNumero = riga[i].numero;
            const secondoNumero = riga[i + 1].numero
            //ambo
            gameEvent.ambo.combinazioni.push({ n1: primoNumero, n2: secondoNumero })
        }
        //genero le terne
        for (let i = 0; i < riga.length - 2; i++) {
            const primoNumero = riga[i].numero;
            const secondoNumero = riga[i + 1].numero
            const terzoNumero = riga[i + 2].numero
            gameEvent.terna.combinazioni.push({ n1: primoNumero, n2: secondoNumero, n3: terzoNumero })
        }

    })
    store.GameEvent = gameEvent
    console.log('store.GameEvent', store.getGameEvent)
    router.push('/game')
})
socket.on('schede-generate', (schede) => {

})
</script>