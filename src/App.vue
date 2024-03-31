<script setup>

import { onMounted } from 'vue'
import { useGo } from '@/usego'
import { store } from '@/store.js'

import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

async function checkUser() {

	const { data } = await useGo('/admin/ready').text()

	if(data.value != 'GO') {
		store.logout("Your session has expired. Please login again to continue.")
	}

}

onMounted(() => {
	const storedUsername = localStorage.getItem("goname")
	const storedToken = localStorage.getItem("goken")
	if(storedUsername && storedToken) {
		store.login(storedUsername, storedToken)
		checkUser()
	}
})

</script>
<template>
	<Header />
	<main class="main">
		<RouterView />
	</main>
	<Footer />
</template>