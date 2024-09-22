import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { colors } from '../global/colors'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'

const SearchBar = ({ onSearch }) => {

  const [ input, setInput ] = useState('');

  const handleInputChange = (text) => {
    setInput(text)
  }

  const handleRemoveSearch = () => {
    setInput('')
    onSearch('')
  }

  const handleSearch = () => {
    onSearch(input)
  }
 
  return (
    <View style={styles.searchBarContainer}>
        <Pressable onPress={handleSearch}>
          <Ionicons name='search' size={24}/>
        </Pressable>
        <TextInput 
          placeholder='Buscar producto' 
          style={styles.searchBarText}
          value={input}
          onChangeText={handleInputChange}
        />
        {input ? (
          <Pressable onPress={handleRemoveSearch}>
            <Ionicons name='close-circle-outline' size={26}/>
          </Pressable>
        ) : null}
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({
    searchBarContainer: {
      flexDirection: 'row',
      marginTop: 10,
      padding: 12,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: colors.violet,
      width: '85%',
      alignItems: 'center',
      alignSelf: 'center'
    },
    searchBarText: {
      width: '80%',
      marginLeft: 10,
      color: '#000',
      fontSize: 18,
      fontWeight: '500'
    }
})