# 🔧 Configuración de Base de Datos para Perfiles

## 📋 Paso 1: Crear la tabla en Supabase

1. Ve a: https://supabase.com/dashboard/project/zhcieaqcuycrgtmtwrns/sql/new

2. Copia y pega el contenido del archivo [`supabase-profile-setup.sql`](file:///c:/Users/migue/OneDrive/Desktop/SideProjects/urbancity-logistics/supabase-profile-setup.sql)

3. Click en **"Run"** para ejecutar el script

4. Verifica que la tabla se creó:
   - Ve a: https://supabase.com/dashboard/project/zhcieaqcuycrgtmtwrns/editor
   - Deberías ver la tabla **"profiles"** en la lista

---

## ✅ Verificar Row Level Security (RLS)

1. Ve a: https://supabase.com/dashboard/project/zhcieaqcuycrgtmtwrns/auth/policies

2. Busca la tabla **"profiles"**

3. Deberías ver 3 políticas activas:
   - ✅ "Users can view own profile" (SELECT)
   - ✅ "Users can insert own profile" (INSERT)  
   - ✅ "Users can update own profile" (UPDATE)

---

## 🚀 Paso 2: Probar la funcionalidad

1. **Reinicia el servidor** (si está corriendo):
   ```bash
   # Ctrl + C para detener
   pnpm dev
   ```

2. **Accede a tu perfil**:
   - Navega a: http://localhost:3000/dashboard
   - Click en el botón de perfil en el UserMenu (icono de persona)
   - O click en la tarjeta "Mi Perfil" en accesos rápidos

3. **Completa tu perfil**:
   - Agrega tu número de teléfono
   - Agrega el nombre de tu tienda
   - Click en "Guardar Cambios"

4. **Verifica que se guardó**:
   - Recarga la página
   - Los datos deberían persistir

---

## 📊 Verificar datos en Supabase

1. Ve a: https://supabase.com/dashboard/project/zhcieaqcuycrgtmtwrns/editor

2. Click en la tabla **"profiles"**

3. Deberías ver tu registro con:
   - `id`: Tu user ID
   - `phone`: El teléfono que agregaste
   - `store_name`: El nombre de tienda
  - `created_at` y `updated_at`: Timestamps

---

## 🎯 Funcionalidades Implementadas

✅ Página de perfil en `/profile`
✅ Formulario para editar teléfono y nombre de tienda
✅ Validación de datos
✅ Mensajes de éxito/error
✅ Link desde UserMenu (header)
✅ Link desde Dashboard (accesos rápidos)
✅ RLS: Cada usuario solo puede ver/editar su propio perfil
✅ Auto-actualización de `updated_at`

---

## ⚠️ Troubleshooting

### Error: "Cannot find module './ProfileForm'"
**Solución:** Asegúrate de que el servidor esté corriendo. Si persiste, detén y reinicia:
```bash
pnpm dev
```

### Error: "relation public.profiles does not exist"
**Solución:** La tabla no se creó. Ejecuta el script SQL de nuevo en Supabase.

### Los cambios no se guardan
**Solución:** 
1. Verifica que las políticas RLS estén activas
2. Revisa la consola del navegador para errores
3. Verifica que estés autenticado

---

¡Listo! Tu sistema de perfiles está funcionando. 🎉
