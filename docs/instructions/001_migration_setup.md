# Instrucciones para ejecutar la migración 001

## Opción 1: Usando el Panel de Supabase (Recomendado)

1. Inicia sesión en [supabase.com](https://supabase.com)
2. Selecciona tu proyecto
3. Ve a **SQL Editor** en el menú lateral
4. Copia todo el contenido del archivo `db/migrations/001_create_shipments.sql`
5. Pega el SQL en el editor
6. Haz clic en **Run** para ejecutar la migración

## Opción 2: Usando la CLI de Supabase

Si tienes la CLI de Supabase instalada:

```bash
# Ejecutar la migración directamente
supabase db push db/migrations/001_create_shipments.sql
```

## Verificación

Después de ejecutar la migración, puedes verificar que todo se creó correctamente:

### 1. Verificar tablas en el Table Editor
- Ve a **Table Editor** en el panel de Supabase
- Deberías ver las tablas `shipments` y `tracking_events`
- Haz clic en cada tabla para ver las columnas

### 2. Verificar los índices
```sql
-- Consultar índices en shipments
SELECT indexname FROM pg_indexes 
WHERE tablename = 'shipments';

-- Consultar índices en tracking_events
SELECT indexname FROM pg_indexes 
WHERE tablename = 'tracking_events';
```

### 3. Verificar triggers
```sql
-- Verificar trigger de updated_at
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers 
WHERE trigger_name = 'update_shipments_updated_at';
```

## Prueba Rápida

Para probar que todo funciona correctamente:

```sql
-- Insertar un envío de prueba (basado en el formulario real)
INSERT INTO shipments (
  tracking_code,
  user_id,
  recipient_name,
  recipient_phone,
  recipient_address,
  recipient_city,
  recipient_reference,
  shipment_type,
  payment_type,
  amount_to_charge,
  ship_date,
  notes,
  status
) VALUES (
  'UC-TEST123',
  '00000000-0000-0000-0000-000000000000',
  'María González',
  '+54 11 1234-5678',
  'Av. Córdoba 456, Piso 3, Depto A',
  'Córdoba Capital',
  'Entre Junín y Catamarca',
  'VENTA',
  'COBRAR',
  15000.50,
  '2025-01-21',
  'Paquete con producto electrónico frágil',
  'pending'
);

-- Verificar la inserción
SELECT * FROM shipments WHERE tracking_code = 'UC-TEST123';

-- Agregar un evento de tracking
INSERT INTO tracking_events (
  shipment_id,
  status,
  notes,
  delivered_by,
  received_by
) VALUES (
  (SELECT id FROM shipments WHERE tracking_code = 'UC-TEST123'),
  'pending',
  'Envío creado y pendiente de recolección',
  NULL,
  NULL
);

-- Verificar el evento
SELECT * FROM tracking_events 
WHERE shipment_id = (SELECT id FROM shipments WHERE tracking_code = 'UC-TEST123');
```

## Troubleshooting

### Error: relation "auth.users" does not exist
Asegúrate de que la extensión de autenticación de Supabase esté configurada en tu proyecto.

### Error: permission denied
Verifica que el rol con el que ejecutas la migración tenga los permisos necesarios. En Supabase, debería funcionar con el rol `postgres` o `authenticator`.

### Error: duplicate key value violates unique constraint
Esto indica que ya intentaste insertar un tracking_code duplicado. Los códigos de tracking deben ser únicos.

## Siguiente Paso

Una vez que la migración se haya ejecutado correctamente, continúa con la tarea **1.2: Configurar políticas RLS para acceso público y protegido**.