-- CreateEnum
CREATE TYPE "VocabularyStatus" AS ENUM ('DRAFT', 'ACTIVE');

-- CreateTable
CREATE TABLE "Vocabulary" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "pronunciation" TEXT,
    "meaning" TEXT NOT NULL,
    "wordType" TEXT,
    "imageUrl" TEXT,
    "audioUrl" TEXT,
    "status" "VocabularyStatus" NOT NULL DEFAULT 'DRAFT',
    "lessonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vocabulary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vocabulary_lessonId_idx" ON "Vocabulary"("lessonId");

-- CreateIndex
CREATE INDEX "Vocabulary_status_idx" ON "Vocabulary"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Vocabulary_lessonId_term_key" ON "Vocabulary"("lessonId", "term");

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
