-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EMPLOYEE', 'VOLUNTEER');

-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('WORK_HOURS', 'EXPENSE', 'VACATION', 'TRAVEL');

-- CreateEnum
CREATE TYPE "EntryStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "phoneNumber" TEXT,
    "department" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "EntryType" NOT NULL,
    "status" "EntryStatus" NOT NULL DEFAULT 'PENDING',
    "date" TIMESTAMP(3),
    "hoursWorked" DOUBLE PRECISION,
    "expenseAmount" DOUBLE PRECISION,
    "expenseCategory" TEXT,
    "receiptUrl" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "vacationDays" INTEGER,
    "travelDate" TIMESTAMP(3),
    "travelFrom" TEXT,
    "travelTo" TEXT,
    "travelKm" DOUBLE PRECISION,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "entries_userId_idx" ON "entries"("userId");

-- CreateIndex
CREATE INDEX "entries_type_idx" ON "entries"("type");

-- CreateIndex
CREATE INDEX "entries_status_idx" ON "entries"("status");

-- CreateIndex
CREATE INDEX "entries_date_idx" ON "entries"("date");

-- CreateIndex
CREATE INDEX "entries_createdAt_idx" ON "entries"("createdAt");

-- AddForeignKey
ALTER TABLE "entries" ADD CONSTRAINT "entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
