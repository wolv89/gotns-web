import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './views/Home.vue'
import EventView from './views/Event.vue'
import LoginView from './views/Login.vue'

import CreateEventAdminView from './views/admin/CreateEvent.vue'

const routes = [
	{ path: '/', component: HomeView },
	{ path: '/event/new', component: CreateEventAdminView },
	{ path: '/event/:event', component: EventView },
	{ path: '/login', component: LoginView }
]



const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router