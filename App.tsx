import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { CircularSlider } from './src/components/CircularSlider';

export default function App() {
  return (
    <View style={styles.container}>
      <CircularSlider />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
