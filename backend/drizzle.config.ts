import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

function parseDatabaseUrl(url: string) {
  const match = url.match(/^postgres(?:ql)?:\/\/(?<user>[^:]+):(?<password>[^@]+)@(?<host>[^:/]+)(?::(?<port>\d+))?\/(?<database>[^?]+)/);
  if (!match || !match.groups) throw new Error('Invalid DATABASE_URL');
  return {
    host: match.groups.host,
    port: match.groups.port ? Number(match.groups.port) : 5432,
    user: match.groups.user,
    password: match.groups.password,
    database: match.groups.database,
    ssl: true,
  };
}

const dbCredentials = parseDatabaseUrl(process.env.DATABASE_URL!);

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials,
} satisfies Config; 