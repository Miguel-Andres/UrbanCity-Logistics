-- Migration 003: Actualizar constraint de payment_type para permitir 'PAGADO'
-- Fecha: 2025-12-13
-- Motivo: Cambio de UI de "SOLO ENTREGAR" a "PAGADO" para mejor UX

-- 1. Eliminar el constraint existente
ALTER TABLE shipments 
DROP CONSTRAINT IF EXISTS shipments_payment_type_check;

-- 2. Actualizar registros existentes que tengan 'SOLO ENTREGAR' a 'PAGADO'
UPDATE shipments 
SET payment_type = 'PAGADO' 
WHERE payment_type = 'SOLO ENTREGAR';

-- 3. Crear nuevo constraint con los valores actualizados
ALTER TABLE shipments 
ADD CONSTRAINT shipments_payment_type_check CHECK (
  payment_type IN ('COBRAR', 'PAGADO')
);

-- Comentario: Esta migración mantiene la funcionalidad pero actualiza el lenguaje
-- para ser más claro en el UI (PAGADO vs SOLO ENTREGAR)