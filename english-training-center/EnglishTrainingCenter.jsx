/**
 * Centro de Entrenamiento Personal de Inglés · 6 meses
 * Emiliano · Logistics Trainee @ Groupe SEB · Proyecto: Automating the Gross Sales Report
 *
 * Un solo componente React funcional (Tailwind CSS + lucide-react).
 * Todo el progreso se guarda en localStorage con el prefijo "emiliano-etc:".
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Copy,
  Database,
  Eye,
  EyeOff,
  Flame,
  FlaskConical,
  Headphones,
  Keyboard,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Link2,
  ListChecks,
  Map as MapIcon,
  MessageSquare,
  Mic,
  Pause,
  PenLine,
  Play,
  Plus,
  RefreshCw,
  Repeat,
  RotateCcw,
  Save,
  Search,
  Settings,
  ShieldAlert,
  Shuffle,
  Sparkles,
  Star,
  Target,
  Timer,
  Trash2,
  TrendingUp,
  Trophy,
  Truck,
  Volume2,
  Waves,
  X,
  XCircle,
  Zap,
} from 'lucide-react';

/* =========================================================================
 * DATOS
 * ========================================================================= */

const CATEGORIES = [
  { id: 'all', label: 'Todos', short: 'Todos', icon: Layers },
  { id: 'office', label: 'Phrasal Verbs de Oficina', short: 'Oficina', icon: Briefcase },
  { id: 'logistics', label: 'Logística & Supply Chain', short: 'Logística', icon: Truck },
  { id: 'data', label: 'Automatización & Datos', short: 'Datos', icon: Database },
  { id: 'connectors', label: 'Conectores Ejecutivos', short: 'Conectores', icon: Link2 },
];

const CATEGORY_STYLE = {
  office: { chip: 'border-sky-400/30 bg-sky-400/10 text-sky-300', dot: 'bg-sky-400' },
  logistics: { chip: 'border-blue-400/30 bg-blue-400/10 text-blue-300', dot: 'bg-blue-400' },
  data: { chip: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300', dot: 'bg-emerald-400' },
  connectors: { chip: 'border-indigo-400/30 bg-indigo-400/10 text-indigo-300', dot: 'bg-indigo-400' },
  past: { chip: 'border-teal-400/30 bg-teal-400/10 text-teal-300', dot: 'bg-teal-400' },
};

const FORMAL_TAGS = {
  rigid: { label: 'Correcto, pero suena a traductor', cls: 'text-amber-300', strike: false },
  calque: { label: 'Calco del español: evítalo', cls: 'text-rose-300', strike: true },
};

const TERMS = [
  /* ---------------- Phrasal Verbs de Oficina ---------------- */
  {
    id: 'look-into',
    term: 'Look into',
    category: 'office',
    meaning: 'Investigar / revisar a fondo',
    formal: 'Investigate',
    formalType: 'rigid',
    example: "I'll look into the discrepancy between SAP and the Gross Sales Report before Friday's meeting.",
    highlight: ['look into'],
    tip: 'Cuando te piden revisar algo: “Sure, I’ll look into it.” Suena seguro y natural.',
    blank: {
      sentence: 'My manager asked about the missing units. I said: "Sure, I\'ll ___ it this afternoon."',
      answer: 'look into',
      options: ['look into', 'run out of', 'push back', 'back up'],
    },
  },
  {
    id: 'follow-up-on',
    term: 'Follow up on',
    category: 'office',
    meaning: 'Dar seguimiento a algo',
    formal: 'Monitor / Pursue',
    formalType: 'rigid',
    example: "I'm following up on the missing invoices from the distribution center so the report closes on time.",
    highlight: ['following up on'],
    tip: 'En correos: “Just following up on my last email…” es amable y profesional.',
    blank: {
      sentence: 'I sent the request to IT on Monday. Today I need to ___ it because I still don\'t have access.',
      answer: 'follow up on',
      options: ['follow up on', 'break down', 'point out', 'set up'],
    },
  },
  {
    id: 'figure-out',
    term: 'Figure out',
    category: 'office',
    meaning: 'Resolver / descifrar / entender cómo',
    formal: 'Determine / Resolve',
    formalType: 'rigid',
    example: 'I finally figured out why the macro was duplicating rows in the Gross Sales Report.',
    highlight: ['figured out'],
    tip: 'En pasado: figured out. “I figured it out!” = ¡Ya lo resolví!',
    blank: {
      sentence: "The totals don't match and I can't ___ why. Can you help me?",
      answer: 'figure out',
      options: ['figure out', 'catch up on', 'hold up', 'carry out'],
    },
  },
  {
    id: 'break-down',
    term: 'Break down',
    category: 'office',
    meaning: 'Desglosar (datos, costos, cifras)',
    formal: 'Itemize / Decompose',
    formalType: 'rigid',
    example: 'Can you break down gross sales by brand (T-fal, Rowenta and Krups) for the monthly review?',
    highlight: ['break down'],
    tip: 'El sustantivo es “a breakdown”: “Here’s the breakdown by channel.”',
    blank: {
      sentence: "The director wants to see each brand separately, so I'll ___ the gross sales by brand.",
      answer: 'break down',
      options: ['break down', 'push back', 'follow up on', 'run out of'],
    },
  },
  {
    id: 'set-up',
    term: 'Set up',
    category: 'office',
    meaning: 'Configurar / armar / organizar',
    formal: 'Configure / Establish',
    formalType: 'rigid',
    example: 'I set up a Power Query connection that pulls the raw data from SAP automatically.',
    highlight: ['set up'],
    tip: 'Irregular: set / set / set. “Yesterday I set up…” (sin -ed).',
    blank: {
      sentence: 'Before we can automate the report, I need to ___ a connection to the SAP database.',
      answer: 'set up',
      options: ['set up', 'hold up', 'point out', 'catch up on'],
    },
  },
  {
    id: 'push-back',
    term: 'Push back',
    category: 'office',
    meaning: 'Posponer (junta, fecha, entrega)',
    formal: 'Postpone',
    formalType: 'rigid',
    example: "Can we push back the report review to Thursday? The data from the warehouse isn't up-to-date yet.",
    highlight: ['push back'],
    tip: 'También es “poner resistencia”: “The team pushed back on the new deadline.”',
    blank: {
      sentence: "The raw data isn't ready. Can we ___ the meeting to Thursday?",
      answer: 'push back',
      options: ['push back', 'figure out', 'carry out', 'look into'],
    },
  },
  {
    id: 'run-out-of',
    term: 'Run out of',
    category: 'office',
    meaning: 'Quedarse sin (stock, tiempo, espacio)',
    formal: 'Exhaust / Deplete',
    formalType: 'rigid',
    example: "We're running out of T-fal frying pans at the warehouse, so I'm checking the forecast for next week.",
    highlight: ['running out of'],
    tip: 'Siempre lleva “of” + lo que se acaba: “We ran out of time.”',
    blank: {
      sentence: "If the supplier doesn't deliver this week, we'll ___ stock before Buen Fin.",
      answer: 'run out of',
      options: ['run out of', 'set up', 'break down', 'follow up on'],
    },
  },
  {
    id: 'point-out',
    term: 'Point out',
    category: 'office',
    meaning: 'Señalar / hacer notar un dato',
    formal: 'Indicate',
    formalType: 'rigid',
    example: 'My manager pointed out a discrepancy in the October numbers of the Gross Sales Report.',
    highlight: ['pointed out'],
    tip: 'Para presentar: “I’d like to point out that…” = Quisiera señalar que…',
    blank: {
      sentence: 'During the review, I want to ___ that the automated report saves us four hours a week.',
      answer: 'point out',
      options: ['point out', 'hold up', 'run out of', 'catch up on'],
    },
  },
  {
    id: 'hold-up',
    term: 'Hold up',
    category: 'office',
    meaning: 'Retrasar / detener (un proceso o envío)',
    formal: 'Delay',
    formalType: 'rigid',
    example: 'The shipment was held up at customs for two days, so the sales data for that week is incomplete.',
    highlight: ['held up'],
    tip: 'Sustantivo: “a hold-up” = un retraso. “What’s the hold-up?” = ¿Qué lo está deteniendo?',
    blank: {
      sentence: 'Missing paperwork can ___ a shipment at customs for days.',
      answer: 'hold up',
      options: ['hold up', 'point out', 'back up', 'figure out'],
    },
  },
  {
    id: 'catch-up-on',
    term: 'Catch up on',
    category: 'office',
    meaning: 'Ponerse al día con algo',
    formal: 'Update oneself on',
    formalType: 'rigid',
    example: 'After the inventory count, I need to catch up on my emails and the pending report requests.',
    highlight: ['catch up on'],
    tip: '“Let’s catch up” también es “pongámonos al día” en una plática informal.',
    blank: {
      sentence: 'I was at the warehouse all day yesterday, so this morning I need to ___ my emails.',
      answer: 'catch up on',
      options: ['catch up on', 'push back', 'set up', 'hold up'],
    },
  },
  {
    id: 'carry-out',
    term: 'Carry out',
    category: 'office',
    meaning: 'Llevar a cabo / ejecutar',
    formal: 'Execute / Perform',
    formalType: 'rigid',
    example: 'We carried out a full test of the automated Gross Sales Report before sending it to Finance.',
    highlight: ['carried out'],
    tip: 'Muy común en reportes: “carry out an analysis / a test / an audit”.',
    blank: {
      sentence: 'Before the go-live, we need to ___ a full test of the new workflow.',
      answer: 'carry out',
      options: ['carry out', 'run out of', 'catch up on', 'point out'],
    },
  },
  {
    id: 'back-up',
    term: 'Back up',
    category: 'office',
    meaning: 'Respaldar (datos) / apoyar a alguien',
    formal: 'Support / Save a copy',
    formalType: 'rigid',
    example: 'Always back up the raw data before running the macro. And thanks for backing me up in the meeting!',
    highlight: ['back up', 'backing me up'],
    tip: 'Sustantivo: “a backup” (un respaldo). Verbo: “to back up” (separado).',
    blank: {
      sentence: 'Please ___ the raw data on SharePoint before you run the macro.',
      answer: 'back up',
      options: ['back up', 'hold up', 'break down', 'look into'],
    },
  },

  /* ---------------- Logística & Supply Chain ---------------- */
  {
    id: 'lead-time',
    term: 'Lead time',
    category: 'logistics',
    meaning: 'Tiempo de entrega (del pedido a la recepción)',
    formal: 'Time of delivery',
    formalType: 'calque',
    example: "The supplier's lead time went from three to five weeks, so we need to order earlier for Buen Fin.",
    highlight: ['lead time'],
    tip: 'Se pronuncia “leed taim” (no “led”). Pregunta clave: “What’s the lead time?”',
    blank: {
      sentence: 'The ___ for this supplier is five weeks, so we have to place the order today.',
      answer: 'lead time',
      options: ['lead time', 'warehouse', 'backorder', 'customs'],
    },
  },
  {
    id: 'bottleneck',
    term: 'Bottleneck',
    category: 'logistics',
    meaning: 'Cuello de botella',
    formal: 'Point of congestion',
    formalType: 'rigid',
    example: 'The manual copy-paste step is the main bottleneck in the Gross Sales Report workflow.',
    highlight: ['bottleneck'],
    tip: 'Combínalo: “The bottleneck is holding up the whole process.”',
    blank: {
      sentence: "Copying data by hand takes three hours. It's the biggest ___ in our process.",
      answer: 'bottleneck',
      options: ['bottleneck', 'shipment', 'forecast', 'supplier'],
    },
  },
  {
    id: 'backorder',
    term: 'Backorder',
    category: 'logistics',
    meaning: 'Pedido pendiente por falta de stock',
    formal: 'Pending order',
    formalType: 'rigid',
    example: "We have 300 Rowenta irons on backorder because the container hasn't arrived yet.",
    highlight: ['backorder'],
    tip: '“On backorder” = en espera de stock. Muy usado con clientes.',
    blank: {
      sentence: "We don't have stock right now, so the 300 irons are on ___.",
      answer: 'backorder',
      options: ['backorder', 'lead time', 'forecast', 'warehouse'],
    },
  },
  {
    id: 'forecast',
    term: 'Forecast',
    category: 'logistics',
    meaning: 'Pronóstico / proyección (de ventas o demanda)',
    formal: 'Prognostic',
    formalType: 'calque',
    example: 'The sales forecast for Buen Fin is 20% higher than last year, especially for small appliances.',
    highlight: ['forecast'],
    tip: 'Pasado irregular: forecast / forecast. “We forecast 20% growth.”',
    blank: {
      sentence: "Based on last year's sales, the ___ for November is 20% higher.",
      answer: 'forecast',
      options: ['forecast', 'bottleneck', 'customs', 'shipment'],
    },
  },
  {
    id: 'inventory-turnover',
    term: 'Inventory turnover',
    category: 'logistics',
    meaning: 'Rotación de inventario',
    formal: 'Inventory rotation',
    formalType: 'calque',
    example: 'Inventory turnover for cookware is higher in Q4 because of the holiday season.',
    highlight: ['inventory turnover'],
    tip: '“Rotation” es traducción directa. En reportes se dice “turnover” o “inventory turns”.',
    blank: {
      sentence: "High ___ means the products sell fast and don't stay long in the warehouse.",
      answer: 'inventory turnover',
      options: ['inventory turnover', 'lead time', 'backorder', 'customs'],
    },
  },
  {
    id: 'shipment',
    term: 'Shipment',
    category: 'logistics',
    meaning: 'Envío / embarque',
    formal: 'Embarkation',
    formalType: 'calque',
    example: 'The shipment for our biggest retail customer left the warehouse this morning.',
    highlight: ['shipment'],
    tip: '“Shipment” es el envío (la carga). “Shipping” es el proceso de enviar.',
    blank: {
      sentence: 'The ___ left the warehouse at 8 a.m. and will arrive tomorrow.',
      answer: 'shipment',
      options: ['shipment', 'forecast', 'supplier', 'bottleneck'],
    },
  },
  {
    id: 'warehouse',
    term: 'Warehouse',
    category: 'logistics',
    meaning: 'Almacén / CEDIS',
    formal: 'Store',
    formalType: 'calque',
    example: 'I spent the morning at the warehouse checking stock levels for the report.',
    highlight: ['warehouse'],
    tip: 'CEDIS = distribution center (DC). Ojo: “store” significa tienda.',
    blank: {
      sentence: 'I spent the morning at the ___ counting pallets.',
      answer: 'warehouse',
      options: ['warehouse', 'shipment', 'lead time', 'forecast'],
    },
  },
  {
    id: 'supplier',
    term: 'Supplier / Vendor',
    category: 'logistics',
    meaning: 'Proveedor',
    formal: 'Provider',
    formalType: 'rigid',
    example: 'The vendor confirmed the new delivery date, so the backorder should be cleared next week.',
    highlight: ['vendor', 'supplier'],
    tip: '“Provider” se usa para servicios (internet provider). Para mercancía: supplier o vendor.',
    blank: {
      sentence: 'Our main ___ in China confirmed the new delivery date.',
      answer: 'supplier',
      options: ['supplier', 'warehouse', 'customs', 'backorder'],
    },
  },
  {
    id: 'customs',
    term: 'Customs',
    category: 'logistics',
    meaning: 'Aduana',
    formal: 'Custom',
    formalType: 'calque',
    example: "The containers cleared customs in Manzanillo, so they'll arrive at the warehouse on Wednesday.",
    highlight: ['customs'],
    tip: 'Siempre con “s”: customs. “Custom” (singular) es costumbre. “Clear customs” = liberar la aduana.',
    blank: {
      sentence: 'The containers are still at ___ because some documents are missing.',
      answer: 'customs',
      options: ['customs', 'supplier', 'forecast', 'lead time'],
    },
  },

  /* ---------------- Automatización & Datos ---------------- */
  {
    id: 'streamline',
    term: 'Streamline',
    category: 'data',
    meaning: 'Optimizar / agilizar un proceso',
    formal: 'Optimize',
    formalType: 'rigid',
    example: 'Automating the Gross Sales Report will streamline our month-end close.',
    highlight: ['streamline'],
    tip: 'Ideal para tu presentación: “The goal of my project is to streamline…”',
    blank: {
      sentence: 'The goal of my project is to ___ the reporting process so it takes minutes, not hours.',
      answer: 'streamline',
      options: ['streamline', 'discrepancy', 'raw data', 'insight'],
    },
  },
  {
    id: 'raw-data',
    term: 'Raw data',
    category: 'data',
    meaning: 'Datos crudos (sin procesar)',
    formal: 'Crude data',
    formalType: 'calque',
    example: 'Every Monday I download the raw data from SAP and the macro cleans it automatically.',
    highlight: ['raw data'],
    tip: '“Crude” se usa para petróleo (crude oil), no para datos.',
    blank: {
      sentence: 'The ___ from SAP has duplicates, so the first step is cleaning it.',
      answer: 'raw data',
      options: ['raw data', 'workflow', 'insight', 'accuracy'],
    },
  },
  {
    id: 'gross-sales-report',
    term: 'Gross Sales Report',
    category: 'data',
    meaning: 'Reporte de ventas brutas',
    formal: 'Report of gross sales',
    formalType: 'calque',
    example: "The Gross Sales Report used to take four hours. Now it's ready in fifteen minutes.",
    highlight: ['Gross Sales Report'],
    tip: 'En inglés el sustantivo principal va al final: gross sales → report.',
    blank: {
      sentence: 'Every Monday, I send the ___ to the commercial team.',
      answer: 'Gross Sales Report',
      options: ['Gross Sales Report', 'bottleneck', 'workflow', 'discrepancy'],
    },
  },
  {
    id: 'discrepancy',
    term: 'Discrepancy',
    category: 'data',
    meaning: 'Discrepancia / diferencia entre cifras',
    formal: 'Difference',
    formalType: 'rigid',
    example: "There's a 2% discrepancy between SAP and the BI dashboard. I'm looking into it.",
    highlight: ['discrepancy'],
    tip: 'Acento en “CREP”: dis-CREP-an-cy.',
    blank: {
      sentence: "SAP says 10,500 units and the report says 10,300. There's a ___.",
      answer: 'discrepancy',
      options: ['discrepancy', 'insight', 'workflow', 'streamline'],
    },
  },
  {
    id: 'insight',
    term: 'Insight',
    category: 'data',
    meaning: 'Hallazgo valioso / entendimiento profundo',
    formal: 'Conclusion',
    formalType: 'rigid',
    example: 'The new report gives us better insights into which channel is growing faster.',
    highlight: ['insights', 'insight'],
    tip: '“Key insights” = hallazgos clave. Perfecto para cerrar una presentación.',
    blank: {
      sentence: 'The dashboard gave us a great ___: e-commerce is growing twice as fast as retail.',
      answer: 'insight',
      options: ['insight', 'raw data', 'discrepancy', 'workflow'],
    },
  },
  {
    id: 'accuracy',
    term: 'Accuracy / Accurate',
    category: 'data',
    meaning: 'Precisión / preciso (que los datos sean correctos)',
    formal: 'Exactitude',
    formalType: 'calque',
    example: 'Automation improved the accuracy of the report. The numbers are now accurate to the peso.',
    highlight: ['accuracy', 'accurate'],
    tip: '“Accuracy” es el sustantivo; “accurate” el adjetivo: “The numbers are accurate.”',
    blank: {
      sentence: 'Before sending the report, I always check the ___ of the numbers against SAP.',
      answer: 'accuracy',
      options: ['accuracy', 'bottleneck', 'insight', 'workflow'],
    },
  },
  {
    id: 'up-to-date',
    term: 'Up-to-date',
    category: 'data',
    meaning: 'Actualizado',
    formal: 'Actualized',
    formalType: 'calque',
    example: 'The dashboard is always up-to-date because it refreshes every morning at 7 a.m.',
    highlight: ['up-to-date'],
    tip: 'Falso amigo: “actual” = real. Lo contrario de up-to-date es “out of date”.',
    blank: {
      sentence: 'The dashboard refreshes every morning, so the numbers are always ___.',
      answer: 'up-to-date',
      options: ['up-to-date', 'raw data', 'streamline', 'discrepancy'],
    },
  },
  {
    id: 'workflow',
    term: 'Workflow',
    category: 'data',
    meaning: 'Flujo de trabajo',
    formal: 'Flow of work',
    formalType: 'calque',
    example: 'I mapped the current workflow step by step before automating the report.',
    highlight: ['workflow'],
    tip: 'Una sola palabra. “Let me walk you through the workflow.” = Te explico el flujo.',
    blank: {
      sentence: 'Let me walk you through the new ___: download, clean, validate and send.',
      answer: 'workflow',
      options: ['workflow', 'accuracy', 'insight', 'raw data'],
    },
  },

  /* ---------------- Conectores Ejecutivos ---------------- */
  {
    id: 'moving-forward',
    term: 'Moving forward',
    category: 'connectors',
    meaning: 'De ahora en adelante',
    formal: 'Henceforth',
    formalType: 'rigid',
    example: 'Moving forward, the Gross Sales Report will be sent automatically every Monday at 9 a.m.',
    highlight: ['Moving forward'],
    tip: 'Abre la parte de “próximos pasos” en cualquier junta o correo.',
    blank: {
      sentence: '___, the report will be sent automatically every Monday at 9 a.m.',
      answer: 'Moving forward',
      options: ['Moving forward', 'On the other hand', 'Regarding', 'In the meantime'],
    },
  },
  {
    id: 'in-the-meantime',
    term: 'In the meantime',
    category: 'connectors',
    meaning: 'Mientras tanto',
    formal: 'During this time',
    formalType: 'rigid',
    example: "IT is fixing my SAP access. In the meantime, I'll work with last week's file.",
    highlight: ['In the meantime'],
    tip: 'Perfecto para bloqueos: explica el problema y luego qué harás “in the meantime”.',
    blank: {
      sentence: "IT is fixing my SAP access. ___, I'll use last week's file.",
      answer: 'In the meantime',
      options: ['In the meantime', 'Overall', 'Regarding', 'On the other hand'],
    },
  },
  {
    id: 'regarding',
    term: 'Regarding',
    category: 'connectors',
    meaning: 'Respecto a / en cuanto a',
    formal: 'In relation with',
    formalType: 'calque',
    example: 'Regarding the October discrepancy, I found the root cause: duplicated invoices.',
    highlight: ['Regarding'],
    tip: 'Ideal para abrir correos: “Regarding your question about…”. Si usas “in relation”, es “in relation TO”.',
    blank: {
      sentence: '___ the October numbers, I found the root cause of the discrepancy.',
      answer: 'Regarding',
      options: ['Regarding', 'Overall', 'In the meantime', 'Moving forward'],
    },
  },
  {
    id: 'overall',
    term: 'Overall',
    category: 'connectors',
    meaning: 'En general / en resumen',
    formal: 'In general terms',
    formalType: 'rigid',
    example: 'Overall, the automation is working well. We only need to fix two small issues.',
    highlight: ['Overall'],
    tip: 'Úsalo para resumir antes de cerrar: “Overall, …”',
    blank: {
      sentence: 'There were two small issues, but ___ the project is going very well.',
      answer: 'overall',
      options: ['overall', 'regarding', 'moving forward', 'in the meantime'],
    },
  },
  {
    id: 'on-the-other-hand',
    term: 'On the other hand',
    category: 'connectors',
    meaning: 'Por otro lado',
    formal: 'By the other side',
    formalType: 'calque',
    example: 'The macro is very fast. On the other hand, it needs clean raw data to work.',
    highlight: ['On the other hand'],
    tip: '“By the other side” es traducción literal. Úsalo para contrastar dos ideas.',
    blank: {
      sentence: 'The macro is very fast. ___, it needs clean raw data to work.',
      answer: 'On the other hand',
      options: ['On the other hand', 'Regarding', 'Moving forward', 'Overall'],
    },
  },
];

const PAST_VERBS = [
  { id: 'pv-started', term: 'started', base: 'start', meaning: 'empecé', irregular: false, example: 'I started the automation project in September.' },
  { id: 'pv-worked', term: 'worked', base: 'work', meaning: 'trabajé', irregular: false, example: 'I worked on the Gross Sales Report all morning.' },
  { id: 'pv-sent', term: 'sent', base: 'send', meaning: 'envié', irregular: true, example: 'I sent the weekly report to my manager at 9 a.m.' },
  { id: 'pv-went-swimming', term: 'went swimming', base: 'go swimming', meaning: 'fui a nadar', irregular: true, example: 'I went swimming after work and swam 1.5 km.' },
  { id: 'pv-figured-out', term: 'figured out', base: 'figure out', meaning: 'resolví / descifré', irregular: false, example: "I figured out why the totals didn't match." },
  { id: 'pv-set-up', term: 'set up', base: 'set up', meaning: 'configuré / armé', irregular: true, example: 'I set up the automatic refresh for the dashboard.' },
  { id: 'pv-checked', term: 'checked', base: 'check', meaning: 'revisé', irregular: false, example: 'I checked the stock levels at the warehouse.' },
  { id: 'pv-updated', term: 'updated', base: 'update', meaning: 'actualicé', irregular: false, example: 'I updated the forecast with the new orders.' },
  { id: 'pv-had-meeting', term: 'had a meeting', base: 'have a meeting', meaning: 'tuve una junta', irregular: true, example: 'I had a meeting with the Finance team about the discrepancy.' },
  { id: 'pv-met', term: 'met', base: 'meet', meaning: 'me reuní con / conocí', irregular: true, example: 'I met my manager to review the project.' },
  { id: 'pv-wrote', term: 'wrote', base: 'write', meaning: 'escribí', irregular: true, example: 'I wrote the documentation for the new workflow.' },
  { id: 'pv-swam', term: 'swam', base: 'swim', meaning: 'nadé', irregular: true, example: "I swam 2 km this morning. I'm starving!" },
];

const GOLDEN_RULES = [
  {
    id: 1,
    title: 'Cero “To Be” intruso',
    subtitle: 'Los verbos de acción no llevan am / is / was',
    why: 'En español decimos “estoy de acuerdo”, pero en inglés “agree” ya es el verbo completo. Con verbos normales no metas am, is ni was.',
    correct: ['I agree.', 'I worked on the report yesterday.', 'It depends on the data.'],
    wrong: ["I'm agree.", 'I was worked on the report.', "It's depends on the data."],
    memory: 'Si ya hay un verbo de acción, el “to be” sobra.',
  },
  {
    id: 2,
    title: 'Sensaciones con “I am”',
    subtitle: 'Hambre, frío y cansancio se dicen con to be',
    why: 'En español “tengo hambre”; en inglés “estoy hambriento”: I am hungry. Nunca “I have hungry”.',
    correct: ["I'm hungry.", "I'm starving!", "I'm tired after swimming."],
    wrong: ['I have hungry.', 'I have eat.', 'I have tired.'],
    memory: 'Tengo hambre / frío / sueño → I am hungry / cold / sleepy.',
  },
  {
    id: 3,
    title: 'Preposiciones limpias',
    subtitle: 'AT la empresa, ON el proyecto, sin “one”',
    why: 'Trabajas AT una empresa y ON un proyecto o reporte. “En este momento” es “right now”. El artículo “a” ya significa “un”.',
    correct: ['I work at Groupe SEB.', "I'm working on a report.", "Right now, I'm checking the data."],
    wrong: ['I work in Groupe SEB.', "I'm working in a report.", 'In this moment…', 'I sent a one report.'],
    memory: 'AT company · ON project · RIGHT NOW · a report',
  },
  {
    id: 4,
    title: 'Orden en inglés',
    subtitle: 'La descripción va antes; el adverbio, después del verbo',
    why: 'El inglés pone lo que describe primero: “Logistics Trainee”, no “Trainee of Logistics”. Y el adverbio va después del verbo: “I worked hard”.',
    correct: ["I'm a Logistics Trainee.", 'I worked hard this week.', 'The Gross Sales Report is ready.'],
    wrong: ["I'm a Trainee of Logistics.", 'I hard worked.', 'The report of gross sales…'],
    memory: 'Lo que describe va antes; la cosa principal va al final.',
  },
  {
    id: 5,
    title: 'El sujeto “It”',
    subtitle: 'En inglés la oración siempre lleva sujeto',
    why: 'En español el sujeto puede desaparecer (“Depende”). En inglés no: necesitas “It”.',
    correct: ['It depends on the price.', "It's important to check the data.", 'It takes 15 minutes to run the report.'],
    wrong: ['Depends on the price.', 'Is important to check the data.', 'Takes 15 minutes.'],
    memory: '¿No hay sujeto? Pon “It”.',
  },
];

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    rule: 1,
    prompt: 'Estoy de acuerdo con tu propuesta.',
    options: ["I'm agree with your proposal.", 'I agree with your proposal.', 'I am agree to your proposal.'],
    answer: 'I agree with your proposal.',
    explain: '“Agree” ya es el verbo. No necesita “am”.',
  },
  {
    id: 'q2',
    rule: 1,
    prompt: 'Ayer trabajé en el reporte hasta las 7.',
    options: ['Yesterday I was worked on the report until 7.', 'Yesterday I worked on the report until 7.', 'Yesterday I am worked on the report until 7.'],
    answer: 'Yesterday I worked on the report until 7.',
    explain: 'Pasado simple = verbo + -ed. Para lo que tú hiciste no se usa “was worked”.',
  },
  {
    id: 'q3',
    rule: 1,
    prompt: 'Depende del forecast.',
    options: ["It's depends on the forecast.", 'It depends on the forecast.', 'Is depends of the forecast.'],
    answer: 'It depends on the forecast.',
    explain: '“It depends” sin “is”. Y la preposición es “on”, no “of”.',
  },
  {
    id: 'q4',
    rule: 2,
    prompt: 'Tengo hambre, ¿vamos a comer?',
    options: ['I have hungry, shall we get lunch?', "I'm hungry. Shall we get lunch?", 'I have eat, shall we get lunch?'],
    answer: "I'm hungry. Shall we get lunch?",
    explain: 'Las sensaciones van con “to be”: I am hungry.',
  },
  {
    id: 'q5',
    rule: 2,
    prompt: 'Me muero de hambre después de nadar.',
    options: ["I'm starving after swimming.", 'I have starving after swimming.', 'I am starve after swim.'],
    answer: "I'm starving after swimming.",
    explain: '“I’m starving” = me muero de hambre. Después de “after” va swimming (-ing).',
  },
  {
    id: 'q6',
    rule: 2,
    prompt: 'Estoy muy cansado, nadé 2 km hoy.',
    options: ['I have very tired. I swam 2 km today.', "I'm really tired. I swam 2 km today.", "I'm really tired. I was swim 2 km today."],
    answer: "I'm really tired. I swam 2 km today.",
    explain: 'El cansancio va con “I’m”. Y “swam” es el pasado de swim, sin “was”.',
  },
  {
    id: 'q7',
    rule: 3,
    prompt: 'Trabajo en Groupe SEB.',
    options: ['I work in Groupe SEB.', 'I work at Groupe SEB.', 'I work on Groupe SEB.'],
    answer: 'I work at Groupe SEB.',
    explain: 'Para la empresa donde trabajas se usa AT.',
  },
  {
    id: 'q8',
    rule: 3,
    prompt: 'Estoy trabajando en un proyecto de automatización.',
    options: ["I'm working in an automation project.", "I'm working on an automation project.", "I'm working at an automation project."],
    answer: "I'm working on an automation project.",
    explain: 'Proyectos, reportes y tareas van con ON.',
  },
  {
    id: 'q9',
    rule: 3,
    prompt: 'En este momento estoy revisando los datos.',
    options: ["In this moment I'm checking the data.", "Right now I'm checking the data.", 'In this moment I checking the data.'],
    answer: "Right now I'm checking the data.",
    explain: '“En este momento” = right now. “In this moment” es traducción literal.',
  },
  {
    id: 'q10',
    rule: 3,
    prompt: 'Le mandé un reporte a mi jefe.',
    options: ['I sent a one report to my boss.', 'I sent a report to my boss.', 'I sent one a report to my boss.'],
    answer: 'I sent a report to my boss.',
    explain: '“A” ya significa “un”. No se agrega “one”.',
  },
  {
    id: 'q11',
    rule: 4,
    prompt: 'Soy practicante de logística.',
    options: ["I'm a Trainee of Logistics.", "I'm a Logistics Trainee.", "I'm Trainee Logistics."],
    answer: "I'm a Logistics Trainee.",
    explain: 'La descripción va antes: Logistics Trainee. Y no olvides el artículo “a”.',
  },
  {
    id: 'q12',
    rule: 4,
    prompt: 'Trabajé duro esta semana.',
    options: ['I hard worked this week.', 'I worked hard this week.', 'Hard I worked this week.'],
    answer: 'I worked hard this week.',
    explain: 'El adverbio “hard” va después del verbo.',
  },
  {
    id: 'q13',
    rule: 4,
    prompt: 'El reporte de ventas brutas está listo.',
    options: ['The report of gross sales is ready.', 'The gross sales report is ready.', 'The sales gross report is ready.'],
    answer: 'The gross sales report is ready.',
    explain: 'Lo que describe (gross sales) va antes del sustantivo principal (report).',
  },
  {
    id: 'q14',
    rule: 5,
    prompt: 'Depende del precio.',
    options: ['Depends on the price.', 'It depends on the price.', 'Is depends of the price.'],
    answer: 'It depends on the price.',
    explain: 'En inglés la oración necesita sujeto: It.',
  },
  {
    id: 'q15',
    rule: 5,
    prompt: 'Es importante revisar los datos antes de enviarlos.',
    options: ['Is important to check the data before sending it.', "It's important to check the data before sending it.", 'It important check the data before send it.'],
    answer: "It's important to check the data before sending it.",
    explain: '“Es importante…” = It’s important to… Nunca empieces con “Is”.',
  },
];

const TRAP_PATTERNS = [
  { rule: 1, re: /\b(i'?m|i am|you'?re|we'?re|they'?re|he'?s|she'?s) agree\b/i, fix: 'I agree / We agree (sin am / are)' },
  { rule: 1, re: /\b(i|we|they) (was|were|am|are) (worked|went|started|agreed|swam|talked|arrived|came|depended)\b/i, fix: 'Quita el “to be”: I worked / I went / I started' },
  { rule: 1, re: /\b(it'?s|it is|is) depends?\b/i, fix: 'It depends' },
  { rule: 2, re: /\bi have (hungry|thirsty|cold|hot|tired|sleepy|eat)\b/i, fix: "I'm hungry / I'm starving / I'm tired" },
  { rule: 3, re: /\bwork(s|ing|ed)? in groupe seb\b/i, fix: 'I work AT Groupe SEB' },
  { rule: 3, re: /\bwork(s|ing|ed)? in (a|an|the|my|this) [\w-]*\s?(project|report)\b/i, fix: 'working ON a project / report' },
  { rule: 3, re: /\bin this moment\b/i, fix: 'Right now' },
  { rule: 3, re: /\ba one (report|project|meeting|file|email|shipment)\b/i, fix: 'a report (sin “one”)' },
  { rule: 4, re: /\btrainee of logistics\b/i, fix: 'Logistics Trainee' },
  { rule: 4, re: /\b(i hard worked|hard i worked)\b/i, fix: 'I worked hard' },
  { rule: 4, re: /\breport of (the )?gross sales\b/i, fix: 'Gross Sales Report' },
  { rule: 5, re: /(^|[.!?]\s+)(depends on|is important|is necessary|is raining|is late|takes \d+)/im, fix: 'Agrega el sujeto: It depends / It’s important' },
];

const ROUTINE_BLOCKS = [
  {
    id: 'input',
    step: 'Paso 1',
    label: 'Input Auditivo',
    minutes: 15,
    icon: Headphones,
    tone: 'sky',
    how: 'Audio en inglés con subtítulos en inglés. Nada de español.',
    ideas: ['BBC Learning English: 6 Minute English', 'Business English Pod', 'Un video de supply chain con subs EN', 'Tu serie favorita, con subtítulos en inglés'],
  },
  {
    id: 'shadowing',
    step: 'Paso 2',
    label: 'Shadowing',
    minutes: 10,
    icon: Mic,
    tone: 'blue',
    how: 'Escucha una frase, pausa y repítela en voz alta imitando ritmo y entonación.',
    ideas: ['Usa el botón de audio en las tarjetas del Laboratorio', 'Repite 5 frases del audio de hoy', 'Grábate y compara con el original'],
  },
  {
    id: 'output',
    step: 'Paso 3',
    label: 'Output Activo',
    minutes: 15,
    icon: PenLine,
    tone: 'emerald',
    how: 'Habla o escribe sobre tu día en Groupe SEB. Usa el reto del día de abajo.',
    ideas: ['Escribe en “Mi diario en inglés”', 'Grábate 2 minutos contando tu día', 'Arma tu standup en la pestaña Standup'],
  },
];

const BLOCK_TONE = {
  sky: { icon: 'bg-sky-400/15 text-sky-300', bar: 'bg-sky-400', text: 'text-sky-300' },
  blue: { icon: 'bg-blue-400/15 text-blue-300', bar: 'bg-blue-400', text: 'text-blue-300' },
  emerald: { icon: 'bg-emerald-400/15 text-emerald-300', bar: 'bg-emerald-400', text: 'text-emerald-300' },
};

const OUTPUT_PROMPTS = [
  'Describe what you did yesterday on the Gross Sales Report. Use 2 verbs in the past (worked, set up, figured out).',
  'Explain the biggest bottleneck in your current workflow and how automation will streamline it.',
  "Talk about your last swimming session: how far you swam and how you felt (I'm tired / I'm starving).",
  'Write a short Teams message to your manager to push back a meeting. Give a reason.',
  'Explain to a new colleague what a Gross Sales Report is and why accuracy matters.',
  'Describe a discrepancy you found in the data and how you looked into it.',
  'Introduce yourself for 60 seconds: "I\'m a Logistics Trainee at Groupe SEB…"',
  'Talk about a shipment or backorder that was held up this week. What happened? What\'s next?',
  'Summarize your week with 3 connectors: Overall, Regarding and Moving forward.',
  'Explain one insight from the sales data: which brand or channel is growing, and why?',
  'Describe your workday routine. Remember: I work AT Groupe SEB, ON a project.',
  'Tell the story of a problem you figured out at work. Start with: "Last week, I noticed…"',
  'Explain step by step how you set up the raw data connection for your project.',
  'Plan next week: what will you follow up on, and what do you need to catch up on?',
];

const ROADMAP = [
  {
    month: 1,
    title: 'Cimientos y rutina',
    level: 'A2 → A2+',
    focus: 'Crear el hábito de 40 minutos y eliminar los errores básicos.',
    items: [
      { id: 'm1-routine', text: 'Completar la rutina de 40 min al menos 20 días del mes', hint: 'routineMonth' },
      { id: 'm1-quiz', text: 'Sacar 13/15 o más en el Quiz del Cazatrampas', hint: 'quizBest' },
      { id: 'm1-office', text: 'Dominar los 12 Phrasal Verbs de Oficina en Flashcards', hint: 'masteredOffice' },
      { id: 'm1-intro', text: 'Grabar 1 minuto presentándome: “I’m a Logistics Trainee at Groupe SEB…”' },
      { id: 'm1-phone', text: 'Poner el celular y Teams en inglés' },
      { id: 'm1-series', text: 'Ver un capítulo por semana con subtítulos en inglés' },
    ],
  },
  {
    month: 2,
    title: 'Vocabulario de trabajo',
    level: 'A2+ → B1',
    focus: 'Hablar de logística con las palabras correctas.',
    items: [
      { id: 'm2-logistics', text: 'Dominar los 9 keywords de Logística & Supply Chain', hint: 'masteredLogistics' },
      { id: 'm2-standups', text: 'Preparar 3 standups por semana con el Generador', hint: 'standupCount' },
      { id: 'm2-shadow', text: 'Hacer shadowing con un podcast de negocios todos los días', hint: 'routineMonth' },
      { id: 'm2-workflow', text: 'Explicar en voz alta el workflow del Gross Sales Report en 2 minutos' },
      { id: 'm2-custom', text: 'Agregar 10 keywords nuevas escuchadas en el trabajo', hint: 'customCount' },
      { id: 'm2-read', text: 'Leer un artículo corto de supply chain cada semana' },
    ],
  },
  {
    month: 3,
    title: 'Hablar de datos',
    level: 'B1',
    focus: 'Explicar números, gráficas y hallazgos del proyecto.',
    items: [
      { id: 'm3-data', text: 'Dominar Automatización & Datos y Conectores Ejecutivos', hint: 'masteredDataConn' },
      { id: 'm3-update', text: 'Presentar un avance del proyecto en inglés (5 min) a un compañero' },
      { id: 'm3-email', text: 'Escribir un correo formal en inglés sin traductor' },
      { id: 'm3-chart', text: 'Describir una gráfica con “Overall”, “Regarding” y “On the other hand”' },
      { id: 'm3-zero', text: 'Cero errores de “To Be intruso” en 3 grabaciones seguidas' },
      { id: 'm3-subs', text: 'Usar solo subtítulos en inglés en todo lo que veo' },
    ],
  },
  {
    month: 4,
    title: 'Fluidez en juntas',
    level: 'B1 → B1+',
    focus: 'Participar en juntas sin preparar todo palabra por palabra.',
    items: [
      { id: 'm4-comment', text: 'Hacer al menos un comentario en inglés en cada junta con equipos globales' },
      { id: 'm4-roleplay', text: 'Practicar una conversación de 15 min por semana (tutor o roleplay)' },
      { id: 'm4-weekend', text: 'Contar mi fin de semana (natación incluida) 3 minutos sin pausas largas' },
      { id: 'm4-five', text: 'Usar 5 phrasal verbs distintos en un solo standup' },
      { id: 'm4-podcast', text: 'Escuchar podcasts a velocidad normal sin subtítulos' },
      { id: 'm4-custom', text: 'Llegar a 25 keywords propias en el Laboratorio', hint: 'customCount' },
    ],
  },
  {
    month: 5,
    title: 'Presentaciones',
    level: 'B1+ → B2',
    focus: 'Preparar la presentación final del proyecto de automatización.',
    items: [
      { id: 'm5-deck', text: 'Preparar la presentación “Automating the Gross Sales Report”' },
      { id: 'm5-rehearse', text: 'Ensayar la presentación 3 veces grabándome' },
      { id: 'm5-qa', text: 'Preparar y practicar 10 preguntas difíciles del proyecto con sus respuestas' },
      { id: 'm5-summary', text: 'Escribir el resumen ejecutivo del proyecto (1 página) en inglés' },
      { id: 'm5-negotiate', text: 'Negociar una fecha en un roleplay: “Can we push back…?”' },
      { id: 'm5-webinar', text: 'Ver un webinar de supply chain completo sin subtítulos' },
    ],
  },
  {
    month: 6,
    title: 'Inglés profesional',
    level: 'B2',
    focus: 'Presentar, negociar y conversar con seguridad.',
    items: [
      { id: 'm6-present', text: 'Presentar el proyecto en inglés ante el equipo' },
      { id: 'm6-talk', text: 'Mantener 20 minutos de conversación de trabajo sin cambiar al español' },
      { id: 'm6-quiz', text: 'Sacar 15/15 en el Quiz del Cazatrampas', hint: 'quizBest' },
      { id: 'm6-all', text: 'Tener todo el vocabulario del Laboratorio en “Dominada”', hint: 'masteredAll' },
      { id: 'm6-test', text: 'Hacer un test de nivel (por ejemplo EF SET) y registrar el resultado' },
      { id: 'm6-next', text: 'Definir mi plan de los siguientes 6 meses rumbo a C1' },
    ],
  },
];

const STANDUP_YESTERDAY = [
  { id: 'y-setup', text: 'set up the Power Query connection to the SAP raw data', uses: ['set-up', 'raw-data'] },
  { id: 'y-figured', text: 'figured out why the macro was duplicating rows', uses: ['figure-out'] },
  { id: 'y-lookinto', text: 'looked into the discrepancy between SAP and the Gross Sales Report', uses: ['look-into', 'discrepancy', 'gross-sales-report'] },
  { id: 'y-breakdown', text: 'broke down gross sales by brand and channel', uses: ['break-down'] },
  { id: 'y-backup', text: 'backed up all the raw data files on SharePoint', uses: ['back-up', 'raw-data'] },
  { id: 'y-followup', text: 'followed up on the missing invoices with the Finance team', uses: ['follow-up-on'] },
  { id: 'y-test', text: 'carried out a full test run of the automated report', uses: ['carry-out'] },
  { id: 'y-catchup', text: 'caught up on the shipment updates from the warehouse', uses: ['catch-up-on', 'shipment', 'warehouse'] },
  { id: 'y-workflow', text: 'mapped the current workflow step by step', uses: ['workflow'] },
  { id: 'y-sent', text: 'sent the weekly report to my manager', uses: [] },
];

const STANDUP_TODAY = [
  { id: 't-streamline', text: 'streamline the data-cleaning step of the workflow', uses: ['streamline', 'workflow'] },
  { id: 't-forecast', text: 'break down the Buen Fin forecast by SKU', uses: ['break-down', 'forecast'] },
  { id: 't-backorder', text: 'follow up on the backorder of Rowenta irons', uses: ['follow-up-on', 'backorder'] },
  { id: 't-refresh', text: 'set up the automatic refresh so the dashboard is always up-to-date', uses: ['set-up', 'up-to-date'] },
  { id: 't-leadtime', text: 'look into the lead time of our main supplier', uses: ['look-into', 'lead-time', 'supplier'] },
  { id: 't-accuracy', text: 'check the accuracy of the October numbers against SAP', uses: ['accuracy'] },
  { id: 't-insights', text: 'point out the main insights from the report to my manager', uses: ['point-out', 'insight'] },
  { id: 't-document', text: 'document the new workflow for the team', uses: ['workflow'] },
];

const STANDUP_BLOCKERS = [
  { id: 'b-none', label: 'Sin bloqueos', text: 'No blockers for now. Everything is on track.', uses: [] },
  { id: 'b-sap', label: 'El extracto de SAP me retrasa', text: "The SAP extract is holding up the report. In the meantime, I'll work with last week's file.", uses: ['hold-up', 'in-the-meantime'] },
  { id: 'b-access', label: 'Sigo sin acceso a la base', text: "I'm still waiting for access to the sales database. I'll follow up on it with IT today.", uses: ['follow-up-on'] },
  { id: 'b-discrepancy', label: 'Una discrepancia que no resuelvo', text: "There's a discrepancy in the raw data that I can't figure out yet. Could someone from Finance help me with it?", uses: ['discrepancy', 'raw-data', 'figure-out'] },
  { id: 'b-customs', label: 'Un envío detenido en aduana', text: 'A shipment is held up at customs, so the sales data for this week will be incomplete.', uses: ['shipment', 'hold-up', 'customs'] },
  { id: 'b-pushback', label: 'Hay que mover la revisión', text: "The data isn't up-to-date yet, so we may need to push back the report review to Thursday.", uses: ['up-to-date', 'push-back'] },
];

const STANDUP_CLOSINGS = [
  { id: 'c-overall', text: 'Overall, the project is on track. Thanks!', uses: ['overall'] },
  { id: 'c-moving', text: "Moving forward, I'll share a short update every Friday. Thanks!", uses: ['moving-forward'] },
  { id: 'c-regarding', text: 'If you have any questions regarding the report, just let me know. Thanks!', uses: ['regarding'] },
  { id: 'c-simple', text: "That's it from my side. Thanks!", uses: [] },
];

const DEFAULT_STANDUP = {
  format: 'spoken',
  yesterday: ['y-setup', 'y-figured'],
  today: ['t-forecast', 't-backorder'],
  blocker: 'b-sap',
  closing: 'c-overall',
  extraYesterday: '',
  extraToday: '',
};

const TABS = [
  { id: 'dashboard', label: 'Dashboard', short: 'Hoy', icon: LayoutDashboard },
  { id: 'lab', label: 'Laboratorio', short: 'Lab', icon: FlaskConical, star: true },
  { id: 'traps', label: 'Cazatrampas', short: 'Trampas', icon: ShieldAlert },
  { id: 'cards', label: 'Flashcards', short: 'Cards', icon: Layers },
  { id: 'standup', label: 'Daily Standup', short: 'Standup', icon: MessageSquare },
  { id: 'roadmap', label: 'Roadmap 6 meses', short: 'Roadmap', icon: MapIcon },
];

/* =========================================================================
 * UTILIDADES
 * ========================================================================= */

const STORAGE_PREFIX = 'emiliano-etc:';
const isPlainObject = (v) => Boolean(v) && typeof v === 'object' && !Array.isArray(v);
const PERSISTED_KEYS = {
  startDate: (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v),
  routineLog: isPlainObject,
  customTerms: Array.isArray,
  cardStatus: isPlainObject,
  quizStats: isPlainObject,
  blankStats: isPlainObject,
  roadmap: isPlainObject,
  standup: isPlainObject,
  standupCount: (v) => typeof v === 'number' && v >= 0,
  journal: isPlainObject,
};

function readStore(key, fallback) {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    /* Almacenamiento bloqueado: la app sigue funcionando en memoria. */
  }
}

function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => readStore(key, typeof fallback === 'function' ? fallback() : fallback));
  useEffect(() => {
    writeStore(key, value);
  }, [key, value]);
  return [value, setValue];
}

const cx = (...classes) => classes.filter(Boolean).join(' ');
const pad = (n) => String(n).padStart(2, '0');
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const formatClock = (sec) => `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`;

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function joinList(items) {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

const dateKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseKey = (key) => {
  const [y, m, d] = String(key).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};
const addMonths = (date, n) => {
  const d = new Date(date.getFullYear(), date.getMonth() + n, 1);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(date.getDate(), lastDay));
  return d;
};
const daysBetween = (a, b) => Math.round((parseKey(dateKey(b)) - parseKey(dateKey(a))) / 86400000);
const formatShort = (date) => date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
const formatLong = (date) => date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

function getProgram(startKey, todayKey) {
  const start = parseKey(startKey);
  const today = parseKey(todayKey);
  const end = addMonths(start, 6);
  const totalDays = daysBetween(start, end);
  const dayNumber = daysBetween(start, today) + 1;
  const clampedDay = Math.min(Math.max(dayNumber, 0), totalDays);
  let month = 1;
  for (let m = 1; m <= 6; m += 1) {
    if (today >= addMonths(start, m - 1)) month = m;
  }
  return {
    start,
    end,
    totalDays,
    totalWeeks: Math.ceil(totalDays / 7),
    dayNumber,
    clampedDay,
    week: Math.min(Math.max(Math.ceil(dayNumber / 7), 1), Math.ceil(totalDays / 7)),
    month,
    pct: Math.min(100, Math.max(0, (clampedDay / totalDays) * 100)),
    notStarted: dayNumber < 1,
    finished: dayNumber > totalDays,
  };
}

const monthWindow = (start, m) => ({ from: addMonths(start, m - 1), to: addDays(addMonths(start, m), -1) });

const blockDone = (entry, id) => Boolean(entry && entry[id] && entry[id].done);
const isDayComplete = (entry) => ROUTINE_BLOCKS.every((b) => blockDone(entry, b.id));

function computeStreak(log, todayKey) {
  let cursor = parseKey(todayKey);
  if (!isDayComplete(log[todayKey])) cursor = addDays(cursor, -1);
  let streak = 0;
  while (isDayComplete(log[dateKey(cursor)])) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function computeBestStreak(log) {
  const keys = Object.keys(log).filter((k) => isDayComplete(log[k])).sort();
  let best = 0;
  let run = 0;
  let prev = null;
  keys.forEach((k) => {
    run = prev && daysBetween(parseKey(prev), parseKey(k)) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = k;
  });
  return best;
}

function detectTraps(text) {
  if (!text || !text.trim()) return [];
  const clean = text.replace(/[\u2018\u2019]/g, "'");
  const found = [];
  TRAP_PATTERNS.forEach((p) => {
    const m = clean.match(p.re);
    if (m) found.push({ rule: p.rule, fix: p.fix, match: m[0].replace(/^[.!?\s]+/, '').trim() });
  });
  return found;
}

function makeCustomBlank(item, allTerms) {
  if (!item.example) return null;
  const re = new RegExp(escapeRegExp(item.term), 'i');
  const match = item.example.match(re);
  if (!match) return null;
  const firstForm = (t) => t.term.split('/')[0].trim().toLowerCase();
  const sameCategory = allTerms.filter((t) => t.category === item.category && t.id !== item.id).map(firstForm);
  const others = allTerms.filter((t) => t.category !== item.category).map(firstForm);
  const distractors = [...shuffle(sameCategory), ...shuffle(others)]
    .filter((t, i, arr) => t !== match[0].toLowerCase() && arr.indexOf(t) === i)
    .slice(0, 3);
  return { sentence: item.example.replace(re, '___'), answer: match[0], options: [match[0], ...distractors] };
}

let audioCtx = null;
function unlockAudio() {
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  } catch (e) {
    audioCtx = null;
  }
}

function playChime() {
  try {
    if (!audioCtx) return;
    const t0 = audioCtx.currentTime;
    [659.25, 880, 1318.5].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const t = t0 + i * 0.18;
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.65);
    });
  } catch (e) {
    /* Sin audio disponible. */
  }
}

const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';

function speak(text, rate = 0.92) {
  try {
    if (!canSpeak() || !text) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    const voices = synth.getVoices();
    const voice =
      voices.find((v) => v.lang === 'en-US' && /Google|Samantha|Microsoft|Natural/i.test(v.name)) ||
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
    if (voice) utterance.voice = voice;
    synth.speak(utterance);
  } catch (e) {
    /* El navegador no permite voz. */
  }
}

function copyText(text, nodeToSelect) {
  const selectNode = () => {
    try {
      if (!nodeToSelect) return;
      const range = document.createRange();
      range.selectNodeContents(nodeToSelect);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) {
      /* Nada que seleccionar. */
    }
  };
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        () => 'copied',
        () => {
          selectNode();
          return 'selected';
        },
      );
    }
  } catch (e) {
    /* Caemos a seleccionar el texto. */
  }
  selectNode();
  return Promise.resolve('selected');
}

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
.etc-root { font-family: 'Figtree', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; color-scheme: dark; -webkit-font-smoothing: antialiased; }
.etc-display { font-family: 'Bricolage Grotesque', 'Figtree', ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.015em; }
.etc-mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-variant-numeric: tabular-nums; }
.etc-balance { text-wrap: balance; }
.etc-gutter { padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
.etc-sticky { position: sticky; top: env(safe-area-inset-top, 0px); }
.etc-scroll-x { overflow-x: auto; scrollbar-width: none; }
.etc-scroll-x::-webkit-scrollbar { display: none; }
.etc-lane { background-image: repeating-linear-gradient(90deg, rgba(148, 163, 184, 0.16) 0 8px, rgba(15, 23, 42, 0) 8px 14px); }
.etc-flip-scene { perspective: 1400px; }
.etc-flip-card { position: relative; width: 100%; height: 100%; transition: transform 0.55s cubic-bezier(0.2, 0.7, 0.2, 1); transform-style: preserve-3d; }
.etc-flip-card.is-flipped { transform: rotateY(180deg); }
.etc-flip-face { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.etc-flip-back { transform: rotateY(180deg); }
.etc-pulse { animation: etc-pulse 1.6s ease-in-out infinite; }
@keyframes etc-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.etc-pop { animation: etc-pop 0.35s ease-out; }
@keyframes etc-pop { from { transform: scale(0.97); opacity: 0.5; } to { transform: scale(1); opacity: 1; } }
.etc-root :focus-visible { outline: 2px solid #38bdf8; outline-offset: 2px; }
.etc-root input[type='date']::-webkit-calendar-picker-indicator { filter: invert(0.8); }
@media (prefers-reduced-motion: reduce) {
  .etc-flip-card, .etc-pulse, .etc-pop { transition: none !important; animation: none !important; }
}
`;

/* =========================================================================
 * PIEZAS DE UI
 * ========================================================================= */

const CATEGORY_BY_ID = CATEGORIES.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
const BLOCK_BY_ID = ROUTINE_BLOCKS.reduce((acc, b) => ({ ...acc, [b.id]: b }), {});
const TERM_BY_ID = TERMS.reduce((acc, t) => ({ ...acc, [t.id]: t }), {});

function SectionTitle({ eyebrow, title, children, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 max-w-3xl">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">{eyebrow}</p>}
        <h2 className="etc-display etc-balance mt-1 text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        {children && <p className="mt-2 text-sm leading-relaxed text-slate-400">{children}</p>}
      </div>
      {action}
    </div>
  );
}

function CategoryChip({ id }) {
  const cat = CATEGORY_BY_ID[id];
  const style = CATEGORY_STYLE[id] || CATEGORY_STYLE.office;
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium', style.chip)}>
      <span className={cx('h-1.5 w-1.5 rounded-full', style.dot)} />
      {cat ? cat.short : 'Verbo en pasado'}
    </span>
  );
}

function StatusChip({ status }) {
  if (status === 'mastered') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
        <Check className="h-3 w-3" /> Dominada
      </span>
    );
  }
  if (status === 'review') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
        <Repeat className="h-3 w-3" /> Repasar
      </span>
    );
  }
  return null;
}

function SpeakButton({ text, label = 'Escuchar pronunciación', className }) {
  const [available, setAvailable] = useState(false);
  useEffect(() => setAvailable(canSpeak()), []);
  if (!available) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      title={label}
      aria-label={label}
      className={cx(
        'grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-700 bg-slate-800/60 text-slate-300 transition hover:border-sky-400/60 hover:text-sky-300',
        className,
      )}
    >
      <Volume2 className="h-4 w-4" />
    </button>
  );
}

function ProgressBar({ value, tone = 'bg-sky-400', className }) {
  return (
    <div className={cx('h-2 overflow-hidden rounded-full bg-slate-800', className)}>
      <div className={cx('h-full rounded-full transition-all duration-500', tone)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function Highlight({ text, terms }) {
  const parts = useMemo(() => {
    const list = (terms || []).filter(Boolean).sort((a, b) => b.length - a.length).map(escapeRegExp);
    if (!list.length) return [text];
    return text.split(new RegExp(`(${list.join('|')})`, 'gi'));
  }, [text, terms]);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-emerald-400/15 px-0.5 font-semibold text-emerald-300">
        {part}
      </mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

function TrapFindings({ findings, emptyText }) {
  if (!findings.length) {
    return emptyText ? (
      <p className="flex items-center gap-2 text-sm text-emerald-300">
        <CheckCircle2 className="h-4 w-4" /> {emptyText}
      </p>
    ) : null;
  }
  return (
    <ul className="flex flex-col gap-2">
      {findings.map((f, i) => (
        <li key={`${f.rule}-${i}`} className="flex flex-wrap items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm">
          <span className="rounded-md bg-rose-400/20 px-1.5 py-0.5 text-xs font-bold text-rose-200">Regla {f.rule}</span>
          <span className="text-rose-200 line-through decoration-rose-300/70">{f.match}</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
          <span className="font-semibold text-emerald-300">{f.fix}</span>
        </li>
      ))}
    </ul>
  );
}

function ConfirmButton({ onConfirm, label, confirmLabel = '¿Seguro?', icon: Icon = Trash2, className }) {
  const [asking, setAsking] = useState(false);
  if (asking) {
    return (
      <span className="inline-flex items-center gap-2 text-sm">
        <span className="text-slate-300">{confirmLabel}</span>
        <button
          type="button"
          onClick={() => {
            setAsking(false);
            onConfirm();
          }}
          className="rounded-lg bg-rose-500/90 px-3 py-1 font-semibold text-white hover:bg-rose-500"
        >
          Sí
        </button>
        <button type="button" onClick={() => setAsking(false)} className="rounded-lg border border-slate-700 px-3 py-1 text-slate-300 hover:bg-slate-800">
          No
        </button>
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setAsking(true)}
      aria-label={label || confirmLabel}
      title={label || confirmLabel}
      className={cx('inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300', className)}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

/* =========================================================================
 * 1 · DASHBOARD
 * ========================================================================= */

function RoutineCard({ block, remaining, running, done, onStart, onPause, onReset, onToggleDone }) {
  const total = block.minutes * 60;
  const pct = done ? 100 : ((total - remaining) / total) * 100;
  const Icon = block.icon;
  const tone = BLOCK_TONE[block.tone];
  return (
    <article
      className={cx(
        'flex flex-col gap-4 rounded-2xl border p-5 transition-colors',
        done ? 'border-emerald-400/40 bg-emerald-400/5' : running ? 'border-sky-400/60 bg-sky-400/5' : 'border-slate-800 bg-slate-900/60',
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-xl', tone.icon)}>
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              {block.step} · {block.minutes} min
            </p>
            <h3 className="etc-display text-lg font-bold text-white">{block.label}</h3>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleDone}
          aria-pressed={done}
          title={done ? 'Marcar como pendiente' : 'Marcar como hecho'}
          className={cx('rounded-full p-1 transition', done ? 'text-emerald-300' : 'text-slate-600 hover:text-slate-300')}
        >
          {done ? <CheckCircle2 className="h-7 w-7" /> : <Circle className="h-7 w-7" />}
        </button>
      </header>
      <p className="text-sm leading-relaxed text-slate-400">{block.how}</p>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className={cx('etc-mono text-4xl font-bold leading-none', done ? 'text-emerald-300' : running ? 'text-sky-300' : 'text-slate-100')}>
            {done ? 'Listo' : formatClock(remaining)}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            {running ? (
              <>
                <span className="etc-pulse h-2 w-2 rounded-full bg-sky-400" /> Corriendo
              </>
            ) : done ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" /> {block.minutes} min completados
              </>
            ) : remaining < total ? (
              'En pausa'
            ) : (
              'Sin empezar'
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {running ? (
            <button
              type="button"
              onClick={onPause}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
            >
              <Pause className="h-4 w-4" /> Pausa
            </button>
          ) : (
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
            >
              <Play className="h-4 w-4" /> {done ? 'Otra vez' : remaining < total ? 'Seguir' : 'Empezar'}
            </button>
          )}
          <button
            type="button"
            onClick={onReset}
            title="Reiniciar temporizador"
            aria-label="Reiniciar temporizador"
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-700 text-slate-400 transition hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      <ProgressBar value={pct} tone={done ? 'bg-emerald-400' : tone.bar} className="h-1.5" />
      <ul className="flex flex-col gap-1.5 border-t border-slate-800 pt-3 text-xs text-slate-400">
        {block.ideas.map((idea) => (
          <li key={idea} className="flex gap-2">
            <span className={cx('mt-1.5 h-1 w-1 shrink-0 rounded-full', tone.bar)} />
            {idea}
          </li>
        ))}
      </ul>
    </article>
  );
}

function StatTile({ icon: Icon, label, value, detail, tone }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <Icon className={cx('h-4 w-4', tone)} /> {label}
      </p>
      <p className="etc-display text-3xl font-bold text-white">{value}</p>
      {detail && <p className="text-xs text-slate-400">{detail}</p>}
    </div>
  );
}

function SixMonthGrid({ program, routineLog, todayKey }) {
  const cells = useMemo(
    () =>
      Array.from({ length: program.totalDays }, (_, i) => {
        const date = addDays(program.start, i);
        const key = dateKey(date);
        const entry = routineLog[key];
        const doneCount = ROUTINE_BLOCKS.filter((b) => blockDone(entry, b.id)).length;
        const isFuture = key > todayKey;
        let cls = 'bg-slate-800';
        let status = 'Sin rutina';
        if (doneCount === ROUTINE_BLOCKS.length) {
          cls = 'bg-emerald-400';
          status = 'Rutina completa';
        } else if (doneCount > 0) {
          cls = 'bg-sky-500/60';
          status = `${doneCount} de 3 bloques`;
        } else if (isFuture) {
          cls = 'bg-slate-900 ring-1 ring-inset ring-slate-800';
          status = 'Próximamente';
        }
        return { key, date, cls, status, isToday: key === todayKey };
      }),
    [program.start, program.totalDays, routineLog, todayKey],
  );
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div
        className="grid w-full gap-0.5 sm:gap-1"
        style={{ gridTemplateRows: 'repeat(7, auto)', gridTemplateColumns: `repeat(${program.totalWeeks}, minmax(0, 1fr))`, gridAutoFlow: 'column' }}
      >
        {cells.map((c) => (
          <span
            key={c.key}
            title={`${formatShort(c.date)} · ${c.status}`}
            className={cx('aspect-square w-full rounded-sm', c.cls, c.isToday && 'ring-2 ring-sky-300 ring-offset-1 ring-offset-slate-950')}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          Inicio {formatShort(program.start)} · Meta B2 {formatShort(addDays(program.end, -1))}
        </span>
        <span className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" /> Completa
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-sky-500/60" /> Parcial
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-slate-800" /> Sin rutina
          </span>
        </span>
      </div>
    </div>
  );
}

function SettingsPanel({ startDate, setStartDate, exportData, importData, resetAll }) {
  const [open, setOpen] = useState(false);
  const [backupText, setBackupText] = useState('');
  const [message, setMessage] = useState('');
  const exportRef = useRef(null);
  const json = open ? JSON.stringify(exportData()) : '';
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2 font-semibold text-slate-200">
          <Settings className="h-4 w-4 text-slate-400" /> Ajustes y respaldo
        </span>
        <ChevronDown className={cx('h-4 w-4 text-slate-500 transition', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="grid gap-6 border-t border-slate-800 px-5 py-5 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="etc-start-date" className="text-sm font-semibold text-slate-200">
              Fecha de inicio del plan
            </label>
            <input
              id="etc-start-date"
              type="date"
              value={startDate}
              onChange={(e) => e.target.value && setStartDate(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
            />
            <p className="text-xs text-slate-500">Los 6 meses, el roadmap y la cuadrícula se calculan desde aquí.</p>
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <p className="text-sm font-semibold text-slate-200">Copiar respaldo</p>
            <p className="text-xs text-slate-500">Tu progreso vive en este navegador. Copia el respaldo para pasarlo a otro dispositivo.</p>
            <pre ref={exportRef} className="etc-mono max-h-24 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-slate-500">
              {json.slice(0, 600)}
              {json.length > 600 ? '…' : ''}
            </pre>
            <button
              type="button"
              onClick={() =>
                copyText(json, exportRef.current).then((r) => setMessage(r === 'copied' ? 'Respaldo copiado.' : 'Texto seleccionado: cópialo con Ctrl+C.'))
              }
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              <Copy className="h-4 w-4" /> Copiar respaldo
            </button>
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor="etc-restore" className="text-sm font-semibold text-slate-200">
              Restaurar respaldo
            </label>
            <textarea
              id="etc-restore"
              value={backupText}
              onChange={(e) => setBackupText(e.target.value)}
              rows={3}
              placeholder="Pega aquí tu respaldo"
              className="etc-mono rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200 placeholder:text-slate-600"
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const ok = importData(backupText);
                  setMessage(ok ? 'Respaldo restaurado.' : 'Ese texto no es un respaldo válido. Copia el respaldo completo e inténtalo de nuevo.');
                  if (ok) setBackupText('');
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                <Save className="h-4 w-4" /> Restaurar
              </button>
              <ConfirmButton onConfirm={resetAll} label="Borrar todo" confirmLabel="¿Borrar todo el progreso?" />
            </div>
          </div>
          {message && <p className="text-sm text-sky-300 lg:col-span-3">{message}</p>}
        </div>
      )}
    </section>
  );
}

function Dashboard({ program, todayKey, routineLog, routine, streak, bestStreak, completedDays, mastery, quizBest, roadmapPct, journal, setJournal, allTerms, settings, goTo }) {
  const today = parseKey(todayKey);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 19 ? 'Good afternoon' : 'Good evening';
  const dayIndex = Math.floor(today.getTime() / 86400000);
  const prompt = OUTPUT_PROMPTS[((dayIndex % OUTPUT_PROMPTS.length) + OUTPUT_PROMPTS.length) % OUTPUT_PROMPTS.length];
  const wordOfDay = allTerms[((dayIndex % allTerms.length) + allTerms.length) % allTerms.length];
  const entryText = journal[todayKey] || '';
  const findings = detectTraps(entryText);
  const words = entryText.trim() ? entryText.trim().split(/\s+/).length : 0;
  const minutesDone = ROUTINE_BLOCKS.reduce((sum, b) => {
    if (blockDone(routineLog[todayKey], b.id)) return sum + b.minutes;
    return sum + (b.minutes * 60 - routine.remainingFor(b.id)) / 60;
  }, 0);
  const monthInfo = ROADMAP[program.month - 1];

  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-slate-400">{cap(formatLong(today))}</p>
              <h1 className="etc-display etc-balance mt-2 text-4xl font-extrabold text-white sm:text-5xl">{greeting}, Emiliano.</h1>
              <p className="mt-3 max-w-xl text-slate-300">
                {program.notStarted
                  ? `Tu plan empieza el ${formatShort(program.start)}. Ve calentando motores.`
                  : program.finished
                  ? 'Completaste los 6 meses. Hora de definir tu siguiente meta: C1.'
                  : `Día ${program.clampedDay} de ${program.totalDays} · Semana ${program.week} de ${program.totalWeeks} · Mes ${program.month}: ${monthInfo.title}`}
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-amber-400/20 bg-amber-400/5 px-5 py-4">
              <Flame className="h-10 w-10 text-amber-300" />
              <div>
                <p className="etc-display text-4xl font-extrabold leading-none text-white">{streak}</p>
                <p className="mt-1 text-xs text-slate-400">{streak === 1 ? 'día de racha' : 'días de racha'} · récord {bestStreak}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-slate-200">
                Rutina de hoy <span className="etc-mono ml-1 text-sky-300">{Math.floor(minutesDone)}</span>
                <span className="text-slate-500"> / 40 min</span>
              </p>
              <p className="text-xs text-slate-500">40 min × {program.totalDays} días = {Math.round((40 * program.totalDays) / 60)} horas de inglés</p>
            </div>
            <div className="flex gap-1.5">
              {ROUTINE_BLOCKS.map((b) => {
                const done = blockDone(routineLog[todayKey], b.id);
                const pct = done ? 100 : ((b.minutes * 60 - routine.remainingFor(b.id)) / (b.minutes * 60)) * 100;
                return (
                  <div key={b.id} className="flex min-w-0 flex-col gap-1.5" style={{ flex: b.minutes }}>
                    <div className="etc-lane h-3 overflow-hidden rounded-full bg-slate-800/80">
                      <div className={cx('h-full rounded-full transition-all duration-500', done ? 'bg-emerald-400' : BLOCK_TONE[b.tone].bar)} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="truncate text-xs text-slate-500">
                      {b.label} · {b.minutes}′
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Avance hacia los 6 meses</span>
              <span className="etc-mono text-slate-300">{Math.round(program.pct)}%</span>
            </div>
            <ProgressBar value={program.pct} tone="bg-gradient-to-r from-sky-500 to-emerald-400" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={CalendarDays} label="Días completos" value={completedDays} detail={`de ${program.totalDays} del plan`} tone="text-sky-300" />
        <StatTile icon={Brain} label="Vocabulario" value={`${mastery.mastered}/${mastery.total}`} detail="tarjetas dominadas" tone="text-emerald-300" />
        <StatTile icon={Trophy} label="Cazatrampas" value={`${quizBest}/15`} detail="mejor puntaje del quiz" tone="text-amber-300" />
        <StatTile icon={TrendingUp} label="Roadmap" value={`${Math.round(roadmapPct)}%`} detail="metas cumplidas" tone="text-blue-300" />
      </section>

      <section className="flex flex-col gap-4">
        <SectionTitle eyebrow="Checklist diario" title="Rutina de 40 minutos">
          Un temporizador a la vez. Cuando llega a cero, el bloque se marca solo y suena una campana.
        </SectionTitle>
        <div className="grid gap-4 md:grid-cols-3">
          {ROUTINE_BLOCKS.map((b) => (
            <RoutineCard
              key={b.id}
              block={b}
              remaining={routine.remainingFor(b.id)}
              running={routine.isRunning(b.id)}
              done={blockDone(routineLog[todayKey], b.id)}
              onStart={() => routine.start(b.id)}
              onPause={routine.pause}
              onReset={() => routine.reset(b.id)}
              onToggleDone={() => routine.toggleDone(b.id)}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Output activo · reto del día</p>
              <p className="etc-display mt-2 text-lg font-semibold leading-snug text-white">{prompt}</p>
            </div>
            <SpeakButton text={prompt} label="Escuchar el reto" />
          </div>
          <label htmlFor="etc-journal" className="sr-only">
            Mi diario en inglés
          </label>
          <textarea
            id="etc-journal"
            value={entryText}
            onChange={(e) => setJournal((prev) => ({ ...prev, [todayKey]: e.target.value }))}
            rows={6}
            placeholder="Today I worked on the Gross Sales Report. I set up…"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 p-4 leading-relaxed text-slate-100 placeholder:text-slate-600"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>Mi diario en inglés · se guarda solo</span>
            <span className="etc-mono">{words} palabras</span>
          </div>
          <TrapFindings findings={findings} emptyText={words >= 5 ? 'Sin trampas de tus 5 Reglas de Oro. Sigue así.' : ''} />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">Keyword del día</p>
              <p className="etc-display mt-2 text-3xl font-bold text-white">{wordOfDay.term}</p>
              <p className="mt-1 text-sm text-slate-300">{wordOfDay.meaning}</p>
            </div>
            <SpeakButton text={`${wordOfDay.term}. ${wordOfDay.example || ''}`} />
          </div>
          {wordOfDay.example && (
            <p className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm italic leading-relaxed text-slate-300">
              “<Highlight text={wordOfDay.example} terms={wordOfDay.highlight || wordOfDay.term.split('/').map((s) => s.trim())} />”
            </p>
          )}
          {wordOfDay.formal && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl border border-dashed border-slate-700 p-3">
                <p className="text-xs uppercase tracking-wider text-slate-500">Traductor</p>
                <p className={cx('mt-1 font-semibold text-slate-300', wordOfDay.formalType === 'calque' && 'line-through decoration-rose-400/70')}>{wordOfDay.formal}</p>
              </div>
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3">
                <p className="text-xs uppercase tracking-wider text-emerald-300">Nativo</p>
                <p className="mt-1 font-semibold text-emerald-200">{wordOfDay.term}</p>
              </div>
            </div>
          )}
          <p className="text-xs text-slate-500">Úsala hoy en tu diario o en tu standup.</p>
          <div className="mt-auto flex flex-wrap gap-2">
            <button type="button" onClick={() => goTo('lab')} className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">
              <FlaskConical className="h-4 w-4" /> Ir al Laboratorio
            </button>
            <button type="button" onClick={() => goTo('standup')} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800">
              <MessageSquare className="h-4 w-4" /> Armar standup
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">6 meses de un vistazo</p>
            <h3 className="etc-display mt-1 text-xl font-bold text-white">Cada cuadro es un día; cada columna, una semana</h3>
          </div>
          <p className="text-sm text-slate-400">
            Semana <span className="etc-mono text-slate-200">{program.notStarted ? 0 : program.week}</span> de {program.totalWeeks}
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <SixMonthGrid program={program} routineLog={routineLog} todayKey={todayKey} />
          </div>
          <ul className="flex flex-col gap-2.5">
            {ROADMAP.map((m) => {
              const win = monthWindow(program.start, m.month);
              const from = dateKey(win.from);
              const to = dateKey(win.to);
              const days = daysBetween(win.from, win.to) + 1;
              const done = Object.keys(routineLog).filter((k) => k >= from && k <= to && isDayComplete(routineLog[k])).length;
              const isCurrent = !program.notStarted && m.month === program.month;
              return (
                <li key={m.month} className="flex flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className={cx('truncate', isCurrent ? 'font-semibold text-sky-200' : 'text-slate-400')}>
                      Mes {m.month} · {m.title}
                    </span>
                    <span className="etc-mono shrink-0 text-slate-500">
                      {done}/{days}
                    </span>
                  </div>
                  <ProgressBar value={(done / days) * 100} tone="bg-emerald-400" className="h-1.5" />
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <SettingsPanel {...settings} />
    </div>
  );
}

/* =========================================================================
 * 2 · LABORATORIO
 * ========================================================================= */

function TermCard({ item, status, challenge, onDelete }) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => setRevealed(false), [challenge]);
  const showPro = !challenge || revealed;
  const formalTag = FORMAL_TAGS[item.formalType] || FORMAL_TAGS.rigid;
  const marks = item.highlight || item.term.split('/').map((s) => s.trim());
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryChip id={item.category} />
            {item.custom && <span className="rounded-full border border-slate-700 px-2.5 py-0.5 text-xs text-slate-400">Agregada por ti</span>}
            <StatusChip status={status} />
          </div>
          <p className="mt-3 text-sm text-slate-400">Significado</p>
          <p className="etc-display text-xl font-semibold text-white">{item.meaning}</p>
        </div>
        {showPro && <SpeakButton text={`${item.term}. ${item.example || ''}`} />}
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <BookOpen className="h-3.5 w-3.5" /> Traductor
          </p>
          <p className={cx('text-lg font-semibold text-slate-300', formalTag.strike && 'line-through decoration-rose-400/70')}>{item.formal || '—'}</p>
          {item.formal && <p className={cx('text-xs', formalTag.cls)}>{formalTag.label}</p>}
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            <Zap className="h-3.5 w-3.5" /> Nativo · Pro
          </p>
          {showPro ? (
            <p className={cx('etc-display text-xl font-bold text-emerald-200', revealed && 'etc-pop')}>{item.term}</p>
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-lg bg-emerald-400/20 px-3 py-1.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/30"
            >
              <Eye className="h-4 w-4" /> ¿Cuál dirías? Revelar
            </button>
          )}
        </div>
      </div>

      {showPro && item.example && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">En Groupe SEB</p>
          <p className="leading-relaxed text-slate-200">
            “<Highlight text={item.example} terms={marks} />”
          </p>
        </div>
      )}
      {showPro && item.tip && (
        <p className="flex gap-2 rounded-xl bg-slate-950/50 p-3 text-sm leading-relaxed text-slate-400">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" /> {item.tip}
        </p>
      )}
      {item.custom && onDelete && (
        <div className="flex justify-end border-t border-slate-800 pt-3">
          <ConfirmButton onConfirm={() => onDelete(item.id)} label="Eliminar" confirmLabel="¿Eliminar esta keyword?" />
        </div>
      )}
    </article>
  );
}

function FillBlank({ pool, stats, setStats, active }) {
  const poolKey = pool.map((t) => t.id).join('|');
  const [deck, setDeck] = useState(() => shuffle(pool.map((t) => t.id)));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [session, setSession] = useState({ correct: 0, total: 0, streak: 0 });
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setDeck(shuffle(pool.map((t) => t.id)));
    setIndex(0);
    setPicked(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolKey]);

  const current = pool.find((t) => t.id === deck[index]) || pool[0];
  const options = useMemo(() => (current ? shuffle(current.blank.options) : []), [current && current.id, index]); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = useCallback(
    (option) => {
      if (!current || picked) return;
      const correct = option === current.blank.answer;
      setPicked(option);
      setSession((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1, streak: correct ? s.streak + 1 : 0 }));
      setStats((s) => {
        const streak = correct ? (s.currentStreak || 0) + 1 : 0;
        return {
          answered: (s.answered || 0) + 1,
          correct: (s.correct || 0) + (correct ? 1 : 0),
          currentStreak: streak,
          bestStreak: Math.max(s.bestStreak || 0, streak),
        };
      });
    },
    [current, picked, setStats],
  );

  const next = useCallback(() => {
    setPicked(null);
    if (index + 1 >= deck.length) {
      setDeck(shuffle(pool.map((t) => t.id)));
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  }, [index, deck.length, pool]);

  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length && !picked) {
        e.preventDefault();
        choose(options[n - 1]);
      } else if (e.key === 'Enter' && picked) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, options, picked, choose, next]);

  if (!current) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
        No hay oraciones con este filtro. Cambia la categoría o borra la búsqueda.
      </div>
    );
  }

  const [before, after] = current.blank.sentence.split('___');
  const isCorrect = picked === current.blank.answer;
  const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-7 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryChip id={current.category} />
            <span className="text-xs text-slate-500">
              Oración {index + 1} de {deck.length}
            </span>
          </div>
          <span className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
            <Keyboard className="h-3.5 w-3.5" /> Teclas 1–4 para elegir, Enter para seguir
          </span>
        </div>
        <p className="etc-display etc-balance text-2xl font-semibold leading-snug text-white sm:text-3xl">
          {before}
          <span
            className={cx(
              'mx-1 inline-block min-w-24 rounded-lg border-b-2 px-2 text-center',
              !picked && 'border-sky-400 bg-sky-400/10 text-sky-300',
              picked && isCorrect && 'border-emerald-400 bg-emerald-400/15 text-emerald-300',
              picked && !isCorrect && 'border-rose-400 bg-rose-400/10 text-emerald-300',
            )}
          >
            {picked ? current.blank.answer : ' ? '}
          </span>
          {after}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map((opt, i) => {
            const isAnswer = opt === current.blank.answer;
            const isPicked = opt === picked;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => choose(opt)}
                disabled={Boolean(picked)}
                className={cx(
                  'flex items-center gap-3 rounded-xl border px-4 py-3 text-left font-semibold transition',
                  !picked && 'border-slate-700 bg-slate-950/50 text-slate-100 hover:border-sky-400/70 hover:bg-sky-400/5',
                  picked && isAnswer && 'border-emerald-400/70 bg-emerald-400/10 text-emerald-200',
                  picked && isPicked && !isAnswer && 'border-rose-400/70 bg-rose-400/10 text-rose-200 line-through',
                  picked && !isPicked && !isAnswer && 'border-slate-800 text-slate-500',
                )}
              >
                <span className="etc-mono grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-800 text-xs text-slate-400">{i + 1}</span>
                {opt}
              </button>
            );
          })}
        </div>
        {picked && (
          <div className={cx('etc-pop flex flex-col gap-3 rounded-xl border p-4', isCorrect ? 'border-emerald-400/30 bg-emerald-400/5' : 'border-rose-400/30 bg-rose-400/5')}>
            <p className={cx('flex items-center gap-2 font-semibold', isCorrect ? 'text-emerald-300' : 'text-rose-300')}>
              {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
              {isCorrect ? 'Exacto. Así lo diría un nativo.' : `Casi. La correcta es “${current.blank.answer}”.`}
            </p>
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-white">{current.term}</span> = {current.meaning}
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={next} className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">
                Siguiente <ArrowRight className="h-4 w-4" />
              </button>
              <SpeakButton text={`${before}${current.blank.answer}${after}`} label="Escuchar la oración completa" />
            </div>
          </div>
        )}
      </div>
      <aside className="flex flex-col gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Esta sesión</p>
          <p className="etc-display mt-2 text-4xl font-bold text-white">
            {session.correct}
            <span className="text-xl text-slate-500">/{session.total}</span>
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-amber-300">
            <Flame className="h-4 w-4" /> Racha de aciertos: {session.streak}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Histórico</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
            <p className="flex justify-between">
              <span>Respondidas</span>
              <span className="etc-mono text-white">{stats.answered || 0}</span>
            </p>
            <p className="flex justify-between">
              <span>Precisión</span>
              <span className="etc-mono text-white">{accuracy}%</span>
            </p>
            <p className="flex justify-between">
              <span>Mejor racha</span>
              <span className="etc-mono text-white">{stats.bestStreak || 0}</span>
            </p>
          </div>
          <ProgressBar value={accuracy} tone="bg-emerald-400" className="mt-3" />
        </div>
        <button
          type="button"
          onClick={() => {
            setDeck(shuffle(pool.map((t) => t.id)));
            setIndex(0);
            setPicked(null);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
        >
          <Shuffle className="h-4 w-4" /> Revolver oraciones
        </button>
      </aside>
    </div>
  );
}

function AddKeyword({ allTerms, customTerms, setCustomTerms, prefill, onDone }) {
  const empty = { term: '', category: 'office', meaning: '', formal: '', example: '', source: '' };
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  useEffect(() => {
    if (prefill) setForm((f) => ({ ...f, term: prefill }));
  }, [prefill]);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const exampleHasTerm = form.term.trim() && form.example.toLowerCase().includes(form.term.trim().toLowerCase());

  const submit = (e) => {
    e.preventDefault();
    const term = form.term.trim();
    const meaning = form.meaning.trim();
    if (!term || !meaning) {
      setError('Escribe la palabra en inglés y su significado en español.');
      return;
    }
    if (allTerms.some((t) => normalize(t.term) === normalize(term))) {
      setError(`“${term}” ya está en tu Laboratorio. Búscala en el Comparador.`);
      return;
    }
    const item = {
      id: `custom-${Date.now()}`,
      term,
      category: form.category,
      meaning,
      formal: form.formal.trim(),
      formalType: 'rigid',
      example: form.example.trim(),
      tip: form.source.trim() ? `La escuché en: ${form.source.trim()}` : '',
      createdAt: dateKey(),
    };
    setCustomTerms((prev) => [item, ...prev]);
    setForm({ ...empty, category: form.category });
    setError('');
    setSaved(term);
  };

  const inputCls = 'w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-slate-100 placeholder:text-slate-600';
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <form onSubmit={submit} className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 lg:col-span-3" noValidate>
        <div>
          <h3 className="etc-display text-xl font-bold text-white">Agregar nueva keyword</h3>
          <p className="mt-1 text-sm text-slate-400">¿Escuchaste algo nuevo en una junta o en un correo? Guárdalo antes de que se te olvide.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="etc-new-term" className="text-sm font-semibold text-slate-200">
              Palabra o phrasal verb (inglés) *
            </label>
            <input id="etc-new-term" value={form.term} onChange={set('term')} placeholder="Ej: Roll out" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="etc-new-category" className="text-sm font-semibold text-slate-200">
              Categoría
            </label>
            <select id="etc-new-category" value={form.category} onChange={set('category')} className={inputCls}>
              {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="etc-new-meaning" className="text-sm font-semibold text-slate-200">
              Significado en español *
            </label>
            <input id="etc-new-meaning" value={form.meaning} onChange={set('meaning')} placeholder="Ej: Implementar / lanzar" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="etc-new-formal" className="text-sm font-semibold text-slate-200">
              Versión rígida o de traductor
            </label>
            <input id="etc-new-formal" value={form.formal} onChange={set('formal')} placeholder="Ej: Implement" className={inputCls} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="etc-new-example" className="text-sm font-semibold text-slate-200">
            Ejemplo en Groupe SEB
          </label>
          <textarea
            id="etc-new-example"
            value={form.example}
            onChange={set('example')}
            rows={3}
            placeholder="Ej: We'll roll out the automated report to the whole team in January."
            className={inputCls}
          />
          <p className={cx('text-xs', exampleHasTerm ? 'text-emerald-300' : 'text-slate-500')}>
            {exampleHasTerm
              ? 'Tu ejemplo incluye la palabra: también aparecerá en Fill in the Blank.'
              : 'Si el ejemplo incluye la palabra exacta, también entra a Fill in the Blank.'}
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="etc-new-source" className="text-sm font-semibold text-slate-200">
            ¿Dónde la escuchaste?
          </label>
          <input id="etc-new-source" value={form.source} onChange={set('source')} placeholder="Ej: Junta semanal con el equipo de Francia" className={inputCls} />
        </div>
        {error && (
          <p className="flex items-center gap-2 text-sm text-rose-300">
            <AlertTriangle className="h-4 w-4" /> {error}
          </p>
        )}
        {saved && !error && (
          <p className="flex flex-wrap items-center gap-2 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Guardada: “{saved}”. Ya está en el Comparador y en Flashcards.
            <button type="button" onClick={onDone} className="font-semibold underline underline-offset-2">
              Verla
            </button>
          </p>
        )}
        <button type="submit" className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-emerald-400">
          <Plus className="h-4 w-4" /> Guardar keyword
        </button>
      </form>

      <aside className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 lg:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Mis keywords ({customTerms.length})</p>
        {customTerms.length === 0 ? (
          <p className="text-sm leading-relaxed text-slate-400">
            Todavía no agregas ninguna. Meta del Mes 2: 10 keywords propias. Empieza con la última palabra que no entendiste en una junta.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-slate-800">
            {customTerms.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                <span className="min-w-0">
                  <span className="font-semibold text-white">{t.term}</span>
                  <span className="text-sm text-slate-400"> · {t.meaning}</span>
                </span>
                <ConfirmButton onConfirm={() => setCustomTerms((prev) => prev.filter((x) => x.id !== t.id))} label="" confirmLabel="¿Eliminar?" />
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

function Lab({ allTerms, cardStatus, customTerms, setCustomTerms, blankStats, setBlankStats, active }) {
  const [mode, setMode] = useState('compare');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [challenge, setChallenge] = useState(false);
  const [prefill, setPrefill] = useState('');

  const counts = useMemo(() => {
    const out = { all: allTerms.length };
    allTerms.forEach((t) => {
      out[t.category] = (out[t.category] || 0) + 1;
    });
    return out;
  }, [allTerms]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return allTerms.filter(
      (t) =>
        (category === 'all' || t.category === category) &&
        (!q || normalize([t.term, t.meaning, t.formal, t.example].join(' ')).includes(q)),
    );
  }, [allTerms, category, query]);

  const blankPool = useMemo(() => filtered.filter((t) => t.blank), [filtered]);
  const deleteTerm = (id) => setCustomTerms((prev) => prev.filter((t) => t.id !== id));

  const modes = [
    { id: 'compare', label: 'Traductor vs. Nativo', short: 'Comparar', icon: Eye },
    { id: 'blank', label: 'Fill in the Blank', short: 'Completar', icon: Target },
    { id: 'add', label: 'Agregar keyword', short: 'Agregar', icon: Plus },
  ];

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Sección estrella" title="Laboratorio de Phrasal Verbs & Power Keywords">
        Deja de sonar a traductor. Compara la palabra rígida con la que usa un nativo en una junta, y practica con oraciones de tu día en Groupe SEB.
      </SectionTitle>

      <div>
        <div className="grid grid-cols-3 gap-1 rounded-2xl border border-slate-800 bg-slate-900/70 p-1 sm:inline-grid" role="tablist" aria-label="Modo del laboratorio">
          {modes.map((m) => {
            const Icon = m.icon;
            const selected = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setMode(m.id)}
                className={cx(
                  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition sm:px-4',
                  selected ? 'bg-sky-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="sm:hidden">{m.short}</span>
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {mode !== 'add' && (
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <label htmlFor="etc-lab-search" className="sr-only">
              Buscar en el laboratorio
            </label>
            <input
              id="etc-lab-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca en inglés o en español: “posponer”, “lead time”, “datos”…"
              className="w-full rounded-2xl border border-slate-700 bg-slate-900/70 py-3 pl-10 pr-10 text-slate-100 placeholder:text-slate-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Borrar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              const selected = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  aria-pressed={selected}
                  className={cx(
                    'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition',
                    selected ? 'border-sky-400 bg-sky-400/15 text-sky-200' : 'border-slate-700 text-slate-300 hover:border-slate-500',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" /> {c.label}
                  <span className="etc-mono text-xs text-slate-500">{counts[c.id] || 0}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {mode === 'compare' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              {filtered.length} {filtered.length === 1 ? 'término' : 'términos'}
            </p>
            <button
              type="button"
              onClick={() => setChallenge((c) => !c)}
              aria-pressed={challenge}
              className={cx(
                'inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-semibold transition',
                challenge ? 'border-emerald-400 bg-emerald-400/15 text-emerald-200' : 'border-slate-700 text-slate-300 hover:bg-slate-800',
              )}
            >
              {challenge ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              Modo reto: {challenge ? 'activado' : 'ocultar la versión nativa'}
            </button>
          </div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-700 p-10 text-center">
              <p className="text-slate-300">No encontré “{query}” en tu Laboratorio.</p>
              <button
                type="button"
                onClick={() => {
                  setPrefill(query.trim());
                  setMode('add');
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                <Plus className="h-4 w-4" /> Agregarla como nueva keyword
              </button>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filtered.map((t) => (
                <TermCard key={t.id} item={t} status={cardStatus[t.id]} challenge={challenge} onDelete={t.custom ? deleteTerm : null} />
              ))}
            </div>
          )}
        </div>
      )}

      {mode === 'blank' && <FillBlank pool={blankPool} stats={blankStats} setStats={setBlankStats} active={active && mode === 'blank'} />}

      {mode === 'add' && (
        <AddKeyword
          allTerms={allTerms}
          customTerms={customTerms}
          setCustomTerms={setCustomTerms}
          prefill={prefill}
          onDone={() => {
            setQuery('');
            setCategory('all');
            setMode('compare');
          }}
        />
      )}
    </div>
  );
}

/* =========================================================================
 * 3 · CAZATRAMPAS
 * ========================================================================= */

function RuleCard({ rule }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <header className="flex items-start gap-3">
        <span className="etc-display grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-lg font-extrabold text-slate-950">
          {rule.id}
        </span>
        <div className="min-w-0">
          <h3 className="etc-display text-lg font-bold text-white">{rule.title}</h3>
          <p className="text-sm text-slate-400">{rule.subtitle}</p>
        </div>
      </header>
      <p className="text-sm leading-relaxed text-slate-300">{rule.why}</p>
      <div className="grid gap-3">
        <ul className="flex flex-col gap-1.5 rounded-xl border border-emerald-400/25 bg-emerald-400/5 p-3">
          <li className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Así sí</li>
          {rule.correct.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-emerald-100">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> {s}
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-1.5 rounded-xl border border-rose-400/25 bg-rose-400/5 p-3">
          <li className="text-xs font-semibold uppercase tracking-wider text-rose-300">Prohibido</li>
          {rule.wrong.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-rose-200 line-through decoration-rose-300/60">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" /> {s}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-auto flex items-center gap-2 text-sm font-medium text-sky-300">
        <Sparkles className="h-4 w-4 shrink-0" /> {rule.memory}
      </p>
    </article>
  );
}

function Quiz({ quizStats, setQuizStats }) {
  const [phase, setPhase] = useState('intro');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]);

  const start = () => {
    setQuestions(shuffle(QUIZ_QUESTIONS).map((q) => ({ ...q, shuffled: shuffle(q.options) })));
    setIndex(0);
    setPicked(null);
    setAnswers([]);
    setPhase('playing');
  };

  const q = questions[index];
  const choose = (opt) => {
    if (picked || !q) return;
    setPicked(opt);
    setAnswers((a) => [...a, { id: q.id, rule: q.rule, picked: opt, correct: opt === q.answer }]);
  };

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setPicked(null);
      return;
    }
    const score = answers.filter((a) => a.correct).length;
    setQuizStats((prev) => ({
      best: Math.max(prev.best || 0, score),
      attempts: [{ date: dateKey(), score }, ...(prev.attempts || [])].slice(0, 10),
    }));
    setPhase('done');
  };

  if (phase === 'intro') {
    const attempts = quizStats.attempts || [];
    return (
      <div className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-start gap-3">
          <Trophy className="h-8 w-8 shrink-0 text-amber-300" />
          <div>
            <h3 className="etc-display text-2xl font-bold text-white">Quiz del Cazatrampas</h3>
            <p className="mt-1 text-sm text-slate-400">15 preguntas sobre tus 5 Reglas de Oro. Elige cómo lo diría un profesional.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-950/60 p-4">
            <p className="text-xs text-slate-500">Mejor puntaje</p>
            <p className="etc-display text-3xl font-bold text-white">
              {quizStats.best || 0}
              <span className="text-lg text-slate-500">/15</span>
            </p>
          </div>
          <div className="rounded-xl bg-slate-950/60 p-4">
            <p className="text-xs text-slate-500">Intentos recientes</p>
            <p className="etc-mono mt-2 text-sm text-slate-300">{attempts.length ? attempts.slice(0, 5).map((a) => a.score).join(' · ') : 'Ninguno todavía'}</p>
          </div>
        </div>
        <button type="button" onClick={start} className="inline-flex w-fit items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-sky-400">
          <Play className="h-4 w-4" /> Empezar quiz
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    const score = answers.filter((a) => a.correct).length;
    const mistakes = answers.filter((a) => !a.correct).map((a) => ({ ...a, question: QUIZ_QUESTIONS.find((x) => x.id === a.id) }));
    const verdict = score === 15 ? 'Perfecto. Cero trampas.' : score >= 13 ? 'Muy bien: meta del Mes 1 cumplida.' : score >= 10 ? 'Vas bien. Repasa las reglas que fallaste.' : 'Repasa las tarjetas y vuelve a intentarlo.';
    return (
      <div className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Resultado</p>
            <p className="etc-display text-5xl font-extrabold text-white">
              {score}
              <span className="text-2xl text-slate-500">/15</span>
            </p>
            <p className="mt-1 text-sm text-slate-300">{verdict}</p>
          </div>
          <Award className={cx('h-14 w-14', score >= 13 ? 'text-emerald-300' : 'text-slate-600')} />
        </div>
        <div className="flex flex-col gap-2">
          {GOLDEN_RULES.map((r) => {
            const ofRule = answers.filter((a) => a.rule === r.id);
            const ok = ofRule.filter((a) => a.correct).length;
            return (
              <div key={r.id} className="flex items-center gap-3 text-sm">
                <span className="w-44 shrink-0 truncate text-slate-300">
                  {r.id}. {r.title}
                </span>
                <ProgressBar value={ofRule.length ? (ok / ofRule.length) * 100 : 0} tone={ok === ofRule.length ? 'bg-emerald-400' : 'bg-amber-400'} className="flex-1" />
                <span className="etc-mono w-10 text-right text-slate-400">
                  {ok}/{ofRule.length}
                </span>
              </div>
            );
          })}
        </div>
        {mistakes.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-slate-200">Tus trampas de hoy</p>
            <ul className="flex flex-col gap-2">
              {mistakes.map((m) => (
                <li key={m.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-sm">
                  <p className="text-slate-400">{m.question.prompt}</p>
                  <p className="mt-1 text-rose-300 line-through decoration-rose-300/60">{m.picked}</p>
                  <p className="font-semibold text-emerald-300">{m.question.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button type="button" onClick={start} className="inline-flex w-fit items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-sky-400">
          <RefreshCw className="h-4 w-4" /> Repetir quiz
        </button>
      </div>
    );
  }

  const rule = GOLDEN_RULES.find((r) => r.id === q.rule);
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="etc-mono text-slate-400">
          Pregunta {index + 1}/{questions.length}
        </span>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
          Regla {rule.id} · {rule.title}
        </span>
      </div>
      <ProgressBar value={(index / questions.length) * 100} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">¿Cómo lo dices en inglés?</p>
        <p className="etc-display etc-balance mt-2 text-2xl font-semibold text-white">“{q.prompt}”</p>
      </div>
      <div className="flex flex-col gap-2">
        {q.shuffled.map((opt) => {
          const isAnswer = opt === q.answer;
          const isPicked = opt === picked;
          return (
            <button
              key={opt}
              type="button"
              disabled={Boolean(picked)}
              onClick={() => choose(opt)}
              className={cx(
                'flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition',
                !picked && 'border-slate-700 bg-slate-950/50 text-slate-100 hover:border-sky-400/70',
                picked && isAnswer && 'border-emerald-400/70 bg-emerald-400/10 text-emerald-200',
                picked && isPicked && !isAnswer && 'border-rose-400/70 bg-rose-400/10 text-rose-200',
                picked && !isPicked && !isAnswer && 'border-slate-800 text-slate-500',
              )}
            >
              <span>{opt}</span>
              {picked && isAnswer && <CheckCircle2 className="h-5 w-5 shrink-0" />}
              {picked && isPicked && !isAnswer && <XCircle className="h-5 w-5 shrink-0" />}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="etc-pop flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-950/60 p-4">
          <p className="text-sm text-slate-300">
            <span className={cx('font-semibold', picked === q.answer ? 'text-emerald-300' : 'text-rose-300')}>{picked === q.answer ? 'Correcto. ' : 'Trampa. '}</span>
            {q.explain}
          </p>
          <button type="button" onClick={next} className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">
            {index + 1 < questions.length ? 'Siguiente' : 'Ver resultado'} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function TrapDetector() {
  const [text, setText] = useState("I'm agree with the new forecast. Right now I'm working in a report for Groupe SEB.");
  const findings = detectTraps(text);
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-start gap-3">
        <ShieldAlert className="h-7 w-7 shrink-0 text-rose-300" />
        <div>
          <h3 className="etc-display text-xl font-bold text-white">Detector de trampas</h3>
          <p className="mt-1 text-sm text-slate-400">Escribe una frase antes de mandarla por Teams. El detector revisa tus 5 reglas, no toda la gramática.</p>
        </div>
      </div>
      <label htmlFor="etc-trap-text" className="sr-only">
        Frase para revisar
      </label>
      <textarea
        id="etc-trap-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="w-full rounded-xl border border-slate-700 bg-slate-950/70 p-3 leading-relaxed text-slate-100"
      />
      <TrapFindings findings={findings} emptyText={text.trim() ? 'Sin trampas detectadas.' : ''} />
    </div>
  );
}

function Traps({ quizStats, setQuizStats }) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="El Cazatrampas" title="Mis 5 Reglas de Oro">
        Los errores que más se repiten cuando pensamos en español. Apréndelos de memoria y caza cada uno antes de que salga de tu boca.
      </SectionTitle>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {GOLDEN_RULES.map((r) => (
          <RuleCard key={r.id} rule={r} />
        ))}
        <div className="flex flex-col justify-center gap-3 rounded-2xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">
          <p className="etc-display text-lg font-bold text-white">Antes de hablar, pregúntate:</p>
          <p>1. ¿Metí un “to be” que sobra?</p>
          <p>2. ¿Es una sensación? Entonces va con “I am”.</p>
          <p>3. ¿AT la empresa, ON el proyecto?</p>
          <p>4. ¿La descripción va antes del sustantivo?</p>
          <p>5. ¿Mi oración tiene sujeto?</p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Quiz quizStats={quizStats} setQuizStats={setQuizStats} />
        </div>
        <div className="lg:col-span-2">
          <TrapDetector />
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
 * 4 · FLASHCARDS
 * ========================================================================= */

function Flashcards({ allTerms, cardStatus, setCardStatus, active }) {
  const [deckId, setDeckId] = useState('all');
  const [direction, setDirection] = useState('en');
  const [includeMastered, setIncludeMastered] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [session, setSession] = useState({ mastered: 0, review: 0 });
  const statusRef = useRef(cardStatus);
  statusRef.current = cardStatus;

  const cards = useMemo(
    () => [
      ...allTerms.map((t) => ({ id: t.id, kind: 'lab', category: t.category, front: t.term, back: t.meaning, example: t.example, marks: t.highlight || t.term.split('/').map((s) => s.trim()) })),
      ...PAST_VERBS.map((v) => ({ id: v.id, kind: 'past', category: 'past', front: v.term, back: v.meaning, example: v.example, base: v.base, irregular: v.irregular, marks: [v.term] })),
    ],
    [allTerms],
  );

  const inDeck = useCallback(
    (c, status) =>
      deckId === 'all' || (deckId === 'lab' && c.kind === 'lab') || (deckId === 'past' && c.kind === 'past') || (deckId === 'review' && status[c.id] === 'review'),
    [deckId],
  );

  const buildQueue = useCallback(() => {
    const status = statusRef.current;
    const pool = cards.filter((c) => inDeck(c, status) && (includeMastered || status[c.id] !== 'mastered'));
    const review = shuffle(pool.filter((c) => status[c.id] === 'review'));
    const rest = shuffle(pool.filter((c) => status[c.id] !== 'review'));
    return [...review, ...rest].map((c) => c.id);
  }, [cards, inDeck, includeMastered]);

  const [queue, setQueue] = useState(() => buildQueue());
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setQueue(buildQueue());
    setFlipped(false);
    setSession({ mastered: 0, review: 0 });
  }, [buildQueue]);

  const current = cards.find((c) => c.id === queue[0]);
  const deckCards = cards.filter((c) => inDeck(c, cardStatus));
  const masteredInDeck = deckCards.filter((c) => cardStatus[c.id] === 'mastered').length;
  const reviewInDeck = deckCards.filter((c) => cardStatus[c.id] === 'review').length;

  const mark = useCallback(
    (status) => {
      const id = queue[0];
      if (!id) return;
      setCardStatus((prev) => ({ ...prev, [id]: status }));
      setQueue((prev) => {
        const [first, ...rest] = prev;
        if (status === 'mastered') return rest;
        const pos = Math.min(3, rest.length);
        return [...rest.slice(0, pos), first, ...rest.slice(pos)];
      });
      setSession((s) => ({ ...s, [status]: s[status] + 1 }));
      setFlipped(false);
    },
    [queue, setCardStatus],
  );

  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === ' ' || e.key === 'Enter') {
        if (tag === 'BUTTON') return;
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === 'ArrowLeft' || e.key === '1') {
        e.preventDefault();
        mark('review');
      } else if (e.key === 'ArrowRight' || e.key === '2') {
        e.preventDefault();
        mark('mastered');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, mark]);

  const decks = [
    { id: 'all', label: 'Todo', count: cards.length },
    { id: 'lab', label: 'Laboratorio', count: cards.filter((c) => c.kind === 'lab').length },
    { id: 'past', label: 'Verbos en pasado', count: PAST_VERBS.length },
    { id: 'review', label: 'Mis “Repasar”', count: cards.filter((c) => cardStatus[c.id] === 'review').length },
  ];

  const frontText = current ? (direction === 'en' ? current.front : current.back) : '';
  const backText = current ? (direction === 'en' ? current.back : current.front) : '';

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Repetición espaciada" title="Flashcards: Domina o Repasa">
        Voltea la tarjeta, sé honesto y elige. Las que marcas “Repasar” regresan en 3 tarjetas; las que dominas salen de la sesión.
      </SectionTitle>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {decks.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDeckId(d.id)}
              aria-pressed={deckId === d.id}
              className={cx(
                'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition',
                deckId === d.id ? 'border-sky-400 bg-sky-400/15 text-sky-200' : 'border-slate-700 text-slate-300 hover:border-slate-500',
              )}
            >
              {d.label} <span className="etc-mono text-xs text-slate-500">{d.count}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setDirection((d) => (d === 'en' ? 'es' : 'en'));
              setFlipped(false);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-1.5 text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4" /> {direction === 'en' ? 'Inglés → Español' : 'Español → Inglés'}
          </button>
          <button
            type="button"
            onClick={() => setIncludeMastered((v) => !v)}
            aria-pressed={includeMastered}
            className={cx(
              'inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-semibold transition',
              includeMastered ? 'border-emerald-400 bg-emerald-400/15 text-emerald-200' : 'border-slate-700 text-slate-300 hover:bg-slate-800',
            )}
          >
            <ListChecks className="h-4 w-4" /> Incluir dominadas
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {current ? (
            <>
              <div className="etc-flip-scene h-72 sm:h-80">
                <div
                  key={current.id}
                  role="button"
                  tabIndex={0}
                  aria-label={flipped ? 'Tarjeta volteada. Toca para ver el frente' : 'Toca para voltear la tarjeta'}
                  onClick={() => setFlipped((f) => !f)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setFlipped((f) => !f);
                    }
                  }}
                  className={cx('etc-flip-card cursor-pointer', flipped && 'is-flipped')}
                >
                  <div className="etc-flip-face flex flex-col justify-between rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-2">
                      <CategoryChip id={current.category} />
                      <StatusChip status={cardStatus[current.id]} />
                    </div>
                    <p className="etc-display etc-balance text-center text-4xl font-extrabold text-white sm:text-5xl">{frontText}</p>
                    <p className="text-center text-xs text-slate-500">Toca o presiona Espacio para voltear</p>
                  </div>
                  <div className="etc-flip-face etc-flip-back flex flex-col justify-center gap-4 overflow-y-auto rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-slate-900 to-emerald-950 p-6 sm:p-8">
                    <p className="etc-display etc-balance text-center text-3xl font-bold text-emerald-200 sm:text-4xl">{backText}</p>
                    {current.kind === 'past' && (
                      <p className="text-center text-sm text-slate-300">
                        {current.base} → <span className="font-semibold text-white">{current.front}</span>
                        {current.irregular && <span className="ml-2 rounded-full bg-amber-400/15 px-2 py-0.5 text-xs font-semibold text-amber-300">irregular</span>}
                      </p>
                    )}
                    {current.example && (
                      <p className="text-center text-sm italic leading-relaxed text-slate-300">
                        “<Highlight text={current.example} terms={current.marks} />”
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => mark('review')}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-5 py-3 font-semibold text-amber-200 transition hover:bg-amber-400/20 sm:flex-none"
                >
                  <Repeat className="h-5 w-5" /> Repasar
                </button>
                <SpeakButton text={current.kind === 'past' ? `${current.front}. ${current.example}` : `${current.front}. ${current.example || ''}`} className="h-12 w-12" />
                <button
                  type="button"
                  onClick={() => mark('mastered')}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 sm:flex-none"
                >
                  <Check className="h-5 w-5" /> La domino
                </button>
              </div>
              <p className="hidden items-center justify-center gap-1.5 text-xs text-slate-500 sm:flex">
                <Keyboard className="h-3.5 w-3.5" /> ← Repasar · Espacio voltear · → La domino
              </p>
            </>
          ) : (
            <div className="flex h-72 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-700 p-8 text-center sm:h-80">
              <Award className="h-12 w-12 text-emerald-300" />
              <p className="etc-display text-2xl font-bold text-white">{deckCards.length ? 'Sesión terminada' : 'Este mazo está vacío'}</p>
              <p className="max-w-sm text-sm text-slate-400">
                {deckCards.length
                  ? `Dominaste ${session.mastered} y marcaste ${session.review} para repasar. Vuelve mañana o incluye las dominadas para un repaso total.`
                  : 'Cuando marques tarjetas como “Repasar”, aparecerán aquí.'}
              </p>
              {deckCards.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQueue(buildQueue());
                      setSession({ mastered: 0, review: 0 });
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
                  >
                    <RefreshCw className="h-4 w-4" /> Otra ronda
                  </button>
                  {!includeMastered && (
                    <button type="button" onClick={() => setIncludeMastered(true)} className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800">
                      Repasar todo el mazo
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Este mazo</p>
            <p className="etc-display mt-2 text-4xl font-bold text-white">
              {masteredInDeck}
              <span className="text-xl text-slate-500">/{deckCards.length}</span>
            </p>
            <p className="text-sm text-slate-400">dominadas</p>
            <ProgressBar value={deckCards.length ? (masteredInDeck / deckCards.length) * 100 : 0} tone="bg-emerald-400" className="mt-3" />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-slate-950/60 p-2">
                <p className="etc-mono text-lg font-bold text-emerald-300">{masteredInDeck}</p>
                <p className="text-slate-500">Dominadas</p>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-2">
                <p className="etc-mono text-lg font-bold text-amber-300">{reviewInDeck}</p>
                <p className="text-slate-500">Repasar</p>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-2">
                <p className="etc-mono text-lg font-bold text-slate-200">{deckCards.length - masteredInDeck - reviewInDeck}</p>
                <p className="text-slate-500">Nuevas</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-400">
            <p className="flex items-center gap-2 font-semibold text-slate-200">
              <Clock className="h-4 w-4 text-sky-300" /> En esta sesión
            </p>
            <p className="mt-2">
              Quedan <span className="etc-mono text-white">{queue.length}</span> tarjetas · dominaste <span className="etc-mono text-emerald-300">{session.mastered}</span> · repasaste{' '}
              <span className="etc-mono text-amber-300">{session.review}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm font-semibold text-slate-200">Mis verbos diarios en pasado</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {PAST_VERBS.map((v) => (
                <span
                  key={v.id}
                  className={cx(
                    'rounded-full border px-2.5 py-0.5 text-xs',
                    cardStatus[v.id] === 'mastered' ? 'border-emerald-400/40 text-emerald-300' : 'border-slate-700 text-slate-400',
                  )}
                >
                  {v.term}
                </span>
              ))}
            </div>
          </div>
          <ConfirmButton
            onConfirm={() => {
              setCardStatus((prev) => {
                const nextStatus = { ...prev };
                deckCards.forEach((c) => delete nextStatus[c.id]);
                statusRef.current = nextStatus;
                return nextStatus;
              });
              setQueue(shuffle(cards.filter((c) => inDeck(c, {}))).map((c) => c.id));
              setSession({ mastered: 0, review: 0 });
            }}
            label="Reiniciar este mazo"
            confirmLabel="¿Reiniciar el progreso del mazo?"
            icon={RotateCcw}
            className="w-fit"
          />
        </aside>
      </div>
    </div>
  );
}

/* =========================================================================
 * 5 · DAILY STANDUP
 * ========================================================================= */

function buildStandupScript(s) {
  const pick = (list, ids) => list.filter((o) => ids.includes(o.id)).map((o) => o.text);
  const clean = (t) => t.trim().replace(/[.!]+$/, '');
  const yesterday = pick(STANDUP_YESTERDAY, s.yesterday);
  if (s.extraYesterday.trim()) yesterday.push(clean(s.extraYesterday).replace(/^i\s+/i, ''));
  const today = pick(STANDUP_TODAY, s.today);
  if (s.extraToday.trim()) today.push(clean(s.extraToday).replace(/^(i'?m going to|i am going to|i will|i'll)\s+/i, ''));
  const blocker = STANDUP_BLOCKERS.find((b) => b.id === s.blocker) || STANDUP_BLOCKERS[0];
  const closing = STANDUP_CLOSINGS.find((c) => c.id === s.closing) || STANDUP_CLOSINGS[0];

  if (s.format === 'teams') {
    const lines = ['Hi team! Quick update on the Gross Sales Report automation:'];
    if (yesterday.length) lines.push('', 'Yesterday:', ...yesterday.map((x) => `• ${cap(x)}`));
    if (today.length) lines.push('', 'Today:', ...today.map((x) => `• ${cap(x)}`));
    lines.push('', 'Blockers:', `• ${blocker.id === 'b-none' ? 'None for now. Everything is on track.' : blocker.text}`);
    lines.push('', closing.text);
    return lines.join('\n');
  }

  const parts = ["Good morning, everyone. Here's my update on the Gross Sales Report automation."];
  if (yesterday.length) parts.push(`Yesterday, I ${joinList(yesterday)}.`);
  if (today.length) parts.push(`Today, I'm going to ${joinList(today)}.`);
  parts.push(blocker.id === 'b-none' ? blocker.text : `I have one blocker. ${blocker.text}`);
  parts.push(closing.text);
  return parts.join('\n\n');
}

function OptionChip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cx(
        'flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm transition',
        selected ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-100' : 'border-slate-700 bg-slate-950/40 text-slate-300 hover:border-slate-500',
      )}
    >
      <span className={cx('mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border', selected ? 'border-emerald-400 bg-emerald-400 text-slate-950' : 'border-slate-600')}>
        {selected && <Check className="h-3 w-3" />}
      </span>
      <span className="min-w-0">{children}</span>
    </button>
  );
}

function Standup({ standup, setStandup, standupCount, setStandupCount }) {
  const s = { ...DEFAULT_STANDUP, ...standup };
  const [copyState, setCopyState] = useState('');
  const previewRef = useRef(null);
  const update = (patch) => setStandup((prev) => ({ ...DEFAULT_STANDUP, ...prev, ...patch }));
  const toggle = (field, id) => update({ [field]: s[field].includes(id) ? s[field].filter((x) => x !== id) : [...s[field], id] });
  const script = useMemo(() => buildStandupScript(s), [standup]); // eslint-disable-line react-hooks/exhaustive-deps
  const words = script.split(/\s+/).filter(Boolean).length;
  const extraTraps = detectTraps(`${s.extraYesterday}. ${s.extraToday}`);

  const usedTerms = useMemo(() => {
    const ids = new Set();
    [...STANDUP_YESTERDAY.filter((o) => s.yesterday.includes(o.id)), ...STANDUP_TODAY.filter((o) => s.today.includes(o.id))].forEach((o) => o.uses.forEach((u) => ids.add(u)));
    const blocker = STANDUP_BLOCKERS.find((b) => b.id === s.blocker);
    const closing = STANDUP_CLOSINGS.find((c) => c.id === s.closing);
    [blocker, closing].forEach((o) => o && o.uses.forEach((u) => ids.add(u)));
    return [...ids].map((id) => TERM_BY_ID[id]).filter(Boolean);
  }, [standup]); // eslint-disable-line react-hooks/exhaustive-deps

  const copy = () => {
    copyText(script, previewRef.current).then((result) => {
      setCopyState(result);
      if (result === 'copied') setStandupCount((n) => n + 1);
      setTimeout(() => setCopyState(''), 2500);
    });
  };

  const inputCls = 'w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600';

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Mis juntas en Groupe SEB" title="Generador de Daily Standup">
        Elige qué hiciste ayer, qué harás hoy y si algo te bloquea. El script sale en inglés natural, con los phrasal verbs y keywords del Laboratorio.
      </SectionTitle>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-6 lg:col-span-3">
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 flex items-center gap-2 font-semibold text-white">
              <span className="etc-mono grid h-6 w-6 place-items-center rounded-md bg-sky-500 text-xs font-bold text-slate-950">1</span> Yesterday · ¿Qué hiciste ayer?
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {STANDUP_YESTERDAY.map((o) => (
                <OptionChip key={o.id} selected={s.yesterday.includes(o.id)} onClick={() => toggle('yesterday', o.id)}>
                  {cap(o.text)}
                </OptionChip>
              ))}
            </div>
            <label htmlFor="etc-extra-yesterday" className="text-xs text-slate-400">
              Otra cosa que hiciste (en pasado, en inglés)
            </label>
            <input id="etc-extra-yesterday" value={s.extraYesterday} onChange={(e) => update({ extraYesterday: e.target.value })} placeholder="Ej: fixed the date format in the macro" className={inputCls} />
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 flex items-center gap-2 font-semibold text-white">
              <span className="etc-mono grid h-6 w-6 place-items-center rounded-md bg-sky-500 text-xs font-bold text-slate-950">2</span> Today · ¿Qué harás hoy en tu proyecto?
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {STANDUP_TODAY.map((o) => (
                <OptionChip key={o.id} selected={s.today.includes(o.id)} onClick={() => toggle('today', o.id)}>
                  {cap(o.text)}
                </OptionChip>
              ))}
            </div>
            <label htmlFor="etc-extra-today" className="text-xs text-slate-400">
              Otra tarea de hoy (verbo en forma base)
            </label>
            <input id="etc-extra-today" value={s.extraToday} onChange={(e) => update({ extraToday: e.target.value })} placeholder="Ej: review the template with my manager" className={inputCls} />
            <TrapFindings findings={extraTraps} />
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 flex items-center gap-2 font-semibold text-white">
              <span className="etc-mono grid h-6 w-6 place-items-center rounded-md bg-sky-500 text-xs font-bold text-slate-950">3</span> Blockers · ¿Hay un cuello de botella?
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {STANDUP_BLOCKERS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => update({ blocker: b.id })}
                  aria-pressed={s.blocker === b.id}
                  className={cx(
                    'flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm transition',
                    s.blocker === b.id ? 'border-sky-400/70 bg-sky-400/10 text-sky-100' : 'border-slate-700 bg-slate-950/40 text-slate-300 hover:border-slate-500',
                  )}
                >
                  <span className={cx('grid h-4 w-4 shrink-0 place-items-center rounded-full border', s.blocker === b.id ? 'border-sky-400' : 'border-slate-600')}>
                    {s.blocker === b.id && <span className="h-2 w-2 rounded-full bg-sky-400" />}
                  </span>
                  {b.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 flex items-center gap-2 font-semibold text-white">
              <span className="etc-mono grid h-6 w-6 place-items-center rounded-md bg-sky-500 text-xs font-bold text-slate-950">4</span> Cierre con conector ejecutivo
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {STANDUP_CLOSINGS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => update({ closing: c.id })}
                  aria-pressed={s.closing === c.id}
                  className={cx(
                    'rounded-xl border px-3.5 py-2.5 text-left text-sm transition',
                    s.closing === c.id ? 'border-sky-400/70 bg-sky-400/10 text-sky-100' : 'border-slate-700 bg-slate-950/40 text-slate-300 hover:border-slate-500',
                  )}
                >
                  {c.text}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="lg:col-span-2">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 lg:sticky lg:top-32">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Tu script</p>
              <div className="inline-flex rounded-xl border border-slate-700 p-0.5 text-xs font-semibold" role="tablist" aria-label="Formato del script">
                {[
                  { id: 'spoken', label: 'Junta (en voz alta)' },
                  { id: 'teams', label: 'Mensaje de Teams' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={s.format === f.id}
                    onClick={() => update({ format: f.id })}
                    className={cx('rounded-lg px-2.5 py-1 transition', s.format === f.id ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-white')}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div ref={previewRef} className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-relaxed text-slate-100">
              {script}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400">
                <Copy className="h-4 w-4" /> {copyState === 'copied' ? 'Copiado' : 'Copiar script'}
              </button>
              <SpeakButton text={script} label="Escuchar el script para practicar" />
              <span className="text-xs text-slate-500">
                ~{Math.max(10, Math.round(words / 2.3))} s en voz alta · {words} palabras
              </span>
            </div>
            {copyState === 'selected' && <p className="text-xs text-amber-300">Texto seleccionado: cópialo con Ctrl+C o mantén presionado en el celular.</p>}
            {usedTerms.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-slate-800 pt-3">
                <p className="text-xs text-slate-400">
                  Usaste <span className="font-semibold text-white">{usedTerms.length}</span> keywords del Laboratorio
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {usedTerms.map((t) => (
                    <span key={t.id} className={cx('rounded-full border px-2.5 py-0.5 text-xs', CATEGORY_STYLE[t.category].chip)}>
                      {t.term}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-slate-500">Standups copiados: {standupCount}. Meta del Mes 2: 3 por semana.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* =========================================================================
 * 6 · ROADMAP
 * ========================================================================= */

function Roadmap({ program, roadmapDone, setRoadmapDone, hintFor }) {
  const totalItems = ROADMAP.reduce((n, m) => n + m.items.length, 0);
  const doneItems = ROADMAP.reduce((n, m) => n + m.items.filter((i) => roadmapDone[i.id]).length, 0);
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Hoja de ruta" title="De A2 a B2 en 6 meses">
        Seis etapas, una por mes. Marca cada meta cuando la cumplas de verdad; donde la app puede medir tu avance, te lo muestra debajo.
      </SectionTitle>

      <section className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="etc-display text-3xl font-bold text-white">
            {doneItems}
            <span className="text-lg text-slate-500">/{totalItems} metas</span>
          </p>
          <p className="text-sm text-slate-400">{program.notStarted ? 'El plan aún no empieza' : `Estás en el Mes ${program.month}`}</p>
        </div>
        <ProgressBar value={(doneItems / totalItems) * 100} tone="bg-gradient-to-r from-sky-500 to-emerald-400" />
        <ol className="etc-scroll-x flex gap-2">
          {ROADMAP.map((m) => {
            const isCurrent = !program.notStarted && m.month === program.month;
            const past = !program.notStarted && m.month < program.month;
            return (
              <li
                key={m.month}
                className={cx(
                  'flex min-w-28 flex-1 flex-col gap-1 rounded-xl border px-3 py-2',
                  isCurrent ? 'border-sky-400 bg-sky-400/10' : past ? 'border-emerald-400/30 bg-emerald-400/5' : 'border-slate-800',
                )}
              >
                <span className="text-xs text-slate-500">Mes {m.month}</span>
                <span className={cx('etc-mono text-sm font-bold', isCurrent ? 'text-sky-200' : past ? 'text-emerald-300' : 'text-slate-300')}>{m.level}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ROADMAP.map((m) => {
          const win = monthWindow(program.start, m.month);
          const done = m.items.filter((i) => roadmapDone[i.id]).length;
          const isCurrent = !program.notStarted && m.month === program.month;
          return (
            <article key={m.month} className={cx('flex flex-col gap-4 rounded-2xl border p-5', isCurrent ? 'border-sky-400/60 bg-sky-400/5' : 'border-slate-800 bg-slate-900/60')}>
              <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Mes {m.month} · {formatShort(win.from)} – {formatShort(win.to)}
                    {isCurrent && <span className="rounded-full bg-sky-400 px-2 py-0.5 text-xs font-bold normal-case tracking-normal text-slate-950">Mes actual</span>}
                  </p>
                  <h3 className="etc-display mt-1 text-xl font-bold text-white">{m.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{m.focus}</p>
                </div>
                <span className="etc-mono shrink-0 rounded-lg bg-slate-800 px-2 py-1 text-xs font-bold text-slate-200">{m.level}</span>
              </header>
              <div className="flex items-center gap-3">
                <ProgressBar value={(done / m.items.length) * 100} tone={done === m.items.length ? 'bg-emerald-400' : 'bg-sky-400'} className="flex-1" />
                <span className="etc-mono text-xs text-slate-400">
                  {done}/{m.items.length}
                </span>
              </div>
              <ul className="flex flex-col gap-1">
                {m.items.map((item) => {
                  const checked = Boolean(roadmapDone[item.id]);
                  const hint = item.hint ? hintFor(item.hint, m.month) : '';
                  return (
                    <li key={item.id}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-800/50">
                        <input
                          type="checkbox"
                          id={`etc-${item.id}`}
                          checked={checked}
                          onChange={() => setRoadmapDone((prev) => ({ ...prev, [item.id]: !checked }))}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-400"
                        />
                        <span className="min-w-0">
                          <span className={cx('text-sm leading-snug', checked ? 'text-slate-500 line-through' : 'text-slate-200')}>{item.text}</span>
                          {hint && <span className="mt-0.5 block text-xs text-sky-300">{hint}</span>}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
 * APP
 * ========================================================================= */

function useTodayKey() {
  const [key, setKey] = useState(() => dateKey());
  useEffect(() => {
    const id = setInterval(() => setKey(dateKey()), 30000);
    return () => clearInterval(id);
  }, []);
  return key;
}

export default function EnglishTrainingCenter() {
  const todayKey = useTodayKey();
  const [tab, setTab] = usePersistentState('tab', 'dashboard');
  const [startDate, setStartDate] = usePersistentState('startDate', () => dateKey());
  const [routineLog, setRoutineLog] = usePersistentState('routineLog', {});
  const [timer, setTimer] = usePersistentState('timer', null);
  const [customTerms, setCustomTerms] = usePersistentState('customTerms', []);
  const [cardStatus, setCardStatus] = usePersistentState('cardStatus', {});
  const [quizStats, setQuizStats] = usePersistentState('quizStats', { best: 0, attempts: [] });
  const [blankStats, setBlankStats] = usePersistentState('blankStats', { answered: 0, correct: 0, currentStreak: 0, bestStreak: 0 });
  const [roadmapDone, setRoadmapDone] = usePersistentState('roadmap', {});
  const [standup, setStandup] = usePersistentState('standup', DEFAULT_STANDUP);
  const [standupCount, setStandupCount] = usePersistentState('standupCount', 0);
  const [journal, setJournal] = usePersistentState('journal', {});
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    try {
      const fromHash = window.location.hash.replace('#', '');
      if (TABS.some((t) => t.id === fromHash)) setTab(fromHash);
    } catch (e) {
      /* Sin hash disponible. */
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = useCallback(
    (id) => {
      setTab(id);
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        /* Sin scroll. */
      }
    },
    [setTab],
  );

  /* ---------- Temporizador de la rutina ---------- */
  useEffect(() => {
    if (!timer) return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [timer]);

  const updateBlock = useCallback(
    (key, blockId, patch) =>
      setRoutineLog((prev) => {
        const day = prev[key] || {};
        return { ...prev, [key]: { ...day, [blockId]: { ...(day[blockId] || {}), ...patch } } };
      }),
    [setRoutineLog],
  );

  useEffect(() => {
    if (timer && now >= timer.endsAt) {
      updateBlock(timer.dateKey, timer.blockId, { done: true, secondsLeft: 0 });
      setTimer(null);
      playChime();
    }
  }, [now, timer, updateBlock, setTimer]);

  const secondsLeftOf = (t) => Math.max(0, Math.ceil((t.endsAt - Date.now()) / 1000));

  const routine = {
    remainingFor: (blockId) => {
      const total = BLOCK_BY_ID[blockId].minutes * 60;
      if (timer && timer.blockId === blockId && timer.dateKey === todayKey) return Math.max(0, Math.ceil((timer.endsAt - now) / 1000));
      const entry = routineLog[todayKey] && routineLog[todayKey][blockId];
      if (entry && entry.done) return 0;
      return entry && typeof entry.secondsLeft === 'number' && entry.secondsLeft > 0 ? entry.secondsLeft : total;
    },
    isRunning: (blockId) => Boolean(timer && timer.blockId === blockId && timer.dateKey === todayKey),
    start: (blockId) => {
      unlockAudio();
      const total = BLOCK_BY_ID[blockId].minutes * 60;
      if (timer) updateBlock(timer.dateKey, timer.blockId, { secondsLeft: secondsLeftOf(timer) });
      const entry = routineLog[todayKey] && routineLog[todayKey][blockId];
      const remaining = entry && !entry.done && entry.secondsLeft > 0 ? entry.secondsLeft : total;
      if (entry && entry.done) updateBlock(todayKey, blockId, { done: false, secondsLeft: total });
      setTimer({ blockId, dateKey: todayKey, endsAt: Date.now() + remaining * 1000 });
    },
    pause: () => {
      if (!timer) return;
      updateBlock(timer.dateKey, timer.blockId, { secondsLeft: secondsLeftOf(timer) });
      setTimer(null);
    },
    reset: (blockId) => {
      if (timer && timer.blockId === blockId) setTimer(null);
      updateBlock(todayKey, blockId, { done: false, secondsLeft: BLOCK_BY_ID[blockId].minutes * 60 });
    },
    toggleDone: (blockId) => {
      const done = !blockDone(routineLog[todayKey], blockId);
      if (timer && timer.blockId === blockId) setTimer(null);
      updateBlock(todayKey, blockId, { done, secondsLeft: done ? 0 : BLOCK_BY_ID[blockId].minutes * 60 });
    },
  };

  /* ---------- Datos derivados ---------- */
  const allTerms = useMemo(() => {
    const custom = (Array.isArray(customTerms) ? customTerms : []).filter((t) => t && t.term && CATEGORY_BY_ID[t.category]).map((t) => ({ ...t, custom: true }));
    const merged = [...TERMS, ...custom];
    return merged.map((t) => (t.custom ? { ...t, blank: makeCustomBlank(t, merged) } : t));
  }, [customTerms]);

  const program = useMemo(() => getProgram(startDate, todayKey), [startDate, todayKey]);
  const streak = useMemo(() => computeStreak(routineLog, todayKey), [routineLog, todayKey]);
  const bestStreak = useMemo(() => Math.max(computeBestStreak(routineLog), streak), [routineLog, streak]);
  const completedDays = useMemo(() => Object.keys(routineLog).filter((k) => isDayComplete(routineLog[k])).length, [routineLog]);

  const mastery = useMemo(() => {
    const by = { office: [0, 0], logistics: [0, 0], data: [0, 0], connectors: [0, 0], past: [0, 0] };
    allTerms.forEach((t) => {
      by[t.category][1] += 1;
      if (cardStatus[t.id] === 'mastered') by[t.category][0] += 1;
    });
    PAST_VERBS.forEach((v) => {
      by.past[1] += 1;
      if (cardStatus[v.id] === 'mastered') by.past[0] += 1;
    });
    const mastered = Object.values(by).reduce((n, [m]) => n + m, 0);
    const total = Object.values(by).reduce((n, [, t]) => n + t, 0);
    return { by, mastered, total };
  }, [allTerms, cardStatus]);

  const roadmapTotal = ROADMAP.reduce((n, m) => n + m.items.length, 0);
  const roadmapPct = (ROADMAP.reduce((n, m) => n + m.items.filter((i) => roadmapDone[i.id]).length, 0) / roadmapTotal) * 100;

  const hintFor = (hint, month) => {
    const { by } = mastery;
    switch (hint) {
      case 'routineMonth': {
        const win = monthWindow(program.start, month);
        const from = dateKey(win.from);
        const to = dateKey(win.to);
        const n = Object.keys(routineLog).filter((k) => k >= from && k <= to && isDayComplete(routineLog[k])).length;
        return `${n} ${n === 1 ? 'día completo' : 'días completos'} en este mes`;
      }
      case 'quizBest':
        return `Tu mejor puntaje: ${quizStats.best || 0}/15`;
      case 'masteredOffice':
        return `${by.office[0]}/${by.office[1]} dominadas`;
      case 'masteredLogistics':
        return `${by.logistics[0]}/${by.logistics[1]} dominadas`;
      case 'masteredDataConn':
        return `${by.data[0] + by.connectors[0]}/${by.data[1] + by.connectors[1]} dominadas`;
      case 'masteredAll':
        return `${mastery.mastered}/${mastery.total} dominadas`;
      case 'customCount':
        return `${customTerms.length} keywords propias`;
      case 'standupCount':
        return `${standupCount} standups copiados`;
      default:
        return '';
    }
  };

  /* ---------- Respaldo ---------- */
  const setters = {
    startDate: setStartDate,
    routineLog: setRoutineLog,
    customTerms: setCustomTerms,
    cardStatus: setCardStatus,
    quizStats: setQuizStats,
    blankStats: setBlankStats,
    roadmap: setRoadmapDone,
    standup: setStandup,
    standupCount: setStandupCount,
    journal: setJournal,
  };
  const values = { startDate, routineLog, customTerms, cardStatus, quizStats, blankStats, roadmap: roadmapDone, standup, standupCount, journal };
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const exportData = useCallback(() => ({ app: 'emiliano-english-training-center', version: 1, exportedAt: new Date().toISOString(), data: valuesRef.current }), []);
  const importData = (text) => {
    try {
      const parsed = JSON.parse(text);
      const data = parsed && parsed.data;
      if (!isPlainObject(data)) return false;
      const valid = Object.keys(PERSISTED_KEYS).filter((k) => k in data && PERSISTED_KEYS[k](data[k]));
      if (!valid.length) return false;
      valid.forEach((k) => setters[k](data[k]));
      setTimer(null);
      return true;
    } catch (e) {
      return false;
    }
  };
  const resetAll = () => {
    setTimer(null);
    setStartDate(dateKey());
    setRoutineLog({});
    setCustomTerms([]);
    setCardStatus({});
    setQuizStats({ best: 0, attempts: [] });
    setBlankStats({ answered: 0, correct: 0, currentStreak: 0, bestStreak: 0 });
    setRoadmapDone({});
    setStandup(DEFAULT_STANDUP);
    setStandupCount(0);
    setJournal({});
  };

  const runningBlock = timer ? BLOCK_BY_ID[timer.blockId] : null;
  const runningLeft = timer ? Math.max(0, Math.ceil((timer.endsAt - now) / 1000)) : 0;

  return (
    <div className="etc-root min-h-screen bg-slate-950 text-slate-100">
      <style>{GLOBAL_CSS}</style>

      <header className="etc-sticky z-30 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur">
        <div className="etc-gutter mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-3 py-3">
            <button type="button" onClick={() => goTo('dashboard')} className="flex min-w-0 items-center gap-3 text-left">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-slate-950">
                <Waves className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="etc-display block truncate text-base font-bold text-white sm:text-lg">English Training Center</span>
                <span className="block truncate text-xs text-slate-400">Emiliano · Logistics Trainee @ Groupe SEB</span>
              </span>
            </button>
            <div className="flex shrink-0 items-center gap-2">
              {runningBlock && (
                <button
                  type="button"
                  onClick={() => goTo('dashboard')}
                  className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1 text-sm font-semibold text-sky-200"
                  title="Ir al temporizador"
                >
                  <Timer className="h-4 w-4" />
                  <span className="hidden sm:inline">{runningBlock.label}</span>
                  <span className="etc-mono">{formatClock(runningLeft)}</span>
                </button>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-200" title="Días seguidos con la rutina completa">
                <Flame className="h-4 w-4" />
                <span className="etc-mono">{streak}</span>
              </span>
            </div>
          </div>
          <nav className="etc-scroll-x -mb-px flex gap-1" role="tablist" aria-label="Módulos">
            {TABS.map((t) => {
              const Icon = t.icon;
              const selected = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => goTo(t.id)}
                  className={cx(
                    'inline-flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold transition',
                    selected ? 'border-sky-400 text-white' : 'border-transparent text-slate-400 hover:text-slate-200',
                  )}
                >
                  <Icon className={cx('h-4 w-4', selected ? 'text-sky-300' : '')} />
                  <span className="sm:hidden">{t.short}</span>
                  <span className="hidden sm:inline">{t.label}</span>
                  {t.star && <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="etc-gutter mx-auto max-w-6xl pb-16 pt-6 sm:pt-8">
        <div hidden={tab !== 'dashboard'}>
          <Dashboard
            program={program}
            todayKey={todayKey}
            routineLog={routineLog}
            routine={routine}
            streak={streak}
            bestStreak={bestStreak}
            completedDays={completedDays}
            mastery={mastery}
            quizBest={quizStats.best || 0}
            roadmapPct={roadmapPct}
            journal={journal}
            setJournal={setJournal}
            allTerms={allTerms}
            goTo={goTo}
            settings={{ startDate, setStartDate, exportData, importData, resetAll }}
          />
        </div>
        <div hidden={tab !== 'lab'}>
          <Lab
            allTerms={allTerms}
            cardStatus={cardStatus}
            customTerms={customTerms}
            setCustomTerms={setCustomTerms}
            blankStats={blankStats}
            setBlankStats={setBlankStats}
            active={tab === 'lab'}
          />
        </div>
        <div hidden={tab !== 'traps'}>
          <Traps quizStats={quizStats} setQuizStats={setQuizStats} />
        </div>
        <div hidden={tab !== 'cards'}>
          <Flashcards allTerms={allTerms} cardStatus={cardStatus} setCardStatus={setCardStatus} active={tab === 'cards'} />
        </div>
        <div hidden={tab !== 'standup'}>
          <Standup standup={standup} setStandup={setStandup} standupCount={standupCount} setStandupCount={setStandupCount} />
        </div>
        <div hidden={tab !== 'roadmap'}>
          <Roadmap program={program} roadmapDone={roadmapDone} setRoadmapDone={setRoadmapDone} hintFor={hintFor} />
        </div>
      </main>

      <footer className="etc-gutter mx-auto max-w-6xl border-t border-slate-800 pb-10 pt-6 text-xs text-slate-500">
        <p>Tu progreso se guarda en este navegador. Usa “Ajustes y respaldo” en el Dashboard para pasarlo a otro dispositivo.</p>
      </footer>
    </div>
  );
}
