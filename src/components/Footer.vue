<template>
	<footer class="footer">
		<div class="wrapper">
			<p>Made with <img src="@/assets/images/radix-ui-heart.svg" /> by <a href="https://blewb.com.au" target="_blank">Blewb</a></p>
		</div>
	</footer>
</template>
<style lang="sass">
.footer
	padding: 1rem 0

	p
		+slm(0.7rem, 1rem, 0)
		text-align: center

		img
			width: 1.2em
			height: 1.2em
			vertical-align: middle
			filter: invert(16%) sepia(71%) saturate(4499%) hue-rotate(351deg) brightness(105%) contrast(88%)

		a
			color: #3FA9F5

			&:hover
				text-decoration: underline

</style>