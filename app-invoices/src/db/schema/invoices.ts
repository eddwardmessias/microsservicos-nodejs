import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey(),
  orderId: text().notNull(),
  createAt: timestamp().defaultNow().notNull()
})