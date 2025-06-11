import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import ServerConfigModal from '../components/ServerConfigModal';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [mssv, setMssv] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleLogin = async () => {
    if (!mssv || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ MSSV và mật khẩu');
      return;
    }

    try {
      setIsLoading(true);
      await login(mssv, password);
    } catch (error: any) {
      Alert.alert('Đăng nhập thất bại', error.message || 'MSSV hoặc mật khẩu không chính xác');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.settingsButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.settingsButtonText}>⚙️</Text>
      </TouchableOpacity>

      <ServerConfigModal 
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />

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
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
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
  settingsButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  settingsButtonText: {
    fontSize: 28,
  },
});

export default LoginScreen;
