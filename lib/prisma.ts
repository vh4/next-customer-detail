import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import logger from "./logger";

export const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
    { emit: "event", level: "info" },
    { emit: "event", level: "warn" },
  ],
});

export async function initDB(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info("Prisma client connected successfully");

    await insertInitialData();

  } catch (error) {
    logger.error("Error connecting Prisma client:", error);
  }
}

async function insertInitialData() {
  try {
    const filePath = path.join(process.cwd(), "viewData.json");

    const fileContent = await fs.readFile(filePath, "utf8");
    const { data } = JSON.parse(fileContent);

    if (!data || data.length === 0) {
      logger.warn("No data found in viewData.json");
      return;
    }

    for (const record of data) {
      const exists = await prisma.transaksi.findUnique({
        where: { id: record.id },
      });

      if (!exists) {
        await prisma.transaksi.create({
          data: {
            id: record.id,
            productID: record.productID,
            productName: record.productName,
            amount: record.amount,
            customerName: record.customerName,
            status: record.status,
            transactionDate: new Date(record.transactionDate),
            createBy: record.createBy,
            createOn: new Date(record.createOn),
          },
        });
        logger.info(`Inserted record with ID: ${record.id}`);
      } else {
        logger.info(`Record with ID: ${record.id} already exists`);
      }
    }
  } catch (error) {
    logger.error("Error inserting initial data:", error);
  }
}

prisma.$on("error", (e) => {
  logger.error(e.message);
});

prisma.$on("warn", (e) => {
  logger.warn(e.message);
});

prisma.$on("info", (e) => {
  logger.warn(e.message);
});

prisma.$on("query", (e) => {
  logger.warn(e.query);
});
