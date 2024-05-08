/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `Service` table. All the data in the column will be lost.
  - Added the required column `photo` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Service` DROP COLUMN `photoUrl`,
    ADD COLUMN `photo` VARCHAR(191) NOT NULL;
