-- CreateEnum
CREATE TYPE "GrammarStatus" AS ENUM ('DRAFT', 'ACTIVE');

-- CreateTable
CREATE TABLE "Grammar" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "example" TEXT,
    "exampleMeaning" TEXT,
    "note" TEXT,
    "order" INTEGER NOT NULL,
    "status" "GrammarStatus" NOT NULL DEFAULT 'DRAFT',
    "lessonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grammar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Grammar_lessonId_idx" ON "Grammar"("lessonId");

-- CreateIndex
CREATE INDEX "Grammar_status_idx" ON "Grammar"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Grammar_lessonId_title_key" ON "Grammar"("lessonId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "Grammar_lessonId_order_key" ON "Grammar"("lessonId", "order");

-- AddForeignKey
ALTER TABLE "Grammar" ADD CONSTRAINT "Grammar_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
