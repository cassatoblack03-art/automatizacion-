# Centro de Entrenamiento Personal de Inglés · 6 meses

App web para Emiliano (Logistics Trainee en Groupe SEB): de A2 a B2 en 6 meses, con vocabulario de logística, del proyecto *Automating the Gross Sales Report* y de natación.

Todo vive en un solo componente React: [`EnglishTrainingCenter.jsx`](./EnglishTrainingCenter.jsx) (React + Tailwind CSS + `lucide-react`). El progreso se guarda en `localStorage` con el prefijo `emiliano-etc:`.

## Módulos

| Pestaña | Qué hace |
| --- | --- |
| **Dashboard** | Racha, día/semana/mes del plan, rutina de 40 min con temporizadores (15′ Input Auditivo, 10′ Shadowing, 15′ Output Activo), reto diario de escritura con detector de errores, keyword del día y cuadrícula de los ~182 días. |
| **Laboratorio** ⭐ | 34 términos precargados (12 phrasal verbs de oficina, 9 de logística, 8 de automatización y datos, 5 conectores ejecutivos). Buscador (acepta inglés o español, con o sin acentos), filtros por categoría, comparador *Traductor vs. Nativo* con modo reto, entrenador *Fill in the Blank* (teclas 1–4 y Enter) y formulario para agregar keywords propias. |
| **Cazatrampas** | Las 5 Reglas de Oro con ejemplos correctos y prohibidos, quiz de 15 preguntas con desglose por regla, y un detector de trampas para revisar frases antes de mandarlas por Teams. |
| **Flashcards** | Tarjetas que giran (Inglés → Español o al revés) con todo el Laboratorio + 12 verbos diarios en pasado. “Repasar” regresa la tarjeta 3 lugares después; “La domino” la saca de la sesión. Teclado: ← / Espacio / →. |
| **Daily Standup** | Eliges qué hiciste ayer, qué harás hoy, el bloqueo y el cierre; genera el script en formato junta (en voz alta) o mensaje de Teams, lo lee en voz alta y lo copia. Marca qué keywords del Laboratorio usaste. |
| **Roadmap 6 meses** | 6 etapas (A2 → B2) con 36 metas verificables; donde la app puede medir tu avance (quiz, tarjetas dominadas, keywords propias, standups, días de rutina) te lo muestra debajo de la meta. |

En *Dashboard → Ajustes y respaldo* puedes cambiar la fecha de inicio del plan, copiar un respaldo del progreso, restaurarlo en otro dispositivo o borrarlo todo.

## Cómo usarla

**Opción 1 · Como Artifact de Claude o en cualquier proyecto React.** Copia `EnglishTrainingCenter.jsx` tal cual. Solo necesita `react`, `lucide-react` y Tailwind CSS (clases estándar).

**Opción 2 · Como página independiente.** Genera un solo HTML que carga React desde cdnjs y trae Tailwind ya compilado:

```bash
cd english-training-center/standalone
npm install
npm run build
# Abre dist/index.html en el navegador
```

`dist/artifact.html` es el mismo contenido sin `<html>`/`<head>`, listo para publicarse como Artifact.

## Notas

- El progreso queda en el navegador donde usas la app. Para pasarlo a otro dispositivo usa *Copiar respaldo* / *Restaurar*.
- La lectura en voz alta usa la voz en inglés del navegador (`speechSynthesis`); si el navegador no tiene voz, el botón no aparece.
- El detector de trampas revisa las 5 Reglas de Oro, no toda la gramática.
