
import { createFetch } from '@vueuse/core'

export const useGo = createFetch({
	baseUrl: 'http://localhost:8040',
	options: {
		beforeFetch({ options }) {
			// options.headers.Authorization = `Bearer (( TOKEN ))`;
			return { options };
		}
	},
	fetchOptions: {
		mode: 'cors'
	}
});
