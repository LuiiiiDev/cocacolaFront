import { useState, useEffect } from 'react'

const useProductData = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función para obtener todos los productos
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:4000/api/products')
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Función para refrescar productos (alias de fetchProducts)
  const refreshProducts = async () => {
    await fetchProducts()
  }

  // Función para agregar un nuevo producto
  const addProduct = async (productData) => {
    try {
      setError(null) // Limpiar errores previos
      const response = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
      }

      const newProduct = await response.json()
      setProducts(prev => [...prev, newProduct])
      return newProduct
    } catch (err) {
      setError(err.message)
      console.error('Error adding product:', err)
      throw err
    }
  }

  // Función para actualizar un producto
  const updateProduct = async (id, productData) => {
    try {
      setError(null) // Limpiar errores previos
      const response = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
      }

      const updatedProduct = await response.json()
      setProducts(prev => prev.map(product => 
        product._id === id ? updatedProduct : product
      ))
      return updatedProduct
    } catch (err) {
      setError(err.message)
      console.error('Error updating product:', err)
      throw err
    }
  }

  // Función para eliminar un producto
  const deleteProduct = async (id) => {
    try {
      setError(null) // Limpiar errores previos
      const response = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
      }

      setProducts(prev => prev.filter(product => product._id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting product:', err)
      throw err
    }
  }

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    fetchProducts,
    refreshProducts, // Nueva función agregada
    addProduct,
    updateProduct,
    deleteProduct,
  }
}

export default useProductData