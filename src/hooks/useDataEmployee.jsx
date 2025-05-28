import { useState, useEffect } from 'react'

const useDataEmployee = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función para obtener todos los empleados
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('https://api-rest-bl9i.onrender.com/api/employee')
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      setEmployees(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching employees:', err)
    } finally {
      setLoading(false)
    }
  }

  // Función para refrescar empleados (alias de fetchEmployees)
  const refreshEmployees = async () => {
    await fetchEmployees()
  }

  // Función para agregar un nuevo empleado
  const addEmployee = async (employeeData) => {
    try {
      setError(null) // Limpiar errores previos
      const response = await fetch('https://api-rest-bl9i.onrender.com/api/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
      }

      const newEmployee = await response.json()
      setEmployees(prev => [...prev, newEmployee])
      return newEmployee
    } catch (err) {
      setError(err.message)
      console.error('Error adding employee:', err)
      throw err
    }
  }

  // Función para actualizar un empleado
  const updateEmployee = async (id, employeeData) => {
    try {
      setError(null) // Limpiar errores previos
      const response = await fetch(`https://api-rest-bl9i.onrender.com/api/employee/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
      }

      const updatedEmployee = await response.json()
      setEmployees(prev => prev.map(employee => 
        employee._id === id ? updatedEmployee : employee
      ))
      return updatedEmployee
    } catch (err) {
      setError(err.message)
      console.error('Error updating employee:', err)
      throw err
    }
  }

  // Función para eliminar un empleado
  const deleteEmployee = async (id) => {
    try {
      setError(null) // Limpiar errores previos
      const response = await fetch(`https://api-rest-bl9i.onrender.com/api/employee/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`)
      }

      setEmployees(prev => prev.filter(employee => employee._id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting employee:', err)
      throw err
    }
  }

  // Cargar empleados al montar el componente
  useEffect(() => {
    fetchEmployees()
  }, [])

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    refreshEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  }
}

export default useDataEmployee