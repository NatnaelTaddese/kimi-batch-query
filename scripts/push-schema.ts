import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as schema from "../db/schema";
import * as fs from "fs";
import * as path from "path";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function pushSchema() {
  console.log("🔄 Checking for schema changes...");

  try {
    const migrationsFolder = "./db/migrations";

    // Check if migrations folder exists and has migration files
    const migrationsPath = path.resolve(migrationsFolder);

    if (!fs.existsSync(migrationsPath)) {
      console.log("📁 No migrations folder found. Creating...");
      fs.mkdirSync(migrationsPath, { recursive: true });
    }

    const files = fs.readdirSync(migrationsPath);
    const sqlFiles = files.filter((f) => f.endsWith(".sql"));

    if (sqlFiles.length === 0) {
      console.log("✨ No migration files found. Schema is up to date!");
      process.exit(0);
    }

    console.log(`📦 Found ${sqlFiles.length} migration file(s)`);
    console.log("⚡ Running migrations...");

    // Run migrations
    await migrate(db, { migrationsFolder });

    console.log("✅ Schema pushed successfully!");
    process.exit(0);
  } catch (error) {
    // Check if it's a "already exists" error
    if (error instanceof Error && error.message.includes("already exists")) {
      console.log("ℹ️  Database schema is already up to date!");
      console.log(
        "💡 Tip: Remove old migration files if you've already applied them.",
      );
      process.exit(0);
    }

    console.error("❌ Failed to push schema:");
    console.error(error);
    process.exit(1);
  }
}

pushSchema();
