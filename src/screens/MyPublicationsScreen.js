import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useGetUserPostQuery, useDeletePostMutation } from '../services/user'
import Loading from '../components/Loading'
import PostItem from '../components/HomeScreen/PostItem'
import { colors } from '../global/colors'

const MyPublicationsScreen = () => {

  const localId = useSelector(state => state.auth.localId)

  const { data: userPosts, error, isLoading } = useGetUserPostQuery(localId)
  const [ deletePost ] = useDeletePostMutation()

  // Convierte userPosts en array
  const postArray = userPosts ? Object.entries(userPosts).map(([key, value]) => ({ ...value, id: key })) : []

  // Filtra solo las publicaciones del usuario actual
  const filteredPosts = postArray.filter(post => post.localId === localId)

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId)
    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
    }
  }

  if (isLoading) return <Loading />
  if (error) return <Text>Error: {error.message}</Text>

  const renderItem = ({ item }) => (
    <PostItem 
      item={item} 
      isDeletable={true} // Prop para hacer el item eliminable
      onDelete={handleDelete} // Función de eliminación
    />
  )

  return (
    <View style={styles.container}>
      {postArray.length > 0 ? (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.noPublicationsTextContainer}>
            <Text style={styles.noPublicationsText}>No tienes publicaciones</Text>
        </View>
      )}
    </View>
  )
}

export default MyPublicationsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
  },
  list: {
    justifyContent: 'center'
  },
  noPublicationsTextContainer: {
    width: '90%',
    height: 100,
    alignSelf: 'center',
    marginTop: 100,
    borderWidth: 1.5,
    borderColor: colors.violet,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noPublicationsText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.violet,
    textShadowColor: '#000',
    textShadowOffset: {width: 0.9, height: 0.9},
    textShadowRadius: 1
  }
})