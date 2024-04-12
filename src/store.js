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
	logout(msg) {
		localStorage.removeItem("goken")
		localStorage.removeItem("goname")
		this.user = null
		if(msg != undefined && msg.length) {
			this.alert = msg
		}
		else {
			this.alert = "You have been logged out."
		}
	},
	alert: null,
	event: null,
	divisions: null,
	players: [],
	playermap: new Map(),
	addPlayer(newplayer) {
		this.players.push(newplayer)
		this.playermap.set(newplayer.id, newplayer)
	},
	getPlayerName(id) {
		player = this.playermap.get(id)
		if(!player) return 'Player not found'
		return player.firstname + ' ' + player.lastname
	}
})
