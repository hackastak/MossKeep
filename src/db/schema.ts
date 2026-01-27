import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Example users table - extend as needed
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Add your tables here
