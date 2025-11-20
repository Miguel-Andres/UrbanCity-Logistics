# Configuración de Supabase para Urban City Logistics

## ✅ URL del Proyecto
```
https://yrrftzledzpuxehrpyds.supabase.co
```

---

## 📋 Paso 1: Obtener Anon Key

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard/project/yrrftzledzpuxehrpyds
2. En el menú lateral, ve a **Settings** (⚙️)
3. Click en **API**
4. En la sección "Project API keys", copia el valor de **anon/public**

---

## 📋 Paso 2: Actualizar .env.local

Agrega estas líneas a tu archivo `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yrrftzledzpuxehrpyds.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY_AQUI
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Reemplaza `TU_ANON_KEY_AQUI` con el valor que copiaste.

---

## 📋 Paso 3: Configurar Google OAuth

### 3.1 - Crear credenciales en Google Cloud Console

1. Ve a: https://console.cloud.google.com
2. Crea un proyecto nuevo o selecciona uno existente
3. Habilita **Google+ API** (o la API actual de Google Identity)
4. Ve a **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth 2.0 Client ID**
6. Si es la primera vez, configura la pantalla de consentimiento:
   - User Type: **External**
   - App name: **Urban City Logistics**
   - User support email: tu email
   - Developer contact: tu email
   - Scopes: No necesitas agregar nada extra
   - Test users: Agrega tu email de Google para testing

7. Crea el OAuth Client ID:
   - Application type: **Web application**
   - Name: **Urban City Logistics**
   
8. En **Authorized redirect URIs**, agrega:
   ```
   https://yrrftzledzpuxehrpyds.supabase.co/auth/v1/callback
   ```

9. Click **Create**
10. Copia:
    - **Client ID**
    - **Client Secret**

### 3.2 - Configurar en Supabase

1. Ve a: https://supabase.com/dashboard/project/yrrftzledzpuxehrpyds/auth/providers
2. Encuentra **Google** en la lista de providers
3. Habilita el toggle
4. Pega:
   - **Client ID** (de Google Cloud Console)
   - **Client Secret** (de Google Cloud Console)
5. Click **Save**

---

## 🚀 Paso 4: Probar la autenticación

1. Asegúrate de que tu servidor esté corriendo:
   ```bash
   pnpm dev
   ```

2. Navega a: http://localhost:3000/access

3. Click en **"Continuar con Google"**

4. Si todo está configurado correctamente:
   - Te redirigirá a Google
   - Seleccionas tu cuenta
   - Aceptas los permisos
   - Vuelves a `/dashboard` autenticado ✅

---

## ⚠️ Troubleshooting

### Error: "redirect_uri_mismatch"
- Verifica que el redirect URI en Google Cloud Console sea exactamente:
  ```
  https://yrrftzledzpuxehrpyds.supabase.co/auth/v1/callback
  ```

### Error: "Invalid credentials"
- Verifica que copiaste correctamente el Client ID y Secret
- Asegúrate de que el provider Google esté habilitado en Supabase

### No redirige después de login
- Verifica que `NEXT_PUBLIC_SITE_URL` esté configurado
- Revisa la consola del navegador para errores

---

## 📝 Resumen de Variables de Entorno

Tu archivo `.env.local` debe tener:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://yrrftzledzpuxehrpyds.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**¡Eso es todo!** Una vez configurado, la autenticación está lista. 🎉
