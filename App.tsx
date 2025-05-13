import React from 'react';
import { StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  // Kích hoạt tối ưu hóa cho React Navigation
  enableScreens();

  return (
    <PaperProvider>
      <NavigationContainer>
        <AuthProvider>
          <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#4a6ea9" barStyle="light-content" />
            <AppNavigator />
          </SafeAreaView>
        </AuthProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});