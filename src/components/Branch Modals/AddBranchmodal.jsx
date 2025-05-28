import React, { useState } from 'react'
import { X, Building2, MapPin, Calendar, Clock, Phone, AlertCircle } from 'lucide-react'
import useBranchData from '../../hooks/useBranchData'

function AddBranchModal({ isOpen, onClose, onBranchAdded }) {
  const { addBranch } = useBranchData()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    birthday: '',
    schedule: '',
    telephone: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validaciones básicas
      if (!formData.name.trim()) {
        throw new Error('El nombre de la sucursal es obligatorio')
      }

      // Preparar datos para enviar (remover campos vacíos completamente)
      const branchData = {
        name: formData.name.trim()
      }

      // Solo agregar campos que tienen valor
      if (formData.address.trim()) {
        branchData.address = formData.address.trim()
      }
      if (formData.birthday) {
        branchData.birthday = formData.birthday
      }
      if (formData.schedule.trim()) {
        branchData.schedule = formData.schedule.trim()
      }
      if (formData.telephone.trim()) {
        branchData.telephone = formData.telephone.trim()
      }

      console.log('Submitting branch data:', branchData)
      
      await addBranch(branchData)
      
      // Resetear formulario
      setFormData({
        name: '',
        address: '',
        birthday: '',
        schedule: '',
        telephone: ''
      })
      
      // Notificar al componente padre y cerrar modal
      onBranchAdded()
      onClose()
    } catch (err) {
      console.error('Submit error:', err)
      setError(err.message || 'Error desconocido al agregar la sucursal')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        address: '',
        birthday: '',
        schedule: '',
        telephone: ''
      })
      setError('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Building2 className="h-6 w-6 text-red-600 mr-2" />
            Agregar Nueva Sucursal
          </h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Sucursal *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={loading}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Ej: Sucursal Centro"
                required
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={loading}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Ej: Av. Principal #123"
              />
            </div>
          </div>

          {/* Fecha de Inauguración */}
          <div>
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Inauguración
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
                disabled={loading}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          {/* Horario */}
          <div>
            <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
              Horario de Atención
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="schedule"
                name="schedule"
                value={formData.schedule}
                onChange={handleInputChange}
                disabled={loading}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Ej: Lun-Vie 8:00-17:00"
              />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                disabled={loading}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Ej: 2234-5678"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? 'Guardando...' : 'Agregar Sucursal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBranchModal