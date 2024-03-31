import { createWebHistory, createRouter } from 'vue-router'
import { store } from '@/store.js'

import HomeView from './views/Home.vue'
import EventView from './views/Event.vue'
import UserView from './views/User.vue'

import CreateEventAdminView from './views/admin/CreateEvent.vue'

const routes = [
	{ path: '/', component: HomeView },
	{ path: '/user', component: UserView },
	{ path: '/:event', component: EventView },
	{ path: '/event/new', component: CreateEventAdminView }
]



const router = createRouter({
	history: createWebHistory(),
	routes
})

router.beforeEach((to, from) => {
	store.alert = ""
})

export default router