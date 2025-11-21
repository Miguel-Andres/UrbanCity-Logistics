-- Migration 001: Crear tablas para el sistema de tracking
-- Fecha: 2025-01-21

-- Habilitar extension UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de envíos (shipments)
CREATE TABLE IF NOT EXISTS shipments (
  -- ID primario
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Información del envío
  tracking_code VARCHAR(20) UNIQUE NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Datos del destinatario (del formulario)
  recipient_name VARCHAR(100) NOT NULL,
  recipient_phone VARCHAR(20),
  recipient_address TEXT NOT NULL,
  recipient_city VARCHAR(100),      -- localidad del formulario
  recipient_reference TEXT,        -- entre calles del formulario
  
  -- Detalles del envío (del formulario)
  shipment_type VARCHAR(50),       -- VENTA o CAMBIO
  payment_type VARCHAR(50),         -- COBRAR o SOLO ENTREGAR
  amount_to_charge DECIMAL(10, 2), -- monto a cobrar
  ship_date DATE,                    -- fecha del envío
  
  -- Observaciones (del formulario)
  notes TEXT,
  
  -- Estado y fechas
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Información de entrega (se llena después)
  delivered_by VARCHAR(100),        -- Nombre del repartidor
  received_by VARCHAR(100),         -- Nombre de quien recibió
  delivery_notes TEXT,              -- Notas específicas de la entrega
  
  -- Restricciones
  CONSTRAINT shipments_status_check CHECK (
    status IN ('pending', 'in_transit', 'delivered', 'failed')
  ),
  CONSTRAINT shipments_shipment_type_check CHECK (
    shipment_type IN ('VENTA', 'CAMBIO')
  ),
  CONSTRAINT shipments_payment_type_check CHECK (
    payment_type IN ('COBRAR', 'SOLO ENTREGAR')
  )
);

-- Tabla de eventos de tracking (historial)
CREATE TABLE IF NOT EXISTS tracking_events (
  -- ID primario
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relación con el envío
  shipment_id uuid NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  
  -- Información del evento
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  
  -- Quién realizó la actualización
  delivered_by VARCHAR(100),     -- Quién entregó
  received_by VARCHAR(100),      -- Quién recibió
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- Restricciones
  CONSTRAINT tracking_events_status_check CHECK (
    status IN ('pending', 'in_transit', 'delivered', 'failed')
  )
);

-- Crear índices para performance optimizado
-- Índice unique para tracking_code (búsquedas exactas)
CREATE UNIQUE INDEX idx_shipments_tracking_code ON shipments(tracking_code);

-- Índice compuesto para /mis-envios (ordenado por fecha descendente)
CREATE INDEX idx_shipments_user_created_at ON shipments(user_id, created_at DESC);

-- Índice para tracking_events (con clustering optimizado)
CREATE INDEX idx_tracking_events_shipment_created ON tracking_events(shipment_id, created_at);

-- Índice simple para user_id si se necesita filtrado rápido
CREATE INDEX idx_shipments_user_id ON shipments(user_id);

-- Crear trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shipments_updated_at
   BEFORE UPDATE ON shipments
   FOR EACH ROW
   EXECUTE FUNCTION update_updated_at_column();

-- Comentarios de las tablas y columnas importantes
COMMENT ON TABLE shipments IS 'Tabla principal de envíos con información de tracking';
COMMENT ON TABLE tracking_events IS 'Historial de eventos y cambios de estado de los envíos';
COMMENT ON COLUMN shipments.tracking_code IS 'Código único de tracking (ej: UC-ABC123)';
COMMENT ON COLUMN shipments.recipient_name IS 'Nombre del destinatario (del formulario)';
COMMENT ON COLUMN shipments.recipient_phone IS 'Teléfono del destinatario (del formulario)';
COMMENT ON COLUMN shipments.recipient_address IS 'Dirección completa del destinatario (del formulario)';
COMMENT ON COLUMN shipments.recipient_city IS 'Ciudad o localidad del destinatario (del formulario)';
COMMENT ON COLUMN shipments.recipient_reference IS 'Entre calles o referencia del destinatario (del formulario)';
COMMENT ON COLUMN shipments.shipment_type IS 'Tipo de envío: VENTA o CAMBIO (del formulario)';
COMMENT ON COLUMN shipments.payment_type IS 'Tipo de pago: COBRAR o SOLO ENTREGAR (del formulario)';
COMMENT ON COLUMN shipments.amount_to_charge IS 'Monto a cobrar si tipo es COBRAR (del formulario)';
COMMENT ON COLUMN shipments.ship_date IS 'Fecha del envío (del formulario)';
COMMENT ON COLUMN shipments.notes IS 'Observaciones adicionales del envío (del formulario)';
COMMENT ON COLUMN shipments.status IS 'Estado del envío: pending, in_transit, delivered, failed';
COMMENT ON COLUMN shipments.delivered_by IS 'Nombre del repartidor que realizó la entrega';
COMMENT ON COLUMN shipments.received_by IS 'Nombre de la persona que recibió el paquete';
COMMENT ON COLUMN tracking_events.shipment_id IS 'ID del envío asociado al evento';
COMMENT ON COLUMN tracking_events.delivered_by IS 'Nombre del repartidor en este evento';
COMMENT ON COLUMN tracking_events.received_by IS 'Nombre del receptor en este evento';

-- Configuración de autovacuum para tablas con alto volumen de datos
ALTER TABLE shipments SET (
  autovacuum_vacuum_threshold = 50,
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_threshold = 50,
  autovacuum_analyze_scale_factor = 0.05
);

ALTER TABLE tracking_events SET (
  autovacuum_vacuum_threshold = 100,
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_threshold = 50,
  autovacuum_analyze_scale_factor = 0.05
);