<script setup>

import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { useGo } from '@/usego'
import { useRoute } from 'vue-router'

import { store } from '@/store.js'

const route = useRoute()

const division = ref(null)
const content = ref(null)
const someError = ref(null)

const pkg = ref(null)
const editing = ref(0)
const loadmsg = ref("Loading")
const errmsg = ref(null)



async function loadEvent() {
	const { data, error } = await useGo('/event/' + route.params.event).json()
	if(error.value) {
		someError.value = error.value
		store.event = null
	}
	else {
		if(!data.value.result) {
			someError.value = data.value.response
			store.event = null
		}
		else {
			store.event = data.value.packet
			loadDivision()
		}
	}
}


async function loadDivision() {
	const { data, error } = await useGo('/event/' + store.event.id + '/division/' + route.params.division).json()
	if(error.value) {
		someError.value = error.value
		division.value = null
	}
	else {
		if(!data.value.result) {
			someError.value = data.value.response
			division.value = null
		}
		else {
			division.value = data.value.packet
			loadMatches()
		}
	}
}


async function loadMatches() {

	const { data, error } = await useGo('/division/' + division.value.id + '/view')

	if(error.value) {
		content.value = null
	}
	else {
		content.value = data.value

		await nextTick()

		bindMatches()
	}

}


function bindMatches() {

	let matchesWrapper = document.getElementById("matches")
	if(!matchesWrapper) return

	let matchElements = matchesWrapper.getElementsByClassName("match")
	if(!matchElements) return

	for(let m = 0; m < matchElements.length; m++) {
		matchElements[m].addEventListener("click", (event) => {
			openEditor(event.currentTarget.getAttribute("id").replace("match-", ""))
		})
	}

}


async function openEditor(id) {

	editing.value = 1
	loadmsg.value = "Loading match"

	const { data, error } = await useGo('/admin/match/' + id).json()

	if(error.value) {
		errmsg.value = error.value
		pkg.value = null
		editing.value = 3
	}
	else {
		pkg.value = data.value
		editing.value = 2
	}

}


async function updateMatch() {

	editing.value = 1
	loadmsg.value = "Saving match"

	const submission = {
		...pkg.value.match
	}

	submission.status = +submission.status
	submission.winner = +submission.winner

	const { data, error } = await useGo('/admin/match/' + pkg.value.match.id + '/update', {
		body: JSON.stringify(submission)
	}).post().json()

	editing.value = 0
	pkg.value = null
	loadMatches()

}



function closeEditor() {

	pkg.value = null
	editing.value = 0

}


onMounted(() => {
	if(!store.event) {
		loadEvent()
	}
	else {
		loadDivision()
	}
})

watch(() => route.params.division, (newDiv, oldDiv) => {
	division.value = null
	loadDivision()
})


const e1name = computed(() => {

	if(!pkg.value) return ""
	if(!pkg.value.entrant1) return ""

	let name = pkg.value.entrant1.p1firstname + " " + pkg.value.entrant1.p1lastname

	if(pkg.value.entrant1.team) {
		name += " & " + pkg.value.entrant1.p2firstname + " " + pkg.value.entrant1.p2lastname
	}

	return name

})


const e2name = computed(() => {

	if(!pkg.value) return ""
	if(!pkg.value.entrant2) return ""

	let name = pkg.value.entrant2.p1firstname + " " + pkg.value.entrant2.p1lastname

	if(pkg.value.entrant2.team) {
		name += " & " + pkg.value.entrant2.p2firstname + " " + pkg.value.entrant2.p2lastname
	}

	return name

})


</script>
<template>
	<div class="wrapper wrap-max-lrg">
		<h2 v-if="division">{{ division.name }}</h2>
		<p><RouterLink class="edit-link" :to="route.fullPath + 'edit'">Edit division</RouterLink></p>
		<div :class="{templ: true, 'can-edit': store.user}" v-if="content" v-html="content"></div>
	</div>
	<section v-if="editing > 0" class="pop-editor">
		<div class="pop-content">
			<article v-if="editing == 1" class="pop-loader">
				<p>{{ loadmsg }}</p>
			</article>
			<article v-else-if="editing == 2" class="pop-struct">
				<div class="form pop-columns">
					<div class="pop-column">
						<h6>Edit Match</h6>
						<div class="entrants">
							<div class="entrant1">
								<p><span class="mini-title">Entrant 1</span>{{ e1name }}</p>
							</div>
							<div class="entrants-sep"><span>vs</span></div>
							<div class="entrant2">
								<p><span class="mini-title">Entrant 2</span>{{ e2name }}</p>
							</div>
						</div>
					</div>
					<div class="pop-column">
						<fieldset class="pop-field">
							<label class="pop-label">Status</label>
							<select v-model="pkg.match.status">
								<option value="0">Pending</option>
								<option value="1">Ready</option>
								<option value="2">Playing</option>
								<option value="3">Finished</option>
							</select>
						</fieldset>
						<fieldset class="pop-field">
							<label class="pop-label">Winner</label>
							<select v-model="pkg.match.winner">
								<option value="0">None</option>
								<option value="1">Entrant 1</option>
								<option value="2">Entrant 2</option>
							</select>
						</fieldset>
						<fieldset class="pop-field">
							<label class="pop-label">Score</label>
							<input type="text" class="text-input" v-model="pkg.match.score" />
						</fieldset>
						<fieldset class="pop-field">
							<label class="pop-label">Notes</label>
							<textarea class="text-input" v-model="pkg.match.notes"></textarea>
						</fieldset>
						<fieldset class="pop-field">
							<label class="pop-label">Schedule</label>
							<input type="text" class="text-input" v-model="pkg.match.start" />
						</fieldset>
					</div>
				</div>
			</article>
			<article v-else-if="editing == 3" class="pop-error">
				<p>{{ errmsg }}</p>
			</article>
		</div>
		<div class="pop-control">
			<ol class="pop-btns">
				<li><button @click.prevent="closeEditor" class="btn pop-cancel">Cancel</button></li>
				<li v-if="editing == 2"><button @click.prevent="updateMatch" class="btn pop-submit">Save</button></li>
			</ol>
		</div>
	</section>
</template>
<style lang="sass">
.templ
	&.can-edit
		.matches
			.match
				cursor: pointer

				&:hover
					border-color: $theme

					.match
						&-header,&-sep
							background: $theme

.pop-editor
	position: fixed
	top: 0
	left: 0
	width: 100vw
	height: 100vh
	overflow: auto
	z-index: 9999
	background: rgba(255,255,255,0.8)
	backdrop-filter: blur(5px)
	display: flex
	flex-flow: column
	justify-content: center
	align-items: center
	gap: 1rem

	.pop
		&-content
			box-sizing: border-box
			flex-basis: 55%
			padding: 2rem 1rem 0

			.entrants
				background: $hover
				padding: 1rem

				.mini-title
					display: block
					+slm(0.6rem, 0.8rem, 0)
					text-transform: uppercase
					padding: 0.25rem 0
					opacity: 0.3

				&-sep
					position: relative
					text-align: center
					padding: 0.25rem 0
					+slm(0.6rem, 0.8rem, 0)

					&:before,&:after
						content: ''
						position: absolute
						width: 40%
						height: 1px
						background: $border
						top: 50%

					&:before
						left: 0

					&:after
						right: 0

					span
						position: relative
						z-index: 10
						display: inline-block
						text-transform: uppercase

		&-columns
			display: flex
			justify-content: space-between
			gap: 1rem

			.pop-column
				flex-basis: 45%

		&-control
			flex-basis: 25%

		&-btns
			display: flex
			gap: 1rem
			justify-content: center
			list-style: none outside
			margin: 0
			padding: 0

			li
				padding: 0.5rem

			.btn
				padding-left: 1.5rem
				padding-right: 1.5rem

				&.pop-cancel
					background: $half

				&.pop-submit
					background: $theme

				&:hover
					background: $text

</style>