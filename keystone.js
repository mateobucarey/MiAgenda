import 'dotenv/config';
import { config, list } from '@keystone-6/core';
import { text } from '@keystone-6/core/fields';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

export default config({
  db: {
    provider: 'sqlite',
    prismaClientOptions: () => ({
      adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL }),
    }),
  },
  lists: {
    KeystoneSystem: list({
      access: () => true,
      fields: {
        systemKey: text({ validation: { isRequired: true } }),
      },
    }),
  },
  ui: {
    isAccessAllowed: () => true,
  },
  server: {
    port: 3001,
  },
});