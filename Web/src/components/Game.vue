<script setup>
//import
import { useStorage } from '../stores';
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'

//store
const store = useStorage();
const cartella = store.getCartella;
const socket = store.getSocket;
const GameEvent = store.getGameEvent;

//ref
const numeroEstratto = ref(-1)
const partitaFinita = ref(false)

let numeriEstratti = [];

//l'owner fa partire le estrazioni
if (store.getGameSettings.owner == socket.id) {
    socket.emit('game-start')
}

//eventi chiamati dal server
socket.on('numero-estratto', (numero) => {
    numeroEstratto.value = numero;
    numeriEstratti.push(numero)
    numeriEstratti.sort()
    let tombola = true;
    cartella.forEach(row => {
        row.forEach(numberObj => {
            if (numberObj.numero == numero) {
                numberObj.estratto = true
            }
            if (numberObj.estratto == false) tombola = false
        })
    })
    if (tombola) {
        socket.emit('fine-gioco', (store.getUsername))
        partitaFinita.value = true
    } else {
        checkAmbo();
    }

})

socket.on('ambo', (msg) => {
    console.log(msg)
})

socket.on('vincitore', (username) => {
    alert(`il vincitore della tombola è ${username}`)
    partitaFinita.value = true
})
//funzioni
function checkAmbo() {

    //Controllo che non sia già stato fatto ambo
    if (!GameEvent.ambo.fatto) {
        //ciclo esterno che va a vedere le righe (max 3)
        for (let i = 0; i < cartella.length; i++) {
            //vado a prendere la riga
            const riga = cartella[i];

            //ciclo che va a fare i controlli su numeri presenti sulla riga
            for (let j = 0; j < riga.length - 1; j++) {

                //vado a controllare che i due numeri consecutivi siano stati estratti
                if (riga[j].estratto && riga[j + 1].estratto) {

                    //vado a prendere i due numeri consecutivi
                    let n1 = riga[j].numero;
                    let n2 = riga[j + 1].numero

                    //vado a prendere l'array delle combinazioni presenti nello storage (passato dal server)
                    const comboPossibili = GameEvent.ambo.combinazioni;

                    //questo ciclo controlla se nell'array delle combinazioni è presente la combinazione con i numeri consecutivi
                    for (let k = 0; k < comboPossibili.length; k++) {

                        //vado a prendere la combinazione
                        const combo = comboPossibili[k];
                        //controllo se la combinazione presa contiene i due numeri della scheda
                        if (combo.n1 == n1 && combo.n2 == n2 && !GameEvent.ambo.fatto) {

                            //ambo fatto
                            GameEvent.ambo.fatto = true;
                            //dico al server che sono fottissimo!
                            socket.emit('ambo-fatto', store.getUsername, n1, n2)

                            //fa esplodere tutto
                            break;
                        }
                    }
                } else {
                    //uno dei due numeri non è stato estratto
                }
            }
        }
    }
}

function checkTerna() {

}

</script>

<template>
    <div class="h-screen">
        <div class="flex flex-col items-center pt-4">
            <h1 class="text-white text-3xl">Fase estrazioni, tu sei {{store.getUsername}}</h1>
            <h3 class="text-white text-3xl ">Numero estratto: {{numeroEstratto}}</h3>
        </div>

        <div class="flex flex-row flex-wrap mt-4">
            <h3 class="text-white text-xl">Numeri estratti:</h3>
            <div v-for="(numeri, index) in numeriEstratti" :key="index" class="text-white text-xl ml-2">{{numeri}}</div>
        </div>

        <div name="tua cartella" class="h-2/4 mt-8">
            <div class="grid grid-cols-9 h-full content-end justify-items-center">
                <p class="text-white text-2xl mb-12 col-span-9 self-start">La tua cartella</p>
                <template v-for="(riga) in cartella">
                    <div v-for="(numeroObj, index) in riga" :key="index">
                        <p class="text-white text-2xl"
                            :style="{textDecoration: numeroObj.estratto ? 'line-through' : 'none', textDecorationColor: 'red'}">
                            {{numeroObj.numero}}
                        </p>
                    </div>
                </template>
            </div>
                
        </div>
        <div name="footer" class="flex flex-row justify-center pt-10 pb-10">
            <RouterLink to="/" class="text-white text-2xl bg-green-700 hover:bg-green-800 rounded-xl py-2 px-4" :style="{visibility: partitaFinita ? 'visible' : 'hidden'}">Home</RouterLink>
        </div>
    </div>
</template>