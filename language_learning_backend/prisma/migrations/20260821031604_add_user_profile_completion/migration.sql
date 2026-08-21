CREATE TYPE "UserGender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

ALTER TABLE "User"
ADD COLUMN "displayName" TEXT,
ADD COLUMN "phoneNumber" TEXT,
ADD COLUMN "dateOfBirth" TIMESTAMP(3),
ADD COLUMN "gender" "UserGender",
ADD COLUMN "profileCompletedAt" TIMESTAMP(3),
ALTER COLUMN "name" SET DEFAULT '';

UPDATE "User"
SET "profileCompletedAt" = CURRENT_TIMESTAMP
WHERE "name" <> '';
