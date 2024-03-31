
import { createFetch } from '@vueuse/core'
import { store } from '@/store.js'


export const useGo = createFetch({
	baseUrl: 'http://localhost:8040',
	options: {
		beforeFetch({ options }) {
			if(store.user) {
				const authtoken = btoa(store.user.token)
				options.headers.Authorization = `Bearer ${authtoken}`;
			}
			return { options };
		},
		onFetchError({ response }) {
			if(response.status == 401) {
				store.logout("Your session was invalid or has expired. Please login again to continue.")
			}
		}
	},
	fetchOptions: {
		mode: 'cors'
	}
});
