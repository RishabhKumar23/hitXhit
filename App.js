import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import Ball from './Components/Ball/Ball';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function App() {
  return (
    // importing components 
    <GestureHandlerRootView style={styles.container}>
      <Ball />
      <StatusBar style='auto' />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});