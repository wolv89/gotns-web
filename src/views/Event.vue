<script setup>

import { ref, onMounted } from 'vue'
import { useGo } from '@/usego'
import { useRoute, useRouter } from 'vue-router'

import { store } from '@/store.js'

const route = useRoute()
const router = useRouter()

const loaded = ref(false)

async function loadEvent() {
	const { data, error } = await useGo('/event/' + $route.params.event).json()
}

onMounted(() => {
	if(route.query.created) {
		store.alert = "New event has been created!"
	}
	// loadEvent()
})

</script>
<template>
	<h1>Event</h1>
	<h3>{{ $route.params.event }}</h3>
</template>