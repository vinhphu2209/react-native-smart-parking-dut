import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { register } from '../api/api';

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mssv, setMssv] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Kiểm tra đầu vào
    if (!name || !mssv || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setIsLoading(true);
      await register(name, mssv, password);
      Alert.alert(
        'Đăng ký thành công', 
        'Tài khoản của bạn đã được tạo thành công!',
        [{ text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Đăng ký thất bại', 'Có lỗi xảy ra khi đăng ký tài khoản.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Đăng Ký Tài Khoản</Text>
        
        <TextInput
          label="Họ và tên"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

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

        <TextInput
          label="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <Button 
          mode="contained" 
          onPress={handleRegister}
          style={styles.registerButton}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : 'Đăng Ký'}
        </Button>

        <View style={styles.loginContainer}>
          <Text>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a6ea9',
    marginBottom: 30,
    marginTop: 40,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  registerButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#4a6ea9',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30
  },
  loginText: {
    color: '#4a6ea9',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
