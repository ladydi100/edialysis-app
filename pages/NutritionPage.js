import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NutritionPage = () => {
  return (
    <View style={styles.container}>
      <Text>Nutricion</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NutritionPage;