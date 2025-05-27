import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import NavBar from '../src/components/NavBar'
import Productos from "./pages/Productos"
import Employees from "./pages/Employees"
import Sucursales from './pages/Sucursales'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Ruta por defecto que redirige a productos */}
            <Route path="/" element={<Navigate to="/productos" replace />} />
            
            {/* Rutas principales */}
            <Route path="/productos" element={<Productos />} />
            <Route path="/empleados" element={<Employees />} />
            <Route path="/sucursales" element={<Sucursales />} />
            
            {/* Ruta 404 - redirige a productos */}
            <Route path="*" element={<Navigate to="/productos" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App