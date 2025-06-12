import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
	// 3rd parameter '' loads all env variables
	const env = loadEnv(mode, process.cwd(), "");

	return {
		plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
		server: {
			proxy: {
				"/api": {
					target: env.API_DOMAIN,
					changeOrigin: true,
					secure: false,
					cookieDomainRewrite: env.API_DOMAIN,
					rewrite: (path) => path.replace(/^\/api/, ""),
				},
			},
		},
	};
});
