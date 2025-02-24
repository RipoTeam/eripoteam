import { InsertUser, User, Task, Warning, Ban, SupportTicket, users, tasks, warnings, bans, supportTickets } from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  updateUser(id: number, data: Partial<User>): Promise<User>;

  // Tasks
  getTasks(userId: number): Promise<Task[]>;
  getAllTasks(): Promise<Task[]>;
  createTask(userId: number, task: Omit<Task, "id" | "userId">): Promise<Task>;
  updateTask(taskId: number, completed: boolean): Promise<Task>;
  approveTask(taskId: number, modId: number, note: string): Promise<Task>;

  // Warnings
  getWarnings(userId: number): Promise<Warning[]>;
  getAllWarnings(): Promise<Warning[]>;
  createWarning(warning: Omit<Warning, "id">): Promise<Warning>;
  approveWarning(warningId: number, modId: number, note: string): Promise<Warning>;

  // Bans
  getBans(userId: number): Promise<Ban[]>;
  getAllBans(): Promise<Ban[]>;
  createBan(ban: Omit<Ban, "id">): Promise<Ban>;
  approveBan(banId: number, modId: number, note: string): Promise<Ban>;

  // Support Tickets
  createSupportTicket(ticket: Omit<SupportTicket, "id">): Promise<SupportTicket>;
  getSupportTickets(): Promise<SupportTicket[]>;
  updateSupportTicket(id: number, data: Partial<SupportTicket>): Promise<SupportTicket>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async getTasks(userId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async getAllTasks(): Promise<Task[]> {
    return db.select().from(tasks);
  }

  async createTask(userId: number, task: Omit<Task, "id" | "userId">): Promise<Task> {
    const [newTask] = await db.insert(tasks).values({ ...task, userId }).returning();
    return newTask;
  }

  async updateTask(taskId: number, completed: boolean): Promise<Task> {
    const [task] = await db.update(tasks)
      .set({ completed })
      .where(eq(tasks.id, taskId))
      .returning();
    return task;
  }

  async approveTask(taskId: number, modId: number, note: string): Promise<Task> {
    const [task] = await db.update(tasks)
      .set({ approved: true, approvedBy: modId, approvalNote: note })
      .where(eq(tasks.id, taskId))
      .returning();
    return task;
  }

  async getWarnings(userId: number): Promise<Warning[]> {
    return db.select().from(warnings).where(eq(warnings.userId, userId));
  }

  async getAllWarnings(): Promise<Warning[]> {
    return db.select().from(warnings);
  }

  async createWarning(warning: Omit<Warning, "id">): Promise<Warning> {
    const [newWarning] = await db.insert(warnings).values(warning).returning();
    return newWarning;
  }

  async approveWarning(warningId: number, modId: number, note: string): Promise<Warning> {
    const [warning] = await db.update(warnings)
      .set({ approved: true, approvedBy: modId, approvalNote: note })
      .where(eq(warnings.id, warningId))
      .returning();
    return warning;
  }

  async getBans(userId: number): Promise<Ban[]> {
    return db.select().from(bans).where(eq(bans.userId, userId));
  }

  async getAllBans(): Promise<Ban[]> {
    return db.select().from(bans);
  }

  async createBan(ban: Omit<Ban, "id">): Promise<Ban> {
    const [newBan] = await db.insert(bans).values(ban).returning();
    return newBan;
  }

  async approveBan(banId: number, modId: number, note: string): Promise<Ban> {
    const [ban] = await db.update(bans)
      .set({ approved: true, approvedBy: modId, approvalNote: note })
      .where(eq(bans.id, banId))
      .returning();
    return ban;
  }

  async createSupportTicket(ticket: Omit<SupportTicket, "id">): Promise<SupportTicket> {
    const [newTicket] = await db.insert(supportTickets).values(ticket).returning();
    return newTicket;
  }

  async getSupportTickets(): Promise<SupportTicket[]> {
    return db.select().from(supportTickets);
  }

  async updateSupportTicket(id: number, data: Partial<SupportTicket>): Promise<SupportTicket> {
    const [ticket] = await db.update(supportTickets)
      .set(data)
      .where(eq(supportTickets.id, id))
      .returning();
    return ticket;
  }
}

export const storage = new DatabaseStorage();