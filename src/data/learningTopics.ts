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
];

export type LearningTopic = typeof learningTopics[number];
export type TopicCategory = 'basics' | 'mechanics' | 'heroes' | 'items' | 'advanced';
