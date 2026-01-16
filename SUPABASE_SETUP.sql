-- ============================================
-- SETUP DATABASE AUTOCAMB.IT
-- Esegui questo script in Supabase SQL Editor
-- ============================================

-- Tabella per le richieste "Compriamo la tua auto"
CREATE TABLE IF NOT EXISTS buy_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  cap TEXT NOT NULL,
  messaggio TEXT,
  marca TEXT,
  modello TEXT,
  anno TEXT,
  km TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per le richieste "Permutiamo la tua auto"
CREATE TABLE IF NOT EXISTS trade_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  cap TEXT NOT NULL,
  messaggio TEXT,
  marca TEXT,
  modello TEXT,
  anno TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Abilita Row Level Security
ALTER TABLE buy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_requests ENABLE ROW LEVEL SECURITY;

-- Elimina policy esistenti se ci sono (per evitare errori)
DROP POLICY IF EXISTS "Anyone can insert buy requests" ON buy_requests;
DROP POLICY IF EXISTS "Anyone can insert trade requests" ON trade_requests;

-- Crea le policy (senza IF NOT EXISTS che non è supportato)
CREATE POLICY "Anyone can insert buy requests" ON buy_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert trade requests" ON trade_requests
  FOR INSERT WITH CHECK (true);

