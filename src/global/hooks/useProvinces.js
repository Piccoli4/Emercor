import { useState, useEffect } from 'react';

const useProvinces = () => {
  const [ provinces, setProvinces ] = useState([]);
  const [ departments, setDepartments ] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://apis.datos.gob.ar/georef/api/provincias');
        const data = await response.json();

        // Ordenar las provincias alfabéticamente por el nombre
        const sortedProvinces = data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));

        setProvinces(sortedProvinces);
      } catch (error) {
        console.error('Error fetching provinces: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  // Función para obtener los departamentos de una provincia específica
  const fetchDepartments = async (provinceId) => {
    try {
      const response = await fetch(`https://apis.datos.gob.ar/georef/api/departamentos?provincia=${provinceId}&max=500`);
      const data = await response.json();
      
      // Ordenar los departamentos alfabéticamente por el nombre
      const sortedDepartments = data.departamentos.sort((a, b) => a.nombre.localeCompare(b.nombre));
      
      setDepartments(sortedDepartments);
    } catch (error) {
      console.error('Error fetching departments: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener localidades del departamento seleccionado
  const fetchLocalities = async (departmentId) => {
    try {
      const response = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?departamento=${departmentId}&max=500`);
      const data = await response.json();
      const sortedLocalities = data.localidades.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setLocalities(sortedLocalities);
    } catch (error) {
      console.error('Error fetching localities: ', error);
    } finally {
      setLoading(false);
    }
  };

  return { 
        provinces, 
        departments, 
        localities, 
        loading, 
        fetchDepartments, 
        fetchLocalities 
    };
};

export default useProvinces;
