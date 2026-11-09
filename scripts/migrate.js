const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

async function runMigration() {
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:43IcWJGo05wMAU9J@db.epnvqyyyzbefyxnqmfcj.supabase.co:5432/postgres";

  console.log("Connecting to Supabase PostgreSQL database...");

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Successfully connected to Supabase PostgreSQL!");

    const schemaPath = path.join(__dirname, "..", "supabase", "schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");

    console.log("Executing schema.sql...");
    await client.query(sql);

    console.log("Schema migration completed successfully!");

    // Verify all created tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log("\nCreated public tables:");
    res.rows.forEach((r) => console.log(` - ${r.table_name}`));

  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();

