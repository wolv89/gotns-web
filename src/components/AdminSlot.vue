<script setup>

import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store.js'

const router = useRouter()

onMounted(() => {
	if(!store.user)
		router.replace({path: '/user'})
})

const props = defineProps(['name', 'desktop', 'steps', 'activestep'])

function stepTitle(completed, active) {

	if(completed) {
		return 'Step has been completed'
	}

	if(active) {
		return 'Current active step'
	}

	return 'Step to be completed'

}

</script>
<template>
	<div :class="{wrapper: true, 'wrap-max-lrg': true, 'desktop-only': props.desktop}">
		<div id="admin-header">
			<h2 class="admin-title"><img src="@/assets/images/radix-ui-double-right.svg" /> {{ props.name }}</h2>
			<div v-if="props.steps" class="step-list">
				<ol class="step-list-container">
					<li v-for="(step, s) in props.steps" :key="s" :class="{step: true, 'is-complete': step.complete, 'is-active': props.activestep == s}" :title="stepTitle(step.complete, props.activestep == s)">
						<span :class="{'step-status': true, 'is-completed': step.complete}">
							<img src="@/assets/images/radix-ui-status.svg" />
						</span>
						<span class="step-name">{{ step.name }}</span>
					</li>
				</ol>
			</div>
		</div>
		<slot/>
	</div>
	<div v-if="props.desktop" class="wrapper wrap-max-mid desktop-only-notice">
		<h2 class="admin-title">{{ props.name }}</h2>
		<p class="soft-message"><strong>Sorry!</strong></p>
		<p class="soft-message">This interface is too complicated for smaller screens (for now).</p>
		<p class="soft-message">Please use a larger device.</p>
	</div>
</template>
<style lang="sass">
.step-list
	background: $hover
	border-radius: calc(0.5rem + 4px)
	overflow: hidden
	margin-bottom: 1rem

	&-container
		display: flex
		list-style: none outside
		margin: 0 !important
		padding: 0

	.step
		padding: 0.5rem 1rem
		text-align: center
		font-weight: bold
		flex-basis: 50%
		position: relative
		overflow: clip

		&:before
			content: ''
			z-index: 5
			width: 2.5rem
			height: 2.5rem
			transform: rotate(45deg)
			top: 0
			left: -1.25rem
			position: absolute

		span
			display: inline-block
			padding: 0 0.25rem
			opacity: 0.32
			position: relative
			z-index: 10

			&.step-status
				img
					width: 1rem
					height: 1rem
					position: relative
					top: 0.1rem

		&.is-complete
			background: $half

			span
				color: $background
				opacity: 1

				img
					filter: invert(81%) sepia(97%) saturate(390%) hue-rotate(8deg) brightness(87%) contrast(92%)

			+ .step
				&:before
					background: $half

		&.is-active
			background: $theme

			span
				opacity: 1

			+ .step
				&:before
					background: $theme

#admin-header
	padding-bottom: 1rem

	> *:last-child
		margin-bottom: 0

.desktop-only
	+untilLrg
		display: none
	&-notice
		+atLrg
			display: none
</style>