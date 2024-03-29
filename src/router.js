import { createWebHistory, createRouter } from 'vue-router'

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
	routes,
})

export default router