import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingBag, Users, MapPin } from 'lucide-react'

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActiveRoute = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-red-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-white font-bold text-2xl tracking-wide hover:text-gray-100 transition duration-300">
              Coca-Cola
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/productos"
                className={`px-4 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out flex items-center space-x-2 ${
                  isActiveRoute('/productos') 
                    ? 'bg-red-800 text-white' 
                    : 'text-white hover:bg-red-700 hover:text-gray-100'
                }`}
              >
                <ShoppingBag size={18} />
                <span>Productos</span>
              </Link>
              <Link
                to="/empleados"
                className={`px-4 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out flex items-center space-x-2 ${
                  isActiveRoute('/empleados') 
                    ? 'bg-red-800 text-white' 
                    : 'text-white hover:bg-red-700 hover:text-gray-100'
                }`}
              >
                <Users size={18} />
                <span>Empleados</span>
              </Link>
              <Link
                to="/sucursales"
                className={`px-4 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out flex items-center space-x-2 ${
                  isActiveRoute('/sucursales') 
                    ? 'bg-red-800 text-white' 
                    : 'text-white hover:bg-red-700 hover:text-gray-100'
                }`}
              >
                <MapPin size={18} />
                <span>Sucursales</span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:bg-red-700 p-2 rounded-md transition duration-300 ease-in-out"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-red-700 rounded-lg mt-2">
              <Link
                to="/productos"
                className={`block px-3 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out flex items-center space-x-2 ${
                  isActiveRoute('/productos') 
                    ? 'bg-red-900 text-white' 
                    : 'text-white hover:bg-red-800'
                }`}
                onClick={toggleMenu}
              >
                <ShoppingBag size={18} />
                <span>Productos</span>
              </Link>
              <Link
                to="/empleados"
                className={`block px-3 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out flex items-center space-x-2 ${
                  isActiveRoute('/empleados') 
                    ? 'bg-red-900 text-white' 
                    : 'text-white hover:bg-red-800'
                }`}
                onClick={toggleMenu}
              >
                <Users size={18} />
                <span>Empleados</span>
              </Link>
              <Link
                to="/sucursales"
                className={`block px-3 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out flex items-center space-x-2 ${
                  isActiveRoute('/sucursales') 
                    ? 'bg-red-900 text-white' 
                    : 'text-white hover:bg-red-800'
                }`}
                onClick={toggleMenu}
              >
                <MapPin size={18} />
                <span>Sucursales</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavBar