<script setup>

import { ref } from 'vue'
import { useGo } from '@/usego'
import { useRouter } from 'vue-router'

import { store } from '@/store.js'

import AdminSlot from '@/components/AdminSlot.vue'
import ButtonLoader from '@/components/ButtonLoader.vue'

const router = useRouter()

const loading = ref(false)
const ferror = ref('')

const eventname = ref("")
const eventdesc = ref("")
const eventstate = ref(false)

async function editEvent() {

	ferror.value = ''

	if(!eventname.value) {
		ferror.value = 'Event name is required'
		return
	}

	loading.value = true

	const submission = {
		name: eventname.value,
		desc: eventdesc.value,
		state: eventstate.value
	}

	const { data, error } = await useGo('/admin/event/' + store.event.id + '/edit', {
		body: JSON.stringify(submission)
	}).post().json()

	if(!error.value) {
		const r = data.value
		if(r.result) {
			// router.push({path: '/' + r.return, query: {created: true}})
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

</script>
<template>
	<div v-if="!store.event" class="page-error">
		<h4>Sorry, a problem occurred.</h4>
		<p>Unable to load parent event</p>
	</div>
	<AdminSlot v-else :name="store.event.name + '// Edit Event'">
		<div class="instructed">
			<div class="instructed-instructions">
				<h4>Edit this event</h4>
				<h6>Event Name</h6>
				<p>?? ...</p>
				<p>This is required. Suggest using a clear/distinct name such as "Club Championships 2024". This will automatically create a URL-friendly path, based on the name, e.g:</p>
				<pre>domain.com/club-championships-2024/</pre>
				<h6>Event Description</h6>
				<p>This is optional. General description/details for the event that will be shown on the event page. Accepts HTML for formatting.</p>
				<h6>Event Status</h6>
				<p>Publish this event for everyone to see? Suggest setting this to 'no' until all divisions and matches and have been configured in later steps.</p>
			</div>
			<div class="instructed-actions">
				<article class="card">
					<fieldset>
						<input type="text" placeholder="Event Name" name="eventname" v-model="eventname" />
					</fieldset>
					<fieldset>
						<textarea class="large-content" placeholder="Description (Optional)" name="eventdesc" v-model="eventdesc" />
					</fieldset>
					<fieldset>
						<label><input type="checkbox" v-model="eventstate" /> Publish event</label>
					</fieldset>
					<fieldset>
						<button v-if="!loading" class="btn" @click.prevent="editEvent">Update Event</button>
						<ButtonLoader v-else />
					</fieldset>
					<p class="error-message" v-if="ferror">{{ ferror }}</p>
				</article>
			</div>
		</div>
	</AdminSlot>
</template>