import { Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { View, Text} from 'react-native';
import React from 'react'

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pop It!</Text>
      <Text style={styles.subtitle}>Tap to Start</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('./game')}
      >
      <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity>
    </View>

   
  ); 
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: { fontSize: 40, fontWeight: 'bold', padding:20 },
  subtitle: { fontSize: 20, color: 'gray', padding:12, paddingBottom: 30 },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

