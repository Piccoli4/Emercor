import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { useGetCategoriesQuery } from '../../services/market';
import CategoryItem from './CategoryItem';

const Categories = () => {

  const {data, error, isLoading} = useGetCategoriesQuery()

  if (isLoading) return <ActivityIndicator 
                          size="large" 
                          color="#7B2CBF" 
                          style={{marginTop: 50}}
                        />;
  if (error) return <Text>Error: {JSON.stringify(error)}</Text>;

  // Ordena las categorías alfabéticamente por el nombre
  const sortedData = data ? [...data].sort((a, b) => a.name.localeCompare(b.name)) : [];

  // Función para obtener el layout de cada item
  const getItemLayout = (data, index) => ({
    length: 95, // Altura del item incluyendo padding y margen (85 + 10)
    offset: 95 * index, // Altura del item multiplicada por el índice
    index,
  });
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorías</Text>
      <FlatList
        data={sortedData}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} // Usa un índice como fallback para claves únicas
        numColumns={4}
        renderItem={({ item }) => <CategoryItem item={item} />}
        scrollEnabled={false} // Deshabilitar scroll para evitar conflictos
        getItemLayout={getItemLayout}
        removeClippedSubviews={true} // Mejora el rendimiento eliminando elementos no visibles
      />
    </View>
  )
}

export default Categories

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    alignSelf: 'flex-start',
    marginLeft: 15
  }
})