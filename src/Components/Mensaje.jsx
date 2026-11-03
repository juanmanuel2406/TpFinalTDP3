function Mensaje({ tipo = 'error', texto }) {
  if (!texto) return null

  const estilos =
    tipo === 'error'
      ? 'bg-red-50 text-red-800 border-red-300'
      : 'bg-emerald-50 text-emerald-800 border-emerald-300'

  return (
    <p role={tipo === 'error' ? 'alert' : 'status'} className={`${estilos} border-2 rounded-2xl px-4 py-2.5 font-semibold`}>
      {texto}
    </p>
  )
}

export default Mensaje
