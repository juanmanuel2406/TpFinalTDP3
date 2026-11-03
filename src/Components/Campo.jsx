function Campo({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="text-sm font-bold">{label}</span>
      <input
        {...props}
        className="w-full px-4 py-2.5 rounded-xl border-2 border-tinta/15 bg-white placeholder:text-tinta/40 focus:outline-none focus:border-violeta focus:ring-4 focus:ring-violeta/20 transition-colors"
      />
    </label>
  )
}

export default Campo
