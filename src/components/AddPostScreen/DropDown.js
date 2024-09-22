import { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const DropDown = ({ options, selectedValue, onValueChange, placeholder }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(selectedValue);

  // Maneja la selección de una opción
  const handleSelect = (itemValue) => {
    setSelectedOption(itemValue);
    onValueChange(itemValue);
    setIsVisible(false);
  };

  // Encuentra la opción seleccionada en base a su valor
  const selectedLabel = options.find(option => option.value === selectedOption)?.label;

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsVisible(true)}>
          <Text style={[styles.dropdownButtonText, { color: selectedLabel ? '#000' : '#888' }]}>
            {selectedLabel || placeholder} {/* Muestra el label de la opción seleccionada o el placeholder */}
          </Text>
        </TouchableOpacity>
        <Modal transparent visible={isVisible} animationType="fade">
            <TouchableOpacity style={styles.modalBackground} onPress={() => setIsVisible(false)}>
            <View style={styles.modalContainer}>
                <FlatList
                data={options}
                keyExtractor={(item, index) => item.key ? item.key.toString() : index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.option} onPress={() => handleSelect(item.value)}>
                    <Text style={styles.optionText}>{item.label}</Text>
                    </TouchableOpacity>
                )}
                />
            </View>
            </TouchableOpacity>
        </Modal>
    </View>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  container: {
    width: '85%',
    marginTop: 10,
    borderWidth: 1.8,
    borderRadius: 10,
    borderColor: '#7B2CBF',
  },
  dropdownButton: {
    padding: 10,
  },
  dropdownButtonText: {
    fontSize: 15,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '85%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 15,
    color: '#000',
  },
});
