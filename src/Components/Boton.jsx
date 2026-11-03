const variantes = {
  principal: 'bg-violeta text-white shadow-[0_4px_0_var(--color-violeta-oscuro)] hover:bg-violeta-oscuro',
  secundario: 'bg-white text-tinta border-2 border-tinta shadow-[0_3px_0_var(--color-tinta)] hover:bg-sol',
  peligro: 'bg-white text-red-700 border-2 border-red-700 shadow-[0_3px_0_#b91c1c] hover:bg-red-50',
}

function Boton({ label, onClick, type = 'button', disabled, variante = 'principal', chico = false }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${variantes[variante]} ${chico ? 'px-4 py-1.5 text-sm' : 'px-6 py-3 text-base'} font-bold rounded-full cursor-pointer transition-all duration-150 active:translate-y-[3px] active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-chicle/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-y-0`}
    >
      {label}
    </button>
  )
}

export default Boton
