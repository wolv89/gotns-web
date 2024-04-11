<script setup>

import { ref, onMounted, computed } from 'vue'
import { useGo } from '@/usego'
import { useRoute } from 'vue-router'

import AdminSlot from '@/components/AdminSlot.vue'
import SuperLoader from '@/components/SuperLoader.vue'

import PlayerList from '@/components/PlayerList.vue'
import EntrantList from '@/components/EntrantList.vue'

import { store } from '@/store.js'

const route = useRoute()

const SEEDMAX = 16

const loadedEvent = ref(false)
const loadedDivision = ref(false)
const division = ref(null)

const loading = ref(false)
const someError = ref('')
const ferror = ref('')

const entered = ref([])
const entries = ref([])
const seeds = ref(Array(SEEDMAX + 1))

const newEntry = ref({
	player1: null,
	player2: null,
	seed: 0
})


async function loadEvent() {
	const { data, error } = await useGo('/event/' + route.params.event).json()
	if(error.value) {
		someError.value = error.value
		store.event = null
	}
	else {
		if(!data.value.result) {
			someError.value = data.value.response
			store.event = null
		}
		else {
			store.event = data.value.packet
			loadDivision()
		}
	}
	loadedEvent.value = true
}


async function loadDivision() {
	const { data, error } = await useGo('/event/' + store.event.id + '/division/' + route.params.division).json()
	if(error.value) {
		someError.value = error.value
		division.value = null
	}
	else {
		if(!data.value.result) {
			someError.value = data.value.response
			division.value = null
		}
		else {
			division.value = data.value.packet
		}
	}
	loadedDivision.value = true
}


async function loadPlayers() {
	const { data, error } = await useGo('/admin/players').json()
	if(error.value) {
		someError.value = error.value
		store.players = null
	}
	else {
		if(data.value) {
			store.players = data.value
		}
		else {
			store.players = null
		}
	}
}


onMounted(() => {
	loadEvent()
	loadPlayers()

	for (let s = 0; s <= SEEDMAX; s++) {
		seeds.value[s] = false
	}
})


const canAdd = computed(() => {
	if(newEntry.value.player1 == null) return false
	if(division.value.teams) {
		if(newEntry.value.player2 == null) return false
	}
	return true
})


function selectPlayer(player) {

	if(newEntry.value.player1 == null) {
		newEntry.value.player1 = player
	}
	else if(division.value.teams && newEntry.value.player2 == null) {
		newEntry.value.player2 = player
	}

}


function addEntry() {

	entries.value.push(newEntry.value)
	entered.value.push(newEntry.value.player1.id)
	if(division.value.teams) {
		entered.value.push(newEntry.value.player2.id)
	}
	if(newEntry.value.seed > 0) {
		seeds.value[newEntry.value.seed] = true
	}

	newEntry.value = {
		player1: null,
		player2: null,
		seed: 0
	}

}


function removeEntry(e) {

	const entry = entries.value[e]

	entered.value.splice(entered.value.indexOf(entry.player1.id), 1)
	if(entry.player2) {
		entered.value.splice(entered.value.indexOf(entry.player2.id), 1)
	}

	if(entry.seed > 0) {
		seeds.value[entry.seed] = false
	}

	entries.value.splice(e, 1)

}


async function confirmEntries() {

	ferror.value = ''

	if(!entries.value.length) {
		ferror.value = 'No entrants?!'
		return
	}

	loading.value = true

	const submission = []
	const teams = division.value.teams ? 1 : 0

	for(let e in entries.value) {
		const entry = entries.value[e]
		if(teams) {
			submission.push({
				player1: entry.player1.id,
				player2: entry.player2.id,
				seed: entry.seed
			})
		}
		else {
			submission.push({
				player1: entry.player1.id,
				seed: entry.seed
			})
		}
	}

	const { data, error } = await useGo('/admin/division/' + division.value.id + '/entrants/new?teams=' + teams, {
		body: JSON.stringify(submission)
	}).post().json()

	if(!error.value) {
		const r = data.value
		if(r.result) {
			// Success ?
		}
		else {
			ferror.value = r.response
		}
	}
	else {
		ferror.value = error.value
	}

	loading.value = false

}


</script>
<template>
	<div v-if="!loadedEvent || !loadedDivision" class="page-loader">
		<p>Loading...</p>
	</div>
	<div v-else-if="!store.event || !division" class="page-error">
		<h4>Sorry, a problem occurred.</h4>
		<p>Unable to load event or division</p>
	</div>
	<AdminSlot v-else :name="division.name + ' #Add Entrants'" :desktop="true">
		<div class="division-entrants">
			<section class="de-players">
				<PlayerList :entered="entered" @selectplayer="selectPlayer" />
			</section>
			<section class="de-new-entrant">
				<article class="new-entrant card dark-card">
					<h5>{{ division.teams ? "Team" : "Solo" }} Entry</h5>
					<fieldset>
						<p v-if="newEntry.player1">{{ newEntry.player1.firstname }} {{ newEntry.player1.lastname }}<img @click.prevent="newEntry.value.player1 = null" class="cancel" src="@/assets/images/radix-ui-cancel.svg" /></p>
						<p v-else><em>Select player</em></p>
					</fieldset>
					<fieldset v-if="division.teams">
						<p v-if="newEntry.player2">{{ newEntry.player2.firstname }} {{ newEntry.player2.lastname }}<img @click.prevent="newEntry.value.player1 = null" class="cancel" src="@/assets/images/radix-ui-cancel.svg" /></p>
						<p v-else><em>Select player</em></p>
					</fieldset>
					<fieldset class="dropdown spaced">
						<label>Seed</label> <select v-model="newEntry.seed">
							<option v-for="(seed,s) in seeds" :key="s" :value="s" :disabled="seed">
								{{ s > 0 ? s : "None" }}
							</option>
						</select>
					</fieldset>
					<fieldset v-if="canAdd">
						<button class="btn themed" @click.prevent="addEntry">Add Entry</button>
					</fieldset>
				</article>
			</section>
			<section class="de-entrants">
				<EntrantList :entrants="entries" :error="ferror" @remove="removeEntry" @confirm="confirmEntries" />
			</section>
		</div>
		<SuperLoader v-if="loading">
			<p>Entering players in division</p>
		</SuperLoader>
	</AdminSlot>
</template>
<style lang="sass">
.division-entrants
	padding: 1rem 0
	display: flex
	gap: 2rem
	justify-content: space-between

	section
		flex-basis: 33%

	.new-entrant
		img.cancel
			filter: invert(16%) sepia(71%) saturate(4499%) hue-rotate(351deg) brightness(105%) contrast(88%)

		select
			option:disabled
				display: none
</style>