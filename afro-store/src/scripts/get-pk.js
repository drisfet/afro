const { Client } = require('pg');
require('dotenv').config({ path: '/workspaces/afro/afro-store/.env' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function getPublishableKey() {
  await client.connect();
  try {
    const res = await client.query("SELECT token FROM api_key WHERE title = 'Webshop' AND type = 'publishable'");
    if (res.rows.length > 0) {
      console.log(res.rows[0].token);
    } else {
      console.error('Publishable API key not found.');
    }
  } catch (error) {
    console.error('Error fetching API key:', error);
  } finally {
    await client.end();
  }
}

getPublishableKey();
