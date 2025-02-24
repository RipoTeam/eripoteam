import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default('user'), // 'admin', 'mod', 'user'
  nickname: text("nickname"),
  preferences: json("preferences").$type<{
    theme: string;
    buttonColor: string;
    backgroundColor: string;
  }>(),
  isAdmin: boolean("is_admin").default(false),
  isMod: boolean("is_mod").default(false),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  dueDate: timestamp("due_date"),
  createdBy: integer("created_by").notNull(),
  approved: boolean("approved").default(false),
  approvedBy: integer("approved_by"),
  approvalNote: text("approval_note"),
});

export const warnings = pgTable("warnings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  reason: text("reason").notNull(),
  issuedAt: timestamp("issued_at").defaultNow(),
  issuedBy: integer("issued_by").notNull(),
  approved: boolean("approved").default(false),
  approvedBy: integer("approved_by"),
  approvalNote: text("approval_note"),
});

export const bans = pgTable("bans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  reason: text("reason").notNull(),
  expiresAt: timestamp("expires_at"),
  issuedAt: timestamp("issued_at").defaultNow(),
  issuedBy: integer("issued_by").notNull(),
  approved: boolean("approved").default(false),
  approvedBy: integer("approved_by"),
  approvalNote: text("approval_note"),
});

export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default('open'), // 'open', 'in_progress', 'closed'
  createdAt: timestamp("created_at").defaultNow(),
  assignedTo: integer("assigned_to"),
  attachmentUrl: text("attachment_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
}).extend({
  isAdmin: z.boolean().optional(),
  isMod: z.boolean().optional(),
  role: z.enum(['admin', 'mod', 'user']).optional(),
  nickname: z.string().optional(),
  preferences: z.object({
    theme: z.string().optional(),
    buttonColor: z.string().optional(),
    backgroundColor: z.string().optional(),
  }).optional(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  dueDate: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Warning = typeof warnings.$inferSelect;
export type Ban = typeof bans.$inferSelect;
export type SupportTicket = typeof supportTickets.$inferSelect;