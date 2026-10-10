# FATU University Portal

FATU universitet boshqaruv portali: qabul arizalari, e'lonlar, talabalar, o'qituvchilar, baholar, jadval va hisobotlar.

## Ishga tushirish

Node.js 20+ kifoya. Ma'lumotlar bazasi uchun ikki variant bor:

### A variant — PostgreSQL o'rnatmasdan (eng oson)

Loyihaga ichki embedded Postgres (PGlite) qo'shilgan — alohida PostgreSQL server
o'rnatish shart emas:

```bash
npm install

# 1-terminal: embedded Postgres serveri (ma'lumotlar .pglite/ da saqlanadi)
npm run dev:db

# 2-terminal: DATABASE_URL ni embedded serverga qaratib ishga tushiring
# (Windows PowerShell: $env:DATABASE_URL = "..."; $env:JWT_SECRET = "...")
DATABASE_URL=postgres://postgres@127.0.0.1:5432/postgres \
JWT_SECRET=$(openssl rand -hex 32) \
npm run dev
```

So'ng bir marta jadvallar va demo ma'lumotlarni yarating (3-terminal yoki alohida buyruq):

```bash
DATABASE_URL=postgres://postgres@127.0.0.1:5432/postgres npm run db:push
DATABASE_URL=postgres://postgres@127.0.0.1:5432/postgres \
JWT_SECRET=$(openssl rand -hex 32) npm run db:seed
```

5432 port band bo'lsa: `PGLITE_PORT=5433 npm run dev:db` va DATABASE_URL da ham shu portni ko'rsating.

### B variant — haqiqiy PostgreSQL bilan

1. PostgreSQL 14+ o'rnating.
2. `.env.example` faylini `.env.local` nomi bilan nusxalang va `DATABASE_URL` hamda `JWT_SECRET` qiymatlarini kiriting.
3. Paketlarni o'rnating va bazani tayyorlang:

   ```bash
   npm install
   npm run db:push
   npm run db:seed
   ```

4. Ilovani ishga tushiring:

   ```bash
   npm run dev
   ```

   Production uchun:

   ```bash
   npm run build
   npm start
   ```

Ilova http://localhost:3000 da ochiladi.

## Windows setup.exe

Windows installer source kodi `desktop/` ichida. Windows runtime va PostgreSQL
talab qilingani sababli haqiqiy `setup.exe` Windows build runner’da chiqariladi.
GitHub Actions'da `Build Windows installer` workflow'ni qo‘lda ishga tushirsangiz
(Actions → Build Windows installer → Run workflow), tayyor `.exe` fayl artifact
sifatida beriladi.

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
