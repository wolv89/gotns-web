<script setup>

import { onMounted } from 'vue'
import { store } from '@/store.js'

import Header from './components/Header.vue';

onMounted(() => {
	const storedUsername = localStorage.getItem("goname")
	const storedToken = localStorage.getItem("goken")
	if(storedUsername && storedToken) {
		store.login(storedUsername, storedToken)
	}
})

</script>
<template>
	<Header />
	<main class="main">
		<RouterView />
	</main>
</template>