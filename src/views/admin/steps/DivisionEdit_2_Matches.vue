<script setup>

import { ref, provide, onMounted, nextTick } from 'vue'
import { useGo } from '@/usego'
import { store } from '@/store.js'

import SuperLoader from '@/components/SuperLoader.vue'
import Matchups from '@/components/Matchups.vue'

const props = defineProps(['division'])
const emit = defineEmits(['success'])

const loadedEntrants = ref(false)
const loadingError = ref('')
const entrants = ref([])

const SELECTED = ref(null)
const SLOTTED = ref(0)
const SLOTS = ref([])

provide('getOpponentMarkup', getOpponentMarkup)

const lockEntrantsCard = ref(false)
const loading = ref(false)
const ferror = ref(null)



async function loadEntrants() {
	const { data, error } = await useGo('/admin/division/' + props.division.id + '/entrants').json()
	if(error.value) {
		loadingError.value = error.value
		entrants.value = null
	}
	else {

		entrants.value = data.value
		for(let e in entrants.value) {
			entrants.value[e].used = false
		}

		let m = 1;

		while(m < +entrants.value.length) {
			m *= 2
		}

		const s = new Array(m)
		for(let i = 0; i < m; i++)
			s[i] = -1

		SLOTS.value = s

	}
	loadedEntrants.value = true
	setupScrollHandler()
}

onMounted(() => {
	loadEntrants()
})


function selectEntrant(index) {

	if(SELECTED.value == index) {
		SELECTED.value = null
	}
	else {
		SELECTED.value = index
	}

}


function handlePlaced() {

	entrants.value[SELECTED.value].used = true
	SLOTTED.value += 1
	SELECTED.value = null

}


function handleCleared(i) {

	entrants.value[i].used = false
	SLOTTED.value -= 1

}


function getOpponentMarkup(index) {

	if(index == null || +index < 0) return '<p class="issue">Unidentified player</p>'

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


let esCard, esOffset, isFixed
let mainHeader, adminHeader

async function setupScrollHandler() {

	await nextTick()

	esCard = document.getElementById('entrants-scroll-card')
	mainHeader = document.getElementById('header')
	adminHeader = document.getElementById('admin-header')

	esOffset = mainHeader.clientHeight + adminHeader.clientHeight
	isFixed = false

	let ticking = false

	document.addEventListener('scroll', () => {

		if(!ticking) {
			window.requestAnimationFrame(() => {
				positionScrollCard()
				ticking = false
			})
			ticking = true
		}

	})

}


function positionScrollCard() {

	if(window.scrollY > esOffset) {
		if(!isFixed) {
			esCard.style.width = (+esCard.clientWidth + 2) + 'px'
			lockEntrantsCard.value = true
			isFixed = true
		}
	}
	else {
		if(isFixed) {
			lockEntrantsCard.value = false
			esCard.style.width = ''
			isFixed = false
		}
	}

}


async function confirmMatchups() {

	ferror.value = null

	loading.value = true

	const l = SLOTS.value.length / 2
	let matchups = new Array(l)
	let e1, e2

	for(let m = 0; m < l; m++) {

		e1 = SLOTS.value[m * 2]
		e2 = SLOTS.value[(m * 2) + 1]

		if(e1 >= 0) e1 = entrants.value[e1].id
		else e1 = 0

		if(e2 >= 0) e2 = entrants.value[e2].id
		else e2 = 0

		matchups[m] = {
			entrant1: e1,
			entrant2: e2
		}

	}

	const { data, error } = await useGo('/admin/division/' + props.division.id + '/matches/new', {
		body: JSON.stringify(matchups)
	}).post()

	if(!error.value) {
		emit('success')
	}
	else {
		ferror.value = error.value
	}

	loading.value = false

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
		<section class="entrants-listout">
			<div :class="{card: true, 'lock-card': lockEntrantsCard}" id="entrants-scroll-card">
				<article class="entrant-summary">
					<h6>Entrants <span class="count">{{ entrants.length }}</span></h6>
				</article>
				<article class="entrant-list">
					<ol class="the-entrants">
						<li v-for="(entrant,e) in entrants" :key="e" :class="{'the-entrant': true, 'is-moving': SELECTED == e, 'is-scheduled': entrant.used}" @click="selectEntrant(e)">
							<p v-if="entrant.player1"><span v-if="+entrant.seed > 0" class="seed">{{ entrant.seed }}</span> {{ store.getPlayerName(entrant.player1) }}</p>
							<p v-if="entrant.player2"><span v-if="+entrant.seed > 0" class="seed">{{ entrant.seed }}</span> {{ store.getPlayerName(entrant.player2) }}</p>
							<img v-if="SELECTED == e" class="indicator" src="@/assets/images/radix-ui-arrow-right.svg" />
						</li>
					</ol>
				</article>
			</div>
		</section>
		<section class="matches-listout">
			<h5>Opening Matchups</h5>
			<Matchups :entrants="entrants" :slots="SLOTS" :selected="SELECTED" @place="handlePlaced" @clear="handleCleared" />
		</section>
		<section class="matches-confirmation">
			<div class="card">
				<article class="matches-summary">
					<h6>Scheduled <span class="count">{{ SLOTTED }} / {{ entrants.length }}</span></h6>
					<fieldset :class="{disabled: SLOTTED < entrants.length}">
						<button @click.prevent="confirmMatchups" class="btn">Confirm Matchups</button>
					</fieldset>
					<p v-if="ferror" class="error-message">{{ ferror }}</p>
				</article>
			</div>
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

	.the-entrants
		margin: 0 -0.5rem 0 0
		padding: 0 0.5rem 0 0
		list-style: none outside
		overflow: auto
		max-height: 80vh

		.the-entrant
			padding: 0.5rem 0.75rem
			position: relative
			border: 1px solid $border
			border-radius: calc(0.25rem + 4px)
			cursor: pointer
			background: $background
			transition: border 0.4s ease
			margin-top: 1rem

			&:hover
				border-color: $text

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
				border: 1px dashed $text
				background: $theme

			&.is-scheduled
				display: none

	.lock-card
		position: fixed
		box-sizing: border-box
		top: 1rem

.matches-summary
	fieldset
		transition: opacity 0.4s ease

		&.disabled
			opacity: 0.3
			pointer-events: none
</style>