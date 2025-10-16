import { ShoppingCart, Search, Menu, User } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      {/* Top bar */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-600">Envío gratis en compras mayores a $600</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-black transition-colors">
                Ayuda
              </a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <button className="lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <a href="/" className="text-2xl font-bold tracking-tight">
              CATÁLOGO
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Inicio
            </a>
            <a href="#" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Productos
            </a>
            <a href="#" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Colecciones
            </a>
            <a href="#" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Ofertas
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="hover:text-gray-600 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="hover:text-gray-600 transition-colors">
              <User className="h-5 w-5" />
            </button>
            <button className="relative hover:text-gray-600 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
