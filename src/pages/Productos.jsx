import React, { useState } from 'react'
import { Search, Plus, Package, DollarSign, Archive, Edit, Trash2 } from 'lucide-react'
import useProductData from '../hooks/useProductData'
import AddProductModal from '../components/Product Modals/AddProductModal'
import EditProductModal from '../components/Product Modals/EditProductModal'

function Productos() {
  const { products, loading, error, deleteProduct, refreshProducts } = useProductData()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Filtrar productos basado en el término de búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.desciption?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id, productName) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${productName}"?`)) {
      try {
        await deleteProduct(id)
        // El hook ya debería actualizar automáticamente la lista
      } catch (error) {
        console.error('Error al eliminar producto:', error)
      }
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const openAddModal = () => {
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedProduct(null)
  }

  // Función para refrescar la lista cuando se actualiza un producto
  const handleProductUpdated = () => {
    refreshProducts() // Refrescar la lista de productos
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
        <p>Error al cargar productos: {error}</p>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Productos</h1>
          <p className="text-gray-600">Gestiona el inventario de productos de Coca-Cola</p>
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
              placeholder="Buscar productos..."
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
            Agregar Producto
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Productos
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {products.length}
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
                  <Archive className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      En Stock
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {products.filter(p => p.stock > 0).length}
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
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Valor Total
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatPrice(products.reduce((total, product) => total + (product.price * product.stock), 0))}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm ? 'No se encontraron productos' : 'No hay productos'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza agregando un nuevo producto'}
            </p>
            {!searchTerm && (
              <button 
                onClick={openAddModal}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Producto
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white overflow-hidden shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  {/* Header de la card */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      {product.desciption && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.desciption}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Información del producto */}
                  <div className="space-y-3">
                    {/* Precio */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Precio:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    {/* Stock */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Stock:</span>
                      <span className={`text-sm font-medium ${
                        product.stock > 10 
                          ? 'text-green-600' 
                          : product.stock > 0 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                      }`}>
                        {product.stock} unidades
                      </span>
                    </div>

                    {/* Estado del stock */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Estado:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 10 
                          ? 'bg-green-100 text-green-800' 
                          : product.stock > 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 10 ? 'Disponible' : product.stock > 0 ? 'Poco Stock' : 'Agotado'}
                      </span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="mt-6 flex space-x-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id, product.name)}
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
      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onProductAdded={handleProductUpdated}
      />

      {/* Modal Editar */}
      <EditProductModal 
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        product={selectedProduct}
        onProductUpdated={handleProductUpdated}
      />
    </>
  )
}

export default Productos