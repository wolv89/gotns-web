<script setup>

import { ref, computed, watch } from 'vue'
import { useGo } from '@/usego'

import { store } from '@/store.js'

import ButtonLoader from '@/components/ButtonLoader.vue'

const props = defineProps(['entered'])

const SEARCHMIN = 2


const playerSearch = ref("")

const newPlayerFirstname = ref("")
const newPlayerLastname = ref("")
const newPlayerLoading = ref(false)
const newPlayerError = ref("")

const thePlayers = computed(() => {

	if(!store.players) return []

	if(isSearching.value) {

		const s = playerSearch.value.toLowerCase()
		const searchList = []

		for(let p in store.players) {
			const player = store.players[p]
			if(player.firstname.toLowerCase().indexOf(s) >= 0
				|| player.lastname.toLowerCase().indexOf(s) >= 0) {
				searchList.push(player)
			}
		}

		return searchList

	}

	if(isFiltering.value) {

		const filteredList = []

		for(let p in store.players) {
			const player = store.players[p]
			if(props.entered.indexOf(player.id) < 0) {
				filteredList.push(player)
			}
		}

		return filteredList

	}

	return store.players

})

const isSearching = computed(() => {
	return playerSearch.value.length >= SEARCHMIN
})

const isFiltering = computed(() => {
	return props.entered.length > 0
})


watch(playerSearch, async(newPlayerSearch, oldPlayerSearch) => {

	if(newPlayerSearch.length >= SEARCHMIN && thePlayers.value.length <= 0) {
		const name = newPlayerSearch.split(" ")
		if(name[0]) newPlayerFirstname.value = capitalise(name[0])
		if(name.length > 1) {
			let lname = ""
			for(let n = 1; n < name.length; n++) {
				if(lname.length) lname += " "
				lname += capitalise(name[n])
			}
			newPlayerLastname.value = lname
		}
	}

})

function capitalise(word) {
	return word.charAt(0).toUpperCase() + word.slice(1)
}


function enterPlayer(id) {
	// -- TODO
}

function hasEntered(id) {
	return props.entered.indexOf(id) >= 0
}


async function createPlayer() {

	newPlayerError.value = ""

	if(!newPlayerFirstname.value || !newPlayerLastname.value) {
		newPlayerError.value = "First and last names are required"
		return
	}

	newPlayerLoading.value = true

	const submission = {
		firstname: newPlayerFirstname.value,
		lastname: newPlayerLastname.value
	}

	const { data, error } = await useGo('/admin/player/new', {
		body: JSON.stringify(submission)
	}).post().json()

	if(!error.value) {
		const r = data.value
		if(r.result) {
			store.players.push({
				id: +r.return,
				firstname: submission.firstname,
				lastname: submission.lastname
			})
			playerSearch.value = playerSearch.value.split(" ")[0]
			newPlayerFirstname.value = ""
			newPlayerLastname.value = ""
		}
		else {
			newPlayerError.value = r.response
		}
	}
	else {
		newPlayerError.value = error.value
	}

	newPlayerLoading.value = false

}




</script>
<template>
	<div class="player-supercard card">
		<article class="player-search">
			<h6>Find player</h6>
			<fieldset>
				<input type="text" v-model="playerSearch" placeholder="Player name..." />
			</fieldset>
		</article>
		<article v-if="!thePlayers.length" class="player-new">
			<h6>Add new player</h6>
			<fieldset>
				<input type="text" v-model="newPlayerFirstname" placeholder="First name" />
			</fieldset>
			<fieldset>
				<input type="text" v-model="newPlayerLastname" placeholder="Last name" />
			</fieldset>
			<fieldset>
				<button v-if="!newPlayerLoading" class="btn" @click.prevent="createPlayer">Add new Player</button>
				<ButtonLoader v-else />
			</fieldset>
			<p class="error-message" v-if="newPlayerError">{{ newPlayerError }}</p>
		</article>
		<article class="player-list">
			<ol v-if="thePlayers.length" class="the-players">
				<li v-for="player in thePlayers" :key="player.id" :class="{'the-player': true, 'has-entered': hasEntered(player.id)}" @click.prevent="$emit('selectplayer', player)">
					<div class="the-player-firstname">{{ player.firstname }}</div>
					<div class="the-player-lastname">{{ player.lastname }}</div>
					<div class="the-player-action">
						Enter <img src="@/assets/images/radix-ui-arrow-right.svg" />
					</div>
					<div class="the-player-entered">
						Entered
					</div>
				</li>
			</ol>
			<ol v-else class="empty-list">
				<li v-if="isSearching" class="soft-message">Can't find any player(s) with that name</li>
				<li v-else-if="isFiltering" class="soft-message">No more un-entered players available</li>
				<li v-else class="soft-message">No players have been added to this event yet!</li>
			</ol>
		</article>
	</div>
</template>
<style lang="sass">
.player-supercard
	h6
		margin-bottom: 0.2rem

	.player-search
		padding-bottom: 1rem

	.player-new
		padding: 1rem 1.25rem
		background: #e9e9e9
		border-radius: calc(0.5rem + 4px)
		margin-bottom: 1rem

	.the-players
		margin: 0
		padding: 0
		list-style: none outside
		overflow: auto
		max-height: 50vh

		.the-player
			display: flex
			gap: 0.5rem
			justify-content: space-between
			cursor: pointer
			padding: 0.5rem
			transition: background 0.4s ease

			&:hover
				background: $theme

			&-firstname
				flex-basis: 32.5%

			&-lastname
				flex-basis: 47.5%
				text-transform: uppercase

			&-action,&-entered
				flex-basis: 20%
				font-size: 0.7em

				img
					position: relative
					top: 0.1rem

			&-entered
				display: none

			&.has-entered
				font-style: italic
				opacity: 0.7
				pointer-events: none

				.the-player
					&-action
						display: none
					&-entered
						display: initial
</style>