/**
 * lib/env.ts
 * Validasi environment variables wajib saat startup.
 * Di-import dari app/layout.tsx agar dicek di awal.
 */

const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

// Hanya cek di server-side (bukan di browser)
if (typeof window === "undefined") {
  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      console.error(`[ENV] Missing required environment variable: ${key}`);
      // Tidak throw error agar tidak break build, hanya log peringatan
    }
  });
}
