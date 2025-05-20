import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // allows external access (e.g. via ngrok)
    origin: 'https://2638-106-222-217-24.ngrok-free.app', // optional: sets correct URL
  },
});
