/*
  Warnings:

  - The `status` column on the `Lesson` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "allowReplay" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "durationMinutes" INTEGER,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "requiresPreviousLesson" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ADD COLUMN     "thumbnailUrl" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "LessonStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateIndex
CREATE INDEX "Lesson_topicId_idx" ON "Lesson"("topicId");

-- CreateIndex
CREATE INDEX "Lesson_status_idx" ON "Lesson"("status");
