<script setup>

import { ref } from 'vue'
import { useGo } from '@/usego'
import { useSessionStorage } from '@vueuse/core'

const username = ref("")
const password = ref("")

async function login() {
	const auth = btoa(username.value + ":" + password.value)
	const { data, error, statusCode } = await useGo('/login', {
		headers: {
			Authorization: "Basic " + auth
		}
	})
	if(!error.value) {
		useSessionStorage("goken", data.value)
	}
	else {
		console.log(error.value)
	}
}

</script>
<template>
	<div class="panel">
		<form class="login">
			<fieldset>
				<input type="text" placeholder="Username" v-model="username" />
			</fieldset>
			<fieldset>
				<input type="password" placeholder="Password" v-model="password" />
			</fieldset>
			<fieldset>
				<button class="btn" @click.prevent="login">Login</button>
			</fieldset>
		</form>
	</div>
</template>
<style lang="sass">
.panel
	margin: 5rem auto
	max-width: 500px
	border: 1px solid #dfdfdf
	border-radius: 0.25rem
	padding: 1rem
</style>