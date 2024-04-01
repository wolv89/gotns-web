<script setup>

import { ref, onMounted } from 'vue'
import { useGo } from '@/usego'
import { useRoute } from 'vue-router'

import { store } from '@/store.js'

const route = useRoute()

const someError = ref(null)
const loadedEvent = ref(false)
const loadedDivisions = ref(false)

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
			loadDivisions()
		}
	}
	loadedEvent.value = true
}


async function loadDivisions() {
	const { data, error } = await useGo('/divisions/' + store.event.id).json()
	if(error.value) {
		someError.value = error.value
		store.divisions = null
	}
	else {
		if(data.value) {
			store.divisions = data.value
		}
		else {
			store.divisions = null
		}
	}
	loadedDivisions.value = true
}



onMounted(() => {
	if(route.query.created) {
		store.alert = "New event has been created!"
	}
	loadEvent()
})

</script>
<template>
	<div class="wrapper wrap-max-lrg">
		<div v-if="someError" class="page-error">
			<h4>Sorry, a problem occurred.</h4>
			<p>{{ someError }}</p>
		</div>
		<div v-else class="master-layout">
			<section v-if="loadedDivisions" class="ml-handle">
				<ol v-if="store.divisions" class="card-links">
					<li v-for="division in store.divisions" :class="{'card': true, 'has-link': true, 'is-draft': !division.active}" :key="division.id">
						<RouterLink :to="`/${store.event.path}/${division.path}/`" class="card-link">
							<h5 class="name">{{ division.name }}</h5>
							<div class="status">{{ division.active ? 'Active' : 'Draft' }}</div>
							<span class="icon">
								<img src="@/assets/images/radix-ui-right.svg" />
							</span>
						</RouterLink>
					</li>
				</ol>
				<div v-else class="card blank-space">
					<p>No active divisions found.</p>
				</div>
				<div v-if="store.user" class="card has-action">
					<RouterLink :to="`/${store.event.path}/division/new/`" class="card-action">
						<h5>New Division <img src="@/assets/images/radix-ui-plus.svg" /></h5>
					</RouterLink>
				</div>
			</section>
			<section v-else class="ml-handle">
				<ol class="shadow-list">
					<li v-for="i in 5" class="shadow-card">&nbsp;</li>
				</ol>
			</section>
			<section v-if="loadedEvent && store.event != null" class="ml-title">
				<h2>{{ store.event.name }}</h2>
			</section>
			<section v-else class="ml-title">
				<div class="shadow-card" style="height: 2.5rem">&nbsp;</div>
			</section>
			<section v-if="loadedEvent && store.event != null" class="ml-content">
				<div v-html="store.event.description"></div>
			</section>
			<section v-else class="ml-content">
				<div class="shadow-card" style="height: 15rem">&nbsp;</div>
			</section>
		</div>
	</div>
</template>