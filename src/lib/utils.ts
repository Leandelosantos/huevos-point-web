import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatUnit(unit: string): string {
  const unitLabels: Record<string, string> = {
    unidad: 'unidad',
    media_docena: 'media docena',
    docena: 'docena',
    maple: 'maple (30u)',
  };
  return unitLabels[unit] ?? unit;
}
