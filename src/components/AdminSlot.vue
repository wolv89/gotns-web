<script setup>

import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/store.js'

const router = useRouter()

onMounted(() => {
	if(!store.user)
		router.replace({path: '/user'})
})

const props = defineProps(['name', 'desktop'])

</script>
<template>
	<div :class="{wrapper: true, 'wrap-max-lrg': true, 'desktop-only': props.desktop}">
		<h2 class="admin-title"><img src="@/assets/images/radix-ui-double-right.svg" /> {{ props.name }}</h2>
		<slot/>
	</div>
	<div v-if="props.desktop" class="wrapper wrap-max-mid desktop-only-notice">
		<h2 class="admin-title">{{ props.name }}</h2>
		<p class="soft-message"><strong>Sorry!</strong></p>
		<p class="soft-message">This interface is too complicated for smaller screens (for now).</p>
		<p class="soft-message">Please use a larger device.</p>
	</div>
</template>
<style lang="sass">
.desktop-only
	+untilLrg
		display: none
	&-notice
		+atLrg
			display: none
</style>