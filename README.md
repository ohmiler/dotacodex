# DotaCodex 🎮

> เรียนรู้ Dota 2 จากศูนย์สู่ฮีโร่ | Learn Dota 2 from Zero to Hero

Web Application สำหรับเรียนรู้ Dota 2 สำหรับผู้เล่นใหม่ พร้อมระบบ Hero Database, Item Guide และ Learning Paths

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite)

## ✨ Features

- 🦸 **Hero Database** - ข้อมูล Hero 127 ตัว sync จาก OpenDota API
- ⚔️ **Item Guide** - คู่มือ Items พร้อมแนะนำ Build
- 📚 **Learning Paths** - บทเรียน Step-by-step สำหรับผู้เริ่มต้น
- 🌐 **Bilingual** - รองรับภาษาไทยและอังกฤษ
- 🔐 **Authentication** - Login ด้วย Email/Password หรือ Steam
- 🌑 **Dark Theme** - ธีมสีสไตล์ Dota 2

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database:** SQLite + Drizzle ORM
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS v4
- **i18n:** next-intl (Thai/English)
- **API:** OpenDota API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dotacodex.git
cd dotacodex

# Install dependencies
npm install

# Create database and run migrations
npm run db:push

# Start development server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

### Environment Variables

สร้างไฟล์ `.env.local`:

```env
# NextAuth (required)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Steam API (optional)
STEAM_API_KEY=your-steam-api-key

# OpenDota API (optional - for higher rate limits)
OPENDOTA_API_KEY=your-opendota-api-key
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # Auth pages
│   ├── heroes/            # Heroes pages
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── heroes/           # Hero components
│   ├── layout/           # Layout components
│   └── providers/        # Context providers
├── lib/                   # Utilities
│   ├── db/               # Database (Drizzle)
│   ├── auth.ts           # NextAuth config
│   └── opendota.ts       # OpenDota API client
└── messages/             # i18n translations
    ├── en.json
    └── th.json
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |

## 🔄 Syncing Data

เมื่อเปิดหน้า Heroes ครั้งแรก ให้กดปุ่ม "Sync from OpenDota" เพื่อดึงข้อมูล Heroes จาก API

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is not affiliated with Valve Corporation.  
Dota 2 is a registered trademark of Valve Corporation.

---

Made with ❤️ for Dota 2 beginners
