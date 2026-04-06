# ⚙️ Cómo Funciona TaskFlow

## Visión General

TaskFlow es una aplicación de gestión de tareas con automatización, construida como SPA (Single Page Application). No requiere backend ni base de datos: todo vive en el navegador usando `localStorage`.

El usuario puede crear tareas, organizarlas por prioridad y categoría, marcarlas como completadas, y configurar tareas recurrentes que se recrean automáticamente.

---

## Flujo Principal de la Aplicación

```
Usuario abre la app
       │
       ▼
main.tsx → App.tsx → HomePage.tsx
       │
       ▼
useTaskManager (useReducer)
  └── carga tareas desde localStorage al iniciar
       │
       ├── Sidebar (filtros + estadísticas)
       ├── TaskCard (lista de tareas pendientes)
       ├── CompletedPanel (tareas completadas, colapsable)
       ├── AddTaskModal (crear / editar)
       └── CommandPalette (búsqueda rápida)
```

---

## Capas y Responsabilidades

### 1. Dominio (`src/domain/`)
La capa más interna – **sin dependencias**.

- **`Task.ts`** — Define la forma exacta de una tarea (interfaz TypeScript)
- **`Priority / Recurrence / Category`** — Enums tipados; evitan strings mágicos en toda la app
- **`TaskId.ts`** — Value Object que valida que un ID no esté vacío
- **`ITaskRepository.ts`** — Contrato (interfaz) que define las 4 operaciones de persistencia: `getAll`, `save`, `saveAll`, `delete`

### 2. Infraestructura (`src/infrastructure/`)
Implementaciones concretas. **Depende del dominio, no al revés.**

- **`LocalStorageTaskRepository`** — Implementa `ITaskRepository` usando `localStorage`. Serializa con `TaskMapper`.
- **`TaskMapper`** — Convierte `Task` (con objetos `Date`) a JSON plano y viceversa. Crítico para serialización correcta de fechas.
- **`RecurrenceService`** — Función pura `calcularSiguienteFecha(base, recurrence)` que suma días según el tipo de recurrencia.

### 3. Aplicación (`src/application/`)
Casos de uso — **la lógica de negocio orquestada.**

| Caso de Uso         | Qué hace                                                         |
|---------------------|------------------------------------------------------------------|
| `CreateTask`        | Genera UUID + fecha `createdAt`, construye la entidad, persiste  |
| `CompleteTask`      | Setea `completed: true` + `completedAt: now`, persiste           |
| `UndoComplete`      | Setea `completed: false`, borra `completedAt`, persiste          |
| `DeleteTask`        | Filtra el array y persiste sin la tarea eliminada                |
| `EditTask`          | Merge de campos opcionales del DTO, persiste                     |
| `AutoRecreateTask`  | Crea copia de la tarea con nueva `dueDate` calculada             |

**`useTaskManager`** — Hook React con `useReducer`. Coordina todos los casos de uso y expone acciones simples al componente de página:

```
addTask / completeTask / undoComplete / deleteTask / editTask
clearCompleted / importTasks / exportTasks
```

### 4. Presentación (`src/presentation/`)
Componentes React puros. **Solo manejan UI, no lógica de negocio.**

---

## Ciclo de Vida de una Tarea

```
[Crear] → pending (completed: false)
              │
          [Completar] → completed (completed: true, completedAt: Date)
              │                │
          [Undo]          [autoRenew?]
              │                │
          ← pending        [AutoRecreate]
                               │
                           nueva tarea pending con dueDate calculada
```

---

## Automatización (AutoRenew)

Cuando una tarea tiene `autoRenew: true` y se marca como completada:

1. La tarea se mueve normalmente a "completadas"
2. El reducer dispara `AutoRecreateTask` sobre el array resultante
3. Se crea una nueva tarea con:
   - Mismos: `title`, `subtitle`, `icon`, `priority`, `category`, `recurrence`
   - `completed: false`
   - `createdAt: now`
   - `dueDate`: calculada por `RecurrenceService`

| Recurrencia | Días sumados |
|-------------|-------------|
| `DAILY`     | +1 día      |
| `WEEKLY`    | +7 días     |
| `MONTHLY`   | +30 días    |
| `NONE`      | sin cambio  |

El chip **"Auto"** con punto verde pulsante identifica visualmente estas tareas.

---

## Filtros de Vista (Sidebar)

| Vista          | Criterio de filtrado                                  |
|----------------|-------------------------------------------------------|
| Todas          | Todas las tareas pendientes (`completed: false`)      |
| Alta prioridad | `priority === Priority.HIGH`                          |
| Hoy            | `dueDate` existe Y es fecha de hoy                    |
| Automatizadas  | `autoRenew === true`                                  |

---

## Persistencia Detallada

```
Acción del usuario
      │
      ▼
useTaskManager dispatch(action)
      │
      ▼
taskReducer ejecuta el caso de uso correspondiente
      │
      ▼
Caso de uso llama a repository.saveAll(tasks)
      │
      ▼
LocalStorageTaskRepository → TaskMapper.toRaw() → JSON.stringify
      │
      ▼
localStorage.setItem('taskflow_tasks', jsonString)
```

Al recargar la página: `repository.getAll()` → `JSON.parse` → `TaskMapper.toEntity()` (restaura `Date` desde ISO string).

---

## Atajos de Teclado — Implementación

En `HomePage.tsx`, un `useEffect` añade un listener global en `window`:

```typescript
window.addEventListener('keydown', onKeyDown)
```

Reglas del handler:
- Si el foco está en un `<input>` / `<textarea>` → ignora las teclas (para no interferir con escritura)
- `Esc` → cierra modales / palette (siempre activo)
- `N` → abre `AddTaskModal` con `editingTask = null`
- `/` → abre `CommandPalette`

---

## Animaciones (Framer Motion)

| Elemento             | Animación                                                |
|----------------------|----------------------------------------------------------|
| `TaskRow` (entrada)  | `opacity: 0→1`, `y: 8→0` con delay por índice            |
| `TaskRow` (salida)   | `opacity: 0`, `x: -20`                                   |
| `TaskCheckmark`      | Spring `scale: 0→1` con `stiffness: 400, damping: 15`   |
| `CompletedPanel`     | `height: 0→auto` con `AnimatePresence`                   |
| `AddTaskModal`       | `scale: 0.94→1`, `y: 12→0` con spring                   |
| `ModalOverlay`       | `opacity: 0→1` fade                                      |
| `CommandPalette`     | `y: -16→0`, `scale: 0.96→1`                              |
| `Chip "Auto"`        | `opacity: [1, 0.3, 1]` loop infinito                     |
| `Ambient BG`         | CSS keyframe `pulse-glow` en pseudo-elementos del body   |

---

## Export / Import JSON

### Exportar
```
useTaskManager.exportTasks()
  → JSON.stringify(state.tasks)
  → Blob application/json
  → URL.createObjectURL → <a download="taskflow-backup.json">
  → click programático
```

### Importar
```
<input type="file" accept=".json">
  → FileReader.readAsText()
  → JSON.parse()
  → Restaurar Date objects manualmente
  → dispatch({ type: 'IMPORT_TASKS', payload: tasks })
  → repository.saveAll(tasks)
```

---

## Estadísticas del Sidebar

Las stats se calculan en `HomePage.tsx` con `useMemo`:

```typescript
const stats = {
  total: tasks.length,
  completed: tasks.filter(t => t.completed).length,
  completedToday: tasks que se completaron hoy (completedAt === today),
  totalToday: tasks con dueDate === today,
  percentage: Math.round(completed / total * 100)
}
```

El `ProgressBar` usa `transition: width 700ms ease-out` con gradiente `accent → accent2`.

---

## Responsive Design

- **Desktop (≥ 1024px)**: Grid sidebar 300px | contenido 1fr. Sidebar fijo con `position: fixed`.
- **Mobile (< 1024px)**: Sidebar oculto (clase `hidden lg:flex`). El contenido ocupa el 100% del ancho.

> _Nota: El menú móvil inferior no fue implementado en v1 (ver Tareas Pendientes)._
