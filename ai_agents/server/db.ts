/**
 * Database connection and Drizzle ORM setup
 * Uses Neon Serverless PostgreSQL with WebSocket support
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '../shared/schema.js';

// Configure Neon to use WebSocket for serverless compatibility
neonConfig.webSocketConstructor = ws;

// Validate DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL must be set. Did you forget to provision a database?'
  );
}

// Create PostgreSQL connection pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Initialize Drizzle ORM with schema
export const db = drizzle({ client: pool, schema });
