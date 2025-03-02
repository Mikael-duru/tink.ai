import { PrismaClient } from "@prisma/client";

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalThis.prisma = db;
}

// globalThis.prisma: This global variable ensures that the PrismaClient instance is only initialized once and reused across hot reloads during development.
// Without this, each time your application reloads, a new instance of the PrismaClient will be created, potentially leading to memory leak/connection issue.
