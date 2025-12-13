# Migración 003: Actualización de Payment Type

## Propósito
Actualizar el constraint de `payment_type` en la tabla `shipments` para permitir el nuevo valor `'PAGADO'` en lugar de `'SOLO ENTREGAR'`.

## Motivo del cambio
- **UX Improvement**: "PAGADO" es más claro que "SOLO ENTREGAR"
- **Consistencia**: Los botones del UI ahora dicen "PAGADO" y "COBRAR AL ENTREGAR"
- **Mejor comunicación**: El transportista entiende inmediatamente la acción requerida

## Ejecución

### Paso 1: Ejecutar la migración
```sql
-- En tu cliente SQL de Supabase, ejecuta:
\i db/migrations/003_update_payment_type_constraint.sql
```

### Paso 2: Verificar cambios
```sql
-- Verificar que el constraint se actualizó
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'shipments_payment_type_check';

-- Verificar datos actualizados
SELECT DISTINCT payment_type FROM shipments;
```

### Resultado esperado
- ✅ Constraint permite: `('COBRAR', 'PAGADO')`
- ✅ Registros existentes actualizados: `'SOLO ENTREGAR'` → `'PAGADO'`
- ✅ PDF generation funciona correctamente

## Rollback (si es necesario)
```sql
-- Para revertir cambios
ALTER TABLE shipments DROP CONSTRAINT shipments_payment_type_check;
UPDATE shipments SET payment_type = 'SOLO ENTREGAR' WHERE payment_type = 'PAGADO';
ALTER TABLE shipments ADD CONSTRAINT shipments_payment_type_check CHECK (
  payment_type IN ('COBRAR', 'SOLO ENTREGAR')
);
```