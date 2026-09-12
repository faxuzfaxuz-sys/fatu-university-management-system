# FATU University Portal

FATU universitet boshqaruv portali: qabul arizalari, e'lonlar, talabalar, o'qituvchilar, baholar, jadval va hisobotlar.

## Ishga tushirish

1. Node.js 20+ va PostgreSQL 14+ o'rnating.
2. `.env.example` faylini `.env.local` nomi bilan nusxalang va `DATABASE_URL` hamda `JWT_SECRET` qiymatlarini kiriting.
3. Paketlarni o'rnating:

   ```bash
   npm install
   ```

4. Ma'lumotlar bazasi jadvallarini yarating:

   ```bash
   npm run db:push
   ```

5. Demo ma'lumotlarini kiriting:

   ```bash
   npm run db:seed
   ```

6. Ilovani ishga tushiring:

   ```bash
   npm run dev
   ```

   Production uchun:

   ```bash
   npm run build
   npm start
   ```

## Windows setup.exe

Windows installer source kodi `desktop/` ichida. Windows runtime va PostgreSQL
talab qilingani sababli haqiqiy `setup.exe` Windows build runner’da chiqariladi.
GitHub Actions workflow'ni `Build Windows installer` nomi bilan qo‘lda ishga
tushirsangiz, tayyor `.exe` fayl Actions artifact sifatida beriladi.

Installer ilovaning ichki serverini avtomatik ishga tushiradi. PostgreSQL
serveri alohida o‘rnatilgan va ishlayotgan bo‘lishi kerak.

## Demo akkauntlar

Seed bajarilgandan keyin login sahifasida demo akkauntlar ko'rsatiladi:

- Rektor: `rector@fatu.uz` / `rector2024`
- Dekan: `dean.da@fatu.uz` / `dean2024`
- O'qituvchi: `mirzo@fatu.uz` / `teacher2024`
- Talaba: `sardor@student.fatu.uz` / `student2024`

Production muhitida demo parollarini almashtiring.

## Tekshiruv buyruqlari

```bash
npm run typecheck
npm run lint
npm run build
```

## Muhim xavfsizlik eslatmalari

- `DATABASE_URL` va `JWT_SECRET` ni kodga yozmang.
- `/api/seed` endpoint'i faqat `SEED_SECRET` berilgandagina ishlaydi; boshlang'ich seed'dan keyin `SEED_SECRET` ni olib tashlang.
- `/api/health` faqat ulanishni tekshiradi va ma'lumotlar bazasini o'zi o'zgartirmaydi.