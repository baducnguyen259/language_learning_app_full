-- CreateTable
CREATE TABLE "PasswordResetRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "otpExpiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastSentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "resetTokenHash" TEXT,
    "resetTokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetRequest_userId_key" ON "PasswordResetRequest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetRequest_resetTokenHash_key" ON "PasswordResetRequest"("resetTokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetRequest_otpExpiresAt_idx" ON "PasswordResetRequest"("otpExpiresAt");

-- CreateIndex
CREATE INDEX "PasswordResetRequest_resetTokenExpiresAt_idx" ON "PasswordResetRequest"("resetTokenExpiresAt");

-- AddForeignKey
ALTER TABLE "PasswordResetRequest" ADD CONSTRAINT "PasswordResetRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
