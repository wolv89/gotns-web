<script setup>

import { ref, onMounted } from 'vue'
import { useGo } from '@/usego'
import { useRoute, useRouter } from 'vue-router'

import AdminSlot from '@/components/AdminSlot.vue'
import ButtonLoader from '@/components/ButtonLoader.vue'

import PlayerList from '@/components/PlayerList.vue'

import { store } from '@/store.js'

const router = useRouter()
const route = useRoute()

const SEEDMAX = 32

const loadedEvent = ref(false)
const loadedDivision = ref(false)
const division = ref(null)

const loading = ref(false)
const someError = ref('')
const ferror = ref('')

const entered = ref([])
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
		if(s > 10 & s < 20 & s % 2 == 0)
			seeds.value[s] = true
		else
			seeds.value[s] = false
	}
})

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
				<PlayerList :entered="entered" />
			</section>
			<section class="de-new-entrant">
				<article class="new-entrant card dark-card">
					<h5>{{ division.teams ? "Team" : "Solo" }} Entry</h5>
					<fieldset>
						<p v-if="newEntry.player1">{{ newEntry.player1.firstname }} {{ newEntry.player1.lastname }}</p>
						<p v-else><em>Select player</em></p>
					</fieldset>
					<fieldset v-if="division.teams">
						<p v-if="newEntry.player2">{{ newEntry.player2.firstname }} {{ newEntry.player2.lastname }}</p>
						<p v-else><em>Select player</em></p>
					</fieldset>
					<fieldset class="dropdown">
						<label>Seed</label> <select v-model="newEntry.seed">
							<option v-for="(seed,s) in seeds" :key="s" :value="s" :disabled="seed">
								{{ s > 0 ? s : "None" }}
							</option>
						</select>
					</fieldset>
				</article>
			</section>
			<section class="de-entrants">
			</section>
		</div>
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
</style>