// Vercel version of the chat backend. The bot itself lives in ../lib/worker.js,
// a copy of the bot (worker.js).
// Vercel reads settings from Project > Settings > Environment Variables,
// which arrive here as process.env.
import worker from "../lib/worker.js";

export default {
  fetch(request) {
    return worker.fetch(request, process.env);
  },
};
