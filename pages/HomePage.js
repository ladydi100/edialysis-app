import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext  } from '../context/AuthContext';

const HomePage = () => {
  const { userToken, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text>Bienvenido al Home</Text>
      
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

export default HomePage;