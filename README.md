# Eventra Ticketing

Scaffolding SaaS ticketing multi-tenant untuk Fun Run dan Seminar/Webinar.

## Cakupan awal

- Tenant dapat membuat banyak event dan menetapkan admin per event.
- Landing page publik unik di `/e/[slug]`.
- Preset form dinamis untuk Fun Run dan Seminar/Webinar.
- Midtrans milik tenant atau gateway global Eventra.
- Registrasi ulang on-site, verifikasi identitas, nomor BIB, race pack, dan check-in.
- Superadmin untuk tenant dan konfigurasi platform.

## Menjalankan

```bash
pnpm install
pnpm dev
```

Salin `.env.example` menjadi `.env` dan isi koneksi MySQL. UI saat ini memakai data demo agar seluruh halaman dapat langsung dilihat tanpa database.

## Tahap implementasi berikutnya

1. Autentikasi dan pembatasan tenant/event.
2. Prisma migration dan seed.
3. CRUD event, form builder, tiket, voucher, dan admin event.
4. Midtrans Snap serta webhook idempotent.
5. Scanner QR dan state machine registrasi on-site.
