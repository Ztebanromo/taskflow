# 🚧 Tareas Pendientes y Futuras — TaskFlow

> Este archivo documenta lo que **no se implementó** en v1 y las ideas de evolución futura.
> Clasificadas por prioridad: 🔴 Alta · 🟡 Media · 🟢 Baja / Experimental

---

## 🔴 Alta Prioridad — Pendientes de v1

Estas fueron mencionadas en el prompt original pero no se implementaron completamente:

### Responsive Mobile — Sidebar como menú inferior
- **Qué falta**: En mobile (`< 1024px`) el sidebar está oculto (`hidden lg:flex`) pero no hay navegación alternativa.
- **Solución propuesta**: Barra de navegación inferior fija (`position: fixed; bottom: 0`) con íconos de las 4 vistas.
- **Archivos a crear/modificar**: `MobileNav.tsx`, `MainLayout.tsx`

```tsx
// MobileNav.tsx — solo visible en mobile
<nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[var(--card)] border-t border-[var(--border)]">
  {NAV_ITEMS.map(item => <NavButton ... />)}
</nav>
```

---

### Navegación por teclado en Command Palette
- **Qué falta**: Las teclas `↑` / `↓` no navegan entre resultados y `Enter` no abre el ítem seleccionado.
- **Solución propuesta**: Trackear `selectedIndex` con estado y `useEffect` en `keydown`.

---

### Validación de fecha límite en modal
- **Qué falta**: No se valida que `dueDate` sea en el futuro. El usuario puede poner fechas pasadas.
- **Solución propuesta**: Añadir validación `if (dueDate < new Date()) setError(...)` antes del submit.

---

## 🟡 Media Prioridad — Mejoras Cercanas

### Sistema de Notificaciones / Toast
- Mostrar un toast (snackbar) al realizar acciones: "Tarea creada", "Tarea eliminada", "¡Copia automática creada!".
- **Implementación sugerida**: `useToast` hook + `ToastContainer` component con `AnimatePresence`.

---

### Drag & Drop para reordenar tareas
- Permitir arrastrar `TaskRow` para cambiar el orden manualmente.
- **Dependencia sugerida**: `@dnd-kit/core` + `@dnd-kit/sortable` (o implementar con Framer Motion `drag`).
- Persistir el orden en localStorage como campo `order: number` en la entidad `Task`.

---

### Filtro por Categoría desde el Sidebar
- Las categorías del sidebar son solo informativas (sin filtrar).
- **Qué falta**: Click en una categoría → filtrar la vista principal por esa categoría.
- **Modificaciones**: `FilterView` tipo → agregar `category_quant24 | category_antigravity | ...`, lógica en `HomePage`.

---

### Búsqueda con Comandos en la Command Palette
- Actualmente solo filtra tareas por nombre.
- **Ideas de expansión**:
  - `> nueva tarea` → abre el modal
  - `> limpiar completadas` → acción directa
  - `> exportar` → descarga JSON
  - Prefijo `#` para filtrar por categoría: `#antigravity diseño`

---

### Edición inline en TaskRow
- Al hacer doble-click en el título de una tarea, se convierte en un `<input>` para editar sin abrir el modal.
- Tecla `Enter` confirma, `Esc` cancela.

---

### Contador de tareas pendientes en el título del navegador
```typescript
// En HomePage.tsx
useEffect(() => {
  document.title = pendingTasks.length > 0
    ? `(${pendingTasks.length}) TaskFlow`
    : 'TaskFlow';
}, [pendingTasks.length]);
```

---

## 🟢 Baja Prioridad / Ideas Futuras

### Sincronización Multi-tab
- Escuchar el evento `storage` de `window` para sincronizar cambios entre pestañas del mismo navegador.
```typescript
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) dispatch({ type: 'IMPORT_TASKS', payload: ... })
})
```

---

### Subtareas (Checklist dentro de una Tarea)
- Añadir campo `subtasks: SubTask[]` a la entidad `Task`.
- `SubTask`: `{ id: string, title: string, done: boolean }`.
- UI: Lista expandible debajo del `TaskRow` principal con mini-checkmarks.

---

### Etiquetas / Tags Personalizados
- Además de Categorías fijas, permitir tags libres: `#diseño`, `#urgente`, `#cliente-x`.
- Almacenar como `tags: string[]` en la entidad.
- Filtrado y búsqueda por tags en la Command Palette.

---

### Modo Pomodoro integrado
- Al seleccionar una tarea, iniciar un timer Pomodoro (25min).
- Persistir sesiones de pomodoro vinculadas al `task.id`.
- Widget flotante con countdown animado.

---

### Dashboard / Vista Analytics
- Nueva página con gráficas de productividad:
  - Tareas completadas por día (últimos 7 días) — gráfica de barras
  - Distribución por categoría — gráfica de dona
  - Streak de días con tareas completadas
- **Implementación**: Con SVG puro o librería `recharts`/`visx`.

---

### Temas de Color (Theme Switcher)
- Permitir cambiar entre temas: Dark (actual), Light, Midnight Blue, Forest Green.
- Variables CSS dinámicas cambiando el `:root` con JavaScript.
- Persistir preferencia en `localStorage`.

---

### Backend Opcional (Supabase / Firebase)
- Migrar de `localStorage` a base de datos en la nube.
- Solo requiere implementar `SupabaseTaskRepository` que implemente `ITaskRepository`.
- Sin cambios en las capas de dominio o aplicación (Dependency Inversion).
- Habilitaría sincronización entre dispositivos y respaldo automático.

---

### PWA (Progressive Web App)
- Agregar `manifest.json` y Service Worker.
- App instalable desde Chrome como aplicación de escritorio.
- Soporte offline (ya funciona offline por usar localStorage, solo falta el manifest).

```json
// public/manifest.json
{
  "name": "TaskFlow",
  "short_name": "TaskFlow",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#7c6af7",
  "background_color": "#0e0e12",
  "icons": [{ "src": "/favicon.svg", "sizes": "any", "type": "image/svg+xml" }]
}
```

---

### Tests Automatizados

| Tipo      | Herramienta    | Cobertura objetivo                              |
|-----------|---------------|--------------------------------------------------|
| Unit      | Vitest         | Casos de uso, RecurrenceService, TaskMapper      |
| Component | Testing Library| TaskRow, AddTaskModal, CompletedPanel            |
| E2E       | Playwright     | Flujo crear → completar → autorenew → verificar  |

```bash
# Setup sugerido
npm install -D vitest @testing-library/react @testing-library/user-event
npm install -D @playwright/test
```

---

## 📊 Roadmap de Versiones Sugerido

```
v1.0 (actual) ──── Base funcional completa, Clean Architecture, localStorage
     │
v1.1 ─────────── Mobile nav, toasts, keyboard nav en palette, validaciones
     │
v1.2 ─────────── Drag & drop, filtro por categoría, edición inline
     │
v2.0 ─────────── Backend Supabase, sync multi-dispositivo, auth básica
     │
v2.1 ─────────── Dashboard analytics, subtareas, tags personalizados
     │
v3.0 ─────────── PWA, pomodoro integrado, temas de color, notificaciones push
```
