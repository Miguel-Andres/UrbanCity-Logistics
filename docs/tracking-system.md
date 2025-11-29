# Sistema de Tracking - Arquitectura y Documentación

## 📋 Resumen del Proyecto

Implementación de un sistema de tracking simple y eficiente para Urban City Logistics que permita:
- Generar códigos únicos de seguimiento
- Compartir links públicos de tracking
- Actualizar estados de entrega mediante QR
- Historial completo de envíos

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                        Workflow                             │
└─────────────────────────────────────────────────────────────┘

1. Vendedor genera etiqueta
   ├─ /etiquetas → Formulario
   ├─ Genera código aleatorio: UC-A3K9M2
   ├─ Crea shipment en DB
   ├─ PDF con QR code → /delivery/[code]
   └─ Redirige a /mis-envios

2. Vendedor comparte tracking
   ├─ /mis-envios → Lista de envíos
   ├─ Botón "Copiar Link"
   └─ Comparte: dominio.com/tracking/UC-A3K9M2

3. Comprador consulta tracking
   ├─ Abre link (público)
   ├─ /tracking/[code] → Estado del envío
   └─ Ve historial sin login

4. Repartidor actualiza entrega
   ├─ Escanea QR → /delivery/[code]
   ├─ Formulario simple (sin login)
   ├─ Actualiza estado + quien entregó/recibió
   └─ Redirige a /tracking/[code]
```

## 🗄️ Base de Datos

### Tablas Principales

```sql
-- Tabla de envíos
CREATE TABLE shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code VARCHAR(20) UNIQUE NOT NULL,  -- UC-A3K9M2
  user_id uuid REFERENCES auth.users,          -- Vendedor que creó
  
  -- Información del envío
  sender_name VARCHAR(100),
  sender_address TEXT,
  recipient_name VARCHAR(100),
  recipient_address TEXT,
  recipient_phone VARCHAR(20),
  
  -- Estado y fechas
  status VARCHAR(50) DEFAULT 'pending',       -- pending | in_transit | delivered | failed
  created_at TIMESTAMP DEFAULT NOW(),
  delivered_at TIMESTAMP,
  
  -- Información de entrega
  delivered_by VARCHAR(100),                  -- Nombre del repartidor
  received_by VARCHAR(100),                   -- Nombre de quien recibió
  delivery_notes TEXT                         -- Notas adicionales
);

-- Historial de eventos
CREATE TABLE tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid REFERENCES shipments ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  delivered_by VARCHAR(100),                  -- Quién entregó
  received_by VARCHAR(100),                   -- Quién recibió
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Políticas de Seguridad (RLS)

```sql
-- Habilitar RLS
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;

-- Shipments: Cualquiera puede VER (para tracking público)
CREATE POLICY "Anyone can view shipments" ON shipments
FOR SELECT USING (true);

-- Solo el owner puede CREAR
CREATE POLICY "Users can create own shipments" ON shipments
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cualquiera puede ACTUALIZAR estado (MVP - delivery público)
CREATE POLICY "Anyone can update shipment status" ON shipments
FOR UPDATE USING (true) WITH CHECK (true);

-- Tracking events: Público
CREATE POLICY "Anyone can view tracking events" ON tracking_events
FOR SELECT USING (true);

CREATE POLICY "Anyone can insert tracking events" ON tracking_events
FOR INSERT WITH CHECK (true);
```

### Índices de Performance

```sql
-- Índice crucial para búsquedas rápidas
CREATE INDEX idx_tracking_code ON shipments(tracking_code);
CREATE INDEX idx_user_id ON shipments(user_id);
CREATE INDEX idx_shipment_id ON tracking_events(shipment_id);
```

## 🛣️ Estructura de Rutas

```
/etiquetas
├─ Genera etiqueta + shipment
├─ Crea tracking_code aleatorio
└─ Descarga PDF con QR

/mis-envios
├─ Lista de envíos del usuario
├─ Cards con estados
├─ Botón copiar link
└─ Botón compartir WhatsApp

/tracking/[code] (PÚBLICO)
├─ Server component
├─ Fetch automático
├─ Muestra información pública:
│  ├─ Código y estado actual
│  ├─ Destinatario y ciudad
│  └─ Historial completo
└─ NO requiere login

/delivery/[code] (PÚBLICO)
├─ Formulario simple
├─ Update de estado
├─ Campos: entregado por, recibió por
└─ Redirige a tracking
```

## 📊 Estados del Sistema

### Estados Posibles

| Estado | Icono | Descripción |
|--------|-------|-------------|
| pending | ⏳ | Pendiente de recolección |
| in_transit | 🚚 | En tránsito |
| delivered | ✅ | Entregado |
| failed | ❌ | Cliente ausente/No entregado |

### Flujo de Estados

```
pending → in_transit → delivered
                ↓
              failed
```

## 🔧 Implementación Técnica

### 1. Generación de Códigos

```typescript
function generateTrackingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Sin O,0,I,1
  let code = 'UC-'
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code  // Ej: UC-A3K9M2
}
```

### 2. Flujo de Componentes

```
/etiquetas
├─ Formulario existente
├─ Al generar:
│  ├─ createShipment(data)
│  ├─ generatePDF(con QR)
│  └─ redirect('/mis-envios')

/mis-envios/page.tsx
├─ Server component (auth)
├─ Fetch shipments del user
└─ ShipmentCard(x3)

ShipmentCard
├─ Info del envío
├─ Botón copiar link
└─ Botón WhatsApp

/tracking/[code]/page.tsx
├─ Server component (público)
├─ Fetch shipment por code
└─ TrackingView

/delivery/[code]/page.tsx
├─ Server component (público)
├─ Fetch shipment por code
└─ DeliveryForm
   └─ updateDeliveryStatus(action)
```

## 🔒 Seguridad Considerations

### 1. Códigos Aleatorios
- 6 caracteres = 33^6 = 1,291,467,969 combinaciones
- Imposible de enumerar
- Sin secuencia predecible

### 2. Información Pública Limitada
```
✅ Mostrar públicamente:
- Nombre del destinatario
- Ciudad (no dirección completa)
- Estado del envío
- Fechas

❌ NO mostrar públicamente:
- Dirección exacta
- Teléfono completo
- Datos del vendedor
- Precios/costos
```

### 3. Rate Limiting (Opcional)
- 10 consultas por minuto por IP
- Prevenir brute force

## 📱 Experiencia de Usuario

### Flujo Vendedor
1. Login → /etiquetas
2. Completa formulario → "Generar"
3. PDF descarga + shipment creado
4. Redirect → /mis-envios
5. Ve lista con su nuevo envío
6. Click "Copiar Link"
7. Pega en WhatsApp al comprador

### Flujo Comprador
1. Recibe link por WhatsApp
2. Click → /tracking/UC-A3K9M2
3. Ve estado SIN login
4. Puede recargar para ver updates

### Flujo Repartidor
1. Escanea QR en etiqueta
2. Abre /delivery/UC-A3K9M2
3. Completa formulario simple:
   - Estado (Entregado/No entregado)
   - Entregado por (su nombre)
   - Recibió por (si entregó)
4. Submit → DB actualizada
5. Redirect → /tracking/UC-A3K9M2

## 🚀 MVP - Alcance Inicial

### ✅ Características Incluidas
- Generación de etiquetas con tracking
- Códigos aleatorios únicos
- Lista de envíos del usuario
- Links públicos de tracking
- Actualización de estado sin login
- QR codes en etiquetas
- Información pública limitada

### ❌ Características Futuras (v2)
- Roles y permisos (repartidores, admin)
- Fotos de entrega
- Notificaciones por email
- Dashboard analytics
- API endpoints adicionales
- Rate limiting
- Caché Redis

## 📋 Checklist de Implementación

### Base de Datos
- [ ] Crear tabla shipments
- [ ] Crear tabla tracking_events  
- [ ] Configurar RLS policies
- [ ] Crear índices

### Componentes y Páginas
- [ ] Modificar /etiquetas para crear shipment
- [ ] Crear /mis-envios página
- [ ] Crear /mis-envios/ShipmentCard
- [ ] Crear /tracking/[code] página
- [ ] Crear /delivery/[code] página
- [ ] Crear DeliveryForm

### Funciones y Actions
- [ ] generateTrackingCode()
- [ ] createShipment()
- [ ] updateDeliveryStatus()
- [ ] getShipmentByCode()
- [ ] getTrackingEvents()

### Integraciones
- [ ] QR code en PDF existente
- [ ] Links de compartir
- [ ] WhatsApp sharing

## 🔧 Consideraciones Técnicas

### Performance
- Índice en tracking_code: <5ms查询
- Server components: SEO friendly
- Sin API routes adicionales

### Scalabilidad
- Soporta 1M+ envíos
- Códigos únicos garantizados
- DB optimizada con índices

### Error Handling
- Códigos no encontrados → 404
- Formularios validados
- Loading states

---

## 🚀 Siguientes Pasos

1. **Crear tablas en Supabase**
2. **Implementar generateTrackingCode()**
3. **Modificar /etiquetas para crear shipment**
4. **Crear /tracking/[code] página pública**
5. **Implementar /delivery/[code] con formulario**
6. **Crear /mis-envios con lista de envíos**
7. **Agregar QR codes en etiquetas**
8. **Testing completo del flujo**