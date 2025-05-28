import React, { useState, useEffect } from 'react'
import { X, User, Mail, Phone, Calendar, CreditCard, Building, Check } from 'lucide-react'
import useDataEmployee from '../../hooks/useDataEmployee'

function EditEmployeeModal({ isOpen, onClose, employee, onEmployeeUpdated }) {
  const { updateEmployee } = useDataEmployee()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    telephone: '',
    dui: '',
    birthday: '',
    hireDate: '',
    issnumber: '',
    isVerified: false
  })
  const [errors, setErrors] = useState({})

  // Llenar el formulario cuando el empleado cambie
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        telephone: employee.telephone || '',
        dui: employee.dui || '',
        birthday: employee.birthday ? employee.birthday.split('T')[0] : '',
        hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
        issnumber: employee.issnumber || '',
        isVerified: employee.isVerified || false
      })
      setErrors({})
    }
  }, [employee])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido'
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'El teléfono es requerido'
    } else if (!/^\d{4}-?\d{4}$/.test(formData.telephone.replace('-', ''))) {
      newErrors.telephone = 'El teléfono debe tener 8 dígitos'
    }

    if (!formData.dui.trim()) {
      newErrors.dui = 'El DUI es requerido'
    } else if (!/^\d{8}-?\d$/.test(formData.dui.replace('-', ''))) {
      newErrors.dui = 'El DUI debe tener el formato: 12345678-9'
    }

    if (!formData.birthday) {
      newErrors.birthday = 'La fecha de nacimiento es requerida'
    }

    if (!formData.hireDate) {
      newErrors.hireDate = 'La fecha de contratación es requerida'
    }

    if (!formData.issnumber.trim()) {
      newErrors.issnumber = 'El número de ISSS es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm() || !employee) {
      return
    }

    setLoading(true)
    try {
      await updateEmployee(employee._id, formData)
      onEmployeeUpdated()
      handleClose()
    } catch (error) {
      console.error('Error al actualizar empleado:', error)
      // Puedes agregar manejo de errores aquí si lo deseas
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  if (!isOpen || !employee) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Editar Empleado
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Nombre *
              </label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ingresa el nombre"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="edit-lastName" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Apellido *
              </label>
              <input
                type="text"
                id="edit-lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ingresa el apellido"
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email *
            </label>
            <input
              type="email"
              id="edit-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="ejemplo@correo.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Teléfono y DUI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-telephone" className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Teléfono *
              </label>
              <input
                type="tel"
                id="edit-telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.telephone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1234-5678"
              />
              {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>}
            </div>

            <div>
              <label htmlFor="edit-dui" className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="h-4 w-4 inline mr-1" />
                DUI *
              </label>
              <input
                type="text"
                id="edit-dui"
                name="dui"
                value={formData.dui}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.dui ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="12345678-9"
              />
              {errors.dui && <p className="mt-1 text-sm text-red-600">{errors.dui}</p>}
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-birthday" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                id="edit-birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.birthday ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.birthday && <p className="mt-1 text-sm text-red-600">{errors.birthday}</p>}
            </div>

            <div>
              <label htmlFor="edit-hireDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Fecha de Contratación *
              </label>
              <input
                type="date"
                id="edit-hireDate"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.hireDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.hireDate && <p className="mt-1 text-sm text-red-600">{errors.hireDate}</p>}
            </div>
          </div>

          {/* ISSS */}
          <div>
            <label htmlFor="edit-issnumber" className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="h-4 w-4 inline mr-1" />
              Número de ISSS *
            </label>
            <input
              type="text"
              id="edit-issnumber"
              name="issnumber"
              value={formData.issnumber}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                errors.issnumber ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Número de ISSS"
            />
            {errors.issnumber && <p className="mt-1 text-sm text-red-600">{errors.issnumber}</p>}
          </div>

          {/* Verificado */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="edit-isVerified"
              name="isVerified"
              checked={formData.isVerified}
              onChange={handleInputChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="edit-isVerified" className="ml-2 block text-sm text-gray-700">
              <Check className="h-4 w-4 inline mr-1" />
              Empleado verificado
            </label>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Actualizando...' : 'Actualizar Empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditEmployeeModal