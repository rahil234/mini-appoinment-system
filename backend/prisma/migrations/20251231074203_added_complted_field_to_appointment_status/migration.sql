-- AlterEnum
ALTER TYPE "AppointmentStatus" ADD VALUE 'COMPLETED';

-- DropIndex
DROP INDEX "Appointment_date_idx";

-- DropIndex
DROP INDEX "Appointment_status_idx";

-- DropIndex
DROP INDEX "Appointment_userId_idx";

-- DropIndex
DROP INDEX "Case_assignedUserId_idx";

-- DropIndex
DROP INDEX "User_email_idx";

-- CreateIndex
CREATE INDEX "Appointment_userId_isDeleted_idx" ON "Appointment"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "Appointment_userId_status_isDeleted_idx" ON "Appointment"("userId", "status", "isDeleted");

-- CreateIndex
CREATE INDEX "Appointment_date_isDeleted_idx" ON "Appointment"("date", "isDeleted");

-- CreateIndex
CREATE INDEX "Case_assignedUserId_isDeleted_idx" ON "Case"("assignedUserId", "isDeleted");

-- CreateIndex
CREATE INDEX "Case_assignedUserId_status_isDeleted_idx" ON "Case"("assignedUserId", "status", "isDeleted");

-- CreateIndex
CREATE INDEX "User_email_isDeleted_idx" ON "User"("email", "isDeleted");
