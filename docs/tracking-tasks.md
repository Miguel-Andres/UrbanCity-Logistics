# 🚀 Sistema de Tracking - Tasks de Implementación

## 📋 Fase 1: Base de Datos

### Task 1.1: Crear Tablas en Supabase
- [ ] Crear tabla `shipments`
  ```sql
  CREATE TABLE shipments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_code VARCHAR(20) UNIQUE NOT NULL,
    user_id uuid REFERENCES auth.users,
    sender_name VARCHAR(100),
    sender_address TEXT,
    recipient_name VARCHAR(100),
    recipient_address TEXT,
    recipient_phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    delivered_at TIMESTAMP,
    delivered_by VARCHAR(100),
    received_by VARCHAR(100),
    delivery_notes TEXT
  );
  ```

- [ ] Crear tabla `tracking_events`
  ```sql
  CREATE TABLE tracking_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id uuid REFERENCES shipments ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    delivered_by VARCHAR(100),
    received_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

### Task 1.2: Configurar Seguridad (RLS)
- [ ] Habilitar RLS en ambas tablas
  ```sql
  ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
  ```

- [ ] Crear políticas para shipments
  ```sql
  -- Lectura pública
  CREATE POLICY "Anyone can view shipments" ON shipments 
  FOR SELECT USING (true);
  
  -- Solo owner puede crear
  CREATE POLICY "Users can create own shipments" ON shipments 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
  -- Cualquiera puede actualizar (MVP)
  CREATE POLICY "Anyone can update shipment status" ON shipments 
  FOR UPDATE USING (true) WITH CHECK (true);
  ```

- [ ] Crear políticas para tracking_events
  ```sql
  CREATE POLICY "Anyone can view tracking events" ON tracking_events 
  FOR SELECT USING (true);
  
  CREATE POLICY "Anyone can insert tracking events" ON tracking_events 
  FOR INSERT WITH CHECK (true);
  ```

### Task 1.3: Crear Índices
- [ ] Índice para tracking_code (crucial)
  ```sql
  CREATE INDEX idx_tracking_code ON shipments(tracking_code);
  ```
- [ ] Índice para user_id
  ```sql
  CREATE INDEX idx_user_id ON shipments(user_id);
  ```
- [ ] Índice para shipment_id
  ```sql
  CREATE INDEX idx_shipment_id ON tracking_events(shipment_id);
  ```

---

## 📋 Fase 2: Funciones Principales

### Task 2.1: Generador de Códigos
- [ ] Crear `utils/trackingCode.ts`
  ```typescript
  export function generateTrackingCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = 'UC-'
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)]
    }
    return code
  }
  ```

### Task 2.2: Server Actions
- [ ] Crear `actions/shipments.ts`
  ```typescript
  // createShipment: Crear nuevo envío
  export async function createShipment(data: ShipmentData)
  
  // updateDeliveryStatus: Actualizar estado desde /delivery
  export async function updateDeliveryStatus(params: DeliveryUpdate)
  ```

### Task 2.3: Helpers de Base de Datos
- [ ] Crear `lib/shipments.ts`
  ```typescript
  // getShipmentByCode: Para tracking público
  export async function getShipmentByCode(code: string)
  
  // getUserShipments: Para /mis-envios
  export async function getUserShipments(userId: string)
  
  // getTrackingEvents: Historial completo
  export async function getTrackingEvents(shipmentId: string)
  ```

---

## 📋 Fase 3: Modificar Etiquetas Existente

### Task 3.1: Actualizar /etiquetas
- [ ] Importar generateTrackingCode
- [ ] Al generar etiqueta:
  ```typescript
  const trackingCode = generateTrackingCode()
  const shipment = await createShipment({
    trackingCode,
    userId: user.id,
    formData
  })
  ```

### Task 3.2: Modificar Generador de PDF/ZPL
- [ ] Agregar QR code al PDF
  ```typescript
  // URL para QR:
  const deliveryUrl = `${origin}/delivery/${trackingCode}`
  ```
- [ ] Mostrar código de tracking en etiqueta

### Task 3.3: Mejorar UX
- [ ] Quitar redirección automática
- [ ] Agregar toast/modal de éxito
  ```typescript
  toast.success(`✅ Etiqueta generada - Código: ${trackingCode}`)
  ```
- [ ] Resetear formulario para seguir generando

---

## 📋 Fase 4: Página Mis Envíos

### Task 4.1: Crear Estructura
- [ ] Crear `app/mis-envios/page.tsx` (Server Component)
  - Obtener usuario autenticado
  - Fetch de sus envíos
  - Manejo de estado vacío

### Task 4.2: Componente ShipmentCard
- [ ] Crear `app/mis-envios/ShipmentCard.tsx` (Client Component)
  - Mostrar info básica del envío
  - Estados con iconos y colores
  - Botón de copiar link
  - Botón de compartir WhatsApp

### Task 4.3: Funcionalidades de Compartir
- [ ] Implementar `copyToClipboard`
  ```typescript
  const copyLink = async () => {
    await navigator.clipboard.writeText(trackingUrl)
    setCopied(true)
  }
  ```
- [ ] Implementar `shareViaWhatsApp`
  ```typescript
  const message = `¡Tu pedido está en camino! 📦\n\nCódigo: ${trackingCode}\nRastrea aquí: ${trackingUrl}`
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`)
  ```

### Task 4.4: Navegación
- [ ] Agregar enlace a "Mis Envíos" en el menú/dashboard
- [ ] Breadcrumb de navegación

---

## 📋 Fase 5: Tracking Público

### Task 5.1: Crear /tracking/[code]
- [ ] Crear `app/tracking/[code]/page.tsx` (Server Component)
  ```typescript
  export default async function TrackingPage({ params }: { params: { code: string } }) {
    const shipment = await getShipmentByCode(params.code)
    const events = await getTrackingEvents(shipment.id)
    // Mostrar información PÚBLICA
  }
  ```

### Task 5.2: Componente de Visualización
- [ ] Crear `components/tracking/TrackingView.tsx`
  - Código y estado actual
  - Timeline de eventos
  - Solo mostrar info pública
  - Diseño responsive

### Task 5.3: Manejo de Estados
- [ ] Configuración de estados con iconos
  ```typescript
  const STATUS_CONFIG = {
    pending: { icon: '⏳', label: 'Pendiente', color: 'yellow' },
    in_transit: { icon: '🚚', label: 'En tránsito', color: 'blue' },
    delivered: { icon: '✅', label: 'Entregado', color: 'green' },
    failed: { icon: '❌', label: 'No entregado', color: 'red' }
  }
  ```

### Task 5.4: Página 404 Personalizada
- [ ] Manejo de códigos no encontrados
  ```typescript
  if (!shipment) {
    return <TrackingNotFound code={params.code} />
  }
  ```

---

## 📋 Fase 6: Formulario de Delivery

### Task 6.1: Crear /delivery/[code]
- [ ] Crear `app/delivery/[code]/page.tsx`
  - Verificar shipment existe
  - Redirigir si ya está entregado
  - Mostrar formulario público

### Task 6.2: Formulario de Actualización
- [ ] Crear `app/delivery/[code]/DeliveryForm.tsx`
  - Radio buttons para estado
  - Input para "Entregado por"
  - Input para "Recibido por" (solo si entregado)
  - Textarea para notas opcionales
  - Validación de campos

### Task 6.3: Server Action de Update
- [ ] Implementar `updateDeliveryStatus`
  ```typescript
  export async function updateDeliveryStatus({
    trackingCode,
    status,
    deliveredBy,
    receivedBy,
    notes
  }) {
    // Actualizar shipment
    // Crear tracking_event
    // Redirigir a /tracking/[code]
  }
  ```

### Task 6.4: Redirect Post-Update
- [ ] Redirigir automáticamente a tracking después de actualizar
  ```typescript
  if (result.success) {
    redirect(`/tracking/${trackingCode}`)
  }
  ```

---

## 📋 Fase 7: Integración Final

### Task 7.1: Testing de Flujos
- [ ] Test: Generar etiqueta → Crear shipment ✓
- [ ] Test: Mis envíos → Ver lista ✓
- [ ] Test: Copiar link → Pegar en tracking ✓
- [ ] Test: Escanear QR → Actualizar estado ✓
- [ ] Test: Comprador ve tracking público ✓

### Task 7.2: Optimizaciones
- [ ] Loading states en todos los formularios
- [ ] Error boundaries para manejo de errores
- [ ] Validación de formularios
- [ ] SEO tags en páginas públicas

### Task 7.3: Deploy
- [ ] Migración de base de datos en producción
- [ ] Variables de entorno necesarias
- [ ] Testing en producción

---

## 🎯 Orden Sugerido de Implementación

1. **Base de Datos** (Tasks 1.1 - 1.3) - Fundamento
2. **Funciones Principales** (Tasks 2.1 - 2.3) - Lógica
3. **Modificar Etiquetas** (Tasks 3.1 - 3.3) - Integración
4. **Tracking Público** (Tasks 5.1 - 5.4) - Core feature
5. **Delivery Form** (Tasks 6.1 - 6.4) - Actualización
6. **Mis Envíos** (Tasks 4.1 - 4.4) - UI vendedor
7. **Testing Final** (Tasks 7.1 - 7.3) - QA

## ⚡ Quick Start (Mínimo viable)

```
1. Crear tablas BD (30 min)
2. Generador de códigos (15 min)
3. Modificar /etiquetas (45 min)
4. Crear /tracking/[code] (1 hora)
5. Crear /delivery/[code] (1 hora)
6. Probar flujo completo (30 min)
```

**Total estimated: ~4 horas para MVP funcional**

## 🔍 Consideraciones Finales

- **Info pública limitada**: Nunca mostrar dirección completa ni teléfono
- **Validación de datos**: Sanitizar todos los inputs
- **Rate limiting** (opcional): Prevenir abuse
- **Logs**: Registrar cambios importantes
- **Backup**: Exportación de datos de envíos

---

## 📚 Archivos a Crear/Modificar

### Nuevos
```
utils/trackingCode.ts
actions/shipments.ts
lib/shipments.ts
app/mis-envios/page.tsx
app/mis-envios/ShipmentCard.tsx
app/tracking/[code]/page.tsx
components/tracking/TrackingView.tsx
app/delivery/[code]/page.tsx
app/delivery/[code]/DeliveryForm.tsx
```

### A modificar
```
app/etiquetas/page.tsx
lib/pdf-generator.ts (o donde se genera el PDF)
components/navigation/ (agregar enlace a Mis Envíos)
```