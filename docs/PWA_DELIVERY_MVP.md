# 📱 PWA Delivery MVP - Plan de Implementación

## 🎯 Objetivo
Crear una PWA optimizada para repartidores que permita:
- Instalar la app desde rutas `/delivery`
- Scanner QR nativo para escanear códigos de envío
- Actualizar estados de delivery directamente
- UX móvil-first optimizada para repartidores

## 📋 Tasks de Implementación

### 🔧 **1. Configuración PWA Base**

#### 1.1 Crear Web App Manifest
- [ ] Crear `public/manifest.json`
- [ ] Configurar metadatos de la app:
  - `name`: "Urban City Delivery"  
  - `short_name`: "UC Delivery"
  - `start_url`: "/delivery"
  - `display`: "standalone"
  - `theme_color`: "#EA580C" (orange)
  - `background_color`: "#FFFFFF"
- [ ] Definir iconos para diferentes tamaños (192x192, 512x512)
- [ ] Agregar manifest al layout.tsx

#### 1.2 Service Worker Básico  
- [ ] Crear `public/sw.js` con cache básico
- [ ] Registrar service worker en layout.tsx
- [ ] Cache estático para assets principales
- [ ] NO incluir offline support (MVP)

### 📱 **2. Página Principal Delivery**

#### 2.1 Crear `/app/delivery/page.tsx`
- [ ] Server Component que detecte si hay sesión activa
- [ ] Redirección a `/access` si no está autenticado
- [ ] Layout móvil-first con header limpio

#### 2.2 Scanner QR Component
- [ ] Instalar librería QR scanner: `npm install react-qr-scanner`
- [ ] Crear `DeliveryScanner.tsx` component
- [ ] Permisos de cámara con manejo de errores
- [ ] UI simple: cámara + overlay para apuntar QR
- [ ] Al detectar QR → navegar a `/delivery/[tracking_code]`

#### 2.3 Install Prompt
- [ ] Crear `InstallPWAButton.tsx` component
- [ ] Detectar si app ya está instalada
- [ ] Mostrar botón "📱 Instalar App" solo en rutas delivery
- [ ] Manejar evento `beforeinstallprompt`

### 🎯 **3. Página Específica de Envío**

#### 3.1 Mejorar `/app/delivery/[code]/page.tsx` existente
- [ ] Revisar UI actual - optimizar para móvil
- [ ] Botones grandes para cambiar estado
- [ ] Confirmación visual de acciones
- [ ] Breadcrumb: "🔙 Volver al Scanner"

#### 3.2 Componentes móvil-first
- [ ] `DeliveryStatusCard.tsx` - info del envío
- [ ] `StatusUpdateButtons.tsx` - botones grandes de acción
- [ ] `DeliveryHeader.tsx` - header optimizado móvil

### 🎨 **4. UI/UX Móvil**

#### 4.1 Layout específico para delivery
- [ ] Crear `app/delivery/layout.tsx` específico
- [ ] Header simple con logo pequeño
- [ ] Sin sidebar - navegación mínima
- [ ] Tema de colores para delivery (orange/amber)

#### 4.2 Responsive Design
- [ ] CSS optimizado para móvil (touch targets 44px+)
- [ ] Botones grandes, fáciles de tocar
- [ ] Texto legible en pantallas pequeñas
- [ ] Sin hover effects - solo touch

### 🔗 **5. Integración con Sistema Existente**

#### 5.1 API Updates
- [ ] Verificar que API `/api/delivery/[code]` funcione para updates
- [ ] Manejar errores de red gracefully  
- [ ] Loading states en todos los botones

#### 5.2 Autenticación
- [ ] Verificar que AuthProvider funcione en delivery routes
- [ ] Manejar sesiones expiradas
- [ ] Redirección automática a login si necesario

## 🗂️ Estructura de Archivos Nueva

```
app/
├── delivery/
│   ├── layout.tsx              # Layout específico móvil
│   ├── page.tsx                # Scanner QR principal  
│   ├── [code]/
│   │   └── page.tsx           # Página envío existente (mejorar)
│   └── components/
│       ├── DeliveryScanner.tsx
│       ├── InstallPWAButton.tsx
│       ├── DeliveryStatusCard.tsx
│       └── StatusUpdateButtons.tsx
public/
├── manifest.json               # PWA manifest
├── sw.js                      # Service worker básico
└── icons/
    ├── icon-192x192.png
    └── icon-512x512.png
```

## ⚡ **MVP Features (Incluir)**
- ✅ PWA installable desde delivery routes
- ✅ Scanner QR nativo con cámara
- ✅ UI móvil-first optimizada
- ✅ Actualización de estados básica
- ✅ Navegación simple entre scanner y envío específico

## ❌ **NO MVP Features (Versiones futuras)**
- 🔄 Offline support / Cache de datos
- 📱 Push notifications
- 🎨 Animaciones complejas
- 📊 Analytics avanzados
- 🔐 Autenticación biométrica
- 📷 Captura de fotos de entrega

## 🎯 **Definition of Done**

### Criterios de aceptación:
1. ✅ Repartidor puede instalar PWA desde cualquier link `/delivery/[code]`
2. ✅ App instalada abre directo en `/delivery` (scanner)
3. ✅ Scanner detecta QR codes y navega a página correcta
4. ✅ Puede actualizar estados de envío desde la app
5. ✅ UI completamente usable en móvil (iPhone/Android)
6. ✅ Funciona en Chrome, Safari, Edge móvil

### Testing:
- [ ] Testear instalación PWA en iOS Safari
- [ ] Testear instalación PWA en Android Chrome  
- [ ] Testear scanner QR con códigos reales
- [ ] Testear actualización de estados
- [ ] Testear navegación completa del flujo

## 📅 **Estimación de Tiempo**
- **Setup PWA básico**: 1 día
- **Scanner QR + navegación**: 1-2 días  
- **UI móvil optimization**: 1-2 días
- **Testing + fixes**: 1 día
- **Total: 4-6 días** 🚀

## 🚀 **Post-MVP Roadmap**
- **v1.1**: Offline support para actualizar estados sin internet
- **v1.2**: Push notifications para nuevos envíos
- **v1.3**: Captura de fotos de entrega
- **v1.4**: Geolocalización para tracking en tiempo real