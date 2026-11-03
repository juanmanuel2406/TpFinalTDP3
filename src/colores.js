const colores = [
  { fondo: 'bg-sol', texto: 'text-tinta', borde: 'border-sol' },
  { fondo: 'bg-menta', texto: 'text-tinta', borde: 'border-menta' },
  { fondo: 'bg-chicle', texto: 'text-tinta', borde: 'border-chicle' },
  { fondo: 'bg-cielo', texto: 'text-white', borde: 'border-cielo' },
  { fondo: 'bg-naranja', texto: 'text-tinta', borde: 'border-naranja' },
  { fondo: 'bg-lime-400', texto: 'text-tinta', borde: 'border-lime-400' },
]

export function colorCarrera(indice) {
  if (indice < 0) return { fondo: 'bg-violeta', texto: 'text-white', borde: 'border-violeta' }
  return colores[indice % colores.length]
}
