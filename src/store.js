// store.js
import { reactive } from 'vue'

export const store = reactive({
	user: null,
	login(username, token) {
		this.user = {
			username: username,
			token: token
		}
	},
	logout() {
		this.user = null
	},
	event: null
})