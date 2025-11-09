/*
  Warnings:

  - Changed the type of `appointmentDate` on the `Appointments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Appointments" DROP COLUMN "appointmentDate",
ADD COLUMN     "appointmentDate" DATE NOT NULL;

-- CreateIndex
CREATE INDEX "Appointments_appointmentDate_idx" ON "Appointments"("appointmentDate");

-- CreateIndex
CREATE UNIQUE INDEX "Appointments_patientId_appointmentDate_key" ON "Appointments"("patientId", "appointmentDate");
