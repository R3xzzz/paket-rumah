-- CreateTable
CREATE TABLE "Package" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "packageName" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderAddress" TEXT,
    "courier" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "recipientPhone" TEXT NOT NULL,
    "isCod" BOOLEAN NOT NULL,
    "codAmount" REAL,
    "deliveryStatus" TEXT NOT NULL DEFAULT 'waiting',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Package_trackingNumber_key" ON "Package"("trackingNumber");
