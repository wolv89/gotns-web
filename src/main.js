import { createApp } from 'vue'
import router from './router'
import './assets/sass/style.sass'
import App from './App.vue'

createApp(App)
	.use(router)
	.mount('#app')
