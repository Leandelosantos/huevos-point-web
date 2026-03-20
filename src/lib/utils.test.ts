import { describe, it, expect } from 'vitest';
import { formatPrice, formatUnit, cn } from './utils';

describe('formatPrice', () => {
  it('formats a whole number with ARS currency symbol', () => {
    const result = formatPrice(4500);
    expect(result).toContain('4.500');
  });

  it('formats zero as $0', () => {
    const result = formatPrice(0);
    expect(result).toContain('0');
  });

  it('formats large numbers with thousand separators', () => {
    const result = formatPrice(10500);
    expect(result).toContain('10.500');
  });

  it('rounds decimals', () => {
    const result = formatPrice(4500.75);
    expect(result).toContain('4.501');
  });
});

describe('formatUnit', () => {
  it('returns "unidad" for unidad', () => {
    expect(formatUnit('unidad')).toBe('unidad');
  });

  it('returns "media docena" for media_docena', () => {
    expect(formatUnit('media_docena')).toBe('media docena');
  });

  it('returns "docena" for docena', () => {
    expect(formatUnit('docena')).toBe('docena');
  });

  it('returns "maple (30u)" for maple', () => {
    expect(formatUnit('maple')).toBe('maple (30u)');
  });

  it('returns the raw string for unknown units', () => {
    expect(formatUnit('desconocido')).toBe('desconocido');
  });
});

describe('cn', () => {
  it('merges Tailwind classes without conflicts', () => {
    const result = cn('px-4 py-2', 'px-6');
    expect(result).toBe('py-2 px-6');
  });

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'visible');
    expect(result).toBe('base visible');
  });

  it('handles undefined and null', () => {
    const result = cn('base', undefined, null);
    expect(result).toBe('base');
  });
});
