-- CreateTable
CREATE TABLE "VocabularyFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VocabularyFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VocabularyFavorite_userId_createdAt_idx" ON "VocabularyFavorite"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "VocabularyFavorite_vocabularyId_idx" ON "VocabularyFavorite"("vocabularyId");

-- CreateIndex
CREATE UNIQUE INDEX "VocabularyFavorite_userId_vocabularyId_key" ON "VocabularyFavorite"("userId", "vocabularyId");

-- AddForeignKey
ALTER TABLE "VocabularyFavorite" ADD CONSTRAINT "VocabularyFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyFavorite" ADD CONSTRAINT "VocabularyFavorite_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
