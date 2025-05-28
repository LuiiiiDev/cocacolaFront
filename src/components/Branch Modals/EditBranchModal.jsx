import React, { useState, useEffect } from 'react'
import { X, Building2, MapPin, Calendar, Clock, Phone, AlertCircle } from 'lucide-react'
import useBranchData from '../../hooks/useBranchData'

function EditBranchModal({ isOpen, onClose, branch, onBranchUpdated }) {
  const { updateBranch } = useBranchData()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    birthday: '',
    schedule: '',
    telephone: ''
  })

  // Llenar el formulario cuando se selecciona una sucursal
  useEffect(() => {
    if (branch && isOpen) {
      setFormData({
        name: branch.name || '',
        address: branch.address || '',
        birthday: branch.birthday ? branch.birthday.split('T')[0] : '',
        schedule: branch.schedule || '',
        telephone: branch.telephone ? branch.telephone.toString() : ''
      })
      setError('')
    }
  }, [branch, isOpen])

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

      // Preparar datos para enviar
      const branchData = {
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        birthday: formData.birthday || undefined,
        schedule: formData.schedule.trim() || undefined,
        telephone: formData.telephone.trim() || undefined
      }

      await updateBranch(branch._id, branchData)
      
      // Notificar al componente padre y cerrar modal
      onBranchUpdated()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setError('')
      onClose()
    }
  }

  if (!isOpen || !branch) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Building2 className="h-6 w-6 text-red-600 mr-2" />
            Editar Sucursal
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
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Sucursal *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building2 className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="edit-name"
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
            <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="edit-address"
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
            <label htmlFor="edit-birthday" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Inauguración
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="date"
                id="edit-birthday"
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
            <label htmlFor="edit-schedule" className="block text-sm font-medium text-gray-700 mb-1">
              Horario de Atención
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="edit-schedule"
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
            <label htmlFor="edit-telephone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="tel"
                id="edit-telephone"
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
              {loading ? 'Guardando...' : 'Actualizar Sucursal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBranchModal