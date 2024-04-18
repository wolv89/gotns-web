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
<style lang="sass">
.matches
	display: flex
	margin: 0 -2.5rem

	.round
		position: relative
		padding: 1rem 0
		box-sizing: border-box
		flex-basis: 25%
		overflow: clip
		display: flex
		flex-direction: column

		&-of-1
			.match-slot
				flex-basis: 100%

		&-of-2
			.match-slot
				flex-basis: 50%

		&-of-4
			.match-slot
				flex-basis: 25%

		&-of-8
			.match-slot
				flex-basis: 12.5%

		&-of-16
			.match-slot
				flex-basis: 6.25%

		&-of-32
			.match-slot
				flex-basis: 3.125%

		&-of-64
			.match-slot
				flex-basis: 1.5625%

		&-of-128
			.match-slot
				flex-basis: 0.78125%

		&:first-child
			.match
				&:before
					display: none

		&:last-child
			.match
				&:after,&-slot:after
					display: none

	.match-slot
		display: flex
		align-items: center
		padding: 1rem 2.5rem
		position: relative
		box-sizing: border-box

		&:after
			content: ''
			width: 1px
			height: 50%
			position: absolute
			right: 0
			background: $text

		&:nth-child(odd):after
			top: 50%

		&:nth-child(even):after
			bottom: 50%

	.match
		border: 1px solid #4a4a4a
		border-radius: 0.2rem
		background: #fff
		position: relative
		flex-basis: 100%

		&:before,&:after
			content: ''
			position: absolute
			top: 50%
			height: 1px
			width: 100%
			background: $text

		&:before
			right: 100%

		&:after
			left: 100%

		&-header
			display: flex
			justify-content: space-between
			align-items: center
			gap: 1rem
			padding: 0.5rem 0.75rem
			background: $text
			color: $background

		&-round
			+slm(0.8rem, 1rem, 0)

		&-status
			+slm(0.6rem, 0.9rem, 0)

		&-body
			padding: 0.75rem
			display: flex
			justify-content: space-between
			align-items: center
			gap: 0.5rem

</style>