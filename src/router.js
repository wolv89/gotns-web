import { createWebHistory, createRouter } from 'vue-router'
import { store } from '@/store.js'

import HomeView from './views/Home.vue'
import UserView from './views/User.vue'
import EventView from './views/Event.vue'
import DivisionView from './views/Division.vue'

import EventCreateAdminView from './views/admin/EventCreate.vue'
import EventEditAdminView from './views/admin/EventEdit.vue'
import DivisionCreateAdminView from './views/admin/DivisionCreate.vue'
import DivisionEditAdminView from './views/admin/DivisionEdit.vue'

const routes = [
	{ path: '/', component: HomeView },
	{ path: '/user', component: UserView },
	{ path: '/:event', component: EventView },
	{ path: '/event/new', component: EventCreateAdminView },
	{ path: '/:event/edit', component: EventEditAdminView },
	{ path: '/:event/:division', component: DivisionView },
	{ path: '/:event/division/new', component: DivisionCreateAdminView },
	{ path: '/:event/:division/edit', component: DivisionEditAdminView }
]



const router = createRouter({
	history: createWebHistory(),
	routes
})

router.beforeEach((to, from) => {
	store.alert = ""
})

export default router