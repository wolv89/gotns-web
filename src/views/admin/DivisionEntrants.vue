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

const loadedEvent = ref(false)
const loadedDivision = ref(false)
const division = ref(null)

const loading = ref(false)
const someError = ref('')
const ferror = ref('')

const entered = ref([])


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
			<section class="de-entrants">
			</section>
		</div>
	</AdminSlot>
</template>
<style lang="sass">
.division-entrants
	display: flex
	gap: 1rem
	justify-content: space-between

	.de-players
		flex-basis: 35%

	.de-entrants
		flex-basis: 65%
</style>