# DotaCodex 🎮

<div align="center">

![DotaCodex Logo](https://img.shields.io/badge/DotaCodex-Learn%20Dota%202-66ff66?style=for-the-badge&logo=steam&logoColor=white)

**เรียนรู้ Dota 2 จากศูนย์สู่ฮีโร่ | Learn Dota 2 from Zero to Hero**

Web Application สำหรับเรียนรู้ Dota 2 สำหรับผู้เล่นใหม่ พร้อมระบบ Hero Database, Item Guide และ Learning Paths

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite)](https://www.sqlite.org/)

[🌐 Live Demo](#) • [📖 Documentation](#features) • [🐛 Report Bug](https://github.com/ohmiler/dotacodex/issues)

</div>

---

## ✨ Features

### 🦸 Hero Database
- ข้อมูล Hero **127 ตัว** sync จาก OpenDota API
- กรองตาม **Attribute** (STR/AGI/INT/Universal)
- กรองตาม **Role** (Carry, Support, Nuker, etc.)
- หน้า Detail พร้อม **Stats, Counters, Tips**

### ⚔️ Item Guide
- คู่มือ Items พร้อม **293 ไอเทม**
- แบ่งหมวด **Basic / Upgrade**
- แสดง **Components** และราคา
- Modal แสดงรายละเอียด

### 📚 Learning Paths
- **6 บทเรียน** สำหรับผู้เริ่มต้น
- เนื้อหา **ภาษาไทย/อังกฤษ**
- หมวดหมู่: Basics, Mechanics, Heroes, Items
- Navigation ระหว่างบทเรียน

### 🌐 Internationalization
- รองรับ **ภาษาไทย** และ **อังกฤษ**
- เปลี่ยนภาษาได้ทันที
- เนื้อหาแปลครบถ้วน

### 🔐 Authentication
- Login ด้วย **Email/Password**
- พร้อมรองรับ **Steam OAuth** (ต้อง config API key)
- Session management ด้วย JWT

### 🌑 Dark Theme
- ธีมสีสไตล์ **Dota 2**
- Radiant Green, Dire Red, Gold accents
- Glassmorphism effects

---

## 📸 Screenshots

| หน้าหลัก | Heroes |
|:---:|:---:|
| Homepage with features | Hero grid with filters |

| Items | Learning |
|:---:|:---:|
| Item grid with modal | Beginner tutorials |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript |
| **Database** | SQLite + Drizzle ORM |
| **Auth** | NextAuth.js |
| **Styling** | Tailwind CSS v4 |
| **i18n** | next-intl (Thai/English) |
| **API** | OpenDota API |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ohmiler/dotacodex.git
cd dotacodex

# Install dependencies
npm install

# Create database and run migrations
npm run db:push

# Start development server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

### Sync Data from OpenDota

1. ไปที่หน้า Heroes หรือ Items
2. กดปุ่ม **"Sync from OpenDota"**
3. รอ data sync เสร็จ (ใช้เวลา ~5 วินาที)

---

## 🔧 Environment Variables

สร้างไฟล์ `.env.local`:

```env
# NextAuth (required)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Steam API (optional - for Steam login)
# Get your key from: https://steamcommunity.com/dev/apikey
STEAM_API_KEY=your-steam-api-key

# OpenDota API (optional - for higher rate limits)
# Get your key from: https://www.opendota.com/api-keys
OPENDOTA_API_KEY=your-opendota-api-key
```

---

## 📁 Project Structure

```
dotacodex/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── heroes/        # Heroes API
│   │   │   ├── items/         # Items API
│   │   │   └── sync/          # OpenDota sync
│   │   ├── auth/              # Auth pages (login, register)
│   │   ├── heroes/            # Heroes pages
│   │   │   └── [id]/          # Hero detail
│   │   ├── items/             # Items page
│   │   ├── learn/             # Learning pages
│   │   │   └── [slug]/        # Topic detail
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # React components
│   │   ├── heroes/            # HeroGrid, HeroDetail
│   │   ├── items/             # ItemGrid
│   │   ├── layout/            # Navbar, Footer
│   │   ├── learn/             # TopicContent
│   │   └── providers/         # SessionProvider
│   ├── data/                  # Static data
│   │   └── learningTopics.ts  # Learning content
│   ├── lib/                   # Utilities
│   │   ├── db/                # Database (Drizzle)
│   │   ├── auth.ts            # NextAuth config
│   │   └── opendota.ts        # OpenDota API client
│   ├── messages/              # i18n translations
│   │   ├── en.json
│   │   └── th.json
│   └── i18n.ts                # i18n config
├── data/                      # SQLite database
├── drizzle.config.ts          # Drizzle config
└── package.json
```

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |

---

## 📚 Learning Topics

| หัวข้อ | หมวดหมู่ | เวลา |
|--------|----------|------|
| Dota 2 คืออะไร? | Basics | 5 นาที |
| การควบคุมฮีโร่เบื้องต้น | Basics | 10 นาที |
| Last Hit และ Deny | Mechanics | 15 นาที |
| ฮีโร่แนะนำสำหรับมือใหม่ | Heroes | 10 นาที |
| เข้าใจ Role และ Position | Basics | 10 นาที |
| พื้นฐานการซื้อไอเทม | Items | 15 นาที |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is not affiliated with Valve Corporation.  
Dota 2 is a registered trademark of Valve Corporation.

---

<div align="center">

Made with ❤️ for Dota 2 beginners by [ohmiler](https://github.com/ohmiler)

</div>
