import { useState, useEffect } from 'react';

const useSliders = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSliders = async () => {
      setLoading(true);
      try {
        // Obtiene la referencia a la colección 'sliders'
        const coleccion = collection(db, 'sliders');
        
        // Realiza la consulta para obtener todos los documentos en 'sliders'
        const response = await getDocs(coleccion);
        
        // Mapea los documentos para obtener solo los nombres de los sliders
        const slidersObtenidos = response.docs.map((doc) => ({
          id: doc.id,
          image: doc.data().image,
        }))

        setSliders(slidersObtenidos); // Guarda los sliders en el estado
      } catch (error) {
        setError("Error al obtener los sliders");
      } finally {
        setLoading(false);
      }
    };

    getSliders(); // Llama a la función para obtener los sliders
  }, []);

  return { sliders, loading, error };
};

export default useSliders;