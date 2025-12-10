# 📋 Documentación: Refactorización del Sistema de Store Name

## 🎯 Problema Original

**Síntoma**: Las etiquetas ZPL y PDF mostraban "MI TIENDA" en producción en lugar del nombre real de la tienda del usuario.

**Causa raíz**: Uso incorrecto del patrón de datos entre Server y Client Components, resultando en consultas fallidas en producción.

## 🔧 Solución Implementada

### ✨ Antes (Anti-patrón)

```typescript
// ❌ INCORRECTO: Estado global complejo + consultas just-in-time
function LabelPreview({ user }) {
  const { storeName } = useAuthStore() // null en producción
  
  const handleGenerate = async () => {
    // Consulta compleja just-in-time que fallaba
    const supabase = createBrowserClient(...)
    const { data } = await supabase.from('profiles')... // Se colgaba
  }
}
```

### ✅ Después (Patrón correcto)

```typescript
// ✅ CORRECTO: Server Component obtiene datos + props limpias
async function EtiquetasPage() {
  const supabase = await createClient() // Server client
  const { data: user } = await supabase.auth.getUser()
  
  // Obtener profile en el servidor
  const { data: profile } = await supabase
    .from('profiles')
    .select('store_name, phone')
    .eq('id', user.id)
    .single()

  return <EtiquetasClient user={user} profile={profile} />
}

function LabelPreview({ user, profile }) {
  const storeName = profile?.store_name || 'Mi Tienda' // Datos del servidor
  
  const handleGenerate = async () => {
    const formData = { 
      ...data, 
      store_name: storeName // Directo, sin consultas
    }
  }
}
```

## 📁 Archivos Modificados

### 1. **`app/etiquetas/page.tsx`**
- ✅ Agregado: Consulta de profile en Server Component
- ✅ Agregado: Logging para debugging en servidor
- ✅ Modificado: Prop `profile` pasada a `EtiquetasClient`

### 2. **`app/etiquetas/EtiquetasClient.tsx`**
- ✅ Agregado: Interfaz `Profile` 
- ✅ Modificado: Props para incluir `profile`
- ✅ Modificado: Prop pasada a `SingleLabelWizard`

### 3. **`app/etiquetas/components/wizard/SingleLabelWizard.tsx`**
- ✅ Agregado: Interfaz `Profile`
- ✅ Modificado: Props para incluir `profile`
- ✅ Modificado: Prop pasada a `LabelPreview`

### 4. **`app/etiquetas/components/wizard/LabelPreview.tsx`**
- ✅ **CAMBIO PRINCIPAL**: Removido código complejo just-in-time
- ✅ **CAMBIO PRINCIPAL**: Usar `profile?.store_name` desde prop del servidor
- ✅ Simplificado: `handleGeneratePDF` y `handleGenerateZPL`
- ✅ Agregado: Logging para verificar datos del servidor

### 5. **`components/AuthProvider.tsx`**
- ✅ Corregido: Tipos TypeScript (`null` → `undefined`)

## 🏗️ Arquitectura Nueva

```
┌─────────────────────────────────────────────────────────────┐
│ EtiquetasPage (Server Component)                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 1. await supabase.auth.getUser()                        │ │
│ │ 2. await supabase.from('profiles').select('store_name') │ │
│ │ 3. return <EtiquetasClient user={user} profile={prof} />│ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ EtiquetasClient (Client Component)                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ return <SingleLabelWizard user={user} profile={prof} /> │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ LabelPreview (Client Component)                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ const storeName = profile?.store_name \|\| 'Mi Tienda'   │ │
│ │ // Usar directamente, sin consultas DB                  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Beneficios

### ✅ **Performance**
- **Antes**: Consulta DB en cada click → ⏱️ Loading + errores
- **Después**: Datos pre-cargados → ⚡ Inmediato

### ✅ **Confiabilidad** 
- **Antes**: Consultas fallaban en producción (RLS/permisos)
- **Después**: Server Component con permisos correctos

### ✅ **Simplicidad**
- **Antes**: 150+ líneas de código complejo con try/catch anidados
- **Después**: 10 líneas simples usando props

### ✅ **Debugging**
- **Antes**: Errores silenciosos difíciles de debuggear
- **Después**: Logs claros en servidor (Vercel) y cliente

### ✅ **Siguiendo Best Practices**
- **Antes**: Anti-patrón de Next.js + Supabase
- **Después**: Patrón oficial recomendado por Next.js docs

## 🎯 Resultado Esperado

```bash
# En producción, logs esperados:
🔍 [EtiquetasPage Server] Profile obtenido: { store_name: "mickey store", ... }
✅ [LabelPreview] Using server profile data: { store_name: "mickey store", ... }
📄 [handleGeneratePDF] Generando con datos del servidor: { store_name: "mickey store" }
```

**Resultado**: Las etiquetas mostrarán **"mickey store"** en lugar de **"Mi Tienda"**.

## 🔄 Próximos Pasos

1. **Commit y Push** → Deploy a producción
2. **Test en producción** → Verificar logs del servidor
3. **Cleanup** → Remover código de debugging una vez confirmado el fix

## 📚 Referencias

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Supabase with Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Data Fetching Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

Esta refactorización resuelve el problema de raíz siguiendo las mejores prácticas de Next.js y Supabase.