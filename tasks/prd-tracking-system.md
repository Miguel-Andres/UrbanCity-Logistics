# PRD: Sistema de Tracking Urban City Logistics

## 1. Overview

Implementación de un sistema de tracking completo para Urban City Logistics que permita a los vendedores generar códigos de seguimiento únicos al crear etiquetas, compartir links de seguimiento con los compradores, y actualizar estados de entrega mediante QR codes. El sistema debe ser simple, escalable y con un diseño minimalista y moderno.

## 2. Goals

### Objetivos Principales
- Generar automáticamente un código de tracking único al crear cada etiqueta
- Proporcionar una página pública para que los compradores vean el estado de sus envíos
- Permitir actualizaciones de estado simples mediante escaneo de QR
- Crear una lista de envíos para que los vendedores gestionen y compartan links
- Soportar hasta 100 envíos diarios por vendedor con excelente performance

### Objetivos Secundarios
- Mejorar la experiencia del comprador con información en tiempo real
- Reducir consultas de soporte sobre estado de envíos
- Facilitar el compartir tracking por WhatsApp
- Crear una base para futuras funcionalidades avanzadas

## 3. User Stories

### Vendedor (Usuario Registrado)
- Como vendedor, quiero que al generar una etiqueta se cree automáticamente un código de tracking para poder rastrear el envío
- Como vendedor, quiero ver una lista de todos mis envíos con sus estados para gestionarlos fácilmente
- Como vendedor, quiero poder copiar el link de tracking para enviarlo por WhatsApp al comprador
- Como vendedor, quiero que el link de tracking sea corto y profesional para dar buena imagen
- Como vendedor, quiero ver el historial completo de cambios de estado de cada envío

### Comprador (Usuario No Registrado)
- Como comprador, quiero poder ver el estado de mi paquete sin necesidad de registrarme
- Como comprador, quiero que la información se muestre inmediatamente al hacer click en el link
- Como comprador, quiero ver el historial completo con fechas y detalles
- Como comprador, quiero poder identificar fácilmente quién recibió el paquete

### Repartidor (Cualquier persona con QR)
- Como repartidor, quiero poder actualizar el estado escaneando un QR sin necesidad de login
- Como repartidor, quiero un formulario simple que solo pida información esencial
- Como repartidor, quiero poder marcar como entregado o cliente ausente fácilmente
- Como repartidor, quiero poder dejar notas sobre la entrega si es necesario

## 4. Functional Requirements

### 4.1 Generación de Tracking
1. El sistema debe generar un código de tracking aleatorio en formato UC-ABC123 (prefijo + 6 caracteres alfanuméricos)
2. El código debe ser único y no secuencial para seguridad
3. Al generar una etiqueta en /etiquetas, el sistema debe:
   a. Crear un registro en la tabla shipments
   b. Asignar un tracking_code único
   c. Generar un QR code que apunte a /delivery/[tracking_code]
   d. Incluir el QR en el PDF/ZPL de la etiqueta

### 4.2 Página Pública de Tracking
4. Crear /tracking/[code] como página pública accesible sin login
5. La página debe mostrar automáticamente la información del envío al cargar
6. La información visible públicamente incluye:
   a. Código de tracking
   b. Nombre del destinatario
   c. Ciudad/localidad de destino (sin dirección completa)
   d. Estado actual
   e. Historial completo con timestamps
   f. Nombre de quién entregó y recibió (si aplica)

### 4.3 Actualización de Estado por QR
7. Crear /delivery/[code] como formulario público para actualizar estado
8. El formulario debe permitir:
   a. Marcar como "Entregado" o "No entregado (cliente ausente)"
   b. Ingresar nombre de quién entrega
   c. Ingresar nombre de quien recibe (solo si entregado)
   d. Agregar notas opcionales
9. No se requiere login ni autenticación para acceder
10. Al actualizar, debe redirigir a /tracking/[code] para ver los cambios

### 4.4 Lista de Envíos del Vendedor
11. Crear /mis-envios como página protegida (requiere login)
12. Mostrar todos los envíos del usuario logueado con paginación (20 por página)
13. Cada envío debe mostrar:
   a. Código de tracking
   b. Nombre del destinatario
   c. Estado actual con iconos
   d. Fecha de creación
   e. Botones para copiar link y compartir por WhatsApp
14. Incluir contador total de envíos y filtros por estado

### 4.5 Integración con Etiquetas
15. Modificar /etiquetas para que al generar:
   a. Cree el shipment con tracking_code
   b. Incluya el código de tracking en el PDF/ZPL
   c. Agregue el QR code en la etiqueta
   d. Muestre una notificación de éxito con el código
16. El diseño debe ser minimalista, limpio y más moderno que el actual

### 4.6 Estados y Transiciones
17. El sistema soporta 4 estados principales:
   a. "pending" - Pendiente (⏳)
   b. "in_transit" - En tránsito (🚚)
   c. "delivered" - Entregado (✅)
   d. "failed" - No entregado (❌)
18. Cada cambio de estado debe crear un registro en tracking_events

### 4.7 Datos a Almacenar
19. Para cada shipment:
   a. tracking_code único
   b. user_id (quien creó)
   c. datos de remitente y destinatario
   d. estado actual
   e. delivered_by y received_by (cuando aplique)
   f. delivery_notes
   g. timestamps de creación y entrega

## 5. Non-Goals (Out of Scope)

### MVP No Incluirá:
- Sistema de roles (repartidores, admins)
- Autenticación en /delivery
- Fotos de entrega
- Notificaciones por email o push
- Dashboard de analytics
- Asignación de repartidores a envíos
- Firma digital
- Geolocalización
- Edición de envíos después de creados

## 6. Design Considerations

### 6.1 UI/UX Requirements
- Diseño minimalista con uso generoso de espacios en blanco
- Colores consistentes con la marca (naranja como color primario)
- Iconos claros para cada estado
- Dark mode soportado
- Mobile-first responsive design
- Loading states claros
- Sin componentes innecesarios

### 6.2 Componentes Clave
- Tarjeta de envío con info esencial y botones de acción
- Timeline de eventos con círculos y líneas conectando
- Formularios simples con validación en tiempo real
- Botones con íconos claros (copiar, WhatsApp, etc.)

### 6.3 Diseño de /etiquetas
- Reescribir la página actual con diseño más limpio
- Secciones bien definidas con separadores visuales
- Tipografía jerárquica clara
- Input fields con bordes suaves y focus states
- Botones prominentes con hover effects suaves

## 7. Technical Considerations

### 7.1 Arquitectura
- Next.js 14 con App Router
- Server Components para páginas públicas
- Client Components solo donde se necesite interactividad
- Supabase como base de datos
- Row Level Security (RLS) configurado

### 7.2 Base de Datos
- Tabla `shipments` con índice en tracking_code para rendimiento
- Tabla `tracking_events` para historial completo
- Políticas RLS: lectura pública, escritura protegida
- Soporte para 1M+ envíos sin degradación

### 7.3 Performance
- Índices en tracking_code y user_id
- Paginación en /mis-envios
- Server components para SEO y performance
- Cache opcional con Redis/Upstash para tracking frecuente

### 7.4 Seguridad
- Códigos aleatorios (no secuenciales) - 1.29B combinaciones
- Información pública limitada (sin direcciones/teléfonos)
- Input sanitization en todos los formularios
- Rate limiting opcional (10 req/min por IP)

## 8. Success Metrics

### Métricas de Adopción
- % de etiquetas generadas con tracking activo
- Cantidad de actualizaciones de estado por día
- Clicks en links de tracking compartidos

### Métricas de Performance
- Tiempo de carga de /tracking/[code] < 100ms
- Tiempo de generación de tracking < 50ms
- Queries a BD < 10ms con índices

### Métricas de Negocio
- Reducción de consultas de soporte sobre estado
- Tasa de uso de compartido por WhatsApp
- Retorno de usuarios a /mis-envios

## 9. Open Questions

1. ¿Qué información exacta mostrar en el historial? ¿Solo cambio de estado o incluir ubicaciones?
2. ¿Cuántos caracteres debe tener el campo de notas?
3. ¿Deberíamos mostrar fechas en formato local (dd/mm/yyyy) o relativo ("hace 2 horas")?
4. ¿Necesitamos exportar la lista de envíos a CSV/Excel?

## 10. Implementation Notes

### Estructura de Archivos
```
app/
├── etiquetas/page.tsx (modificar diseño)
├── mis-envios/page.tsx (nuevo)
├── mis-envios/ShipmentCard.tsx (nuevo)
├── tracking/[code]/page.tsx (nuevo)
├── delivery/[code]/page.tsx (nuevo)
├── delivery/[code]/DeliveryForm.tsx (nuevo)
└── delivery/[code]/actions.ts (nuevo)

lib/
├── tracking/generateCode.ts (nuevo)
├── tracking/getShipment.ts (nuevo)
└── pdf/generate.ts (modificar para QR)

db/
└── migrations/
    └── 001_create_shipments.sql (nuevo)
```

### Prioridad de Implementación
1. Base de datos y funciones básicas
2. Modificar /etiquetas para generar tracking
3. Crear /tracking/[code] página pública
4. Implementar /delivery/[code] para actualizaciones
5. Crear /mis-envios con lista y compartido
6. Mejorar diseño de /etiquetas
7. Testing y optimización