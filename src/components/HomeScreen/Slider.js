import { ActivityIndicator, Animated, Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import { useEffect, useRef, useState } from 'react';
import { colors } from '../../global/colors';
import { useGetSlidersQuery } from '../../services/market';

const Slider = () => {

  const { data: sliders, isLoading, error } = useGetSlidersQuery()
  const flatListRef = useRef(null); // Referencia al FlatList
  const screenWidth = Dimensions.get('window').width; // Obtiene el ancho de la pantalla
  const imageWidth = screenWidth * 0.95; // Calcula el 95% del ancho de la pantalla
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (sliders && sliders.length > 0) {
      const interval = setInterval(() => {
        const nextIndex = (activeIndex + 1) % sliders.length;
        setActiveIndex(nextIndex);
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }, 4000); // Cada 4 segundos

      return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }
  }, [sliders, activeIndex]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  if (isLoading) return <ActivityIndicator size="large" color="#7B2CBF" style={{marginTop: 50}}/>;
  if (error) return <Text>Error: {JSON.stringify(error)}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={sliders}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()} 
        renderItem={({ item }) => (
          <View style={[styles.slidersContainer, { width: screenWidth }]}>
            <Image source={{ uri: item.image }} style={[styles.slidersImage, { width: imageWidth }]} />
          </View>
        )}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.pagination}>
        {sliders.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.paginationDot,
              {
                opacity: scrollX.interpolate({
                  inputRange: [
                    (index - 1) * screenWidth,
                    index * screenWidth,
                    (index + 1) * screenWidth,
                  ],
                  outputRange: [0.5, 1, 0.5],
                  extrapolate: 'clamp',
                }),
              }
            ]}
          />
        ))}
      </View>
    </View>
  )
}

export default Slider

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10
  },
  slidersContainer: {
    alignItems: 'center', 
    justifyContent: 'center'
  },
  slidersImage: {
    height: 210,
    resizeMode: 'contain',
    borderRadius: 10
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.violet,
    marginHorizontal: 5,
    marginTop: 5
  },
})