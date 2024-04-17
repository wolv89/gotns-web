<template>
	<div class="super-loader">
		<article class="the-loader">
			<div class="the-loader-icon">
				<img src="@/assets/images/hptc-ball.svg" />
			</div>
			<div class="the-loader-content">
				<slot/>
			</div>
		</article>
	</div>
</template>
<style lang="sass">
.super-loader
	background: rgba(255,255,255,0.9)
	position: fixed
	z-index: 999
	top: 0
	left: 0
	width: 100%
	height: 100%
	display: flex
	justify-content: center
	align-items: center

.the-loader
	padding: 1rem

	&-icon
		opacity: 0.4
		padding-bottom: 0.5rem

		img
			width: 6rem
			height: 6rem
			display: block
			margin: 0 auto
			animation: bounce 1s cubic-bezier(.4,0,.6,1) infinite

	&-content
		text-align: center
		max-width: 8rem
		margin: 0 auto

		p
			&:after
				content: ''
				animation: dotdot 2s linear infinite

@keyframes bounce
	50%
		transform: scale(0.7)
		opacity: 0.7

@keyframes dotdot
	0%
		content: '.'
	35%
		content: '..'
	50%
		content: '...'
</style>