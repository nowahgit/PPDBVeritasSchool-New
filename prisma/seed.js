const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const agamaList = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];
const pekerjaanList = ["PNS", "Wiraswasta", "Karyawan Swasta", "Petani", "Dokter", "Guru", "TNI/Polri"];
const kotaList = ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Palembang"];
const smpList = [
  "SMP Negeri 1 Jakarta", "SMP Negeri 2 Surabaya", "MTs Negeri 1 Bandung",
  "SMP Islam Al-Azhar", "SMP Negeri 3 Medan", "MTs Muhammadiyah Semarang",
  "SMP Kristen Petra", "SMP Negeri 5 Makassar", "MTs Negeri 2 Palembang",
  "SMP Global Mandiri", "SMP Negeri 4 Tangerang", "MTs Al-Irsyad Cirebon"
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
function randomNilai() {
  return parseFloat((70 + Math.random() * 30).toFixed(1));
}

const dataPendaftar = [
  "Aldi Firmansyah", "Budi Santoso", "Citra Dewi", "Dina Pratiwi", "Eko Wahyudi",
  "Fajar Ramadhan", "Gita Permata", "Hana Safitri", "Irfan Maulana", "Jihan Aulia",
  "Kevin Pratama", "Layla Sari", "Muhamad Rizki", "Nadia Putri", "Omar Hakim",
  "Putri Anggraini", "Qori Ramadhani", "Rafi Ahmad", "Siti Rahayu", "Taufik Hidayat",
  "Ulfa Nurjanah", "Vino Pratama", "Winda Lestari", "Xena Maharani", "Yoga Saputra",
  "Zahra Amalia", "Arif Budiman", "Bella Kusuma", "Candra Wijaya", "Desi Wulandari",
  "Evan Setiawan", "Fitri Handayani", "Galih Prabowo", "Hesti Ratnasari", "Ivan Kurniawan",
  "Julia Susanti", "Krisna Bayu", "Lina Marlina", "Miko Andrianto", "Nina Septiani",
  "Oka Dermawan", "Pita Suhartini", "Qasim Firdaus", "Rina Agustina", "Surya Dinata",
  "Tia Rahayu", "Umar Bakri", "Vivi Oktavia", "Wahyu Nugroho", "Xander Putra",
  "Yuni Astuti", "Zaki Mubarak", "Aditya Nugraha", "Bunga Pertiwi", "Cica Wati",
  "Dimas Ardiansyah", "Elsa Fitriani", "Fandi Akbar", "Grace Natalia", "Hendra Gunawan",
  "Ika Rahmawati", "Joko Purnomo", "Kartika Sari", "Lukman Hakim", "Maya Indah",
  "Nanda Saputri", "Oscar Permana", "Pandu Wijaya", "Qoni Anisa", "Rendra Kusuma",
  "Salma Azzahra", "Toni Setiawan", "Uci Nurhayati", "Vega Pradana", "Wati Suryani",
  "Andi Saputra", "Bella Puspita", "Cahya Ramadhan", "Dita Kusumawati", "Endra Kusuma",
  "Fira Aulia", "Gani Pratama", "Hilda Permatasari", "Iman Santoso", "Jasmine Putri",
  "Kukuh Wibowo", "Leli Susilawati", "Maman Suherman", "Nova Andriani", "Okta Kurnia",
  "Pita Rahayu", "Qira Amelia", "Roni Apriadi", "Sari Dewi", "Teguh Prasetyo",
  "Umi Kalsum", "Vio Santana", "Wira Nugraha", "Xifi Mahardhika", "Yayan Supriyanto"
];

const dataAdmin = [
  { username: "admin_veritas", nama: "Admin Veritas", no_hp: "081234567890" },
  { username: "panitia_01", nama: "Budi Hartono", no_hp: "081298765432" },
  { username: "panitia_02", nama: "Citra Melinda", no_hp: "081312345678" },
  { username: "panitia_03", nama: "Doni Setiawan", no_hp: "081387654321" },
  { username: "panitia_04", nama: "Eka Pratiwi", no_hp: "081423456789" },
];

async function main() {
  console.log("Cleaning up database...");
  await prisma.seleksi.deleteMany();
  await prisma.berkas.deleteMany();
  await prisma.arsipSeleksi.deleteMany();
  await prisma.selectionPeriod.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database cleaned.");

  console.log("Seeding database...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  // SEED ADMIN
  for (const a of dataAdmin) {
    const user = await prisma.user.upsert({
      where: { username: a.username },
      update: {},
      create: {
        username: a.username,
        password: hashedPassword,
        email: `${a.username}@veritasschool.sch.id`,
        role: "PANITIA",
      },
    });
    await prisma.admin.upsert({
      where: { user_id: user.id },
      update: {},
      create: {
        user_id: user.id,
        nama_panitia: a.nama,
        no_hp: a.no_hp,
      },
    });
    console.log(`Admin seeded: ${a.username}`);
  }

  // SEED 100 PENDAFTAR
  for (let i = 0; i < dataPendaftar.length; i++) {
    const nama = dataPendaftar[i];
    const username = `pendaftar_${String(i + 1).padStart(3, "0")}`;
    const jenisKelamin = i % 2 === 0 ? "Laki-laki" : "Perempuan";
    const kota = randomItem(kotaList);

    const user = await prisma.user.upsert({
      where: { username },
      update: {},
      create: {
        username,
        password: hashedPassword,
        email: `${username}@gmail.com`,
        jenis_kelamin: jenisKelamin,
        asal_sekolah: randomItem(smpList),
        role: "PENDAFTAR",
      },
    });

    // Buat berkas untuk setiap pendaftar
    const statusList = ["MENUNGGU", "VALID", "DITOLAK"];
    const status = statusList[i % 3];

    await prisma.berkas.upsert({
      where: { user_id: user.id },
      update: {},
      create: {
        user_id: user.id,
        nisn_pendaftar: `${3000000000 + i}`,
        nama_pendaftar: nama,
        tanggallahir_pendaftar: randomDate(
          new Date("2007-01-01"),
          new Date("2010-12-31")
        ),
        alamat_pendaftar: `Jl. ${randomItem(["Merdeka", "Sudirman", "Diponegoro", "Gatot Subroto"])} No.${i + 1}, ${kota}`,
        agama: randomItem(agamaList),
        prestasi: JSON.stringify([]),
        nama_ortu: `Orang Tua ${nama}`,
        pekerjaan_ortu: randomItem(pekerjaanList),
        no_hp_ortu: `0812${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`,
        alamat_ortu: `Jl. ${randomItem(["Mawar", "Melati", "Anggrek", "Kenanga"])} No.${i + 10}, ${kota}`,
        jenis_berkas: "UMUM",
        file_path: "https://example.com/placeholder.pdf",
        status_validasi: status,
        catatan: status === "DITOLAK" ? "Dokumen tidak lengkap atau tidak terbaca." : null,
        tanggal_validasi: status !== "MENUNGGU" ? new Date() : null,
      },
    });

    // Buat data seleksi untuk pendaftar yang VALID
    if (status === "VALID") {
      const adminUser = await prisma.user.findFirst({
        where: { role: "PANITIA" },
        include: { admin: true },
      });

      await prisma.seleksi.create({
        data: {
          id_panitia: adminUser.admin.id_panitia,
          user_id: user.id,
          nama_seleksi: "Gelombang 1",
          nilai_smt1: randomNilai(),
          nilai_smt2: randomNilai(),
          nilai_smt3: randomNilai(),
          nilai_smt4: randomNilai(),
          nilai_smt5: randomNilai(),
          status_seleksi: i % 2 === 0 ? "LULUS" : "TIDAK_LULUS",
          waktu_seleksi: new Date("2026-03-20T09:00:00"),
        },
      });
    }

    console.log(`Pendaftar seeded: ${username} - ${nama}`);
  }

  console.log("Seeding selesai!");
  console.log("Username admin: admin_veritas | Password: password123");
  console.log("Username pendaftar: pendaftar_001 s.d pendaftar_100 | Password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
