-- ============================================================
-- Huevos Point — Seed Data
-- SRS §5.1.2 — 6 initial products
-- ============================================================

INSERT INTO products (name, slug, description, long_desc, price, unit, category, image_url, image_alt, is_featured, is_available, sort_order, nutrition, origin)
VALUES
  (
    'Huevos de Campo Libre',
    'huevos-campo-libre',
    'Gallinas criadas en libertad, alimentación natural y huevos con yema dorada intensa.',
    'Nuestros huevos de campo libre provienen de gallinas que viven en espacios abiertos, con acceso a pasturas naturales. Cada huevo refleja la calidad de una crianza responsable: yemas doradas, cáscaras firmes y un sabor incomparable.',
    4500,
    'docena',
    'campo_libre',
    '/images/products/campo-libre.webp',
    'Docena de huevos de campo libre con yema dorada sobre superficie de madera',
    true,
    true,
    1,
    '{"proteina": "6.5g", "omega3": "alto", "vitamina_d": "alto", "calorias": "70 por huevo"}',
    'Granja La Aurora, Entre Ríos'
  ),
  (
    'Huevos Orgánicos Certificados',
    'huevos-organicos-certificados',
    'Certificación orgánica oficial. Sin antibióticos, sin hormonas, 100% natural.',
    'Certificados bajo normas orgánicas argentinas. Las gallinas se alimentan exclusivamente con granos orgánicos, sin pesticidas ni transgénicos. El resultado: huevos puros, como la naturaleza los pensó.',
    6200,
    'docena',
    'organico',
    '/images/products/organicos.webp',
    'Huevos orgánicos certificados en envase ecológico con sello de certificación',
    true,
    true,
    2,
    '{"proteina": "6.8g", "omega3": "muy alto", "vitamina_d": "muy alto", "calorias": "72 por huevo"}',
    'Granja Eco Valle, Córdoba'
  ),
  (
    'Huevos Doble Yema',
    'huevos-doble-yema',
    'Selección especial de huevos XL con doble yema. Ideales para repostería.',
    'Huevos cuidadosamente seleccionados por su tamaño extra grande y doble yema natural. Perfectos para recetas que requieren mayor riqueza y textura. Un producto premium para paladares exigentes.',
    5800,
    'docena',
    'especial',
    '/images/products/doble-yema.webp',
    'Huevo abierto mostrando su doble yema sobre plato de cerámica artesanal',
    false,
    true,
    3,
    '{"proteina": "9.2g", "omega3": "medio", "vitamina_d": "alto", "calorias": "110 por huevo"}',
    'Granja La Aurora, Entre Ríos'
  ),
  (
    'Maple Premium (30u)',
    'maple-premium-30u',
    'Nuestro maple insignia: 30 huevos premium seleccionados a mano, uno por uno.',
    'El formato ideal para familias y profesionales de la cocina. Cada huevo del maple es inspeccionado individualmente para garantizar uniformidad en tamaño, color de cáscara y frescura absoluta.',
    10500,
    'maple',
    'premium',
    '/images/products/maple-premium.webp',
    'Maple de 30 huevos premium organizados perfectamente en envase de cartón',
    true,
    true,
    4,
    '{"proteina": "6.5g", "omega3": "alto", "vitamina_d": "alto", "calorias": "70 por huevo"}',
    'Granja La Aurora, Entre Ríos'
  ),
  (
    'Huevos de Codorniz',
    'huevos-codorniz',
    'Delicados huevos de codorniz. Sabor intenso concentrado en tamaño petit.',
    'Pequeños en tamaño pero grandes en sabor. Los huevos de codorniz son un ingrediente gourmet por excelencia, perfectos para entradas, ensaladas y presentaciones de alta cocina.',
    3200,
    'docena',
    'especial',
    '/images/products/codorniz.webp',
    'Huevos de codorniz moteados dispuestos sobre nido de paja natural',
    false,
    true,
    5,
    '{"proteina": "1.2g por huevo", "omega3": "medio", "vitamina_d": "medio", "calorias": "14 por huevo"}',
    'Criadero Don Pedro, Buenos Aires'
  ),
  (
    'Huevos Pastoriles Omega-3',
    'huevos-pastoriles-omega3',
    'Enriquecidos naturalmente con Omega-3 por la dieta de las gallinas pastoriles.',
    'Las gallinas pastoriles se alimentan de pastos, semillas de lino y algas marinas, lo que enriquece naturalmente sus huevos con ácidos grasos Omega-3. Ideales para quienes buscan una alimentación funcional.',
    7400,
    'docena',
    'premium',
    '/images/products/pastoriles-omega3.webp',
    'Huevos pastoriles Omega-3 junto a semillas de lino y hierbas frescas',
    false,
    true,
    6,
    '{"proteina": "7.0g", "omega3": "muy alto", "vitamina_d": "alto", "calorias": "75 por huevo", "omega3_mg": "350mg DHA+EPA"}',
    'Granja Pasturas del Sur, Patagonia'
  );
