import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Ball from './Components/Ball/Ball';
import styles from './Components/Ball/Ball.styles';

export default function App() {
  return (
    // importing components 
    <View>
      <Ball />  
      <StatusBar style='auto' />
    </View>
  );
}

