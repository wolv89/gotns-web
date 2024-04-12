<script setup>

import { ref, onMounted, computed } from 'vue'

const props = defineProps(['entrantcount'])

const slots = ref(0)

onMounted(() => {

	let m = 1;

	while(m < +props.entrantcount) {
		m *= 2
	}

	slots.value = m

})

const matchups = computed(() => {
	return slots.value / 2
})

</script>
<template>
	<div v-if="entrantcount > 1" class="matchups">
		<article v-for="m in matchups" class="match">
			{{ m }}
		</article>
	</div>
	<p v-else>Need at least two entrants for this to work.</p>
</template>
<style lang="sass">

</style>
