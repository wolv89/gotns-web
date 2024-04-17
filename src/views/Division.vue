<script setup>

import { ref, onMounted } from 'vue'
import { useGo } from '@/usego'
import { useRoute } from 'vue-router'

import { store } from '@/store.js'

const route = useRoute()

const division = ref(null)
const content = ref(null)
const someError = ref(null)



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
			loadMatches()
		}
	}
}


async function loadMatches() {

	const { data, error } = await useGo('/division/' + division.value.id + '/view')

	if(error.value) {
		someError.value = error.value
		content.value = null
	}
	else {
		content.value = data.value
	}

}

onMounted(() => {
	if(!store.event) {
		loadEvent()
	}
	else {
		loadDivision()
	}
})

</script>
<template>
	<div class="wrapper wrap-max-lrg">
		<h2>Division</h2>
		<div v-if="content" v-html="content"></div>
	</div>
</template>