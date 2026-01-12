// Initial learning topics data for beginners
export const learningTopics = [
    // Getting Started
    {
        id: 'what-is-dota',
        category: 'basics',
        titleEn: 'What is Dota 2?',
        titleTh: 'Dota 2 คืออะไร?',
        descriptionEn: 'Learn the basics of Dota 2 and what makes it unique.',
        descriptionTh: 'เรียนรู้พื้นฐานของ Dota 2 และสิ่งที่ทำให้มันพิเศษ',
        duration: 5,
        difficulty: 1,
        contentEn: `
# What is Dota 2?

Dota 2 is a free-to-play multiplayer online battle arena (MOBA) game developed by Valve Corporation. It's one of the most popular esports games in the world.

## The Basics

- **5v5 Team Game**: Two teams of five players compete against each other
- **Objective**: Destroy the enemy's Ancient (main building) while protecting your own
- **Heroes**: Each player controls one of 120+ unique heroes with special abilities
- **Items**: Use gold to buy items that make your hero stronger

## Game Structure

1. **Laning Phase** (0-15 minutes): Farm gold and experience in lanes
2. **Mid Game** (15-30 minutes): Take objectives and team fights
3. **Late Game** (30+ minutes): Push for victory

## Why Dota 2?

- Deep strategic gameplay
- No pay-to-win mechanics
- Massive prize pools in tournaments
- Active community and frequent updates
    `,
        contentTh: `
# Dota 2 คืออะไร?

Dota 2 เป็นเกม MOBA (Multiplayer Online Battle Arena) ที่พัฒนาโดย Valve Corporation เป็นหนึ่งในเกม esports ที่ได้รับความนิยมมากที่สุดในโลก

## พื้นฐาน

- **เกม 5v5**: สองทีม ทีมละ 5 คน แข่งขันกัน
- **เป้าหมาย**: ทำลาย Ancient (อาคารหลัก) ของศัตรู พร้อมปกป้องของเรา
- **ฮีโร่**: ผู้เล่นแต่ละคนควบคุมฮีโร่ 1 ตัวจาก 120+ ตัว แต่ละตัวมีสกิลพิเศษ
- **ไอเทม**: ใช้ทองซื้อไอเทมเพื่อเพิ่มความแข็งแกร่ง

## โครงสร้างเกม

1. **Laning Phase** (0-15 นาที): หาเงินและประสบการณ์ในเลน
2. **Mid Game** (15-30 นาที): ยึด Objective และไฟต์ทีม
3. **Late Game** (30+ นาที): ดันเพื่อชัยชนะ

## ทำไมต้อง Dota 2?

- Gameplay เชิงกลยุทธ์ลึกซึ้ง
- ไม่มีระบบ Pay-to-win
- เงินรางวัลในทัวร์นาเมนต์มหาศาล
- ชุมชนแอคทีฟและอัพเดทบ่อย
    `,
    },
    {
        id: 'hero-controls',
        category: 'basics',
        titleEn: 'Basic Hero Controls',
        titleTh: 'การควบคุมฮีโร่เบื้องต้น',
        descriptionEn: 'Master the essential controls to play Dota 2.',
        descriptionTh: 'เรียนรู้การควบคุมพื้นฐานที่จำเป็นในการเล่น Dota 2',
        duration: 10,
        difficulty: 1,
        contentEn: `
# Basic Hero Controls

## Movement

- **Right Click**: Move to location / Attack target
- **A + Left Click**: Attack move (attack nearest enemy)
- **S**: Stop current action
- **H**: Hold position

## Camera

- **Edge Pan**: Move mouse to screen edge
- **Middle Mouse**: Drag camera
- **F1**: Center camera on hero
- **Space**: Center camera on hero (hold)

## Abilities

- **Q, W, E, R**: Use abilities (varies by hero)
- **D, F**: Extra abilities / Items
- **Alt + Ability**: Self-cast

## Items

- **1-6**: Use items in inventory slots
- **Backpack**: 3 extra slots (items have cooldown when moved)

## Communication

- **Y**: Team voice chat
- **Enter**: Text chat
- **Alt + Click**: Ping / Signal

## Pro Tips

1. **Always keep moving** - Standing still makes you an easy target
2. **Use quickcast** - Faster ability usage in settings
3. **Bind items** - Put active items on easy keys
    `,
        contentTh: `
# การควบคุมฮีโร่เบื้องต้น

## การเคลื่อนที่

- **คลิกขวา**: เดินไปตำแหน่ง / โจมตีเป้าหมาย
- **A + คลิกซ้าย**: Attack move (โจมตีศัตรูที่ใกล้ที่สุด)
- **S**: หยุดการกระทำปัจจุบัน
- **H**: ยืนนิ่งในตำแหน่ง

## กล้อง

- **Edge Pan**: เลื่อนเมาส์ไปขอบจอ
- **ปุ่มกลางเมาส์**: ลากกล้อง
- **F1**: จับกล้องไปที่ฮีโร่
- **Space**: จับกล้องไปที่ฮีโร่ (กดค้าง)

## สกิล

- **Q, W, E, R**: ใช้สกิล (แตกต่างตามฮีโร่)
- **D, F**: สกิลเสริม / ไอเทม
- **Alt + สกิล**: ใช้กับตัวเอง

## ไอเทม

- **1-6**: ใช้ไอเทมในช่อง inventory
- **Backpack**: 3 ช่องเสริม (ไอเทมมี CD เมื่อย้าย)

## การสื่อสาร

- **Y**: พูดกับทีม
- **Enter**: แชทข้อความ
- **Alt + คลิก**: Ping / ส่งสัญญาณ

## เคล็ดลับ

1. **เคลื่อนที่ตลอด** - ยืนนิ่งทำให้เป็นเป้าง่าย
2. **ใช้ Quickcast** - ใช้สกิลเร็วขึ้นในตั้งค่า
3. **ตั้งปุ่มไอเทม** - วางไอเทม Active บนปุ่มที่กดสะดวก
    `,
    },
    {
        id: 'last-hitting',
        category: 'mechanics',
        titleEn: 'Last Hitting & Denying',
        titleTh: 'Last Hit และ Deny',
        descriptionEn: 'The most important skill for farming gold efficiently.',
        descriptionTh: 'ทักษะสำคัญที่สุดสำหรับการหาเงินอย่างมีประสิทธิภาพ',
        duration: 15,
        difficulty: 2,
        contentEn: `
# Last Hitting & Denying

## What is Last Hitting?

Last hitting means dealing the **final blow** to an enemy creep to get gold. This is how you earn most of your gold in the early game.

## Gold Values

- **Melee Creep**: ~35-40 gold
- **Ranged Creep**: ~40-48 gold
- **Siege Creep**: ~66-80 gold

## How to Last Hit

1. Watch the creep's health bar
2. Time your attack to land when HP is low enough
3. Consider your hero's attack damage and animation

## What is Denying?

Denying means killing your **own creeps** (when below 50% HP) to:
- Deny gold to enemies
- Deny experience to enemies
- Control lane position

## Tips for Success

- **Practice in Demo Mode**: Use the last hit trainer
- **Know your damage**: Check your attack damage
- **Watch the creep aggro**: Enemy creeps will attack you
- **Use abilities wisely**: Some heroes can use skills to last hit
- **Quelling Blade**: +8 damage vs creeps (great starting item)

## Common Mistakes

❌ Attacking creeps too early
❌ Not watching enemy hero position
❌ Forgetting to deny
❌ Standing in creep wave (taking damage)
    `,
        contentTh: `
# Last Hit และ Deny

## Last Hit คืออะไร?

Last Hit คือการโจมตี**ครั้งสุดท้าย**ใส่ครีปศัตรูเพื่อรับทอง นี่คือวิธีหลักในการหาเงินช่วงต้นเกม

## ค่าทองที่ได้

- **Melee Creep**: ~35-40 ทอง
- **Ranged Creep**: ~40-48 ทอง
- **Siege Creep**: ~66-80 ทอง

## วิธี Last Hit

1. สังเกตแถบเลือดครีป
2. จังหวะโจมตีให้ลงพอดีตอน HP เหลือน้อยพอ
3. คำนึงถึงดาเมจและ Animation การตีของฮีโร่

## Deny คืออะไร?

Deny คือการฆ่า**ครีปของเราเอง** (เมื่อเลือดต่ำกว่า 50%) เพื่อ:
- ปฏิเสธทองจากศัตรู
- ปฏิเสธ EXP จากศัตรู
- ควบคุมตำแหน่งเลน

## เคล็ดลับความสำเร็จ

- **ฝึกใน Demo Mode**: ใช้ Last Hit Trainer
- **รู้ดาเมจตัวเอง**: เช็คค่า Attack Damage
- **สังเกต Creep Aggro**: ครีปศัตรูจะตีเรา
- **ใช้สกิลอย่างฉลาด**: บางฮีโร่ใช้สกิล Last Hit ได้
- **Quelling Blade**: +8 ดาเมจใส่ครีป (ไอเทมเริ่มต้นที่ดี)

## ข้อผิดพลาดที่พบบ่อย

❌ ตีครีปเร็วเกินไป
❌ ไม่สังเกตตำแหน่งฮีโร่ศัตรู
❌ ลืม Deny
❌ ยืนในกลุ่มครีป (โดนตี)
    `,
    },
    {
        id: 'beginner-heroes',
        category: 'heroes',
        titleEn: 'Best Heroes for Beginners',
        titleTh: 'ฮีโร่แนะนำสำหรับมือใหม่',
        descriptionEn: 'Start your journey with these beginner-friendly heroes.',
        descriptionTh: 'เริ่มต้นการเดินทางของคุณด้วยฮีโร่ที่เหมาะกับมือใหม่',
        duration: 10,
        difficulty: 1,
        contentEn: `
# Best Heroes for Beginners

## Support Heroes

### Crystal Maiden ❄️
- Easy to understand abilities
- Strong slows and disable
- Provides mana to team

### Lich 🧊
- Simple point-and-click abilities
- Good lane harass
- Scales well into late game

### Ogre Magi 🔥
- Very tanky support
- High base armor
- Simple abilities with luck factor

## Carry Heroes

### Wraith King 👑
- Only one active ability
- Has a second life (ultimate)
- Easy to farm with

### Juggernaut ⚔️
- Spin to win (Blade Fury)
- Built-in healing
- Strong at all stages

### Phantom Assassin 🗡️
- Simple to understand
- Very rewarding crits
- Good mobility

## Tips for New Players

1. **Start with Support**: Less pressure to farm perfectly
2. **Watch your positioning**: Don't stand in front
3. **Communicate**: Ping and chat with team
4. **Copy builds**: Use in-game guides
5. **Focus on not dying**: Deaths hurt more than kills help
    `,
        contentTh: `
# ฮีโร่แนะนำสำหรับมือใหม่

## Support Heroes

### Crystal Maiden ❄️
- สกิลเข้าใจง่าย
- มี Slow และ Disable ดี
- ให้มานาทีม

### Lich 🧊
- สกิลแบบ Point-and-click ง่าย
- Harass เลนได้ดี
- Scale ได้ดีช่วง Late Game

### Ogre Magi 🔥
- Support ที่ทนมาก
- Armor พื้นฐานสูง
- สกิลง่ายๆ มี Luck Factor

## Carry Heroes

### Wraith King 👑
- มีสกิล Active แค่ 1
- มีชีวิตที่สอง (Ultimate)
- ฟาร์มง่าย

### Juggernaut ⚔️
- หมุนก็ชนะ (Blade Fury)
- มีสกิลฮีลในตัว
- แข็งแกร่งทุกช่วง

### Phantom Assassin 🗡️
- เข้าใจง่าย
- Crit สุดมันส์
- เคลื่อนที่ดี

## เคล็ดลับสำหรับผู้เล่นใหม่

1. **เริ่มเล่น Support**: กดดันน้อยกว่าในการฟาร์ม
2. **ระวังตำแหน่ง**: อย่ายืนหน้า
3. **สื่อสาร**: Ping และแชทกับทีม
4. **ก๊อปปี้ Build**: ใช้ Guide ในเกม
5. **โฟกัสไม่ตาย**: ตายเจ็บกว่าฆ่าได้
    `,
    },
    {
        id: 'roles-positions',
        category: 'basics',
        titleEn: 'Understanding Roles & Positions',
        titleTh: 'เข้าใจ Role และ Position',
        descriptionEn: 'Learn about the 5 positions in Dota 2.',
        descriptionTh: 'เรียนรู้เกี่ยวกับ 5 Position ใน Dota 2',
        duration: 10,
        difficulty: 1,
        contentEn: `
# Understanding Roles & Positions

## The 5 Positions

### Position 1 - Hard Carry (Safe Lane)
- **Priority**: Highest farm priority
- **Goal**: Become the strongest late-game
- **Examples**: Anti-Mage, Phantom Assassin, Spectre

### Position 2 - Mid Lane
- **Priority**: Solo experience and gold
- **Goal**: Win lane, create space
- **Examples**: Storm Spirit, Invoker, Queen of Pain

### Position 3 - Offlane
- **Priority**: Survive, disrupt enemy carry
- **Goal**: Initiate fights, be tanky
- **Examples**: Axe, Tidehunter, Mars

### Position 4 - Soft Support (Roamer)
- **Priority**: Help lanes, make plays
- **Goal**: Gank, set up kills
- **Examples**: Earth Spirit, Tusk, Mirana

### Position 5 - Hard Support
- **Priority**: Lowest farm, buy wards
- **Goal**: Protect carry, provide vision
- **Examples**: Crystal Maiden, Lich, Shadow Shaman

## Key Takeaways

- **Farm goes to carries**: Don't steal farm from Pos 1/2
- **Supports buy wards**: Vision wins games
- **Everyone has a role**: Stick to your job
    `,
        contentTh: `
# เข้าใจ Role และ Position

## 5 ตำแหน่ง

### Position 1 - Hard Carry (Safe Lane)
- **ลำดับ**: ฟาร์มสูงสุด
- **เป้าหมาย**: แข็งแกร่งที่สุด Late Game
- **ตัวอย่าง**: Anti-Mage, Phantom Assassin, Spectre

### Position 2 - Mid Lane
- **ลำดับ**: EXP และ Gold เดี่ยว
- **เป้าหมาย**: ชนะเลน สร้าง Space
- **ตัวอย่าง**: Storm Spirit, Invoker, Queen of Pain

### Position 3 - Offlane
- **ลำดับ**: รอดชีวิต รบกวน Carry ศัตรู
- **เป้าหมาย**: เปิดไฟต์ ทนทาน
- **ตัวอย่าง**: Axe, Tidehunter, Mars

### Position 4 - Soft Support (Roamer)
- **ลำดับ**: ช่วยเลน สร้าง Play
- **เป้าหมาย**: Gank ตั้ง Kill
- **ตัวอย่าง**: Earth Spirit, Tusk, Mirana

### Position 5 - Hard Support
- **ลำดับ**: ฟาร์มต่ำสุด ซื้อ Ward
- **เป้าหมาย**: ปกป้อง Carry ให้ Vision
- **ตัวอย่าง**: Crystal Maiden, Lich, Shadow Shaman

## สิ่งสำคัญ

- **Farm ให้ Carry**: อย่าแย่งฟาร์ม Pos 1/2
- **Support ซื้อ Ward**: Vision ชนะเกม
- **ทุกคนมีหน้าที่**: ทำตาม Role ของตัวเอง
    `,
    },
    {
        id: 'item-basics',
        category: 'items',
        titleEn: 'Item Building Basics',
        titleTh: 'พื้นฐานการซื้อไอเทม',
        descriptionEn: 'Learn how to choose and build items effectively.',
        descriptionTh: 'เรียนรู้วิธีเลือกและซื้อไอเทมอย่างมีประสิทธิภาพ',
        duration: 15,
        difficulty: 2,
        contentEn: `
# Item Building Basics

## Types of Items

### Starting Items (0-500g)
- **Tangos**: Regenerate HP
- **Healing Salve**: Fast HP restore
- **Clarity**: Mana regeneration
- **Quelling Blade**: +8 damage vs creeps

### Early Game (500-2000g)
- **Boots of Speed**: +45 move speed
- **Magic Wand**: Store charges, burst heal
- **Bracer/Wraith Band/Null Talisman**: Cheap stats

### Core Items (2000-5000g)
These vary by hero - check in-game guides!

### Luxury Items (5000g+)
Late-game power spikes

## Item Builds by Role

### Carry
1. Damage items (Desolator, MKB)
2. Attack speed (Moon Shard)
3. Survivability (Satanic, BKB)

### Support
1. Wards (Observer + Sentry)
2. Utility (Force Staff, Glimmer Cape)
3. Team items (Mekansm, Pipe)

## Golden Rules

✅ **Always carry TP Scroll**
✅ **BKB on cores** (magic immunity)
✅ **Check enemy items** (counter-build)
✅ **Don't save for big items** (buy components)
    `,
        contentTh: `
# พื้นฐานการซื้อไอเทม

## ประเภทไอเทม

### Starting Items (0-500g)
- **Tangos**: ฟื้นฟู HP
- **Healing Salve**: ฟื้นฟู HP เร็ว
- **Clarity**: ฟื้นฟู Mana
- **Quelling Blade**: +8 ดาเมจใส่ครีป

### Early Game (500-2000g)
- **Boots of Speed**: +45 Move Speed
- **Magic Wand**: เก็บ Charge ฮีลทันที
- **Bracer/Wraith Band/Null Talisman**: Stat ราคาถูก

### Core Items (2000-5000g)
แตกต่างตามฮีโร่ - เช็ค Guide ในเกม!

### Luxury Items (5000g+)
Power Spike ช่วง Late Game

## Item Builds ตาม Role

### Carry
1. ไอเทมดาเมจ (Desolator, MKB)
2. Attack Speed (Moon Shard)
3. Survivability (Satanic, BKB)

### Support
1. Wards (Observer + Sentry)
2. Utility (Force Staff, Glimmer Cape)
3. Team Items (Mekansm, Pipe)

## กฎทอง

✅ **พก TP Scroll เสมอ**
✅ **BKB สำหรับ Core** (Magic Immunity)
✅ **เช็คไอเทมศัตรู** (Counter-build)
✅ **อย่าเก็บเงินซื้อของใหญ่** (ซื้อ Component ก่อน)
    `,
    },
    // Map Awareness & Minimap
    {
        id: 'map-awareness',
        category: 'basics',
        titleEn: 'Map Awareness & Minimap',
        titleTh: 'การมองแผนที่และ Minimap',
        descriptionEn: 'Learn to read the minimap and develop game sense.',
        descriptionTh: 'เรียนรู้การอ่าน minimap และพัฒนา game sense',
        duration: 10,
        difficulty: 1,
        contentEn: `
# Map Awareness & Minimap

## Why Minimap Matters

The minimap is your **most important tool** for survival and decision-making. Pro players look at it every 2-3 seconds!

## What to Watch For

### Enemy Heroes
- **Missing heroes** = potential gank incoming
- **5 visible** = safe to push or farm aggressively
- Count enemies before every move

### Ally Positions
- Know where your team is
- Can they help if you get ganked?
- Who needs backup?

### Lane Positions
- Which lanes are pushing?
- Where are creep waves?
- Is it safe to farm?

## Minimap Settings

### Recommended Settings
- **Minimap Size**: Make it bigger! (Settings > Options)
- **Hero Icons**: Use hero icons instead of colors
- **Scan Ping**: Learn to use ALT+Click

## Developing Game Sense

### The "1-3 Rule"
Every **3 seconds**, ask yourself:
1. Where are enemies?
2. Am I safe?
3. What should I do next?

### Missing Calls
- **Call missing** when your lane opponent disappears
- Listen for missing calls from teammates
- Retreat if multiple heroes are missing

## Pro Tips

✅ Glance at minimap after every last hit
✅ Make minimap as large as comfortable
✅ Use dedicated scan hotkey
✅ Trust your instincts - if it feels dangerous, it probably is
    `,
        contentTh: `
# การมองแผนที่และ Minimap

## ทำไม Minimap ถึงสำคัญ

Minimap คือ**เครื่องมือสำคัญที่สุด**สำหรับการเอาตัวรอดและตัดสินใจ Pro players ดูทุก 2-3 วินาที!

## สิ่งที่ต้องสังเกต

### ฮีโร่ศัตรู
- **ฮีโร่หายไป** = gank กำลังมา
- **เห็น 5 คน** = ปลอดภัยที่จะดันหรือฟาร์ม
- นับศัตรูก่อนทุกการเคลื่อนไหว

### ตำแหน่งทีม
- รู้ว่าทีมอยู่ไหน
- ช่วยได้ไหมถ้าโดน gank?
- ใครต้องการความช่วยเหลือ?

### ตำแหน่งเลน
- เลนไหนกำลังดัน?
- Creep wave อยู่ไหน?
- ปลอดภัยที่จะฟาร์มไหม?

## ตั้งค่า Minimap

### แนะนำ
- **ขนาด Minimap**: ทำให้ใหญ่ขึ้น! (Settings > Options)
- **Hero Icons**: ใช้ไอคอนฮีโร่แทนสี
- **Scan Ping**: เรียนรู้การใช้ ALT+Click

## พัฒนา Game Sense

### กฎ "1-3"
ทุก **3 วินาที** ถามตัวเอง:
1. ศัตรูอยู่ไหน?
2. ปลอดภัยไหม?
3. ต้องทำอะไรต่อ?

### Missing Calls
- **บอก missing** เมื่อศัตรูในเลนหายไป
- ฟัง missing calls จากทีม
- ถอยถ้าหลายฮีโร่หายไป

## เคล็ดลับ Pro

✅ ดู minimap หลังทุก last hit
✅ ทำ minimap ใหญ่พอที่สะดวก
✅ ตั้ง hotkey สำหรับ scan
✅ เชื่อสัญชาตญาณ - ถ้ารู้สึกอันตราย มันอาจเป็นจริง
    `,
    },
    // Warding & Vision
    {
        id: 'warding-vision',
        category: 'mechanics',
        titleEn: 'Warding & Vision Control',
        titleTh: 'การวาง Ward และควบคุม Vision',
        descriptionEn: 'Master the art of vision to win more games.',
        descriptionTh: 'เชี่ยวชาญศิลปะ vision เพื่อชนะเกมมากขึ้น',
        duration: 15,
        difficulty: 2,
        contentEn: `
# Warding & Vision Control

## Types of Wards

### Observer Wards 👁️
- **Cost**: FREE (limited stock)
- **Duration**: 6 minutes
- **Purpose**: See enemy movement
- **Restock**: Every 135 seconds

### Sentry Wards 🔍
- **Cost**: 50 gold
- **Duration**: 8 minutes
- **Purpose**: Reveal invisible units & enemy wards
- **True Sight radius**: 1000

## Basic Ward Spots

### Laning Phase
- **Rune spots**: Control bounty runes
- **Lane entrances**: See incoming ganks
- **Pull camps**: Protect or block pulls

### Mid Game
- **Roshan pit**: Critical for Roshan attempts
- **High ground**: Before pushing
- **Jungle entrances**: Track enemy farming

## Dewarding

### How to Deward
1. Place Sentry Ward in suspected area
2. Attack enemy ward (4 hits from heroes)
3. You get **100 gold** for destroying wards

### Finding Enemy Wards
- Watch for sudden changes in enemy behavior
- Check common ward spots
- Use Smoke to search safely

## Ward Economy

### Support Priorities
1. **Always have detection** (Sentry or Dust)
2. **Prioritize Observer over purchasing items**
3. **2 Observers + 1 Sentry** is a good baseline

## Pro Tips

✅ Don't ward when enemies can see you
✅ Use Smoke of Deceit for deep wards
✅ Adjust ward spots based on enemy patterns
✅ High ground wards last longer (harder to deward)
    `,
        contentTh: `
# การวาง Ward และควบคุม Vision

## ประเภทของ Ward

### Observer Wards 👁️
- **ราคา**: ฟรี (จำกัดจำนวน)
- **ระยะเวลา**: 6 นาที
- **วัตถุประสงค์**: เห็นการเคลื่อนไหวศัตรู
- **Restock**: ทุก 135 วินาที

### Sentry Wards 🔍
- **ราคา**: 50 ทอง
- **ระยะเวลา**: 8 นาที
- **วัตถุประสงค์**: เปิดเผยสิ่งล่องหนและ ward ศัตรู
- **รัศมี True Sight**: 1000

## จุดวาง Ward พื้นฐาน

### Laning Phase
- **Rune spots**: ควบคุม bounty runes
- **ทางเข้าเลน**: เห็น gank ที่จะมา
- **Pull camps**: ปกป้องหรือบล็อก pulls

### Mid Game
- **Roshan pit**: สำคัญสำหรับ Roshan
- **High ground**: ก่อนดัน
- **ทางเข้าป่า**: ติดตามการฟาร์มศัตรู

## การ Deward

### วิธีทำ
1. วาง Sentry Ward ในพื้นที่สงสัย
2. ตี ward ศัตรู (4 ครั้งจากฮีโร่)
3. ได้ **100 ทอง** จากการทำลาย ward

### การหา Ward ศัตรู
- สังเกตพฤติกรรมศัตรูเปลี่ยนกะทันหัน
- เช็คจุดวาง ward ทั่วไป
- ใช้ Smoke หาอย่างปลอดภัย

## Ward Economy

### ลำดับความสำคัญ Support
1. **มี detection เสมอ** (Sentry หรือ Dust)
2. **Observer สำคัญกว่าซื้อไอเทม**
3. **2 Observer + 1 Sentry** เป็นพื้นฐานที่ดี

## เคล็ดลับ Pro

✅ อย่าวางเมื่อศัตรูเห็น
✅ ใช้ Smoke of Deceit สำหรับ deep wards
✅ ปรับจุดวาง ward ตามรูปแบบศัตรู
✅ High ground wards อยู่นานกว่า (deward ยากกว่า)
    `,
    },
    // Team Fight Basics
    {
        id: 'team-fight-basics',
        category: 'mechanics',
        titleEn: 'Team Fight Basics',
        titleTh: 'พื้นฐานการไฟต์ทีม',
        descriptionEn: 'Learn how to fight together as a team.',
        descriptionTh: 'เรียนรู้วิธีไฟต์ร่วมกันเป็นทีม',
        duration: 15,
        difficulty: 2,
        contentEn: `
# Team Fight Basics

## Before the Fight

### Positioning
- **Backline**: Carries stay behind (get protected)
- **Frontline**: Tanks and initiators lead
- **High Ground**: Fight from advantageous positions

### Cooldown Check
- Are ultimate abilities ready?
- Does everyone have BKB/key items?
- Smoke available for initiation?

## During the Fight

### Focus Priority (Who to Kill)
1. **Squishy high-damage** (Sniper, Drow, Zeus)
2. **Key disablers** (Lion, Shadow Shaman)
3. **Healers** (Oracle, Dazzle)
4. Avoid tanky heroes early

### Role Responsibilities

| Role | Job |
|------|-----|
| Carry (1) | Deal damage, stay alive |
| Mid (2) | Burst key targets |
| Offlane (3) | Initiate, tank damage |
| Soft Support (4) | Disable, save allies |
| Hard Support (5) | Protect carry, use items |

### Common Mistakes
❌ Diving past towers
❌ Fighting without vision
❌ Using ultimates on tanky targets
❌ Ignoring positioning

## After the Fight

### If You Won
- **Push objectives**: Towers, Barracks, Roshan
- **Don't over-chase**: Secure objectives instead

### If You Lost
- **Retreat safely**: Don't die twice
- **Buyback wisely**: Only if you can defend
- **Learn from mistakes**: What went wrong?

## Pro Tips

✅ Wait for initiator's signal
✅ Save disables for channeling spells
✅ Carry TP Scroll always
✅ Communicate target focus
    `,
        contentTh: `
# พื้นฐานการไฟต์ทีม

## ก่อนไฟต์

### ตำแหน่ง
- **Backline**: Carry อยู่ด้านหลัง (ได้รับการป้องกัน)
- **Frontline**: Tank และ initiator นำหน้า
- **High Ground**: ไฟต์จากตำแหน่งที่ได้เปรียบ

### เช็ค Cooldown
- Ultimate พร้อมหรือยัง?
- ทุกคนมี BKB/ไอเทมสำคัญหรือยัง?
- Smoke พร้อมสำหรับ initiate?

## ระหว่างไฟต์

### ลำดับเป้าหมาย (ตีใครก่อน)
1. **นุ่มแต่ดาเมจสูง** (Sniper, Drow, Zeus)
2. **Disabler สำคัญ** (Lion, Shadow Shaman)
3. **Healer** (Oracle, Dazzle)
4. หลีกเลี่ยงฮีโร่ทนๆ ช่วงแรก

### หน้าที่ตาม Role

| Role | งาน |
|------|-----|
| Carry (1) | ตีดาเมจ อยู่รอด |
| Mid (2) | Burst เป้าหมายสำคัญ |
| Offlane (3) | Initiate รับดาเมจ |
| Soft Support (4) | Disable ช่วยทีม |
| Hard Support (5) | ป้องกัน Carry ใช้ไอเทม |

### ข้อผิดพลาดทั่วไป
❌ ดำหลังทาวเวอร์
❌ ไฟต์โดยไม่มี vision
❌ ใช้ ultimate กับฮีโร่ทน
❌ ไม่สนใจตำแหน่ง

## หลังไฟต์

### ถ้าชนะ
- **ดัน objective**: Tower, Barracks, Roshan
- **อย่าไล่มากไป**: ยึด objective แทน

### ถ้าแพ้
- **ถอยอย่างปลอดภัย**: อย่าตายซ้ำ
- **Buyback อย่างฉลาด**: เฉพาะเมื่อป้องกันได้
- **เรียนรู้**: อะไรผิดพลาด?

## เคล็ดลับ Pro

✅ รอสัญญาณจาก initiator
✅ เก็บ disable สำหรับ channeling spells
✅ พก TP Scroll เสมอ
✅ สื่อสารเป้าหมายที่จะโฟกัส
    `,
    },
    // Tower Mechanics
    {
        id: 'tower-mechanics',
        category: 'mechanics',
        titleEn: 'Tower & Building Mechanics',
        titleTh: 'กลไก Tower และอาคาร',
        descriptionEn: 'Understand how towers work and how to push safely.',
        descriptionTh: 'เข้าใจวิธีทำงานของ tower และวิธีดันอย่างปลอดภัย',
        duration: 10,
        difficulty: 2,
        contentEn: `
# Tower & Building Mechanics

## Tower Basics

### Tower Stats
- **Tier 1**: 1800 HP, 12 armor
- **Tier 2**: 2000 HP, 14 armor
- **Tier 3**: 2200 HP, 14 armor
- **Tier 4**: 2600 HP, 25 armor

### Tower Damage
- Damage increases per consecutive hit
- First strike: ~100
- Each hit: +25% more

## Tower Aggro Rules

### What Draws Aggro
1. **Attack enemy hero** while in tower range
2. **Cast targeted spell** on enemy hero
3. **Nearest unit** if no hero attacks

### How to Drop Aggro
- **A-click your own creep** (attack command)
- Move out of range
- Wait 2.5 seconds

### Tower Diving Tips
- Count creeps (need 3-4 to tank)
- Share aggro with teammates
- Have escape ready

## Pushing Objectives

### Safe Pushing
1. Check enemy positions on minimap
2. Have creep wave pushing with you
3. Carry TP to escape
4. Ward the approach

### Glyph of Fortification
- Makes buildings invulnerable for 5 seconds
- Global cooldown (all buildings protected)
- Resets when T1 tower falls

## Backdoor Protection

### How It Works
- Buildings regen HP when no creeps nearby
- 75% damage reduction
- Need creeps within 900 range to remove

### Breaking Backdoor
- Push wave to tower first
- Heroes like Nature's Prophet can break it
- Some items (Necronomicon) summon units

## Building Priority

### What to Take First
1. **Tier 1 towers** (all lanes)
2. **Tier 2 towers** (enemy jungle access)
3. **Roshan** (Aegis advantage)
4. **Tier 3 + Barracks** (mega creeps)
5. **Tier 4 + Ancient** (victory!)
    `,
        contentTh: `
# กลไก Tower และอาคาร

## พื้นฐาน Tower

### ค่าสถานะ Tower
- **Tier 1**: 1800 HP, 12 armor
- **Tier 2**: 2000 HP, 14 armor
- **Tier 3**: 2200 HP, 14 armor
- **Tier 4**: 2600 HP, 25 armor

### ดาเมจ Tower
- ดาเมจเพิ่มขึ้นทุกครั้งที่ตี
- ครั้งแรก: ~100
- แต่ละครั้ง: +25% เพิ่ม

## กฎ Tower Aggro

### อะไรดึง Aggro
1. **ตีฮีโร่ศัตรู** ในระยะ tower
2. **ใช้สกิล targeted** ใส่ฮีโร่ศัตรู
3. **ยูนิตที่ใกล้ที่สุด** ถ้าไม่มีใครตีฮีโร่

### วิธีทิ้ง Aggro
- **A-click ครีปตัวเอง** (attack command)
- ออกนอกระยะ
- รอ 2.5 วินาที

### เคล็ดลับ Tower Diving
- นับครีป (ต้องมี 3-4 ตัวรับ)
- แบ่ง aggro กับทีม
- มีทางหนีพร้อม

## การดัน Objective

### ดันอย่างปลอดภัย
1. เช็คตำแหน่งศัตรูบน minimap
2. มี creep wave ดันด้วย
3. พก TP หนี
4. วาง ward ทางเข้า

### Glyph of Fortification
- ทำให้อาคารคงกระพันเป็นเวลา 5 วินาที
- Cooldown ทั้งแผนที่ (ปกป้องทุกอาคาร)
- Reset เมื่อ T1 tower ล้ม

## Backdoor Protection

### วิธีทำงาน
- อาคารฟื้นฟู HP เมื่อไม่มีครีปใกล้
- ลดดาเมจ 75%
- ต้องมีครีปในระยะ 900 เพื่อยกเลิก

### การ Break Backdoor
- ดันเวฟไป tower ก่อน
- ฮีโร่อย่าง Nature's Prophet สามารถ break ได้
- บางไอเทม (Necronomicon) เรียกยูนิต

## ลำดับความสำคัญอาคาร

### ยึดอะไรก่อน
1. **Tier 1 towers** (ทุกเลน)
2. **Tier 2 towers** (เข้าถึงป่าศัตรู)
3. **Roshan** (Aegis advantage)
4. **Tier 3 + Barracks** (mega creeps)
5. **Tier 4 + Ancient** (ชนะ!)
    `,
    },
    // Farming Patterns
    {
        id: 'farming-patterns',
        category: 'mechanics',
        titleEn: 'Farming Patterns & Efficiency',
        titleTh: 'รูปแบบการฟาร์มและประสิทธิภาพ',
        descriptionEn: 'Learn to farm faster and more efficiently.',
        descriptionTh: 'เรียนรู้การฟาร์มเร็วขึ้นและมีประสิทธิภาพมากขึ้น',
        duration: 15,
        difficulty: 2,
        contentEn: `
# Farming Patterns & Efficiency

## Why Farming Matters

- **Gold = Power**: More items = stronger hero
- **GPM goal**: 600+ GPM for cores
- **Efficiency**: Don't waste time walking

## Basic Farming Pattern

### The Triangle
Most efficient farming route:
1. **Lane creeps** (priority for gold/XP)
2. **Nearby jungle camp**
3. **Next jungle camp**
4. Return to lane when creeps arrive

### Timing
- Creep waves spawn every **30 seconds**
- Jungle camps spawn at **1:00** and every minute
- Plan your route around these timings

## Stacking Camps

### How to Stack
1. Attack camp at **:53-:55** of the minute
2. Run away to pull creeps out
3. New camp spawns at :00

### Why Stack?
- More gold from one camp
- Ancient stacks = massive gold
- Supports can stack for carries

## Lane Equilibrium

### Keeping Lane Safe
- **Don't auto-attack** creeps unnecessarily
- Only last hit, deny when possible
- Pull jungle creeps to reset lane

### When to Push
- Enemy hero is dead
- You want to take tower
- Going to farm jungle

## Farming by Role

### Carry (Position 1)
- Lane → Jungle → Lane → Jungle
- Priority on all farm
- Avoid unnecessary fights

### Mid (Position 2)
- Solo lane → Gank/Farm
- Take stacks when ready
- Balance fighting and farming

### Offlane (Position 3)
- Take what you can
- Farm when safe
- Join fights more than farm

## Pro Tips

✅ **Always be doing something**: Farming, stacking, fighting
✅ **Carry TP Scroll**: Teleport to farm across map
✅ **Use abilities to farm**: Speeds up clearing
✅ **Watch enemy movements**: Know when to farm safe
    `,
        contentTh: `
# รูปแบบการฟาร์มและประสิทธิภาพ

## ทำไมการฟาร์มถึงสำคัญ

- **ทอง = พลัง**: ไอเทมมากขึ้น = ฮีโร่แข็งแกร่งขึ้น
- **เป้าหมาย GPM**: 600+ GPM สำหรับ core
- **ประสิทธิภาพ**: อย่าเสียเวลาเดิน

## รูปแบบการฟาร์มพื้นฐาน

### สามเหลี่ยม
เส้นทางฟาร์มที่มีประสิทธิภาพที่สุด:
1. **Lane creeps** (สำคัญสำหรับ gold/XP)
2. **Jungle camp ใกล้ๆ**
3. **Jungle camp ถัดไป**
4. กลับเลนเมื่อครีปมาถึง

### เวลา
- Creep wave spawn ทุก **30 วินาที**
- Jungle camps spawn ที่ **1:00** และทุกนาที
- วางแผนเส้นทางตามเวลาเหล่านี้

## การ Stack Camps

### วิธี Stack
1. ตี camp ที่ **:53-:55** ของนาที
2. วิ่งหนีเพื่อดึงครีปออก
3. Camp ใหม่ spawn ที่ :00

### ทำไมต้อง Stack?
- ได้ทองมากขึ้นจาก camp เดียว
- Ancient stacks = ทองมหาศาล
- Support สามารถ stack ให้ carry

## Lane Equilibrium

### รักษาเลนให้ปลอดภัย
- **อย่า auto-attack** ครีปโดยไม่จำเป็น
- Last hit อย่างเดียว deny เมื่อทำได้
- ดึง jungle creeps เพื่อ reset เลน

### เมื่อไหร่ควรดัน
- ฮีโร่ศัตรูตาย
- ต้องการยึด tower
- จะไปฟาร์มป่า

## การฟาร์มตาม Role

### Carry (Position 1)
- Lane → Jungle → Lane → Jungle
- ได้ farm ก่อน
- หลีกเลี่ยงการไฟต์ที่ไม่จำเป็น

### Mid (Position 2)
- เลนเดี่ยว → Gank/Farm
- เอา stacks เมื่อพร้อม
- สมดุลระหว่างไฟต์และฟาร์ม

### Offlane (Position 3)
- เอาที่เอาได้
- ฟาร์มเมื่อปลอดภัย
- ร่วมไฟต์มากกว่าฟาร์ม

## เคล็ดลับ Pro

✅ **ทำอะไรสักอย่างเสมอ**: ฟาร์ม stack ไฟต์
✅ **พก TP Scroll**: TP ไปฟาร์มข้ามแผนที่
✅ **ใช้สกิลฟาร์ม**: เคลียร์เร็วขึ้น
✅ **ดูการเคลื่อนไหวศัตรู**: รู้ว่าเมื่อไหร่ฟาร์มปลอดภัย
    `,
    },
];

export type LearningTopic = typeof learningTopics[number];
export type TopicCategory = 'basics' | 'mechanics' | 'heroes' | 'items' | 'advanced';
