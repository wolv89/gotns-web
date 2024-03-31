<script setup>

import { ref, onMounted } from 'vue'
import { useGo } from '@/usego'
import { store } from '@/store.js'

const loaded = ref(false)
const events = ref(null)

async function loadEvents() {
	const { data, error } = await useGo('/events').json()
	if(!error.value) {
		events.value = data.value
	}
	loaded.value = true
}

onMounted(() => { loadEvents() })

</script>
<template>
	<div class="wrapper wrap-max-mid">

		<section v-if="loaded">
			<ol v-if="events" class="card-links">
				<li v-for="event in events" :class="{'card': true, 'has-link': true, 'is-draft': !event.active}" :key="event.id">
					<RouterLink :to="`/${event.path}/`" class="card-link">
						<h5 class="name">{{ event.name }}</h5>
						<div class="status">{{ event.active ? 'Active' : 'Draft' }}</div>
						<span class="icon">
							<img src="@/assets/images/radix-ui-right.svg" />
						</span>
					</RouterLink>
				</li>
			</ol>
			<p v-else>No active events found.</p>
			<div v-if="store.user" class="card has-action">
				<RouterLink to="/event/new/" class="card-action">
					<h5>New Event <img src="@/assets/images/radix-ui-plus.svg" /></h5>
				</RouterLink>
			</div>
		</section>
		<ol v-else class="shadow-list">
			<li v-for="i in 3" class="shadow-card">&nbsp;</li>
		</ol>

	</div>
</template>