/*
  Warnings:

  - You are about to drop the `SelectionArchive` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `SelectionArchive`;

-- CreateTable
CREATE TABLE `ArsipSeleksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_periode` VARCHAR(100) NOT NULL,
    `deskripsi` TEXT NULL,
    `tanggal_buka` DATETIME(3) NOT NULL,
    `tanggal_tutup` DATETIME(3) NOT NULL,
    `total_pendaftar` INTEGER NOT NULL,
    `total_lulus` INTEGER NOT NULL,
    `total_tidak_lulus` INTEGER NOT NULL,
    `data_pendaftar` JSON NOT NULL,
    `tanggal_arsip` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
