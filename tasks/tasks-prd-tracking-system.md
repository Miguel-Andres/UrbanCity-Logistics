## Relevant Files

- `db/migrations/001_create_shipments.sql` - SQL migration para crear tablas shipments y tracking_events con índices óptimos
- `db/migrations/002_configure_rls.sql` - Migration para configurar Row Level Security y políticas de acceso
- `docs/instructions/001_migration_setup.md` - Instrucciones para ejecutar migración 001
- `docs/instructions/002_rls_setup.md` - Instrucciones para ejecutar migración 002 y pruebas
- `lib/tracking-code-generator.ts` - Generador de códigos únicos con verificación en BD
- `lib/tracking-helpers.ts` - Helpers para operaciones CRUD de shipments y tracking
- `app/api/generar-pdf/route.ts` - Modificado para integrar tracking_code y autenticación
- `app/api/generar-pdf/types/index.ts` - Actualizado para incluir tracking_code opcional
- `app/api/generar-pdf/utils/pdf-template.ts` - Template HTML para PDF con QR code (pendiente modificar)
- `app/etiquetas/types.ts` - Tipos del formulario de etiquetas existente

### Notes

- Usar SSR para páginas públicas de tracking
- Implementar Rate Limiting opcional (10 req/min por IP)
- Seguir convención de commits: feat:, fix:, refactor:, etc.

## Tasks

- [x] 1.0 Configurar Base de Datos y Funciones Principales
  - [x] 1.1 Crear tablas shipments y tracking_events en Supabase
  - [x] 1.2 Configurar políticas RLS para acceso público y protegido
  - [x] 1.3 Crear índices óptimos siguiendo guía de Supabase:
    - ✅ Índice unique en tracking_code (más rápido para búsquedas exactas)
    - ✅ Índice compuesto en (user_id, created_at DESC) para /mis-envios
    - ✅ Índice en shipment_id para tracking_events con clustering
    - ✅ Configuración de autovacuum para alto volumen
  - [x] 1.4 Implementar generador de códigos de tracking aleatorios
  - [x] 1.5 Crear helpers de base de datos para operaciones de tracking
  - [x] 1.6 Configurar vacuum y autovacuum para mantenimiento automático
  - [ ] 1.7 Establecer statement_timeout para queries largos

- [ ] 2.0 Modificar Generación de Etiquetas para Integrar Tracking
  - [x] 2.1 Integrar generación de tracking_code en el flujo de etiquetas
  - [ ] 2.2 Modificar API de PDF para incluir QR code
  - [ ] 2.3 Modificar API de ZPL para incluir QR code
  - [x] 2.4 Guardar shipment en BD al generar etiqueta
  - [ ] 2.5 Mejorar diseño UI de /etiquetas (minimalista)
  - [ ] 2.6 Optimizar inserción masiva si se generan múltiples etiquetas

- [ ] 3.0 Crear Página Pública de Tracking Detallado
  - [ ] 3.1 Crear /tracking/[code] como server component
  - [ ] 3.2 Implementar vista de información pública del envío
  - [ ] 3.3 Crear timeline de eventos con historial completo
  - [ ] 3.4 Modificar /tracking actual para redirigir a /[code]
  - [ ] 3.5 Implementar manejo de errores para códigos no encontrados
  - [ ] 3.6 Usar prepared statements para prevenir SQL injection

- [ ] 4.0 Implementar Formulario de Actualización de Estado
  - [ ] 4.1 Crear /delivery/[code] página pública
  - [ ] 4.2 Implementar formulario simple para actualizar estado
  - [ ] 4.3 Crear server action para actualizar estado
  - [ ] 4.4 Implementar validación y manejo de errores
  - [ ] 4.5 Configurar redirect a /tracking después de actualizar
  - [ ] 4.6 Implementar transacciones para asegurar consistencia

- [ ] 5.0 Crear Lista de Envíos del Vendedor
  - [ ] 5.1 Crear /mis-envios página protegida
  - [ ] 5.2 Implementar paginación con cursor-based (mejor performance que OFFSET)
  - [ ] 5.3 Crear componente ShipmentCard con botones de acción
  - [ ] 5.4 Implementar funcionalidad de copiar link
  - [ ] 5.5 Implementar compartir por WhatsApp
  - [ ] 5.6 Agregar enlace a /mis-envios en la navegación
  - [ ] 5.7 Implementar filters por estado con índices soportados

- [ ] 6.0 Testing y Optimización
  - [ ] 6.1 Escribir tests unitarios para funciones de tracking
  - [ ] 6.2 Escribir tests de integración para flujos principales
  - [ ] 6.3 Analizar queries con EXPLAIN ANALYZE para optimización
  - [ ] 6.4 Implementar cache con Supabase Edge Functions para tracking frecuentes
  - [ ] 6.5 Configurar connection pooling para alta concurrencia
  - [ ] 6.6 Implementar rate limiting para prevenir abuse
  - [ ] 6.7 Monitorear performance con pg_stat_statements
  
- [ ] 7.0 Implementación Avanzada y Seguridad
  - [ ] 7.1 Implementar logging de consultas lentas
  - [ ] 7.2 Crear triggers para timestamps automáticos
  - [ ] 7.3 Implementar soft deletes para conservación de datos
  - [ ] 7.4 Configurar backups automáticos de datos críticos
  - [ ] 7.5 Implementar data masking para información sensible