import { create } from 'zustand'

function obtenerUsuarioGuardado() {
  try {
    if (!localStorage.getItem('token')) return null
    return JSON.parse(localStorage.getItem('usuario'))
  } catch {
    return null
  }
}

const useAuthStore = create((set) => ({
  usuario: obtenerUsuarioGuardado(),

  iniciarSesion: (usuario, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
    set({ usuario })
  },

  cerrarSesion: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    set({ usuario: null })
  },
}))

export default useAuthStore
