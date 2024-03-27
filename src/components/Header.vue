<script setup>

import { computed } from 'vue'
import { store } from '@/store.js'

const userBtn = computed(() => {
	if(!store.user) return 'Login'
	return store.user.username
})

</script>
<template>
	<header class="header">
		<div class="wrapper">
			<div class="header-slice hs-logo">
				<h1 class="logo">
					<RouterLink to="/">
						<img src="@/assets/images/hptc-logo.svg" width="75" height="75" />
					</RouterLink>
				</h1>
			</div>
			<div class="header-slice hs-nav">
				<p>Nav...</p>
			</div>
			<div class="header-slice hs-user">
				<RouterLink to="/user" class="icon-btn">
					<span class="icb-icon">
						<img src="@/assets/images/radix-ui-person.svg" />
					</span>
					<span class="icb-text">{{ userBtn }}</span>
				</RouterLink>
			</div>
		</div>
	</header>
</template>
<style lang="sass">
.header
	padding: 1rem 0

	.wrapper
		display: flex
		justify-content: space-between
		gap: 1rem

		.header-slice
			flex-basis: 16%

		.hs-nav
			flex-basis: 60%
			text-align: center

		.hs-user
			text-align: right

			.icb-text
				text-transform: capitalize

.logo
	margin: 0

	img
		transition: transform 0.4s ease

	a
		&:hover
			img
				transform: scale(1.2)
</style>