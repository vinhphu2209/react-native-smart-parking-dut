import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [mssv, setMssv] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!mssv || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ MSSV và mật khẩu');
      return;
    }

    try {
      setIsLoading(true);
      await login(mssv, password);
    } catch (error) {
      Alert.alert('Đăng nhập thất bại', 'MSSV hoặc mật khẩu không chính xác');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/icon.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.appName}>Bãi Đỗ Xe Thông Minh</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          label="Mã số sinh viên"
          value={mssv}
          onChangeText={setMssv}
          mode="outlined"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <Button 
          mode="contained" 
          onPress={handleLogin}
          style={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : 'Đăng nhập'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#4a6ea9',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  loginButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#4a6ea9',
  },
});

export default LoginScreen;
