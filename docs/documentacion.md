# TaskFlow - Documentación del Proyecto

## Estructura del Proyecto

```
src/
├── domain/           # Capa de dominio (núcleo de negocio)
│   ├── entities/     # Entidades (Task)
│   ├── repositories/ # Interfaces de repositorios
│   ├── enums/        # Enumeraciones (Priority, Recurrence)
│
├── application/      # Capa de aplicación
│   ├── use-cases/    # Casos de uso (CreateTask, CompleteTask, etc.)
│   ├── hooks/        # Custom hooks (useTaskManager)
│   └── dtos/         # Data Transfer Objects
│
├── infrastructure/   # Capa de infraestructura
│   ├── repositories/ # Implementaciones de repositorios
│   ├── services/     # Servicios (RecurrenceService)
│   └── mappers/      # Mapeadores de datos
│
├── presentation/     # Capa de presentación (UI)
│   ├── components/   # Componentes React
│   ├── pages/       # Páginas (HomePage)
│   └── styles/      # Estilos CSS
│
└── shared/          # Utilidades compartidas
    ├── types/       # Tipos globales
    ├── utils/       # Utilidades (date, uuid, cn)
    └── constants/   # Constantes
```

## Tech Stack

- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **TailwindCSS** - Estilos
- **Framer Motion** - Animaciones
- **LocalStorage** - Persistencia de datos

## Scripts

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Construir para producción
npm run lint    # Verificar código
npm run preview # Previsualizar build
```

## Funcionalidades

- ✅ Crear, editar, eliminar tareas
- ✅ Completar/descompletar tareas
- ✅ Duplicar tareas
- ✅ Prioridades (baja, media, alta)
- ✅ Fechas de vencimiento (con validación)
- ✅ Recurrencia automática (diaria, semanal, mensual)
- ✅ Filtrado por prioridad/fecha
- ✅ Paleta de comandos (/)
- ✅ Importar/Exportar tareas (JSON)
- ✅ Panel de tareas completadas
- ✅ Sidebar con estadísticas
- ✅ Tema oscuro por defecto
- ✅ Persistencia en LocalStorage
- ✅ Notificaciones toast

## Atajos de teclado

- `N` - Nueva tarea
- `/` - Abrir paleta de comandos
- `Esc` - Cerrar modales

## Categorías por defecto

- Quant24 (púrpura)
- Antigravity (rosa)
- Personal (verde)
- Otro (gris)

## Detalles de implementación

### Recurrencia
- **Diaria**: +1 día
- **Semanal**: +7 días
- **Mensual**: +1 mes (usa setMonth para meses reales)

### Persistencia
Los datos se guardan en LocalStorage con la clave `taskflow-tasks` y `taskflow-categories`.

### Value Objects eliminados
- TaskId.ts (no usado, redundante)

### Correcciones aplicadas
1. Eliminado doble guardado en CreateTask
2. Corregido recurrence mensual para usar meses reales
3. Validación de fecha en modal (no permite fechas pasadas)
