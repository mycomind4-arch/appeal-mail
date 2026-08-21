import pg from 'pg';

const password = 'xF+Y2@uDcP/zfN8';

const client = new pg.Client({
  host: 'aws-0-ca-central-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.akpjuhrzypmcbivgsegt',
  password: password,
  ssl: { rejectUnauthorized: false }
});

try {
  console.log('Connecting to Supabase database...');
  await client.connect();
  console.log('Connected! Running schema...');
  
  const fs = await import('fs');
  const schema = fs.readFileSync('supabase/schema.sql', 'utf-8');
  
  await client.query(schema);
  console.log('Schema applied successfully!');
  
  // Verify tables
  const tables = await client.query(`
    SELECT table_name, row_security 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);
  console.log('\nTables created:');
  for (const row of tables.rows) {
    console.log(`  ${row.table_name} (RLS: ${row.row_security})`);
  }
  
  // Verify RLS policies
  const policies = await client.query(`
    SELECT tablename, policyname, cmd, roles 
    FROM pg_policies 
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname;
  `);
  console.log('\nRLS policies:');
  for (const row of policies.rows) {
    console.log(`  ${row.tablename}.${row.policyname} (${row.cmd})`);
  }
  
  await client.end();
  console.log('\nDone.');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
