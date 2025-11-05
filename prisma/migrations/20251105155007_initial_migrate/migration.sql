-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('BOOKED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED_USER', 'CANCELLED_ADMIN');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT,
    "imageUrl" TEXT,
    "role" "UserRoles" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointments" (
    "id" TEXT NOT NULL,
    "appointmentDate" DATE NOT NULL,
    "queueNumber" INTEGER NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'BOOKED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE INDEX "Appointments_appointmentDate_idx" ON "Appointments"("appointmentDate");

-- CreateIndex
CREATE UNIQUE INDEX "Appointments_patientId_appointmentDate_key" ON "Appointments"("patientId", "appointmentDate");

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
