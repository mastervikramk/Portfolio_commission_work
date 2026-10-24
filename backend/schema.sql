-- Cloudflare D1 Database Schema for Arthur Visions

-- 1. Orders table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    medium TEXT NOT NULL,
    size TEXT NOT NULL,
    subjects INTEGER DEFAULT 1,
    occasion TEXT,
    deadline TEXT,
    notes TEXT,
    photo_key TEXT,
    status TEXT DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Artworks catalog table
CREATE TABLE IF NOT EXISTS artworks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    medium TEXT NOT NULL,
    category TEXT NOT NULL,
    dimensions TEXT NOT NULL,
    year TEXT,
    status TEXT DEFAULT 'Available',
    price TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    featured INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Contact messages table
CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

