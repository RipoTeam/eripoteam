import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create admin account if it doesn't exist
  const adminUsername = "ripoteam";
  const existingAdmin = await storage.getUserByUsername(adminUsername);
  if (!existingAdmin) {
    await storage.createUser({
      username: adminUsername,
      password: await hashPassword("ripo123"),
      isAdmin: true
    });
  }

  setupAuth(app);

  // User Management Routes
  app.post("/api/users", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(401);
    }

    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password),
    });

    res.status(201).json(user);
  });

  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(401);
    }
    const users = await storage.getUsers();
    res.json(users);
  });

  // Tasks Routes
  app.get("/api/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const tasks = await storage.getTasks(req.user.id);
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const task = await storage.createTask(req.user.id, {
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const task = await storage.updateTask(parseInt(req.params.id), req.body.completed);
    res.json(task);
  });

  // Warnings Route
  app.get("/api/warnings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const warnings = await storage.getWarnings(req.user.id);
    res.json(warnings);
  });

  app.post("/api/warnings", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) return res.sendStatus(401);
    const warning = await storage.createWarning({
      ...req.body,
      issuedBy: req.user.id
    });
    res.status(201).json(warning);
  });

  // Add this route after the existing warnings routes
  app.get("/api/admin/warnings", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) return res.sendStatus(401);
    const warnings = await storage.getAllWarnings();
    res.json(warnings);
  });

  // Bans Route
  app.get("/api/bans", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const bans = await storage.getBans(req.user.id);
    res.json(bans);
  });

  app.post("/api/bans", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) return res.sendStatus(401);
    const ban = await storage.createBan({
      ...req.body,
      issuedBy: req.user.id
    });
    res.status(201).json(ban);
  });

  // Add this route after the existing bans routes
  app.get("/api/admin/bans", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) return res.sendStatus(401);
    const bans = await storage.getAllBans();
    res.json(bans);
  });

  const httpServer = createServer(app);
  return httpServer;
}