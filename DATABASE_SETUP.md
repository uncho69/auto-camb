# Setup Database - AUTOCAMB.IT

## 1. Crea un account Supabase

1. Vai su [supabase.com](https://supabase.com)
2. Crea un account gratuito
3. Crea un nuovo progetto
4. Scegli una password sicura per il database
5. Aspetta che il progetto sia pronto (2-3 minuti)

## 2. Crea le tabelle nel database

Vai su **SQL Editor** in Supabase e esegui questo script:

```sql
-- Tabella per le auto
CREATE TABLE cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  version TEXT NOT NULL,
  year INTEGER NOT NULL,
  km INTEGER NOT NULL,
  fuel TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT NOT NULL,
  consumption NUMERIC,
  co2 INTEGER,
  emission_class TEXT,
  category TEXT NOT NULL CHECK (category IN ('Usato', 'KM 0')),
  status TEXT NOT NULL CHECK (status IN ('Disponibile', 'Venduto', 'Prossimamente')),
  tags TEXT[],
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per le richieste "Cerca un'auto"
CREATE TABLE car_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  cap TEXT NOT NULL,
  messaggio TEXT,
  marca TEXT,
  modello TEXT,
  km TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per le richieste "Compriamo la tua auto"
CREATE TABLE buy_requests (
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
CREATE TABLE trade_requests (
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

-- Abilita Row Level Security (RLS) - le auto sono pubbliche
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Policy: tutti possono leggere le auto
CREATE POLICY "Cars are viewable by everyone" ON cars
  FOR SELECT USING (true);

-- Policy: solo admin può inserire/modificare/eliminare (gestito via service role key)
-- Le modifiche vengono fatte tramite API routes che usano service_role_key

-- RLS per car_requests - solo inserimento pubblico, lettura solo admin
ALTER TABLE car_requests ENABLE ROW LEVEL SECURITY;

-- Policy: tutti possono inserire richieste
CREATE POLICY "Anyone can insert car requests" ON car_requests
  FOR INSERT WITH CHECK (true);

-- RLS per buy_requests
ALTER TABLE buy_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert buy requests" ON buy_requests
  FOR INSERT WITH CHECK (true);

-- RLS per trade_requests
ALTER TABLE trade_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert trade requests" ON trade_requests
  FOR INSERT WITH CHECK (true);

-- Policy: solo admin può leggere (gestito via service role key)
```

## 3. Ottieni le chiavi API

1. Vai su **Settings** → **API** in Supabase
2. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ segreta!)

## 4. Setup Resend per le email

1. Vai su [resend.com](https://resend.com)
2. Crea un account gratuito
3. Vai su **API Keys** e crea una nuova chiave
4. Copia la chiave → `RESEND_API_KEY`

## 5. Configura le variabili ambiente

### Localmente (`.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=info@autocamb.it
```

### Su Vercel:

1. Vai su **Settings** → **Environment Variables**
2. Aggiungi tutte le variabili sopra
3. Riapplica il deploy

## 6. Verifica dominio su Resend (opzionale ma consigliato)

Per inviare email da `noreply@autocamb.it`:
1. Vai su **Domains** in Resend
2. Aggiungi `autocamb.it`
3. Configura i record DNS come indicato
4. Attendi la verifica

## 7. Importa le auto esistenti

Dopo aver configurato tutto, puoi importare le auto dal file `data/cars.ts` usando il pannello admin del sito.

