<script setup>

import { ref, onMounted, computed } from 'vue'

import MatchupOpponent from '@/components/MatchupOpponent.vue'

const props = defineProps(['entrants', 'selected'])
const emit = defineEmits(['place'])

const slots = ref([])

onMounted(() => {

	let m = 1;

	while(m < +props.entrants.length) {
		m *= 2
	}

	const s = new Array(m)
	for(let i = 0; i < m; i++)
		s[i] = -1

	slots.value = s

})

const matchups = computed(() => {
	return slots.value.length / 2
})


function placeOpponent(slot) {

	console.log(slot + ": " + props.selected)
	slots.value[slot] = props.selected
	emit('place')

}


// m is 1-indexed, hence double offset
function slot1(m) {
	return (m * 2) - 2
}

function slot2(m) {
	return (m * 2) - 1
}


</script>
<template>
	<div v-if="entrants.length > 1" class="matchups">
		<article v-for="m in matchups" class="match card dark-card">
			<h6>Match {{ m }}</h6>
			<div class="match-opponents">
				<MatchupOpponent :slot="slot1(m)" :oppo="slots[slot1(m)]" @place="placeOpponent(slot1(m))" />
				<div class="oppo-divider">
					<span>vs</span>
				</div>
				<MatchupOpponent :slot="slot2(m)" :oppo="slots[slot2(m)]" @place="placeOpponent(slot2(m))" />
			</div>
		</article>
	</div>
	<p v-else>Need at least two entrants for this to work.</p>
</template>
<style lang="sass">
.matchups
	.match
		padding-top: 1rem

		+ .match
			margin-top: 1rem

		h6
			margin-bottom: 0.75rem

		&-opponents
			+clearly

		.opponent
			&:first-child
				margin-bottom: 0.75rem

		.oppo-divider
			box-sizing: border-box
			float: left
			padding: 0.25rem
			width: 3rem

			span
				display: inline-block
				width: 2rem
				height: 2rem
				line-height: 1.75em
				border-radius: 100%
				text-align: center
				background: rgba(255,255,255,0.2)

</style>
