<script setup>

import { ref, computed } from 'vue'
import { store } from '@/store.js'

const showPopNav = ref(false)

const userBtn = computed(() => {
	if(!store.user) return 'Login'
	return store.user.username
})

</script>
<template>
	<header class="header" id="header">
		<div class="wrapper">
			<div class="header-slice hs-logo">
				<h1 class="logo">
					<RouterLink to="/">
						<img src="@/assets/images/hptc-logo.svg" width="75" height="75" />
					</RouterLink>
				</h1>
			</div>
			<div class="header-slice hs-nav">
				<nav class="header-nav" v-if="store.event">
					<button :class="{'icon-btn': true, 'icb-larger': true, 'icb-flip': showPopNav}" @click.prevent="showPopNav = !showPopNav">
						<span class="icb-icon">
							<img src="@/assets/images/radix-ui-chev-down.svg" />
						</span>
						<span class="icb-text">{{ store.event.name }}</span>
					</button>
				</nav>
				<nav class="pop-nav" v-if="showPopNav">
					<ol class="pop-nav-links">
						<li><RouterLink @click="showPopNav = false" :to="'/' + store.event.path">Event Home</RouterLink></li>
						<li v-for="division in store.divisions" :class="{'is-draft': !division.active}" :key="division.id">
							<RouterLink @click="showPopNav = false" :to="`/${store.event.path}/${division.path}/`">{{ division.name }}<span v-if="!division.active" class="status">Draft</span></RouterLink>
						</li>
					</ol>
				</nav>
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
		<div v-if="store.alert" class="wrapper alert">
			<p v-html="store.alert"></p>
			<span class="icon" @click="store.alert = null">x</span>
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
			position: relative

		.hs-user
			text-align: right

			.icb-text
				text-transform: capitalize

	.alert
		padding: 1rem
		display: flex
		justify-content: center
		align-items: center
		gap: 0.5rem

		p
			border: .25rem solid $theme
			padding: .25rem 0.5rem

		.icon
			background: $theme
			width: 1.5rem
			height: 1.5rem
			border-radius: 1rem
			color: $background
			text-align: center
			font-weight: bold
			+slm(1.25rem, 1.25rem, 0)
			cursor: pointer
			transition: background 0.4s ease

			&:hover
				background: $text

	&-nav
		padding: 0.5rem

.logo
	margin: 0

	img
		transition: transform 0.4s ease

	a
		&:hover
			img
				transform: scale(1.2)

.pop-nav
	position: absolute
	top: 100%
	left: calc(50% - 6rem)
	min-width: 18rem
	z-index: 150
	border-radius: calc(0.5rem + 4px)
	background: $background
	border: 1px solid $text
	box-shadow: 0.3rem 0.6rem 0.1rem rgba(0,0,0,0.2)
	overflow: clip

	ol
		list-style: none outside
		margin: 0
		padding: 0

	a
		display: block
		padding: 1rem
		text-align: left
		transition: all 0.4s ease

		&:hover
			background: $compliment
			color: $background

		&.router-link-exact-active
			font-weight: bold

		.status
			display: inline-block
			text-transform: uppercase
			font-size: 0.6em
			padding: 0 0.5rem
			color: #bbb

</style>