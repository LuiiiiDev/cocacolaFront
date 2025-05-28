import { useState, useEffect } from 'react'

const useBranchData = () => {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = 'https://api-rest-bl9i.onrender.com/api/branches'

  // Función helper para manejar respuestas de fetch
  const handleResponse = async (response) => {
    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`
      
      try {
        const errorData = await response.json()
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        }
      } catch (jsonError) {
        // Si no se puede parsear el JSON, usar mensaje por defecto
        console.warn('No se pudo parsear el error JSON:', jsonError)
      }
      
      throw new Error(errorMessage)
    }
    return response.json()
  }

  // Función helper para manejar errores de fetch
  const handleFetchError = (error) => {
    console.error('Fetch error details:', error)
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return 'Error de conexión. Verifica tu conexión a internet o que el servidor esté disponible.'
    }
    
    if (error.name === 'AbortError') {
      return 'La petición fue cancelada.'
    }
    
    return error.message || 'Error desconocido'
  }

  // Función para obtener todas las sucursales
  const fetchBranches = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching branches from:', API_BASE_URL)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos timeout
      
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      const data = await handleResponse(response)
      
      console.log('Branches fetched successfully:', data)
      setBranches(Array.isArray(data) ? data : [])
    } catch (err) {
      const errorMessage = handleFetchError(err)
      setError(errorMessage)
      console.error('Error fetching branches:', err)
    } finally {
      setLoading(false)
    }
  }

  // Función para refrescar sucursales (alias de fetchBranches)
  const refreshBranches = async () => {
    await fetchBranches()
  }

  // Función para agregar una nueva sucursal
  const addBranch = async (branchData) => {
    try {
      setError(null)
      
      console.log('Adding branch:', branchData)
      console.log('API URL:', API_BASE_URL)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos timeout
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(branchData),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      const newBranch = await handleResponse(response)
      
      console.log('Branch added successfully:', newBranch)
      setBranches(prev => [...prev, newBranch])
      return newBranch
    } catch (err) {
      const errorMessage = handleFetchError(err)
      setError(errorMessage)
      console.error('Error adding branch:', err)
      throw new Error(errorMessage)
    }
  }

  // Función para actualizar una sucursal
  const updateBranch = async (id, branchData) => {
    try {
      setError(null)
      
      console.log('Updating branch:', id, branchData)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)
      
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(branchData),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      const updatedBranch = await handleResponse(response)
      
      console.log('Branch updated successfully:', updatedBranch)
      setBranches(prev => prev.map(branch => 
        branch._id === id ? updatedBranch : branch
      ))
      return updatedBranch
    } catch (err) {
      const errorMessage = handleFetchError(err)
      setError(errorMessage)
      console.error('Error updating branch:', err)
      throw new Error(errorMessage)
    }
  }

  // Función para eliminar una sucursal
  const deleteBranch = async (id) => {
    try {
      setError(null)
      
      console.log('Deleting branch:', id)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)
      
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      
      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          if (errorData.message) errorMessage = errorData.message
        } catch {}
        throw new Error(errorMessage)
      }

      console.log('Branch deleted successfully')
      setBranches(prev => prev.filter(branch => branch._id !== id))
    } catch (err) {
      const errorMessage = handleFetchError(err)
      setError(errorMessage)
      console.error('Error deleting branch:', err)
      throw new Error(errorMessage)
    }
  }

  // Cargar sucursales al montar el componente
  useEffect(() => {
    fetchBranches()
  }, [])

  return {
    branches,
    loading,
    error,
    fetchBranches,
    refreshBranches,
    addBranch,
    updateBranch,
    deleteBranch,
  }
}

export default useBranchData