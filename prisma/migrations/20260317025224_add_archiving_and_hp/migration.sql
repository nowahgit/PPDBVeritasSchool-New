-- AlterTable
ALTER TABLE `User` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `no_hp` VARCHAR(15) NULL;

-- CreateTable
CREATE TABLE `SelectionPeriod` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `deskripsi` TEXT NULL,
    `tanggal_buka` DATETIME(3) NOT NULL,
    `tanggal_tutup` DATETIME(3) NOT NULL,
    `status` ENUM('AKTIF', 'SELESAI', 'DITUTUP') NOT NULL DEFAULT 'AKTIF',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SelectionArchive` (
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

-- CreateIndex
CREATE INDEX `Berkas_nisn_pendaftar_idx` ON `Berkas`(`nisn_pendaftar`);

-- CreateIndex
CREATE INDEX `Berkas_nama_pendaftar_idx` ON `Berkas`(`nama_pendaftar`);

-- CreateIndex
CREATE INDEX `Berkas_status_validasi_idx` ON `Berkas`(`status_validasi`);
