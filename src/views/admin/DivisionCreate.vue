<script setup>

import { ref, onMounted } from 'vue'
import { useGo } from '@/usego'
import { useRoute, useRouter } from 'vue-router'

import { store } from '@/store.js'

import AdminSlot from '@/components/AdminSlot.vue'
import ButtonLoader from '@/components/ButtonLoader.vue'

import DSIKnockout from '@/assets/images/division-structure-knockout.svg'
import DSIFreeform from '@/assets/images/division-structure-freeform.svg'
import RUIPerson from '@/assets/images/radix-ui-person.svg'

const router = useRouter()
const route = useRoute()

const loadedEvent = ref(false)
const loading = ref(false)
const someError = ref('')
const ferror = ref('')

const divStyleTabs = [
	{ name: 'Knockout', icon: DSIKnockout },
	{ name: 'Freeform', icon: DSIFreeform }
]

const divname = ref("")
const divstyle = ref(0)
const divstate = ref(false)
const divteams = ref(false)

async function createDivision() {

	ferror.value = ''

	if(!store.event) {
		ferror.value = 'Base event has not been loaded'
		return
	}

	if(!divname.value) {
		ferror.value = 'Division name is required'
		return
	}

	loading.value = true

	const submission = {
		name: divname.value,
		state: divstate.value,
		style: divstyle.value,
		teams: divteams.value
	}

	const { data, error } = await useGo('/admin/event/' + store.event.id + '/division/new', {
		body: JSON.stringify(submission)
	}).post().json()

	if(!error.value) {
		const r = data.value
		if(r.result) {
			router.push({path: '/' + store.event.path + '/' + r.return + '/entrants'})
		}
		else {
			ferror.value = r.response
		}
	}
	else {
		ferror.value = error.value
	}

	loading.value = false

}

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
		}
	}
	loadedEvent.value = true
}


onMounted(() => {
	loadEvent()
})

</script>
<template>
	<div v-if="!loadedEvent" class="page-loader">
		<p>Loading event</p>
	</div>
	<div v-else-if="!store.event" class="page-error">
		<h4>Sorry, a problem occurred.</h4>
		<p>Unable to load parent event</p>
	</div>
	<AdminSlot v-else name="#New Division">
		<div class="instructed">
			<div class="instructed-instructions">
				<h4>Create a new division</h4>
				<h6>Division Name</h6>
				<p>This is required. Suggest using a clear/distinct name such as "Women's Doubles". This will automatically create a URL-friendly path, based on the name, e.g:</p>
				<pre>domain.com/{{ store.event.path }}/womens-doubles</pre>
				<h6>Division Structure</h6>
				<p>Which format will this division:</p>
				<ol>
					<li><strong>Knockout</strong> - Standard knockout format for tennis tournaments where the winner of each match moves on while the loser is eliminated.</li>
					<li><strong>Freeform</strong> - Unstructured "structure" allowing for custom entry of matches and rounds, e.g. to create a round robin or other collection of matches.</li>
				</ol>
				<h6>Division Status</h6>
				<p>Publish this division for everyone to see? Suggest setting this to 'no' until all starting matches have been configured in the next steps.</p>
			</div>
			<div class="instructed-actions">
				<article class="card">
					<fieldset>
						<input type="text" placeholder="Division name" name="divname" v-model="divname" />
					</fieldset>
					<fieldset>
						<ol class="tab-selector">
							<li>
								<label @click.prevent="divteams = false" :class="{selected: !divteams}">
									<span class="tab-icon">
										<img :src="RUIPerson" />
									</span>
									<p>Singles</p>
								</label>
							</li>
							<li>
								<label @click.prevent="divteams = true" :class="{selected: divteams}">
									<span class="tab-icon dual-icon">
										<img :src="RUIPerson" />
										<img :src="RUIPerson" />
									</span>
									<p>Doubles</p>
								</label>
							</li>
						</ol>
						<input type="hidden" name="divteams" v-model="divteams" />
					</fieldset>
					<fieldset>
						<ol class="tab-selector">
							<li v-for="(tab,t) in divStyleTabs" :key="t">
								<label @click.prevent="divstyle = t" :class="{selected: t == divstyle}">
									<span class="tab-icon">
										<img :src="tab.icon" />
									</span>
									<p>{{ tab.name }}</p>
								</label>
							</li>
						</ol>
						<input type="hidden" name="divteams" v-model="divstyle" />
					</fieldset>
					<fieldset>
						<label><input type="checkbox" v-model="divstate" /> Publish division</label>
					</fieldset>
					<fieldset>
						<button v-if="!loading" class="btn" @click.prevent="createDivision">Create Division</button>
						<ButtonLoader v-else />
					</fieldset>
					<p class="error-message" v-if="ferror">{{ ferror }}</p>
				</article>
			</div>
		</div>
	</AdminSlot>
</template>
<style lang="sass">
.tab-selector
	list-style: none outside
	flex-wrap: wrap
	display: flex
	gap: 1.5rem
	padding: 0
	margin: 0 !important

	li
		flex-basis: 32%

	label
		display: block
		border: 1px solid $border
		border-radius: calc(0.5rem + 4px)
		padding: .75rem 1.25rem
		text-align: center
		cursor: pointer
		transition: background 0.4s ease

		&:hover
			background: $hover

		.tab-icon
			opacity: 0.25

			img
				min-width: 2.5rem
				min-height: 2.5rem

		&.selected
			background: $background
			border: 3px solid $text

			p
				font-weight: bold

			.tab-icon
				opacity: 1
</style>