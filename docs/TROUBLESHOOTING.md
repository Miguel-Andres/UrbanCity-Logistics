# 🔧 Troubleshooting - Error de Autenticación

## ❌ Error Actual
```
GET /auth/callback?code=... 307
GET /auth/auth-code-error 404
```

Esto significa que el código OAuth no se pudo intercambiar por una sesión.

---

## ✅ Soluciones

### 1. Verificar Redirect URI en Google Cloud Console

El redirect URI **DEBE** ser exactamente:
```
https://yrrftzledzpuxehrpyds.supabase.co/auth/v1/callback
```

**Pasos:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Tu proyecto → APIs & Services → Credentials
3. Click en tu OAuth Client ID
4. En **Authorized redirect URIs**, verifica que esté:
   ```
   https://yrrftzledzpuxehrpyds.supabase.co/auth/v1/callback
   ```
5. Si no está o es diferente, agrégalo/corrígelo
6. Click **Save**

---

### 2. Verificar Configuración en Supabase

1. Ve a: https://supabase.com/dashboard/project/yrrftzledzpuxehrpyds/auth/providers
2. Click en **Google**
3. Verifica que:
   - ✅ El toggle esté **habilitado** (verde)
   - ✅ **Client ID** esté correctamente copiado
   - ✅ **Client Secret** esté correctamente copiado
4. Si hay algún error, vuelve a pegar las credenciales
5. Click **Save**

---

### 3. Verificar Variables de Entorno

Tu `.env.local` debe tener:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://yrrftzledzpuxehrpyds.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlycmZ0emxlZHpwdXhlaHJweWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDA3OTMsImV4cCI6MjA3ODkxNjc5M30.Ef861nFQTDyXtugTdjdvUJJnxUwUty2Ff9jhoVUvbcVM
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Importante:** Después de cambiar `.env.local`, **reinicia el servidor**:
```bash
# Ctrl + C para detener
pnpm dev
```

---

### 4. Verificar que el Provider esté habilitado

A veces Supabase no guarda correctamente. Verifica en:
https://supabase.com/dashboard/project/yrrftzledzpuxehrpyds/auth/providers

que Google tenga el toggle en **verde** (habilitado).

---

### 5. Ver el error en la consola

Después de los cambios, intenta de nuevo y revisa la **consola del servidor** (donde ejecutaste `pnpm dev`).

Busca algo como:
```
Error exchanging code for session: {...}
```

Esto nos dará más información sobre qué está fallando.

---

## 🔍 Checklist Rápido

- [ ] Redirect URI en Google Cloud Console es correcto
- [ ] Provider de Google está habilitado en Supabase (toggle verde)
- [ ] Client ID y Secret están correctos en Supabase
- [ ] Variables de entorno en `.env.local` son correctas
- [ ] Reiniciaste el servidor después de cambiar `.env.local`

---

## 📝 Siguiente Paso

Una vez verificado todo lo anterior:
1. Detén el servidor (`Ctrl + C`)
2. Inicia de nuevo: `pnpm dev`
3. Ve a: http://localhost:3000/access
4. Intenta login con Google
5. Si hay error, **copia el mensaje de error de la consola** y compártelo
