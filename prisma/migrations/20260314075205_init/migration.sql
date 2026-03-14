-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(20) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('PENDAFTAR', 'PANITIA') NOT NULL DEFAULT 'PENDAFTAR',

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id_panitia` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `nama_panitia` VARCHAR(50) NOT NULL,
    `no_hp` VARCHAR(15) NOT NULL,

    UNIQUE INDEX `Admin_user_id_key`(`user_id`),
    PRIMARY KEY (`id_panitia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Berkas` (
    `id_berkas` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `nisn_pendaftar` VARCHAR(20) NOT NULL,
    `nama_pendaftar` VARCHAR(50) NOT NULL,
    `tanggallahir_pendaftar` DATETIME(3) NOT NULL,
    `alamat_pendaftar` TEXT NOT NULL,
    `agama` VARCHAR(20) NOT NULL,
    `prestasi` TEXT NOT NULL,
    `nama_ortu` VARCHAR(50) NOT NULL,
    `pekerjaan_ortu` VARCHAR(50) NOT NULL,
    `no_hp_ortu` VARCHAR(15) NOT NULL,
    `alamat_ortu` TEXT NOT NULL,
    `jenis_berkas` VARCHAR(50) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `status_validasi` ENUM('MENUNGGU', 'VALID', 'DITOLAK') NOT NULL DEFAULT 'MENUNGGU',
    `catatan` TEXT NULL,
    `tanggal_validasi` DATETIME(3) NULL,

    UNIQUE INDEX `Berkas_user_id_key`(`user_id`),
    PRIMARY KEY (`id_berkas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seleksi` (
    `id_seleksi` INTEGER NOT NULL AUTO_INCREMENT,
    `id_panitia` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `nama_seleksi` VARCHAR(50) NOT NULL,
    `nilai_smt1` DOUBLE NOT NULL,
    `nilai_smt2` DOUBLE NOT NULL,
    `nilai_smt3` DOUBLE NOT NULL,
    `nilai_smt4` DOUBLE NOT NULL,
    `nilai_smt5` DOUBLE NOT NULL,
    `status_seleksi` ENUM('MENUNGGU', 'LULUS', 'TIDAK_LULUS') NOT NULL DEFAULT 'MENUNGGU',
    `waktu_seleksi` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_seleksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Berkas` ADD CONSTRAINT `Berkas_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seleksi` ADD CONSTRAINT `Seleksi_id_panitia_fkey` FOREIGN KEY (`id_panitia`) REFERENCES `Admin`(`id_panitia`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seleksi` ADD CONSTRAINT `Seleksi_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
