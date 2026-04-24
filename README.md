# Finanzas Personal 💰

App de control de gastos personales con autenticación y datos en la nube.

**Stack:** React + Vite + Supabase

---

## Setup paso a paso

### 1. Supabase — Base de datos y Auth

1. Entrá a [supabase.com](https://supabase.com) e ingresá a tu proyecto
2. Andá a **SQL Editor** y ejecutá todo el contenido de `supabase_schema.sql`
3. Copiá tus credenciales desde **Settings → API**:
   - `Project URL` → va en `VITE_SUPABASE_URL`
   - `anon public` key → va en `VITE_SUPABASE_ANON_KEY`

### 2. Variables de entorno

Creá un archivo `.env` en la raíz del proyecto (copiando `.env.example`):

```bash
cp .env.example .env
```

Editá `.env` con tus datos reales:

```
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Instalar y correr localmente

```bash
npm install
npm run dev
```

Abrí [http://localhost:5173](http://localhost:5173)

---

## Deploy en Vercel (recomendado)

1. Subí el proyecto a GitHub
2. Importá el repo en [vercel.com](https://vercel.com)
3. En la configuración del proyecto, agregá las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy → listo. Vercel detecta Vite automáticamente.

## Deploy en Netlify

1. Subí el proyecto a GitHub
2. Importá en [netlify.com](https://netlify.com) → Build command: `npm run build`, Publish dir: `dist`
3. Agregá las variables de entorno en Site settings → Environment variables
4. Deploy.

---

## Primer uso

1. Abrí la URL de tu app
2. Hacé click en **Registrarse** y creá tu cuenta con email y contraseña
3. Confirmá el email si Supabase lo requiere (podés desactivar esto en Auth settings)
4. ¡Listo! Ya podés cargar tus gastos.

---

## Estructura del proyecto

```
src/
├── lib/
│   └── supabase.js          # Cliente de Supabase
├── hooks/
│   ├── useAuth.js           # Autenticación
│   └── useFinances.js       # Operaciones de DB
├── components/
│   └── UI.jsx               # Componentes compartidos
├── pages/
│   ├── LoginPage.jsx        # Login / registro
│   ├── Dashboard.jsx        # Resumen del mes
│   ├── FixedExpensesPage.jsx
│   ├── VariableExpensesPage.jsx
│   ├── SavingsPage.jsx      # Objetivos
│   └── TimelinePage.jsx     # Línea de tiempo
├── App.jsx                  # Layout + routing
└── main.jsx
```
