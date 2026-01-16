-- Tabella per le richieste "Servizio Navetta"
CREATE TABLE IF NOT EXISTS navetta_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  cap TEXT NOT NULL,
  messaggio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Abilita Row Level Security
ALTER TABLE navetta_requests ENABLE ROW LEVEL SECURITY;

-- Elimina policy esistente se c'è (per evitare errori)
DROP POLICY IF EXISTS "Anyone can insert navetta requests" ON navetta_requests;

-- Crea la policy (senza IF NOT EXISTS che non è supportato)
CREATE POLICY "Anyone can insert navetta requests" ON navetta_requests
  FOR INSERT WITH CHECK (true);

