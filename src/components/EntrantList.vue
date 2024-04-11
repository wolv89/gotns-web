<script setup>

const props = defineProps(['entrants', 'error'])

</script>
<template>
	<div class="entrants-supercard card">
		<article class="entrant-summary">
			<h6>Entrants <span class="count">{{ entrants.length }}</span></h6>
			<fieldset v-if="entrants.length > 1">
				<button class="btn" @click.prevent="$emit('confirm')">Confirm Entries</button>
			</fieldset>
			<p v-if="props.error" v-html="props.error"></p>
		</article>
		<article class="entrant-list">
			<ol v-if="entrants.length" class="the-entrants">
				<li v-for="(entrant,e) in entrants" :key="e" class="the-entrant">
					<img @click="$emit('remove',e)" class="cancel" src="@/assets/images/radix-ui-cancel.svg" />
					<p v-if="entrant.player1"><span v-if="+entrant.seed > 0" class="seed">{{ entrant.seed }}</span> {{ entrant.player1.firstname }} {{ entrant.player1.lastname }}</p>
					<p v-if="entrant.player2"><span v-if="+entrant.seed > 0" class="seed">{{ entrant.seed }}</span> {{ entrant.player2.firstname }} {{ entrant.player2.lastname }}</p>
				</li>
			</ol>
			<ol v-else class="empty-list">
				<li class="soft-message">No entrants have been added to this division yet!</li>
			</ol>
		</article>
	</div>
</template>
<style lang="sass">
.entrants-supercard
	h6
		margin-bottom: 0.2rem
		position: relative

	.count
		position: absolute
		top: 0.3rem
		right: 0
		opacity: 0.32
		+slm(0.8em, 1em, 0)

	.entrant-summary
		padding-bottom: 1rem

	.the-entrants
		margin: 0
		padding: 0
		list-style: none outside
		overflow: auto
		max-height: 50vh

		.the-entrant
			padding: 0.5rem 0.75rem
			position: relative
			border: 1px solid $border
			border-radius: calc(0.25rem + 4px)

			+ .the-entrant
				margin-top: 1rem

			p
				margin: 0
				padding: 0.25rem 0

			.seed
				font-weight: bold
				opacity: 0.32

			.cancel
				right: 0.5rem
				opacity: 0.2

				&:hover
					opacity: 0.8

</style>