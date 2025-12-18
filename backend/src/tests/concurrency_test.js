const axios = require('axios');

const BASE = process.env.BASE || 'http://localhost:4000/api';
const EVENT_ID = 'REPLACE_WITH_EVENT_ID';
const TOKEN1 = 'REPLACE_WITH_TOKEN1';
const TOKEN2 = 'REPLACE_WITH_TOKEN2';

async function attempt(token) {
  try {
    const res = await axios.post(`${BASE}/events/${EVENT_ID}/rsvp`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('SUCCESS', res.data.message);
  } catch (err) {
    console.log('FAILED', err.response?.data || err.message);
  }
}

(async () => {
  await Promise.all([attempt(TOKEN1), attempt(TOKEN2)]);
  process.exit(0);
})();
