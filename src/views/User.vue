<script setup>

import { ref } from 'vue'
import { useGo } from '@/usego'

import { store } from '@/store.js'

import ButtonLoader from '@/components/ButtonLoader.vue'

const loading = ref(false)
const username = ref('')
const password = ref('')
const ferror = ref('')

async function login() {

	ferror.value = ''

	if(!username.value || !password.value) {
		ferror.value = 'Please enter username and password'
		return
	}

	loading.value = true

	const auth = btoa(username.value + ":" + password.value)
	const { data, error } = await useGo('/login', {
		headers: {
			Authorization: "Basic " + auth
		}
	})

	if(!error.value) {
		localStorage.setItem("goken", data.value)
		localStorage.setItem("goname", username.value)
		store.login(username.value, data.value)
	}
	else {
		ferror.value = error.value
	}

	loading.value = false

}

async function logout() {

}

</script>
<template>
	<div class="wrapper wrap-max-sml">
		<article v-if="!store.user" class="card">
			<h3>Login</h3>
			<fieldset>
				<input type="text" placeholder="Username" name="username" v-model="username" />
			</fieldset>
			<fieldset>
				<input type="password" placeholder="Password" name="password" v-model="password" />
			</fieldset>
			<fieldset>
				<button v-if="!loading" class="btn" @click.prevent="login">Login</button>
				<ButtonLoader v-else />
			</fieldset>
			<p class="error-message" v-if="ferror">{{ ferror }}</p>
		</article>
		<article v-else class="card">
			<h3>Logout</h3>
			<p>Logged in as <strong>{{ store.user.username }}</strong></p>
			<button class="btn" @click.prevent="logout">Logout</button>
		</article>
	</div>
</template>