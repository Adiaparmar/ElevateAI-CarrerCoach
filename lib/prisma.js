import { PrismaClient } from "@prisma/client";

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// globalThis.prisma: this global variable ensures that the PrismaClient instance is reused accross hot reloads during development. Without this, each time your application is reloaded, a new PrismaClient instance is created, which can lead to a connection leak in your database.
