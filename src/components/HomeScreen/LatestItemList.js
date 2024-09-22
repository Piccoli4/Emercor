import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import PostItem from './PostItem';
import { useGetUserPostQuery } from '../../services/user';
import { useEffect, useState } from 'react';

const LatestItemList = () => {

  const { data, error, isSuccess, isLoading } = useGetUserPostQuery();
  const [ userPostFiltered, setUserPostFiltered ] = useState([])

  useEffect(() => {
    if (isSuccess && data) {
      // Convierte data en un array
      const postArray = data ? Object.entries(data).map(([key, value]) => ({
        ...value,
        id: key,
        createdAt: new Date(value.createdAt) // Convierte a objeto Date
      })) : [];

      // Ordena las publicaciones por fecha descendente (más reciente primero)
      postArray.sort((a, b) => b.createdAt - a.createdAt);

      // Filtra las últimas 6 publicaciones (más recientes al principio)
      const lastSixPosts = postArray.slice(0, 6);

      setUserPostFiltered(lastSixPosts);
    }
  }, [data, isSuccess]);

  if (isLoading) return <ActivityIndicator 
                          size="large" 
                          color="#7B2CBF" 
                          style={{marginTop: 50}}
                        />;
  if (error) return <Text>Error: {JSON.stringify(error)}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Últimas Publicaciones</Text>
      <FlatList
        data={userPostFiltered} // Usa el array filtrado
        numColumns={2}
        renderItem={({ item }) => <PostItem item={item} />}
        keyExtractor={item => item.id}
        scrollEnabled={false} // Deshabilita el scroll para evitar conflictos con el ScrollView de HomeScreen
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>
  )
}

export default LatestItemList

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10
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