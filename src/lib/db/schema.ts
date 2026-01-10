import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').unique(),
    password: text('password'), // null for Steam users
    name: text('name'),
    avatar: text('avatar'),
    steamId: text('steam_id').unique(),
    locale: text('locale').default('en'),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Heroes table (cached from OpenDota)
export const heroes = sqliteTable('heroes', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    localizedName: text('localized_name').notNull(),
    localizedNameTh: text('localized_name_th'),
    primaryAttr: text('primary_attr').notNull(),
    attackType: text('attack_type').notNull(),
    roles: text('roles', { mode: 'json' }).$type<string[]>(),
    img: text('img'),
    icon: text('icon'),
    baseHealth: integer('base_health'),
    baseMana: integer('base_mana'),
    baseArmor: real('base_armor'),
    moveSpeed: integer('move_speed'),
    attackRange: integer('attack_range'),
    baseStr: integer('base_str'),
    baseAgi: integer('base_agi'),
    baseInt: integer('base_int'),
    strGain: real('str_gain'),
    agiGain: real('agi_gain'),
    intGain: real('int_gain'),
    difficulty: integer('difficulty').default(1), // 1-3: Easy, Medium, Hard
    beginnerTips: text('beginner_tips'),
    beginnerTipsTh: text('beginner_tips_th'),
    lastSyncedAt: integer('last_synced_at', { mode: 'timestamp' }),
});

// Items table (cached from OpenDota)
export const items = sqliteTable('items', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    localizedName: text('localized_name'),
    localizedNameTh: text('localized_name_th'),
    cost: integer('cost'),
    secretShop: integer('secret_shop', { mode: 'boolean' }),
    sideShop: integer('side_shop', { mode: 'boolean' }),
    recipe: integer('recipe', { mode: 'boolean' }),
    components: text('components', { mode: 'json' }).$type<string[]>(),
    description: text('description'),
    descriptionTh: text('description_th'),
    notes: text('notes'),
    category: text('category'), // basic, upgrade, neutral
    img: text('img'),
    lastSyncedAt: integer('last_synced_at', { mode: 'timestamp' }),
});

// Learning Topics
export const learningTopics = sqliteTable('learning_topics', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull().unique(),
    titleEn: text('title_en').notNull(),
    titleTh: text('title_th').notNull(),
    contentEn: text('content_en').notNull(),
    contentTh: text('content_th').notNull(),
    category: text('category').notNull(), // basics, heroes, items, mechanics, advanced
    order: integer('order').default(0),
    difficulty: integer('difficulty').default(1), // 1-3
    estimatedMinutes: integer('estimated_minutes').default(10),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// User Progress
export const userProgress = sqliteTable('user_progress', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    topicId: integer('topic_id').notNull().references(() => learningTopics.id, { onDelete: 'cascade' }),
    completed: integer('completed', { mode: 'boolean' }).default(false),
    score: integer('score'),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
});

// User Bookmarks
export const userBookmarks = sqliteTable('user_bookmarks', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    heroId: integer('hero_id').references(() => heroes.id, { onDelete: 'cascade' }),
    itemId: integer('item_id').references(() => items.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// User Notes
export const userNotes = sqliteTable('user_notes', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    content: text('content'),
    heroId: integer('hero_id').references(() => heroes.id, { onDelete: 'set null' }),
    itemId: integer('item_id').references(() => items.id, { onDelete: 'set null' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Sessions for NextAuth
export const sessions = sqliteTable('sessions', {
    sessionToken: text('session_token').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    expires: integer('expires', { mode: 'timestamp' }).notNull(),
});

// Accounts for NextAuth (Steam OAuth)
export const accounts = sqliteTable('accounts', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    expiresAt: integer('expires_at'),
    tokenType: text('token_type'),
    scope: text('scope'),
    idToken: text('id_token'),
    sessionState: text('session_state'),
});
