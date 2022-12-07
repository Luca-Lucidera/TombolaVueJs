<template>
    <div class="h-screen flex flex-col items-center text-center pt-4" v-if="step == 1">
        <div name="header">
            <p class="dark:text-white text-3xl font-medium">TOMBOLA ONLINE</p>
        </div>
        <div name="form" class="h-1/2 flex items-end">
            <form method="post" @submit.prevent="addUsername">
                <div>
                    <label for="username" class="dark:text-white text-2xl inline pr-2">USERNAME:</label>
                    <input type="text" id="username" v-model="usernameLocal" class="rounded-xl">
                    <p class="text-red-600 text-2xl" v-show="usernameError">Errore, username non valido, minimo 4
                        caratteri,
                        solo lettere, numeri, - e _</p>
                </div>
                <div>
                    <button type="submit" 
                        class="text-white text-2xl  bg-green-600  rounded-xl mt-4 py-2 px-6">
                        Salva username
                    </button>
                    </div>
            </form>
        </div>
    </div>
    <div class="h-screen flex flex-col items-center text-center" v-else>
        <p class="dark:text-white text-3xl pt-4">Benvenuto {{usernameLocal}}</p>
        <div class="flex flex-col h-2/5 justify-end">
            <button class="text-white text-2xl bg-green-700 rounded-2xl py-2 " @click="router.push('/create-lobby')">
                Crea una lobby
            </button>
            <button class="text-white text-2xl bg-green-700 rounded-2xl mt-4 py-2 px-4 "
                @click="router.push('/join-lobby')">
                Partecipa a una partita
            </button>
        </div>
        <button class="text-white text-2xl bg-red-700 mt-6 py-2 px-6 rounded-2xl" @click.prevent="step--">
            Cambia il nome
        </button>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStorage } from '../stores/index'
const usernameLocal = ref('');
const usernameError = ref(false)
const step = ref(1)
const router = useRouter();
const store = useStorage();
Notification.requestPermission()
watch(usernameLocal, (newUsername) => {
    const regex = /^[A-Za-z0-9 \-\_]*$/
    if (!regex.test(newUsername) || newUsername.length < 4) {
        usernameError.value = true;
    } else {
        usernameError.value = false
    }
})

function addUsername() {
    if (usernameLocal.value == "" || usernameError.value) {
        usernameError.value = true
        return;
    }
    step.value++;
    store.Username = usernameLocal.value
}
</script>



