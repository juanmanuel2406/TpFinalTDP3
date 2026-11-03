import { colorCarrera } from '../colores'
function TarjetaMateria({ materia, indiceColor, demora = 0, inscripto = false, children }) {
  const color = colorCarrera(indiceColor)

  return (
    <article
      className="animate-entrada relative bg-white rounded-2xl border-2 border-tinta overflow-hidden shadow-[5px_5px_0_var(--color-tinta)] flex flex-col"
      style={{ animationDelay: `${demora}ms` }}
    >
      <div className={`${color.fondo} ${color.texto} flex items-center justify-between px-5 py-2 border-b-2 border-tinta`}>
        <span className="text-sm font-bold">{materia.carrera}</span>
        <span className="w-3 h-3 rounded-full bg-fondo border-2 border-tinta" aria-hidden="true" />
      </div>
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-4 flex-1">
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight">{materia.nombre}</h2>
        {inscripto && (
          <p className="shrink-0 -rotate-3 bg-sol border-2 border-tinta rounded-lg px-3 py-1 text-base font-extrabold">
            Inscripto
          </p>
        )}
      </div>
      {children && <div className="px-5 pb-5 flex flex-wrap gap-2">{children}</div>}
    </article>
  )
}

export default TarjetaMateria
