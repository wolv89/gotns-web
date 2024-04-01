<script setup>

import { ref, onMounted } from 'vue'
import { useGo } from '@/usego'
import { useRoute, useRouter } from 'vue-router'

import AdminSlot from '@/components/AdminSlot.vue'
import ButtonLoader from '@/components/ButtonLoader.vue'

import { store } from '@/store.js'

const router = useRouter()
const route = useRoute()

const loadedEvent = ref(false)
const loadedDivision = ref(false)
const division = ref(null)

const loading = ref(false)
const someError = ref('')
const ferror = ref('')

const MODE = ref(-1)

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


onMounted(() => {
	loadEvent()
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
	<AdminSlot v-else :name="store.event.name + ' #' + division.name + ' // Init Division'">
		<div class="init-steps">
			<section v-if="MODE < 0" class="step">
				<h3>Step 1: Division type</h3>
				<ul class="xl-tabs">
					<li>
						<label @click.prevent="MODE = 0" class="card">
							<div class="xl-icons">
								<img src="@/assets/images/radix-ui-person.svg" />
							</div>
							<p>Singles</p>
						</label>
					</li>
					<li>
						<label @click.prevent="MODE = 1" class="card">
							<div class="xl-icons more-than-one">
								<img src="@/assets/images/radix-ui-person.svg" />
								<img src="@/assets/images/radix-ui-person.svg" />
							</div>
							<p>Doubles</p>
						</label>
					</li>
				</ul>
			</section>
		</div>
	</AdminSlot>
</template>
<style lang="sass">
.xl-tabs
	display: flex
	gap: 1.5rem
	padding: 1.5rem 0
	margin: 0 !important
	list-style: none outside

	li
		flex-basis: 50%
		max-width: 16rem

	label
		display: block
		cursor: pointer
		transition: background 0.4s ease

		&:hover
			background: $hover

	.xl-icons
		display: flex
		height: 8rem
		justify-content: center
		gap: 1.5rem
		align-items: center

		img
			width: 6.5rem
			height: 6.5rem

		&.more-than-one
			img
				width: 5rem
				height: 5rem

	p
		font-weight: bold
		text-align: center
</style>