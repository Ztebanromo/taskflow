# ⚡ Cómo Encender y Apagar TaskFlow

---

## 🟢 ENCENDER la App

### Paso 1 — Abre una terminal en la carpeta del proyecto

```powershell
cd "C:\Users\ygnac\OneDrive\Escritorio\proyecto\taskflow"
```

> **Importante:** siempre entrar a la carpeta `taskflow`, no a `proyecto`.

### Paso 2 — Inicia el servidor de desarrollo

```powershell
npm run dev
```

Verás esta salida en la terminal:

```
  VITE v8.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Paso 3 — Abre el navegador

Ve a: **http://localhost:5173**

✅ La app está corriendo cuando ves el dashboard de TaskFlow.

---

## 🔴 APAGAR la App

### Opción A — Desde la terminal donde corre (recomendado)

Haz clic en la terminal donde está corriendo `npm run dev` y presiona:

```
Ctrl + C
```

Aparecerá algo como:

```
^C
```

Y el servidor se detiene inmediatamente.

---

### Opción B — Desde cualquier terminal (matar por puerto)

Si no encuentras la terminal original, usa estos comandos:

**1. Encuentra el PID del proceso:**

```powershell
netstat -ano | findstr :5173
```

Busca la línea con `LISTENING` y anota el número al final (ese es el PID):

```
TCP    [::1]:5173    [::]:0    LISTENING    19820
                                            ↑ PID
```

**2. Mata el proceso con ese PID:**

```powershell
taskkill /PID 19820 /F
```

> Reemplaza `19820` con el número que obtuviste.

---

### Opción C — En una sola línea (PowerShell)

```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173 -State Listen).OwningProcess | Stop-Process -Force
```

---

## ✅ Verificar que está apagada

```powershell
netstat -ano | findstr :5173
```

Si no aparece ninguna línea → el servidor está **apagado**.  
Si aparece `LISTENING` → todavía está corriendo.

---

## 📋 Resumen Rápido

| Acción          | Comando                        |
|-----------------|--------------------------------|
| Entrar al proyecto | `cd "...\proyecto\taskflow"` |
| **Encender**    | `npm run dev`                  |
| **Apagar**      | `Ctrl + C` en la terminal      |
| Ver en navegador| `http://localhost:5173`        |
| Verificar puerto| `netstat -ano \| findstr :5173`|
