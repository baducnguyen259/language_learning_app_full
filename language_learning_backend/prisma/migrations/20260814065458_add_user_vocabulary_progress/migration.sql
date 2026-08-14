-- CreateEnum
CREATE TYPE "VocabularyLearningStatus" AS ENUM ('LEARNING', 'MASTERED');

-- CreateTable
CREATE TABLE "UserVocabularyProgress" (
    "userId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "status" "VocabularyLearningStatus" NOT NULL DEFAULT 'LEARNING',
    "masteredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVocabularyProgress_pkey" PRIMARY KEY ("userId","vocabularyId")
);

-- CreateIndex
CREATE INDEX "UserVocabularyProgress_userId_status_updatedAt_idx" ON "UserVocabularyProgress"("userId", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "UserVocabularyProgress_vocabularyId_idx" ON "UserVocabularyProgress"("vocabularyId");

-- AddForeignKey
ALTER TABLE "UserVocabularyProgress" ADD CONSTRAINT "UserVocabularyProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVocabularyProgress" ADD CONSTRAINT "UserVocabularyProgress_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill active vocabulary from lessons users already started and vocabulary
-- users already favorited. Existing data is kept as LEARNING because there is
-- no reliable per-word evidence that it was mastered.
INSERT INTO "UserVocabularyProgress" (
    "userId",
    "vocabularyId",
    "status",
    "createdAt",
    "updatedAt"
)
SELECT DISTINCT
    source."userId",
    source."vocabularyId",
    'LEARNING'::"VocabularyLearningStatus",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM (
    SELECT
        progress."userId",
        vocabulary."id" AS "vocabularyId"
    FROM "LessonProgress" AS progress
    INNER JOIN "Vocabulary" AS vocabulary
        ON vocabulary."lessonId" = progress."lessonId"
       AND vocabulary."status" = 'ACTIVE'

    UNION

    SELECT
        favorite."userId",
        favorite."vocabularyId"
    FROM "VocabularyFavorite" AS favorite
) AS source
ON CONFLICT ("userId", "vocabularyId") DO NOTHING;
