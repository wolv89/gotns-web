<script setup>

import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store.js'

const router = useRouter()

onMounted(() => {
	if(!store.user)
		router.replace({path: '/user'})
})

const props = defineProps(['name'])

</script>
<template>
	<div class="wrapper wrap-max-lrg">
		<h2 class="admin-title"><img src="@/assets/images/radix-ui-double-right.svg" /> {{ props.name }}</h2>
		<slot/>
	</div>
</template>