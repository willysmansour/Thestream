# The Stream - En person per dag

En exklusiv streamingplattform där endast en person per dag får streama live till hela världen.

## 🎯 Koncept

The Stream är en unik plattform som ger 100% fokus till en streamer per dag. Detta skapar en exklusiv upplevelse för både streamer och tittare, och bygger ett dagligt digitalt event med global nåbarhet.

## ✨ Funktioner

### För tittare
- Se dagens liveströmning i helskärmsläge
- Delta i livechatt (med eller utan konto)
- Se streamerns profilinformation
- Donera pengar via Stripe
- Se schema över kommande streamers

### För streamer
- Skapa konto och profil
- Ansök om en dag att streama
- Gå live endast på tilldelad dag
- Se realtidschatt under stream
- Ta emot donationer

### För admin
- Granska ansökningar och tilldela streamdagar
- Hantera rapporterade kommentarer
- Se statistik och analytics

## 🛠 Teknisk Stack

- **Frontend**: Next.js 14 med App Router
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Databas**: Supabase (PostgreSQL)
- **Autentisering**: Supabase Auth
- **Streaming**: LiveKit WebRTC SDK
- **Realtidsdata**: Supabase Realtime
- **Betalningar**: Stripe
- **Hosting**: Vercel

## 🚀 Snabbstart

### Förutsättningar

- Node.js 18+ 
- npm eller yarn
- Supabase-konto
- LiveKit Cloud-konto
- Stripe-konto

### Installation

1. **Klona projektet**
   ```bash
   git clone <repository-url>
   cd the-stream
   ```

2. **Installera beroenden**
   ```bash
   npm install
   ```

3. **Konfigurera miljövariabler**
   ```bash
   cp .env.example .env.local
   ```
   
   Fyll i dina API-nycklar i `.env.local`:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # LiveKit
   NEXT_PUBLIC_LIVEKIT_URL=your_livekit_url
   LIVEKIT_API_KEY=your_livekit_api_key
   LIVEKIT_API_SECRET=your_livekit_api_secret
   
   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Sätt upp databasen**
   
   Kör följande SQL i Supabase SQL Editor:
   ```sql
   -- Skapa tabeller
   CREATE TABLE users (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     name TEXT,
     role TEXT DEFAULT 'viewer' CHECK (role IN ('viewer', 'streamer', 'admin')),
     profile_picture TEXT,
     bio TEXT,
     social_links JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE TABLE streams (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) NOT NULL,
     date DATE UNIQUE NOT NULL,
     title TEXT NOT NULL,
     description TEXT,
     stream_key TEXT,
     is_live BOOLEAN DEFAULT FALSE,
     views_count INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE TABLE chat_messages (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     stream_id UUID REFERENCES streams(id) NOT NULL,
     user_id UUID REFERENCES users(id),
     user_name TEXT,
     content TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE TABLE donations (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     stream_id UUID REFERENCES streams(id) NOT NULL,
     user_id UUID REFERENCES users(id),
     amount INTEGER NOT NULL,
     currency TEXT DEFAULT 'sek',
     stripe_session_id TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE TABLE applications (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) NOT NULL,
     title TEXT NOT NULL,
     pitch TEXT NOT NULL,
     link_to_content TEXT,
     status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'denied')),
     date_requested DATE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Aktivera Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
   ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
   ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

   -- Skapa policies
   CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
   CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Anyone can view streams" ON streams FOR SELECT USING (true);
   CREATE POLICY "Streamers can update own streams" ON streams FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Anyone can view chat messages" ON chat_messages FOR SELECT USING (true);
   CREATE POLICY "Authenticated users can insert chat messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

   CREATE POLICY "Anyone can view donations" ON donations FOR SELECT USING (true);
   CREATE POLICY "Authenticated users can insert donations" ON donations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

   CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Admins can view all applications" ON applications FOR SELECT USING (
     EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
   );

   -- Aktivera Realtime för chat
   ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
   ```

5. **Starta utvecklingsservern**
   ```bash
   npm run dev
   ```

6. **Öppna [http://localhost:3000](http://localhost:3000)**

## 📁 Projektstruktur

```
the-stream/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── globals.css        # Globala stilar
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Huvudsida
│   ├── schedule/          # Schema-sida
│   ├── apply/             # Ansökningssida
│   └── login/             # Inloggningssida
├── components/            # React-komponenter
│   ├── providers/         # Context providers
│   ├── ui/                # UI-komponenter
│   ├── LiveStream.tsx     # LiveKit streaming
│   ├── Chat.tsx           # Realtidschatt
│   ├── StreamerInfo.tsx   # Streamer-profil
│   └── DonationButton.tsx # Stripe donations
├── lib/                   # Utilities och helpers
├── types/                 # TypeScript-definitioner
└── public/                # Statiska filer
```

## 🔧 Konfiguration

### Supabase Setup

1. Skapa ett nytt projekt på [supabase.com](https://supabase.com)
2. Kopiera URL och anon key från Settings > API
3. Aktivera Email auth i Authentication > Providers
4. Kör SQL-scriptet ovan i SQL Editor

### LiveKit Setup

1. Skapa ett konto på [livekit.io](https://livekit.io)
2. Skapa ett nytt projekt
3. Kopiera API key och secret från projektet
4. Använd LiveKit Cloud URL

### Stripe Setup

1. Skapa ett konto på [stripe.com](https://stripe.com)
2. Hämta API-nycklar från Dashboard
3. Konfigurera webhook endpoints (valfritt)

## 🚀 Deployment

### Vercel (Rekommenderat)

1. Pusha kod till GitHub
2. Koppla repository till Vercel
3. Lägg till miljövariabler i Vercel Dashboard
4. Deploya

### Miljövariabler för produktion

Se till att alla miljövariabler är konfigurerade i din hosting-plattform.

## 🤝 Bidrag

1. Forka projektet
2. Skapa en feature branch (`git checkout -b feature/amazing-feature`)
3. Committa dina ändringar (`git commit -m 'Add amazing feature'`)
4. Pusha till branchen (`git push origin feature/amazing-feature`)
5. Öppna en Pull Request

## 📄 Licens

Detta projekt är licensierat under MIT License - se [LICENSE](LICENSE) filen för detaljer.

## 🆘 Support

Om du stöter på problem eller har frågor:

1. Kolla [Issues](../../issues) för befintliga problem
2. Skapa en ny issue med detaljerad beskrivning
3. Kontakta utvecklingsteamet

## 🎉 Tack

Tack för att du använder The Stream! Vi hoppas att denna plattform kan hjälpa kreatörer att nå en global publik och skapa meningsfulla upplevelser. 