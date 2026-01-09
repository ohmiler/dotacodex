# 🚀 สิ่งที่ได้เรียนรู้จากการ Build DotaCodex

> บันทึกจากการพัฒนา [DotaCodex](https://dotacodex.com) - เว็บไซต์สำหรับเรียนรู้ Dota 2 สำหรับผู้เริ่มต้น

---

## 📚 สารบัญ

1. [Security Best Practices](#-security)
2. [Performance Optimization](#-performance)
3. [Database Optimization](#-database)
4. [Next.js 14 Best Practices](#-nextjs-14)

---

## 🔒 Security

### 1. อย่า Hardcode Secrets!

❌ **อย่าทำ:**
```typescript
const SECRET = process.env.SECRET || 'my-default-secret';
```

✅ **ให้ทำ:**
```typescript
if (!process.env.SECRET) {
    throw new Error('SECRET is required');
}
const SECRET = process.env.SECRET;
```

**เหตุผล:** Default value อาจถูก commit และใช้ใน production โดยไม่ตั้งใจ

---

### 2. ซ่อน Error Details ใน Production

```typescript
const errorDetails = process.env.NODE_ENV === 'production' 
    ? 'An error occurred' 
    : error.message;
```

**เหตุผล:** Stack trace และ error messages อาจเปิดเผยข้อมูลภายในระบบ

---

### 3. Rate Limiting + Account Lockout

```typescript
// หลังจาก 5 ครั้งที่ login ผิด
if (failedAttempts >= 5) {
    lockAccount(15 * 60 * 1000); // Lock 15 นาที
}
```

**เหตุผล:** ป้องกัน brute force attacks

---

### 4. ใช้ bcrypt Cost Factor ที่สูงพอ

```typescript
// ใช้ cost factor 12 ขึ้นไป
const hashedPassword = await bcrypt.hash(password, 12);
```

**เหตุผล:** Cost factor ต่ำเกินไปทำให้ crack ได้ง่าย

---

## ⚡ Performance

### 1. ISR (Incremental Static Regeneration)

```typescript
// หน้าจะถูก pre-render และ revalidate ทุก 24 ชั่วโมง
export const revalidate = 86400;

export async function generateStaticParams() {
    const heroes = await db.select({ id: heroes.id }).from(heroes);
    return heroes.map(h => ({ id: String(h.id) }));
}
```

**ผลลัพธ์:** ลด DB reads จากทุก request → เหลือ 1 ครั้ง/24 ชม.

---

### 2. unstable_cache สำหรับ Heavy Queries

```typescript
const getCachedData = unstable_cache(
    async (id: number) => {
        return await db.query.table.findFirst({ where: eq(table.id, id) });
    },
    ['cache-key'],
    { revalidate: 86400 }
);
```

**ผลลัพธ์:** Query เดิมไม่ต้อง hit database ซ้ำ

---

### 3. Streaming with Suspense

```tsx
export default async function Page() {
    // Data ที่โหลดเร็ว
    const fastData = await getFastData();
    
    return (
        <div>
            <FastContent data={fastData} />
            
            {/* Data ที่โหลดช้า - stream เข้ามาทีหลัง */}
            <Suspense fallback={<Skeleton />}>
                <SlowContent />
            </Suspense>
        </div>
    );
}

async function SlowContent() {
    const slowData = await getSlowData(); // เรียก external API
    return <div>{slowData}</div>;
}
```

**ผลลัพธ์:** User เห็นหน้าเว็บทันที ไม่ต้องรอจนข้อมูลครบ

---

### 4. Promise.all สำหรับ Parallel Fetching

```typescript
// ❌ Sequential - ช้า
const heroes = await getHeroes();
const items = await getItems();
const matchups = await getMatchups();

// ✅ Parallel - เร็ว
const [heroes, items, matchups] = await Promise.all([
    getHeroes(),
    getItems(),
    getMatchups(),
]);
```

**ผลลัพธ์:** เวลารวม = เวลาของ request ที่ช้าที่สุด (ไม่ใช่ผลรวม)

---

## 🗄️ Database

### 1. ใช้ Raw SQL เมื่อ ORM มีปัญหา

```typescript
// Drizzle ORM ไม่ทำงานกับ Turso?
// ใช้ raw SQL แทน
await db.run(sql`
    INSERT INTO user_progress (user_id, topic_id, completed)
    VALUES (${userId}, ${topicId}, ${completed})
`);
```

**บทเรียน:** ORM ไม่ได้ perfect กับทุก database

---

### 2. ระวัง Row Reads ใน Serverless Database

| Action | Row Reads |
|--------|-----------|
| Query 1 hero | 1 |
| Query ALL heroes | ~130 |
| Build ใหม่ (ISR) | ~10,000+ |

**วิธีแก้:** Cache ให้มากที่สุด!

---

### 3. สร้าง Index สำหรับ Query ที่ใช้บ่อย

```sql
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
```

**เหตุผล:** ช่วยให้ database หา row ได้เร็วขึ้นอย่างมาก

---

## 📦 Next.js 14

### 1. Server Components vs Client Components

| Type | ใช้เมื่อ |
|------|---------|
| **Server** | Fetch data, เข้าถึง database, ไม่ต้องการ interactivity |
| **Client** | useState, useEffect, onClick, browser APIs |

```tsx
// Server Component (default)
export default async function Page() {
    const data = await db.query.table.findMany();
    return <div>{data}</div>;
}

// Client Component
'use client';
export default function Button() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

---

### 2. Route Handlers ที่ปลอดภัย

```typescript
// ใช้ getToken แทน getServerSession สำหรับ API routes
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // ... rest of the handler
}
```

---

### 3. Metadata สำหรับ SEO

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
    const hero = await getHero(params.id);
    
    return {
        title: `${hero.name} - Hero Guide`,
        description: `Learn how to play ${hero.name}`,
        openGraph: {
            title: hero.name,
            images: [{ url: hero.img }],
        },
    };
}
```

---

## 💡 สรุป Key Takeaways

1. **Security First** - อย่า hardcode secrets, ซ่อน error details
2. **Cache Everything** - ISR, unstable_cache, ลด DB reads
3. **Perceived Performance** - Streaming ทำให้ user รู้สึกเร็ว
4. **Measure & Optimize** - Log API usage, ดู DB reads

---

## 🔗 Resources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Turso Database](https://turso.tech/)
- [NextAuth.js](https://next-auth.js.org/)

---

> 📝 บทความนี้เขียนจากประสบการณ์จริงในการพัฒนา DotaCodex  
> หวังว่าจะเป็นประโยชน์กับเพื่อนๆ developer ครับ! 🚀
