import React, { useState } from 'react'
import { Search, Plus, Users, Calendar, Phone, Mail, Edit, Trash2, UserCheck, UserX } from 'lucide-react'
import useDataEmployee from '../hooks/useDataEmployee'
import AddEmployeeModal from '../components/Employee Modals/AddEmployeeModal'
import EditEmployeeModal from '../components/Employee Modals/EditEmployeeModal'

function Employees() {
  const { employees, loading, error, deleteEmployee, refreshEmployees } = useDataEmployee()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  // Filtrar empleados basado en el término de búsqueda
  const filteredEmployees = employees.filter(employee =>
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.dui?.includes(searchTerm)
  )

  const handleDelete = async (id, employeeName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a "${employeeName}"?`)) {
      try {
        await deleteEmployee(id)
      } catch (error) {
        console.error('Error al eliminar empleado:', error)
      }
    }
  }

  const handleEdit = (employee) => {
    setSelectedEmployee(employee)
    setIsEditModalOpen(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-SV', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateAge = (birthday) => {
    if (!birthday) return 'N/A'
    const today = new Date()
    const birthDate = new Date(birthday)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedEmployee(null)
  }

  const handleEmployeeUpdated = () => {
    refreshEmployees()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error al cargar empleados: {error}</p>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Empleados</h1>
          <p className="text-gray-600">Gestiona los empleados de Coca-Cola</p>
        </div>

        {/* Barra de búsqueda y botón agregar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar empleados por nombre, apellido, email o DUI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <button 
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Empleado
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Empleados
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {employees.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Verificados
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {employees.filter(emp => emp.isVerified).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserX className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Sin Verificar
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {employees.filter(emp => !emp.isVerified).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de empleados */}
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm ? 'No se encontraron empleados' : 'No hay empleados'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza agregando un nuevo empleado'}
            </p>
            {!searchTerm && (
              <button 
                onClick={openAddModal}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Empleado
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <div key={employee._id} className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  {/* Header de la card */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {employee.name} {employee.lastName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.isVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {employee.isVerified ? 'Verificado' : 'Sin Verificar'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Información del empleado */}
                  <div className="space-y-3">
                    {/* Email */}
                    {employee.email && (
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 truncate">{employee.email}</span>
                      </div>
                    )}

                    {/* Teléfono */}
                    {employee.telephone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{employee.telephone}</span>
                      </div>
                    )}

                    {/* DUI */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">DUI:</span>
                      <span className="text-gray-900 font-medium">{employee.dui}</span>
                    </div>

                    {/* Edad */}
                    {employee.birthday && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Edad:</span>
                        <span className="text-gray-900">{calculateAge(employee.birthday)} años</span>
                      </div>
                    )}

                    {/* Fecha de contratación */}
                    {employee.hireDate && (
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Contratado: {formatDate(employee.hireDate)}</span>
                      </div>
                    )}

                    {/* ISSS */}
                    {employee.issnumber && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">ISSS:</span>
                        <span className="text-gray-900 font-mono text-xs">{employee.issnumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="mt-6 flex space-x-2">
                    <button 
                      onClick={() => handleEdit(employee)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(employee._id, `${employee.name} ${employee.lastName}`)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Agregar */}
      <AddEmployeeModal 
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onEmployeeAdded={handleEmployeeUpdated}
      />

      {/* Modal Editar */}
      <EditEmployeeModal 
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        employee={selectedEmployee}
        onEmployeeUpdated={handleEmployeeUpdated}
      />
    </>
  )
}

export default Employees