import { Image, StyleSheet, Text, View } from 'react-native'
import { mapStaticApi } from '../../firebase/googleMapAPI'

const MapPreview = ({ location }) => {
    const mapStaticURL = `https://maps.googleapis.com/maps/api/staticmap?
                          center=${location.latitude},${location.longitude}
                          &zoom=13&size=600x300&maptype=roadmap
                          &markers=color:blue%7Clabel:E%7C40.702147,-74.015794
                          &key=${mapStaticApi}` 
  return (
    <View>
      <Image
        source={location.latitude && { uri: mapStaticURL }}
        style={styles.mapImage}
      />
    </View>
  )
}

export default MapPreview

const styles = StyleSheet.create({
    mapImage: {
        width: 300,
        height: 300,
        backgroundColor: '#444',
        marginTop: 25
    }
})