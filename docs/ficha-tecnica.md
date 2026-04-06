# 📋 Ficha Técnica — TaskFlow

## Identificación del Proyecto

| Campo            | Detalle                                               |
|------------------|-------------------------------------------------------|
| **Nombre**       | TaskFlow                                              |
| **Versión**      | 0.0.0 (Desarrollo)                                    |
| **Tipo**         | Single Page Application (SPA) – Gestor de Tareas     |
| **Autor**        | Equipo Antigravity / Quant24                          |
| **Fecha inicio** | Abril 2026                                            |
| **Repositorio**  | `proyecto/taskflow/`                                  |
| **Puerto local** | `http://localhost:5173`                               |

---

## Stack Tecnológico

| Categoría          | Tecnología              | Versión   |
|--------------------|-------------------------|-----------|
| **Framework UI**   | React                   | 18+       |
| **Lenguaje**       | TypeScript              | 5.x       |
| **Bundler**        | Vite                    | 8.x       |
| **Estilos**        | Tailwind CSS            | 3.x       |
| **Animaciones**    | Framer Motion           | 12.x      |
| **Persistencia**   | localStorage (nativo)   | Web API   |
| **IDs únicos**     | `crypto.randomUUID()`   | Web API   |
| **Fuentes**        | Google Fonts (CDN)      | —         |

### Tipografía

| Fuente     | Pesos     | Uso                          |
|------------|-----------|------------------------------|
| **Syne**   | 700, 800  | Títulos, marca, headings     |
| **DM Sans**| 300–600   | Cuerpo, labels, subtítulos   |

---

## Arquitectura

El proyecto implementa **Clean Architecture** con separación estricta de capas:

```
taskflow/src/
├── domain/          ← Lógica de negocio pura (sin dependencias externas)
├── application/     ← Casos de uso + hook central (useTaskManager)
├── infrastructure/  ← Implementaciones concretas (localStorage, mappers)
├── presentation/    ← Componentes React, páginas, estilos
└── shared/          ← Utilidades, constantes, tipos globales
```

### Principios aplicados
- **Dependency Inversion**: Los casos de uso dependen de `ITaskRepository` (interfaz), no de la implementación concreta.
- **Single Responsibility**: Cada archivo tiene una única responsabilidad.
- **DTO Pattern**: Objetos de transferencia separados para Crear y Editar tareas.
- **Value Object**: `TaskId` encapsula la validación del identificador único.
- **Repository Pattern**: `LocalStorageTaskRepository` implementa `ITaskRepository`.
- **Custom Hook**: `useTaskManager` con `useReducer` centraliza todo el estado.

---

## Modelo de Datos

### Entidad `Task`

```typescript
interface Task {
  id: string            // UUID v4
  title: string         // Máx. 80 caracteres
  subtitle?: string     // Opcional, máx. 120 caracteres
  icon: string          // Emoji (picker de 20 opciones)
  priority: Priority    // HIGH | MEDIUM | LOW
  category: Category    // Quant24 | Antigravity | Personal | Otro
  recurrence: Recurrence// NONE | DAILY | WEEKLY | MONTHLY
  dueDate?: Date        // Fecha límite opcional
  completed: boolean    // Estado de completado
  completedAt?: Date    // Timestamp de completado
  createdAt: Date       // Timestamp de creación
  autoRenew: boolean    // Recreación automática al completar
}
```

### Enums del Dominio

| Enum         | Valores                                |
|--------------|----------------------------------------|
| `Priority`   | `HIGH`, `MEDIUM`, `LOW`                |
| `Recurrence` | `NONE`, `DAILY`, `WEEKLY`, `MONTHLY`   |
| `Category`   | `Quant24`, `Antigravity`, `Personal`, `Otro` |

---

## Paleta de Colores (Design Tokens)

| Variable      | Valor       | Uso                        |
|---------------|-------------|----------------------------|
| `--bg`        | `#0e0e12`   | Fondo principal            |
| `--card`      | `#16161d`   | Cards y sidebar            |
| `--card2`     | `#1c1c26`   | Cards secundarias          |
| `--border`    | `rgba(255,255,255,0.07)` | Bordes sutiles  |
| `--text`      | `#f0f0f5`   | Texto principal            |
| `--muted`     | `#6b6b80`   | Texto secundario           |
| `--accent`    | `#7c6af7`   | Violeta – acento principal |
| `--accent2`   | `#f76a8a`   | Rosa – acento secundario   |
| `--green`     | `#4ade80`   | Éxito / completado         |
| `--yellow`    | `#fbbf24`   | Prioridad media            |
| `--red`       | `#f87171`   | Prioridad alta / error     |

---

## Persistencia

- **Mecanismo**: `localStorage` del navegador
- **Key**: `taskflow_tasks`
- **Formato**: Array JSON con fechas serializadas como ISO 8601 strings
- **Mapper**: `TaskMapper.toRaw()` / `TaskMapper.toEntity()` convierten entre `Task` (con `Date`) y JSON plano

---

## Atajos de Teclado

| Tecla         | Acción                           |
|---------------|----------------------------------|
| `N`           | Abrir modal de nueva tarea       |
| `/`           | Abrir Command Palette (búsqueda) |
| `Esc`         | Cerrar modal / palette abierto   |
| `Ctrl+Enter`  | Confirmar creación en el modal   |

---

## Comandos del Proyecto

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build de producción
npm run build

# Verificar tipos TypeScript
npx tsc --noEmit

# Preview del build de producción
npm run preview
```

---

## Dependencias Principales

```json
{
  "dependencies": {
    "framer-motion": "^12.x",
    "react": "^18.x",
    "react-dom": "^18.x"
  },
  "devDependencies": {
    "autoprefixer": "^10.x",
    "postcss": "^8.x",
    "tailwindcss": "^3.x",
    "typescript": "^5.x",
    "vite": "^8.x"
  }
}
```

---

## Estructura de Carpetas Completa

```
taskflow/
├── public/
│   └── favicon.svg
├── src/
│   ├── domain/
│   │   ├── entities/Task.ts
│   │   ├── enums/{Priority,Recurrence,Category}.ts
│   │   ├── value-objects/TaskId.ts
│   │   └── repositories/ITaskRepository.ts
│   ├── application/
│   │   ├── use-cases/{CreateTask,CompleteTask,UndoComplete,DeleteTask,EditTask,AutoRecreateTask}.ts
│   │   ├── dtos/{CreateTaskDTO,EditTaskDTO}.ts
│   │   └── hooks/useTaskManager.ts
│   ├── infrastructure/
│   │   ├── repositories/LocalStorageTaskRepository.ts
│   │   ├── mappers/TaskMapper.ts
│   │   └── services/RecurrenceService.ts
│   ├── presentation/
│   │   ├── components/layout/{Sidebar,MainLayout}.tsx
│   │   ├── components/task/{TaskCard,TaskRow,TaskIcon,TaskCheckmark,PriorityDot}.tsx
│   │   ├── components/completed/{CompletedPanel,CompletedRow}.tsx
│   │   ├── components/modal/{AddTaskModal,ModalOverlay}.tsx
│   │   ├── components/ui/{Badge,Button,ProgressBar,KeyboardHint,EmptyState}.tsx
│   │   ├── components/command/CommandPalette.tsx
│   │   ├── pages/HomePage.tsx
│   │   └── styles/{globals.css,animations.css}
│   ├── shared/
│   │   ├── constants/app.constants.ts
│   │   ├── utils/{uuid.ts,date.ts,cn.ts}
│   │   └── types/global.types.ts
│   ├── App.tsx
│   └── main.tsx
├── docs/                  ← Documentación técnica
├── index.html
├── tailwind.config.js
├── tsconfig.json
└── package.json
```
