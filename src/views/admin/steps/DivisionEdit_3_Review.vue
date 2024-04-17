<script setup>

import { ref, onMounted } from 'vue'
import { useGo } from '@/usego'

import Toggler from '@/components/Toggler.vue'

const props = defineProps(['division'])
const emit = defineEmits(['success'])

const divState = ref(0)
const ferror = ref(null)

async function toggleState() {

	divState.value = -1
	ferror.value = null

	const submission = [
		{field: 'active', value: props.division.active ? '0' : '1'}
	]

	const { data, error } = await useGo('/admin/division/' + props.division.id + '/update', {
		body: JSON.stringify(submission)
	}).post()

	if(!error.value) {
		props.division.active = !props.division.active
	}
	else {
		ferror.value = error.value
	}

	divState.value = props.division.active ? 1 : 0

}


onMounted(() => {
	if(props.division.active) divState.value = 1
})


</script>
<template>
	<div class="division-review">
		<article class="card">
			<h6>Review Division</h6>
			<fieldset>
				<Toggler :state="divState" onphrase="Public" offphrase="Hidden" @catch="toggleState" />
			</fieldset>
			<fieldset>
				<p>// TODO -- Options to clear matches/entrants</p>
			</fieldset>
			<p v-if="ferror" class="error-message">{{ ferror }}</p>
		</article>
	</div>
</template>
<style lang="sass">
.division-review
	display: flex
	justify-content: space-around
	padding: 1.5rem 0

	.card
		max-width: 400px
</style>