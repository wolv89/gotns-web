import { createWebHistory, createRouter } from 'vue-router'
import { store } from '@/store.js'

import HomeView from './views/Home.vue'
import UserView from './views/User.vue'
import EventView from './views/Event.vue'
import DivisionView from './views/Division.vue'

import CreateEventAdminView from './views/admin/CreateEvent.vue'
import EditEventAdminView from './views/admin/EditEvent.vue'
import CreateDivisionAdminView from './views/admin/CreateDivision.vue'
import InitDivisionAdminView from './views/admin/InitDivision.vue'

const routes = [
	{ path: '/', component: HomeView },
	{ path: '/user', component: UserView },
	{ path: '/:event', component: EventView },
	{ path: '/event/new', component: CreateEventAdminView },
	{ path: '/:event/edit', component: EditEventAdminView },
	{ path: '/:event/:division', component: DivisionView },
	{ path: '/:event/division/new', component: CreateDivisionAdminView },
	{ path: '/:event/:division/init', component: InitDivisionAdminView }
]



const router = createRouter({
	history: createWebHistory(),
	routes
})

router.beforeEach((to, from) => {
	store.alert = ""
})

export default router