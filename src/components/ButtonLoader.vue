<template>
	<div class="btn-loader">
		<span class="blob blob-1"></span>
		<span class="blob blob-2"></span>
		<span class="blob blob-3"></span>
	</div>
</template>
<style lang="sass">
.btn-loader
	height: 1.75rem
	display: flex
	justify-content: center
	align-items: center
	gap: 1rem

	.blob
		width: 0.5rem
		height: 0.5rem
		border-radius: 0.25rem
		background: $text

		&-1
			animation: pulse .75s infinite

		&-2
			animation: pulse .75s infinite .25s

		&-3
			animation: pulse .75s infinite .5s

@keyframes pulse
	0%
		transform: scale(1)
	20%
		transform: scale(1)
	60%
		transform: scale(1.5)
		background: lighten($text, 25)
	80%
		transform: scale(1)
	100%
		transform: scale(1)
</style>