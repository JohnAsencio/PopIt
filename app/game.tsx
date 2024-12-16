import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Dimensions } from 'react-native';

export default function GameScreen() {
  const { width, height } = Dimensions.get('window'); // Get screen dimensions
  const [level, setLevel] = useState(1);
  const [highlightedBubbles, setHighlightedBubbles] = useState<number[]>([]);
  const [poppedBubbles, setPoppedBubbles] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gridSize, setGridSize] = useState(0);
  const [gridKey, setGridKey] = useState(0); // Key to force FlatList re-mount
  const [bubbleSize, setBubbleSize] = useState(90);

  const calculateColumns = () => {
    const maxColumns = Math.floor(width / (bubbleSize + 10)); // Max bubbles per row
    return maxColumns; // Number of bubbles in one row
  };

  const calculateRows = () => {
    const maxRows = Math.floor(height / (bubbleSize + 10) - 2); // Max bubbles per column (leave space for UI)
    return maxRows;
  };

  const generateLevel = () => {
    // Dynamically adjust grid size based on level
    const maxColumns = calculateColumns();
    const newGridSize = Math.min(gridSize + 1, maxColumns);

    setGridSize(newGridSize); // Update grid size
    setGridKey((prev) => prev + 1); // Force FlatList re-render

    const totalBubbles = newGridSize * calculateRows(); // Calculate grid area
    const highlighted = Array.from({ length: level + 2 }, () =>
      Math.floor(Math.random() * totalBubbles)
    );
    setHighlightedBubbles(highlighted);
    setPoppedBubbles([]);

    // Adjust timer dynamically
    const newTimeLeft = Math.max(10, 30 - Math.floor(level / 2)); // Minimum timer is 10 seconds
    setTimeLeft(newTimeLeft);

    // Adjust bubble size every X levels
    if (level % 5 === 0) {
      const newBubbleSize = Math.max(40, bubbleSize - 10); // Minimum bubble size is 40
      setBubbleSize(newBubbleSize);
    }
  };

  useEffect(() => {
    generateLevel(); // Generate new level when the component mounts or level changes
  }, [level]);

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
    setGridSize(0); // Reset grid size
    setBubbleSize(90); // Reset bubble size
    setTimeLeft(30); // Reset timer
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
        data={Array(gridSize * calculateRows()).fill(null)} // Adjust data size dynamically
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
