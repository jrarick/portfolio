import { cloudflare } from "@cloudflare/vite-plugin"
import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { motionStudio } from "@motionplus/studio"
import { defineConfig, lazyPlugins } from "vite-plus"

export default defineConfig(({ mode }) => ({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: [".agents/skills/**", "worker-configuration.d.ts"],
    semi: false,
  },
  lint: {
    ignorePatterns: [".agents/skills/**", "worker-configuration.d.ts"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  plugins: lazyPlugins(() => [
    ...(mode === "test" ? [] : [cloudflare({ viteEnvironment: { name: "ssr" } })]),
    tailwindcss(),
    motionStudio(),
    reactRouter(),
  ]),
  resolve: {
    tsconfigPaths: true,
  },
}))
