import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Dimensions } from 'react-native';

export default function GameScreen() {
  const { width, height } = Dimensions.get('window'); // Get screen dimensions
  const [level, setLevel] = useState(1);
  const [highlightedBubbles, setHighlightedBubbles] = useState<number[]>([]);
  const [poppedBubbles, setPoppedBubbles] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gridSize, setGridSize] = useState(3);
  const [gridKey, setGridKey] = useState(0); // Key to force FlatList re-mount
  const [bubbleSize, setBubbleSize] = useState(60);

  // Calculate maximum number of bubbles per row based on screen width and bubble size
  const calculateColumns = (bubbleSize: number) => {
    const maxColumns = Math.floor(width / (bubbleSize + 10)); // 10px margin between bubbles
    return Math.max(3, maxColumns); // Ensure at least 3 columns
  };

  // Dynamically adjust grid size and bubble size on level change
  const generateLevel = () => {
    // Dynamically calculate grid size based on the screen width and bubble size
    const size = calculateColumns(bubbleSize); // Calculate grid size based on current bubble size
    setGridSize(size);
    setGridKey((prev) => prev + 1); // Change key to force FlatList re-render

    const totalBubbles = size * size;
    const highlighted = Array.from({ length: level + 2 }, () =>
      Math.floor(Math.random() * totalBubbles)
    );
    setHighlightedBubbles(highlighted);
    setPoppedBubbles([]);

    // Decrease the timer slightly as the level increases
    const newTimeLeft = Math.max(10, 30 - level); // Minimum timer is 10 seconds
    setTimeLeft(newTimeLeft);

    // Increase the bubble size as the level increases, with a max size of 90
    const newBubbleSize = Math.min(90, 60 + level * 5); 
    setBubbleSize(newBubbleSize);
  };

  useEffect(() => {
    generateLevel(); // Generate level when the component mounts or level changes
  }, [level, bubbleSize]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleGameOver();
    }
  }, [timeLeft]);

  const handleBubblePress = (index: number) => {
    if (!highlightedBubbles.includes(index)) {
      // Restart game if the wrong bubble is popped
      Alert.alert('Game Over', 'You popped the wrong bubble!', [
        { text: 'Restart', onPress: restartGame },
      ]);
      return;
    }

    setPoppedBubbles((prev) => [...prev, index]);

    // Check if all highlighted bubbles are popped
    if (
      highlightedBubbles.every((highlightedIndex) =>
        [...poppedBubbles, index].includes(highlightedIndex)
      )
    ) {
      handleNextLevel();
    }
  };

  const handleNextLevel = () => {
    Alert.alert('Level Complete!', 'Moving to the next level...', [
      { text: 'OK', onPress: () => setLevel(level + 1) },
    ]);
  };

  const handleGameOver = () => {
    Alert.alert('Game Over', 'You ran out of time!', [
      { text: 'Restart', onPress: restartGame },
    ]);
  };

  const restartGame = () => {
    setLevel(1);
    generateLevel();
  };

  const renderBubble = ({ index }: { index: number }) => {
    const isHighlighted = highlightedBubbles.includes(index);
    const isPopped = poppedBubbles.includes(index);

    return (
      <TouchableOpacity
        style={[
          styles.bubble,
          isHighlighted && styles.highlightedBubble,
          isPopped && styles.bubblePopped,
          { width: bubbleSize, height: bubbleSize }, // Dynamically set bubble size
        ]}
        onPress={() => handleBubblePress(index)}
        disabled={isPopped}
      >
        {isHighlighted && !isPopped && <Text style={styles.bubbleText}>Pop!</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Level {level}</Text>
      <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
      <FlatList
        key={gridKey} // Use the key to force re-render when gridSize changes
        data={Array(gridSize * gridSize).fill(null)}
        renderItem={({ index }) => renderBubble({ index })}
        keyExtractor={(_, index) => index.toString()}
        numColumns={gridSize}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timer: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ff4500',
  },
  grid: {
    justifyContent: 'center',
  },
  bubble: {
    margin: 5,
    borderRadius: 30,
    backgroundColor: '#61dafb',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  highlightedBubble: {
    borderWidth: 3,
    borderColor: '#ffd700',
  },
  bubblePopped: {
    backgroundColor: '#d3d3d3',
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});

