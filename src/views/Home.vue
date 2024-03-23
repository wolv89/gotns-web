<script setup>

import { ref } from 'vue'
import { useGo } from '@/usego'

const log = ref("")

async function testcall() {
	const { data } = await useGo('/get-word').text()
	log.value = data.value
}

</script>
<template>
	<h1>Home Route</h1>
	<p>Test</p>
	<button @click.prevent="testcall">KY!</button>
	<div v-html="log"></div>
</template>
<style lang="sass">
h1
	text-decoration: underline
	color: $theme

	+atBlend
		color: #fff
</style>