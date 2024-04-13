<script setup>

import { ref, inject } from 'vue'

const opponent = inject('opponent')
const props = defineProps(['slot', 'oppo'])

const hovering = ref(false)

function mEnter() {

	if(props.oppo >= 0) return
	hovering.value = true

}

function mLeave() {

	hovering.value = false
	
}

</script>
<template>
	<div :class="{opponent: true, 'is-hovering': hovering}" @mouseenter="mEnter" @mouseleave="mLeave" @click="$emit('place')">
		<div v-if="oppo >= 0">{{ oppo }}</div>
		<div v-else-if="hovering && opponent" v-html="opponent"></div>
		<p v-else class="bye">Bye</p>
	</div>
</template>
<style lang="sass">
.opponent
	box-sizing: border-box
	padding: 0.5rem 0.75rem
	border: 1px dashed #323232
	border-radius: calc(0.125rem + 3px)
	width: calc(100% - 3rem)
	overflow: hidden

	&.is-hovering
		border: 1px solid $theme
		background: $theme
		color: $text
		cursor: pointer

.bye
	color: #646464
	font-style: italic

</style>