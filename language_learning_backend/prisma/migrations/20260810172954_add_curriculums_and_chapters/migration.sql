-- CreateEnum
CREATE TYPE "CurriculumStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "chapterId" TEXT,
ADD COLUMN     "orderInChapter" INTEGER;

-- CreateTable
CREATE TABLE "Curriculum" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "CurriculumStatus" NOT NULL DEFAULT 'DRAFT',
    "levelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "curriculumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Curriculum_levelId_idx" ON "Curriculum"("levelId");

-- CreateIndex
CREATE INDEX "Curriculum_status_idx" ON "Curriculum"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Curriculum_levelId_title_key" ON "Curriculum"("levelId", "title");

-- CreateIndex
CREATE INDEX "Chapter_curriculumId_idx" ON "Chapter"("curriculumId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_curriculumId_order_key" ON "Chapter"("curriculumId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_curriculumId_title_key" ON "Chapter"("curriculumId", "title");

-- CreateIndex
CREATE INDEX "Lesson_chapterId_idx" ON "Lesson"("chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_chapterId_orderInChapter_key" ON "Lesson"("chapterId", "orderInChapter");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curriculum" ADD CONSTRAINT "Curriculum_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE CASCADE ON UPDATE CASCADE;
