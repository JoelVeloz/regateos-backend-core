/*
  Warnings:

  - You are about to drop the column `impersonatedBy` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `banExpires` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `banReason` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `banned` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "regateos"."session" DROP COLUMN "impersonatedBy";

-- AlterTable
ALTER TABLE "regateos"."user" DROP COLUMN "banExpires",
DROP COLUMN "banReason",
DROP COLUMN "banned",
DROP COLUMN "role",
ADD COLUMN     "businessAddress" TEXT,
ADD COLUMN     "businessLogo" TEXT,
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "cedulaPhoto" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "nationalId" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "storeFrontPhoto" TEXT;
