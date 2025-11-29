-- Migration 002: Configurar Row Level Security (RLS) para tracking
-- Fecha: 2025-01-21

-- Habilitar RLS en ambas tablas
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean sus propios envíos
CREATE POLICY "Users can view their own shipments" ON shipments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política para que los usuarios inserten sus propios envíos
CREATE POLICY "Users can insert their own shipments" ON shipments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios actualicen sus propios envíos
CREATE POLICY "Users can update their own shipments" ON shipments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Política para que los usuarios eliminen sus propios envíos
CREATE POLICY "Users can delete their own shipments" ON shipments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Política para acceso público a tracking_events (solo lectura)
CREATE POLICY "Public read access to tracking events" ON tracking_events
  FOR SELECT
  USING (true);

-- Política para que los usuarios vean eventos de sus envíos
CREATE POLICY "Users can view events from their shipments" ON tracking_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM shipments 
      WHERE shipments.id = tracking_events.shipment_id 
      AND shipments.user_id = auth.uid()
    )
  );

-- Política para que los usuarios inserten eventos en sus envíos
CREATE POLICY "Users can insert events in their shipments" ON tracking_events
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM shipments 
      WHERE shipments.id = tracking_events.shipment_id 
      AND shipments.user_id = auth.uid()
    )
  );

-- Política pública para tracking - permite consultar envíos por tracking_code
-- Esto es para la página /tracking/[code] pública
CREATE POLICY "Public access to tracking by code" ON shipments
  FOR SELECT
  USING (true);

-- Crear una función para verificar acceso seguro a tracking por código
CREATE OR REPLACE FUNCTION get_shipment_by_code(tracking_code_param TEXT)
RETURNS TABLE (
  id uuid,
  tracking_code VARCHAR(20),
  recipient_name VARCHAR(100),
  recipient_phone VARCHAR(20),
  recipient_address TEXT,
  recipient_city VARCHAR(100),
  recipient_reference TEXT,
  shipment_type VARCHAR(50),
  payment_type VARCHAR(50),
  amount_to_charge DECIMAL(10, 2),
  ship_date DATE,
  notes TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  delivered_by VARCHAR(100),
  received_by VARCHAR(100),
  delivery_notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.tracking_code,
    s.recipient_name,
    s.recipient_phone,
    s.recipient_address,
    s.recipient_city,
    s.recipient_reference,
    s.shipment_type,
    s.payment_type,
    s.amount_to_charge,
    s.ship_date,
    s.notes,
    s.status,
    s.created_at,
    s.updated_at,
    s.delivered_at,
    s.delivered_by,
    s.received_by,
    s.delivery_notes
  FROM shipments s
  WHERE s.tracking_code = tracking_code_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear función para obtener eventos de un envío por tracking_code
CREATE OR REPLACE FUNCTION get_tracking_events_by_code(tracking_code_param TEXT)
RETURNS TABLE (
  id uuid,
  shipment_id uuid,
  status VARCHAR(50),
  notes TEXT,
  delivered_by VARCHAR(100),
  received_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    te.id,
    te.shipment_id,
    te.status,
    te.notes,
    te.delivered_by,
    te.received_by,
    te.created_at
  FROM tracking_events te
  JOIN shipments s ON te.shipment_id = s.id
  WHERE s.tracking_code = tracking_code_param
  ORDER BY te.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios sobre las políticas
COMMENT ON POLICY "Public access to tracking by code" ON shipments IS 'Permite acceso público readonly para tracking por código';
COMMENT ON POLICY "Public read access to tracking events" ON tracking_events IS 'Permite acceso público readonly al historial de eventos';
COMMENT ON FUNCTION get_shipment_by_code(TEXT) IS 'Función segura para obtener envío por código de tracking';
COMMENT ON FUNCTION get_tracking_events_by_code(TEXT) IS 'Función segura para obtener historial por código de tracking';