import pg from 'pg';

const password = 'xF+Y2@uDcP/zfN8';

const configs = [
  {
    name: 'Pooler (port 5432, SSL no-verify)',
    config: {
      host: 'aws-0-ca-central-1.pooler.supabase.com',
      port: 5432,
      database: 'postgres',
      user: 'postgres.akpjuhrzypmcbivgsegt',
      password,
      ssl: { rejectUnauthorized: false }
    }
  },
  {
    name: 'Pooler (connection string)',
    config: `postgresql://postgres.akpjuhrzypmcbivgsegt:${encodeURIComponent(password)}@aws-0-ca-central-1.pooler.supabase.com:5432/postgres?sslmode=require`
  },
  {
    name: 'Direct (db.xxx.supabase.co)',
    config: {
      host: 'db.akpjuhrzypmcbivgsegt.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password,
      ssl: { rejectUnauthorized: false }
    }
  },
  {
    name: 'Direct IPv6 pooler (port 6543)',
    config: {
      host: 'aws-0-ca-central-1.pooler.supabase.com',
      port: 6543,
      database: 'postgres',
      user: 'postgres.akpjuhrzypmcbivgsegt',
      password,
      ssl: { rejectUnauthorized: false }
    }
  }
];

for (const { name, config } of configs) {
  const client = new pg.Client(config);
  try {
    console.log(`Trying: ${name}...`);
    await Promise.race([
      client.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout (10s)')), 10000))
    ]);
    console.log(`  ✅ Connected via ${name}!`);
    
    // Check user_roles columns
    const cols = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'user_roles'
      ORDER BY ordinal_position;
    `);
    console.log('  user_roles columns:');
    for (const row of cols.rows) {
      console.log(`    ${row.column_name} (${row.data_type}, nullable: ${row.is_nullable})`);
    }
    
    // Check RLS
    const rls = await client.query(`
      SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
    `);
    console.log('  RLS status:');
    for (const row of rls.rows) {
      console.log(`    ${row.tablename}: RLS=${row.rowsecurity}`);
    }
    
    // Check policies
    const policies = await client.query(`
      SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;
    `);
    console.log('  Policies:');
    for (const row of policies.rows) {
      console.log(`    ${row.tablename}.${row.policyname} (${row.cmd})`);
    }
    
    await client.end();
    console.log('\nDatabase verification complete.');
    process.exit(0);
  } catch (err) {
    console.log(`  ❌ ${err.message || 'Unknown error'}`);
    try { await client.end(); } catch {}
  }
}

console.log('\nAll connection attempts failed.');
process.exit(1);
