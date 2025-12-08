import { pgTable, text,integer, pgEnum,timestamp } from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'cancelled']); 

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  customerId: text().notNull(),
  amount: integer().notNull(),
  status: orderStatusEnum().notNull().default('pending'),
  createAt: timestamp().defaultNow().notNull()
})