import { FlatList, StyleSheet, Text, View } from 'react-native'
import Header from '../components/HomeScreen/Header'
import SearchBar from '../components/SearchBar'
import { useGetUserPostQuery } from '../services/user';
import Loading from '../components/Loading'
import PostItem from '../components/HomeScreen/PostItem';
import { useState } from 'react';

const ExploreScreen = () => {

  // Utiliza el nuevo hook para obtener todos los posts
  const { data: userPosts, error, isLoading } = useGetUserPostQuery();
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return <Loading/>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  // Convierte el objeto de datos en un array de publicaciones
  const postArray = userPosts ? Object.entries(userPosts).map(([key, value]) => ({ ...value, id: key })) : [];

  // Filter posts based on search query
  const filteredPosts = postArray.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header style={styles.header}/>
      <SearchBar style={styles.searchBar} onSearch={setSearchQuery}/>
      <FlatList
        data={filteredPosts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostItem item={item}/>
        )}
      />
    </View>
  )
}

export default ExploreScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  }
})