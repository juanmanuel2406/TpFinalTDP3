const etiquetas = [
  { nombre: 'Programación I', carrera: 'Sistemas', color: 'bg-sol', giro: '-rotate-6' },
  { nombre: 'Contabilidad', carrera: 'Contador', color: 'bg-cielo', giro: 'rotate-3' },
  { nombre: 'Marketing', carrera: 'Administración', color: 'bg-menta', giro: '-rotate-2' },
]

function PanelAcceso({ titulo, bajada, children }) {
  return (
    <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-3xl border-2 border-tinta shadow-[8px_8px_0_var(--color-tinta)] overflow-hidden">
      <div className="hidden md:flex flex-col justify-between bg-violeta text-white p-10">
        <p className="text-4xl font-extrabold tracking-tight leading-tight">
          Toda la cursada, en un solo lugar.
        </p>
        <div className="flex flex-col items-start gap-3" aria-hidden="true">
          {etiquetas.map((etiqueta) => (
            <div
              key={etiqueta.nombre}
              className={`${etiqueta.giro} flex items-center gap-4 bg-white text-tinta rounded-xl border-2 border-tinta overflow-hidden`}
            >
              <span className={`${etiqueta.color} self-stretch w-3`} />
              <span className="font-bold py-2">{etiqueta.nombre}</span>
              <span className="bg-sol border-l-2 border-tinta font-extrabold px-3 py-2">{etiqueta.carrera}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-8 sm:p-10">
        <h1 className="text-4xl font-extrabold tracking-tight">{titulo}</h1>
        <p className="mt-2 mb-8 text-tinta/70">{bajada}</p>
        {children}
      </div>
    </div>
  )
}

export default PanelAcceso
