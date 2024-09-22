import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/app/store'
import { Provider } from 'react-redux'
import MainNavigator from './src/navigation/MainNavigator';
import { init } from './src/db';

export default function App() {

  init()

  return (
    <>
      <Provider store={store}>
        <SafeAreaProvider>
          <MainNavigator/>
        </SafeAreaProvider>
      </Provider>
      <StatusBar/>
    </>
  );
}

const styles = StyleSheet.create({});
