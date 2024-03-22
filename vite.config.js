import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	server: {
		port: 3060
	},
	css: {
		preprocessorOptions: {
			sass: {
				additionalData: `@import "@/assets/sass/_ref.sass"`
			}
		}
	}
})
