import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator, HelperText } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { topUpBalance } from '../api/api';

const TopUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hàm tạo mã giao dịch ngẫu nhiên
  const generateTransactionId = () => {
    const timestamp = Date.now().toString().slice(-6); // Lấy 6 số cuối của timestamp
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 ký tự ngẫu nhiên
    return `TX${timestamp}${randomStr}`; // Format: TX + 6 số timestamp + 6 ký tự ngẫu nhiên
  };

  const handleTopUp = async () => {
    // Kiểm tra đầu vào
    if (!amount) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền nạp');
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert('Lỗi', 'Số tiền không hợp lệ');
      return;
    }

    try {
      setIsLoading(true);
      const transactionId = generateTransactionId();
      const response = await topUpBalance(
        user?.mssv || '',
        amountNumber,
        'Chuyển khoản',
        transactionId,
        note
      );

      // Cập nhật số dư người dùng
      if (user) {
        updateUser({
          ...user,
          balance: (user.balance || 0) + amountNumber
        });
      }

      Alert.alert(
        'Thành công',
        `Nạp tiền thành công!\nMã giao dịch: ${transactionId}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Lỗi khi nạp tiền:', error);
      Alert.alert('Lỗi', 'Không thể nạp tiền. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Nạp Tiền</Text>
      
      <View style={styles.formContainer}>
        <TextInput
          label="Số tiền nạp"
          value={amount}
          onChangeText={setAmount}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          disabled={isLoading}
        />
        <HelperText type="info" style={styles.helperText}>
          Nhập số tiền bạn muốn nạp vào tài khoản
        </HelperText>

        <TextInput
          label="Ghi chú (tùy chọn)"
          value={note}
          onChangeText={setNote}
          mode="outlined"
          style={styles.input}
          disabled={isLoading}
        />

        <Button 
          mode="contained" 
          onPress={handleTopUp}
          style={styles.topUpButton}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : 'Nạp tiền'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a6ea9',
    marginBottom: 30,
    marginTop: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  helperText: {
    marginBottom: 15,
  },
  topUpButton: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#4a6ea9',
  },
});

export default TopUpScreen; 