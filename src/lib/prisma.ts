// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Это необходимо для предотвращения ошибок при использовании модуля в разных файлах
  var prisma: PrismaClient | undefined;
}

// Используйте глобальный объект для сохранения экземпляра PrismaClient
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default prisma;
