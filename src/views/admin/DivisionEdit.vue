<script setup>

import { ref, onMounted } from 'vue'
import { useGo } from '@/usego'
import { useRoute } from 'vue-router'

import AdminSlot from '@/components/AdminSlot.vue'

import Step1 from '@/views/admin/steps/DivisionEdit_1_Entrants.vue'
import Step2 from '@/views/admin/steps/DivisionEdit_2_Matches.vue'
import Step3 from '@/views/admin/steps/DivisionEdit_3_Review.vue'

import { store } from '@/store.js'

const route = useRoute()

const STEPS = ref([
	{ name: 'Entrants', complete: false },
	{ name: 'Matches', complete: false },
	{ name: 'Review', complete: false }
])
const STEP = ref(-1)

const loadedEvent = ref(false)
const loadedDivision = ref(false)

const division = ref(null)

const someError = ref('')



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
			getDivisionStatus()
		}
	}
	loadedDivision.value = true
}


async function getDivisionStatus() {
	STEP.value = -1
	const { data, error } = await useGo('/admin/division/' + division.value.id + '/status').json()
	if(error.value) {
		someError.value = error.value
	}
	else {
		if(!data.value.result) {
			someError.value = data.value.response
		}
		else {
			STEP.value = 0
			if(data.value.packet.entrants) {
				STEPS.value[0].complete = true
				STEP.value += 1
			}
			else {
				STEPS.value[0].complete = false
			}
			if(data.value.packet.matches) {
				STEPS.value[1].complete = true
				STEP.value += 1
			}
			else {
				STEPS.value[1].complete = false
			}
		}
	}
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
			for(let p in store.players) {
				const player = store.players[p]
				store.playermap.set(player.id, {...player})
			}
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
		<p>{{ someError }}</p>
	</div>
	<div v-else-if="STEP < 0" class="page-loader">
		<p>Getting division status...</p>
	</div>
	<AdminSlot v-else :name="division.name + ' #Edit Division'" :desktop="true" :steps="STEPS" :activestep="STEP">
		<Step1 v-if="STEP == 0" :division="division" @success="getDivisionStatus" />
		<Step2 v-else-if="STEP == 1" :division="division" @success="getDivisionStatus" />
		<Step3 v-else-if="STEP == 2" :division="division" @success="getDivisionStatus" />
	</AdminSlot>
</template>