<script setup>

const props = defineProps(['state', 'onphrase', 'offphrase'])
const emit = defineEmits(['catch'])

function clickToggle(toState) {

	if(+toState == +props.state) return
	emit('catch')

}

</script>
<template>
	<div :class="{'toggler': true, 'is-off': +props.state == 0, 'is-on': +props.state == 1, 'is-loading': +props.state < 0}">
		<div class="toggler-panel">
			<span class="off-phrase" @click.prevent="clickToggle(0)">{{ props.offphrase }}</span>
			<span class="on-phrase" @click.prevent="clickToggle(1)">{{ props.onphrase }}</span>
		</div>
		<span class="toggler-highlight">&nbsp;</span>
	</div>
</template>
<style lang="sass">
.toggler
	position: relative
	border: 1px solid $border
	padding: 0.25rem 0.5rem
	border-radius: 0.25rem
	min-width: 16rem

	&-panel
		position: relative
		z-index: 10
		display: flex
		justify-content: space-around
		transition: opacity 0.4s ease

		span
			flex-basis: 45%
			text-align: center
			padding: 0.5rem
			border-radius: 0.2rem
			font-size: 0.85rem
			transition: all 0.4s ease

	&.is-off
		.on-phrase
			&:hover
				background: $text
				color: $background
				cursor: pointer

	&.is-on
		.on-phrase
			color: $background

		.off-phrase
			&:hover
				background: $text
				color: $background
				cursor: pointer

		.toggler-highlight
			left: calc(50% + 0.25rem)
			background: $theme

	&.is-loading
		.toggler-panel
			opacity: 0.1
			pointer-events: none

		.toggler-highlight
			animation: toggl 1s linear infinite alternate

	&-highlight
		position: absolute
		z-index: 5
		background: $border
		width: calc(50% - 0.5rem)
		border-radius: 0.2rem
		height: calc(100% - 0.5rem)
		top: 0.25rem
		left: 0.25rem
		transition: all 0.4s ease

@keyframes toggl
	0%
		width: 10%
		background: $border
		left: 0.25rem

	50%
		width: 50%

	100%
		width: 10%
		background: $theme
		left: calc(90% - 0.5rem)
</style>