# Instrucciones para ejecutar la migración 002 - RLS

## Qué hace esta migración

Configura el Row Level Security (RLS) para:
1. **Usuarios autenticados**: Solo ven y modifican sus propios envíos
2. **Acceso público**: Cualquiera puede consultar envíos por código de tracking
3. **Funciones seguras**: Para acceder a datos sin exponer información sensible

## Ejecución

### 1. En Supabase SQL Editor
1. Ve a **SQL Editor** en Supabase
2. Copia el contenido de `db/migrations/002_configure_rls.sql`
3. Pega y haz clic en **Run**

### 2. Verificación
```sql
-- Verificar que RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('shipments', 'tracking_events');

-- Verificar políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('shipments', 'tracking_events');

-- Verificar funciones creadas
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname IN ('get_shipment_by_code', 'get_tracking_events_by_code');
```

## Pruebas

Para probar que funciona:

```sql
-- 1. Crear un envío de prueba
INSERT INTO shipments (
  tracking_code,
  user_id,
  recipient_name,
  recipient_address,
  status
) VALUES (
  'UC-TEST001',
  'TU_USER_ID',  -- Reemplaza con tu user_id
  'Juan Pérez',
  'Calle Falsa 123',
  'pending'
);

-- 2. Probar función pública (debería funcionar)
SELECT * FROM get_shipment_by_code('UC-TEST001');

-- 3. Probar función de eventos
SELECT * FROM get_tracking_events_by_code('UC-TEST001');
```

## Importante

- Las funciones usan `SECURITY DEFINER` para ejecutar con permisos elevados
- El acceso público es **solo lectura** (SELECT)
- Los usuarios solo pueden modificar sus propios envíos
- No se expone información del remitente (vendedor) en el acceso público