<script setup>

import { ref, onMounted, computed } from 'vue'
import { useGo } from '@/usego'
import { store } from '@/store.js'

import SuperLoader from '@/components/SuperLoader.vue'

import PlayerList from '@/components/PlayerList.vue'
import EntrantList from '@/components/EntrantList.vue'

const SEEDMAX = 8

const props = defineProps(['division'])

const loading = ref(false)
const ferror = ref('')

const entered = ref([])
const entries = ref([])
const seeds = ref(Array(SEEDMAX + 1))

const newEntry = ref({
	player1: null,
	player2: null,
	seed: 0
})


onMounted(() => {
	for (let s = 0; s <= SEEDMAX; s++) {
		seeds.value[s] = false
	}
})


const canAdd = computed(() => {
	if(newEntry.value.player1 == null) return false
	if(props.division.teams) {
		if(newEntry.value.player2 == null) return false
	}
	return true
})


function selectPlayer(player) {

	if(newEntry.value.player1 == null) {
		newEntry.value.player1 = player.id
	}
	else if(props.division.teams && newEntry.value.player2 == null) {
		newEntry.value.player2 = player.id
	}

}


function addEntry() {


	if(props.division.teams) {
		entered.value.push(newEntry.value.player2)
	}
	else {
		delete newEntry.value.player2
	}

	entered.value.push(newEntry.value.player1)
	entries.value.push(newEntry.value)

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

	entered.value.splice(entered.value.indexOf(entry.player1), 1)
	if(entry.player2) {
		entered.value.splice(entered.value.indexOf(entry.player2), 1)
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

	const teams = props.division.teams ? 1 : 0

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

	const { data, error } = await useGo('/admin/division/' + props.division.id + '/entrants/new?teams=' + teams, {
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
	<div class="division-entrants">
		<section class="de-players">
			<PlayerList :entered="entered" @selectplayer="selectPlayer" />
		</section>
		<section class="de-new-entrant">
			<article class="new-entrant card dark-card">
				<h5>{{ division.teams ? "Team" : "Solo" }} Entry</h5>
				<fieldset>
					<p v-if="newEntry.player1">{{ store.getPlayerName(newEntry.player1) }}<img @click.prevent="newEntry.player1 = null" class="cancel" src="@/assets/images/radix-ui-cancel.svg" /></p>
					<p v-else><em>Select player</em></p>
				</fieldset>
				<fieldset v-if="division.teams">
					<p v-if="newEntry.player2">{{ store.getPlayerName(newEntry.player2) }}<img @click.prevent="newEntry.player2 = null" class="cancel" src="@/assets/images/radix-ui-cancel.svg" /></p>
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