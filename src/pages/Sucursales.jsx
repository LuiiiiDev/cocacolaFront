import React, { useState } from 'react'
import { Search, Plus, Building2, MapPin, Calendar, Clock, Phone, Edit, Trash2 } from 'lucide-react'
import useBranchData from '../hooks/useBranchData'
import AddBranchModal from '../components/Branch Modals/AddBranchmodal'
import EditBranchModal from '../components/Branch Modals/EditBranchModal'

function Sucursales() {
  const { branches, loading, error, deleteBranch, refreshBranches } = useBranchData()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(null)

  // Filtrar sucursales basado en el término de búsqueda
  const filteredBranches = branches.filter(branch =>
    branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.schedule?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id, branchName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${branchName}"?`)) {
      try {
        await deleteBranch(id)
        // El hook ya debería actualizar automáticamente la lista
      } catch (error) {
        console.error('Error al eliminar sucursal:', error)
      }
    }
  }

  const handleEdit = (branch) => {
    setSelectedBranch(branch)
    setIsEditModalOpen(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado'
    try {
      return new Intl.DateTimeFormat('es-SV', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(dateString))
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  const formatPhone = (phone) => {
    if (!phone) return 'No especificado'
    const phoneStr = phone.toString()
    if (phoneStr.length === 8) {
      return `${phoneStr.slice(0, 4)}-${phoneStr.slice(4)}`
    }
    return phoneStr
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedBranch(null)
  }

  // Función para refrescar la lista cuando se actualiza una sucursal
  const handleBranchUpdated = () => {
    refreshBranches() // Refrescar la lista de sucursales
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
        <p>Error al cargar sucursales: {error}</p>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sucursales</h1>
          <p className="text-gray-600">Gestiona las sucursales de Coca-Cola</p>
        </div>

        {/* Barra de búsqueda y botón agregar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Barra de búsqueda */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar sucursales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Botón agregar */}
          <button 
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Sucursal
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Sucursales
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {branches.length}
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
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Ubicaciones Activas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {branches.filter(b => b.address && b.address.trim()).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de sucursales */}
        {filteredBranches.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm ? 'No se encontraron sucursales' : 'No hay sucursales'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza agregando una nueva sucursal'}
            </p>
            {!searchTerm && (
              <button 
                onClick={openAddModal}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primera Sucursal
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBranches.map((branch) => (
              <div key={branch._id} className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  {/* Header de la card */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
                        <Building2 className="h-5 w-5 text-red-600 mr-2" />
                        {branch.name || 'Sin nombre'}
                      </h3>
                    </div>
                  </div>

                  {/* Información de la sucursal */}
                  <div className="space-y-3">
                    {/* Dirección */}
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500">Dirección:</span>
                        <p className="text-sm text-gray-900">
                          {branch.address || 'No especificada'}
                        </p>
                      </div>
                    </div>

                    {/* Fecha de inauguración */}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <span className="text-sm text-gray-500">Inauguración: </span>
                        <span className="text-sm text-gray-900">
                          {formatDate(branch.birthday)}
                        </span>
                      </div>
                    </div>

                    {/* Horario */}
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <span className="text-sm text-gray-500">Horario: </span>
                        <span className="text-sm text-gray-900">
                          {branch.schedule || 'No especificado'}
                        </span>
                      </div>
                    </div>

                    {/* Teléfono */}
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <span className="text-sm text-gray-500">Teléfono: </span>
                        <span className="text-sm text-gray-900">
                          {formatPhone(branch.telephone)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="mt-6 flex space-x-2">
                    <button 
                      onClick={() => handleEdit(branch)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(branch._id, branch.name)}
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
      <AddBranchModal 
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onBranchAdded={handleBranchUpdated}
      />

      {/* Modal Editar */}
      <EditBranchModal 
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        branch={selectedBranch}
        onBranchUpdated={handleBranchUpdated}
      />
    </>
  )
}

export default Sucursales