import { Facebook, Instagram, Twitter, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand section */}
          <div>
            <h3 className="text-xl font-bold tracking-tight mb-4">CATÁLOGO</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Las mejores playeras con diseños únicos y exclusivos. Calidad premium para tu estilo.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="font-bold mb-4">Tienda</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Todos los productos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Nuevos lanzamientos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Ofertas especiales
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Colecciones
                </a>
              </li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="font-bold mb-4">Atención al cliente</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Envíos y devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Guía de tallas
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Suscríbete para recibir ofertas exclusivas y novedades.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 transition-colors"
              >
                <Mail className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-600 md:flex-row">
            <p>© 2025 Catálogo. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-black transition-colors">
                Términos y condiciones
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Política de privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
