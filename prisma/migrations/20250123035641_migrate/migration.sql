-- CreateTable
CREATE TABLE "Transaksi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productID" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "transactionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createBy" TEXT NOT NULL,
    "createOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
