import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // allows external access (e.g. via ngrok)
    origin: 'https://cool-ends-wink.loca.lt/', // optional: sets correct URL
  },
});
