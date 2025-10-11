const { Client } = require('pg');
require('dotenv').config({ path: '/workspaces/afro/afro-store/.env' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function clearDatabase() {
  await client.connect();
  try {
    console.log('Starting to clear database...');
    // The order of deletion is important to avoid foreign key constraint violations.
    await client.query('TRUNCATE TABLE "order" CASCADE;');
    await client.query('TRUNCATE TABLE "cart" CASCADE;');
    await client.query('TRUNCATE TABLE "inventory_level" CASCADE;');
    await client.query('TRUNCATE TABLE "inventory_item" CASCADE;');
    await client.query('TRUNCATE TABLE "product_variant" CASCADE;');
    await client.query('TRUNCATE TABLE "product" CASCADE;');
    await client.query('TRUNCATE TABLE "product_category" CASCADE;');
    await client.query('TRUNCATE TABLE "api_key" CASCADE;');
    await client.query('TRUNCATE TABLE "shipping_option" CASCADE;');
    await client.query('TRUNCATE TABLE "shipping_profile" CASCADE;');
    await client.query('TRUNCATE TABLE "fulfillment_set" CASCADE;');
    await client.query('TRUNCATE TABLE "stock_location" CASCADE;');
    await client.query('TRUNCATE TABLE "tax_region" CASCADE;');
    await client.query('TRUNCATE TABLE "region" CASCADE;');
    await client.query('TRUNCATE TABLE "sales_channel" CASCADE;');
    await client.query('TRUNCATE TABLE "store" CASCADE;');
    console.log('Database cleared successfully.');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await client.end();
  }
}

clearDatabase();
