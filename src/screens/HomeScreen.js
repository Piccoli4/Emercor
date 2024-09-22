import { StyleSheet, View, ScrollView, FlatList, Text } from 'react-native';
import React, { useState } from 'react';
import Header from '../components/HomeScreen/Header';
import Slider from '../components/HomeScreen/Slider';
import Categories from '../components/HomeScreen/Categories';
import LatestItemList from '../components/HomeScreen/LatestItemList';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import { useGetUserPostQuery } from '../services/user';
import PostItem from '../components/HomeScreen/PostItem';
import { colors } from '../global/colors';

const HomeScreen = () => {

  const { data: userPosts, error, isLoading } = useGetUserPostQuery();
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) return <Loading />;

  if (error) return <Text>Error: {error.message}</Text>;

  const postArray = userPosts ? Object.entries(userPosts).map(([key, value]) => ({ ...value, id: key })) : [];

  // Filtra las publicaciones basado en la búsqueda
  const filteredPosts = postArray.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header style={styles.header}/>
      <SearchBar onSearch={setSearchQuery}/>
      
      {/*Muestra la FlatList si hay una búsqueda, sino muestra la vista de home*/}
      {searchQuery ? (
        <FlatList
          data={filteredPosts}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostItem item={item} />}
          ListEmptyComponent={
            <View style={styles.noProductsTextContainer}>
                <Text style={styles.noProductsText}>No se encontraron productos</Text>
            </View>
          }
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Slider style={styles.slider} />
          <Categories style={styles.categories} />
          <LatestItemList style={styles.latestItemList} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20
  },
  noProductsTextContainer: {
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
  noProductsText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.violet,
    textShadowColor: '#000',
    textShadowOffset: {width: 0.9, height: 0.9},
    textShadowRadius: 1
  }
});

export default HomeScreen;
