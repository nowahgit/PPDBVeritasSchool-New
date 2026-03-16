/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `asal_sekolah` VARCHAR(100) NULL,
    ADD COLUMN `email` VARCHAR(100) NULL,
    ADD COLUMN `jenis_kelamin` VARCHAR(10) NULL,
    ADD COLUMN `reset_token` VARCHAR(255) NULL,
    ADD COLUMN `reset_token_expiry` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
