import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import style from './style.css'
 
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(style)

app.mount('#app')
