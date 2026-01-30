# Panduan Deploy ke Vercel (Gratis)

Aplikasi ini sekarang dikonfigurasi menggunakan **PostgreSQL** agar datanya aman dan tidak hilang saat di-deploy ke Vercel.

## Langkah 1: Push Kode ke GitHub
1. Buat repository baru di [GitHub](https://github.com/new).
2. Push kode project ini ke repository tersebut:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <URL_REPO_ANDA>
   git push -u origin main
   ```

## Langkah 2: Setup Project di Vercel
1. Bikin akun / Login di [Vercel](https://vercel.com).
2. Klik **"Add New..."** -> **"Project"**.
3. Import repository GitHub yang baru Anda buat.
4. Di bagian **Configure Project**:
   - **Framework Preset**: Next.js (Otomatis terdeteksi)
   - **Environment Variables**:
     - Masukkan `ADMIN_PASSWORD` (Isi dengan password admin yang Anda inginkan).
     - **JANGAN** isi `DATABASE_URL` dulu secara manual di sini, kita akan generate di langkah selanjutnya.

5. Klik **Deploy**. (Deployment pertama mungkin akan error/gagal karena database belum konek, ini **NORMAL**. Biarkan saja).

## Langkah 3: Buat Database (Vercel Postgres)
1. Setelah project dibuat (meski deployment gagal), masuk ke dashboard project tersebut di Vercel.
2. Klik tab **Storage** di menu atas.
3. Klik **Connect Store** -> **Create New** -> **Postgres**.
4. Beri nama database (misal: `paket-db`), pilih region (Singapore `sin1` paling cepat untuk Indonesia), lalu klik **Create**.
5. Setelah selesai dibuat, klik tombol **Connect Project** (jika belum otomatis terkoneksi).
   - Vercel akan otomatis menambahkan Environment Variable: `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, dll ke project Anda.

## Langkah 4: Update Konfigurasi Environment & Redeploy
1. Masuk ke tab **Settings** -> **Environment Variables**.
2. Pastikan ada variable bernama `POSTGRES_PRISMA_URL` dan `POSTGRES_URL_NON_POOLING`.
3. Kita perlu variable standar `DATABASE_URL` yang dimengerti Prisma.
   - Vercel biasanya otomatis menyediakan `POSTGRES_PRISMA_URL`.
   - **PENTING**: Buat Environment Variable baru:
     - **Key**: `DATABASE_URL`
     - **Value**: Copy nilai dari `POSTGRES_PRISMA_URL`. (Anda bisa lihat nilainya dengan klik ikon mata/copy).
4. Klik **Save**.
5. Pergi ke tab **Deployments**.
6. Klik titik tiga di deployment terakhir (yang gagal tadi) -> **Redeploy**.
7. Centang "Redeploy with existing build cache" jika ada, lalu konfirmasi.

## Langkah 5: Setup Database Schema
Agar tabel terbentuk otomatis, kita perlu sedikit penyesuaian di Command Build Vercel.

1. Buka **Settings** -> **Build & Development Settings** di Vercel.
2. Di bagian **Build Command**, ubah (Override) menjadi:
   `npx prisma generate && npx prisma migrate deploy && next build`
3. Save, lalu Redeploy sekali lagi.

## Selesai!
Buka URL project Anda (misal `paket-rumah.vercel.app`).
Web sudah live, database aman, dan gratis selamanya (dengan limit free tier Vercel yang sangat cukup untuk usage pribadi).
