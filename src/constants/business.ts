// ─── Validation ───
export const MAX_ORDER_QUANTITY = 50;
export const MIN_ORDER_QUANTITY = 1;
export const MAX_NOTE_LENGTH = 500;
export const MIN_NAME_LENGTH = 2;
export const MIN_MESSAGE_LENGTH = 10;
export const PHONE_REGEX_AR = /^\+?54\s?9?\s?\d{2,4}\s?\d{4}[\s-]?\d{4}$/;

// ─── Delivery Zones ───
export const DELIVERY_ZONES = [
  'CABA',
  'Zona Norte',
  'Zona Oeste',
  'Zona Sur',
  'La Plata',
  'Otros',
] as const;

export type DeliveryZone = (typeof DELIVERY_ZONES)[number];

// ─── Contact ───
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '5491112345678';
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://huevospoint.com.ar';

// ─── Product units ───
export const PRODUCT_UNITS = ['unidad', 'media_docena', 'docena', 'maple'] as const;
export const PRODUCT_CATEGORIES = ['campo_libre', 'organico', 'especial', 'premium'] as const;

// ─── Marquee ───
export const MARQUEE_TEXT = 'HUEVOS POINT • PREMIUM EGGS • FARM TO TABLE • CALIDAD SUPERIOR • ';

// ─── Process Steps ───
export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Recolección',
    description: 'Huevos recolectados a mano cada mañana de gallinas en libertad.',
  },
  {
    number: '02',
    title: 'Selección y Clasificación',
    description: 'Cada huevo es inspeccionado y clasificado por tamaño y calidad.',
  },
  {
    number: '03',
    title: 'Empaque Premium',
    description: 'Packaging diseñado para proteger y preservar la frescura.',
  },
  {
    number: '04',
    title: 'Entrega',
    description: 'Entrega en el día directo a tu puerta. Frescura garantizada.',
  },
] as const;
