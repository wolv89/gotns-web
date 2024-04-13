<script setup>

import { ref, provide, onMounted } from 'vue'
import { useGo } from '@/usego'
import { store } from '@/store.js'

import SuperLoader from '@/components/SuperLoader.vue'
import Matchups from '@/components/Matchups.vue'

const props = defineProps(['division'])

const loadedEntrants = ref(false)
const loadingError = ref('')
const entrants = ref([])

const SELECTED = ref(null)
const OPPONENT = ref("")

provide('opponent', OPPONENT)

const loading = ref(false)


async function loadEntrants() {
	const { data, error } = await useGo('/admin/division/' + props.division.id + '/entrants').json()
	if(error.value) {
		loadingError.value = error.value
		entrants.value = null
	}
	else {
		entrants.value = data.value
	}
	loadedEntrants.value = true
}


onMounted(() => {
	loadEntrants()
})


function selectEntrant(index) {

	if(SELECTED.value == index) {
		SELECTED.value = null
		OPPONENT.value = ""
	}
	else {
		SELECTED.value = index
		OPPONENT.value = getOpponentMarkup(index)
	}

}


function handlePlaced() {

	SELECTED.value = null
	OPPONENT.value = null

}


function getOpponentMarkup(index) {

	let seed_markup = ""
	if(entrants.value[index].seed > 0) {
		seed_markup = '<span class="seed">' + entrants.value[index].seed + '</span> '
	}

	let oppo_markup = '<p>' + seed_markup + store.getPlayerName(entrants.value[index].player1) + '</p>'

	if(entrants.value[index].player2) {
		oppo_markup += '<p>' + seed_markup + store.getPlayerName(entrants.value[index].player2) + '</p>'
	}

	return oppo_markup

}



</script>
<template>
	<div v-if="!loadedEntrants" class="page-loader">
		<p>Loading...</p>
	</div>
	<div v-else-if="loadingError" class="page-error">
		<h4>Sorry, a problem occurred.</h4>
		<p>Unable to load entrants</p>
		<p>{{ loadingError }}</p>
	</div>
	<div v-else class="division-matches">
		<section class="entrants-listout card">
			<article class="entrant-summary">
				<h6>Entrants <span class="count">{{ entrants.length }}</span></h6>
				<fieldset>
					<button class="btn">Autofill Seeds</button>
				</fieldset>
			</article>
			<article class="entrant-list">
				<ol class="the-entrants">
					<li v-for="(entrant,e) in entrants" :key="e" :class="{'the-entrant': true, 'is-moving': SELECTED == e, 'is-scheduled': false}" @click="selectEntrant(e)">
						<p v-if="entrant.player1"><span v-if="+entrant.seed > 0" class="seed">{{ entrant.seed }}</span> {{ store.getPlayerName(entrant.player1) }}</p>
						<p v-if="entrant.player2"><span v-if="+entrant.seed > 0" class="seed">{{ entrant.seed }}</span> {{ store.getPlayerName(entrant.player2) }}</p>
						<img v-if="SELECTED == e" class="indicator" src="@/assets/images/radix-ui-arrow-right.svg" />
					</li>
				</ol>
			</article>
		</section>
		<section class="matches-listout">
			<h5>Matchups</h5>
			<Matchups :entrants="entrants" :selected="SELECTED" :opponent="OPPONENT" @place="handlePlaced" />
		</section>
		<section class="matches-confirmation card">
			<article class="matches-summary">
				<h6>Summary</h6>
			</article>
		</section>
	</div>
	<SuperLoader v-if="loading">
		<p>Saving match structure</p>
	</SuperLoader>
</template>
<style lang="sass">
.division-matches
	padding: 1rem 0
	display: flex
	gap: 2rem
	justify-content: space-between
	align-items: flex-start

	section
		flex-basis: 25%

	.matches-listout
		flex-basis: 50%

.entrants-listout
	position: relative
	z-index: 16

	h6
		margin-bottom: 0.2rem
		position: relative

	.count
		position: absolute
		top: 0.3rem
		right: 0
		opacity: 0.32
		+slm(0.8em, 1em, 0)

	.entrant-summary
		padding-bottom: 1rem

	.the-entrants
		margin: 0
		padding: 0
		list-style: none outside

		.the-entrant
			padding: 0.5rem 0.75rem
			position: relative
			border: 1px solid $border
			border-radius: calc(0.25rem + 4px)
			cursor: pointer
			background: $background
			transition: border 0.4s ease

			&:hover
				border-color: $text

			+ .the-entrant
				margin-top: 1rem

			p
				margin: 0
				padding: 0.25rem 0

			.seed
				font-weight: bold
				opacity: 0.32

			.indicator
				position: absolute
				top: 50%
				right: 0.75rem
				transform: translateY(-50%)
				width: 1.25rem
				height: 1.25rem
				opacity: 0.32

			&.is-moving
				border-style: dashed
				transform: translateX(15%)

</style>