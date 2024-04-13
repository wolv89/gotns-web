<script setup>

import { ref, inject } from 'vue'
const emit = defineEmits(['place', 'clear'])

const getOpponentMarkup = inject('getOpponentMarkup')

const props = defineProps(['slot', 'oppo', 'selected'])

const hovering = ref(false)

function mEnter() {

	if(props.oppo >= 0) return
	if(props.selected == null || props.selected < 0) return
	hovering.value = true

}

function mLeave() {

	hovering.value = false
	
}

function mPlace() {

	if(props.oppo >= 0) return
	if(props.selected == null || props.selected < 0) return

	hovering.value = false
	emit('place')

}

function mClear() {

	emit('clear')

}

</script>
<template>
	<div :class="{opponent: true, 'is-hovering': hovering}" @mouseenter="mEnter" @mouseleave="mLeave" @click="mPlace">
		<div v-if="oppo >= 0" v-html="getOpponentMarkup(oppo)"></div>
		<div v-else-if="selected >= 0 && hovering" v-html="getOpponentMarkup(selected)"></div>
		<p v-else class="bye">Bye</p>
		<img v-if="oppo >= 0" class="clear" src="@/assets/images/radix-ui-cancel.svg" @click="mClear" />
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
	position: relative

	&.is-hovering
		border: 1px solid $theme
		background: $theme
		color: $text
		cursor: pointer

	.clear
		position: absolute
		top: 50%
		width: 1.5rem
		height: 1.5rem
		right: 0.75rem
		transform: translateY(-0.75rem)
		filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%)
		opacity: .32
		cursor: pointer
		transition: opacity 0.4s ease

		&:hover
			opacity: .84

.bye
	color: #646464
	font-style: italic

</style>