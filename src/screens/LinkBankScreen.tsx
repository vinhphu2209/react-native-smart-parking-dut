import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, ActivityIndicator, Divider } from 'react-native-paper';
import { linkBank } from '../api/api';
import { useAuth } from '../context/AuthContext';

const LinkBankScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { updateUser } = useAuth();

  const handleSendOTP = () => {
    // Kiểm tra đầu vào
    if (!bankName || !accountNumber) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin ngân hàng');
      return;
    }
    
    // Giả lập gửi OTP (thực tế sẽ gọi API)
    setShowOtpInput(true);
    Alert.alert('Thông báo', 'Mã OTP đã được gửi tới số điện thoại đăng ký của bạn');
  };

  const handleLinkBank = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Lỗi', 'Mã OTP không hợp lệ');
      return;
    }

    try {
      setIsLoading(true);
      const response = await linkBank(bankName, accountNumber, otp);
      
      // Cập nhật thông tin người dùng sau khi liên kết
      updateUser({
        bank_linked: true
      });
      
      Alert.alert(
        'Thành công', 
        'Tài khoản ngân hàng đã được liên kết thành công!',
        [{ text: 'Về trang chủ', onPress: () => navigation.navigate('Home') }]
      );
    } catch (error) {
      console.error('Lỗi khi liên kết ngân hàng:', error);
      Alert.alert('Lỗi', 'Không thể liên kết ngân hàng. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Liên Kết Tài Khoản Ngân Hàng</Text>
      
      <View style={styles.formContainer}>
        <TextInput
          label="Tên ngân hàng"
          value={bankName}
          onChangeText={setBankName}
          mode="outlined"
          style={styles.input}
          disabled={showOtpInput}
        />
        
        <TextInput
          label="Số tài khoản"
          value={accountNumber}
          onChangeText={setAccountNumber}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          disabled={showOtpInput}
        />

        {!showOtpInput ? (
          <Button 
            mode="contained" 
            onPress={handleSendOTP}
            style={styles.sendOtpButton}
          >
            Gửi mã xác thực OTP
          </Button>
        ) : (
          <>
            <Divider style={styles.divider} />
            
            <Text style={styles.otpTitle}>Nhập mã OTP</Text>
            <Text style={styles.otpSubtitle}>
              Mã xác thực đã được gửi đến số điện thoại đăng ký của bạn
            </Text>
            
            <TextInput
              label="Mã OTP"
              value={otp}
              onChangeText={setOtp}
              mode="outlined"
              keyboardType="numeric"
              maxLength={6}
              style={styles.otpInput}
            />
            
            <HelperText type="info" style={styles.otpHelperText}>
              Mã OTP có hiệu lực trong 5 phút
            </HelperText>
            
            <View style={styles.buttonContainer}>
              <Button 
                mode="outlined" 
                onPress={() => setShowOtpInput(false)}
                style={styles.backButton}
                disabled={isLoading}
              >
                Quay lại
              </Button>
              
              <Button 
                mode="contained" 
                onPress={handleLinkBank}
                style={styles.linkButton}
                disabled={isLoading}
              >
                {isLoading ? <ActivityIndicator color="#fff" /> : 'Liên kết ngay'}
              </Button>
            </View>
          </>
        )}
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
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  sendOtpButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: '#4a6ea9',
  },
  divider: {
    marginVertical: 20,
    height: 1,
  },
  otpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a6ea9',
    marginBottom: 10,
  },
  otpSubtitle: {
    marginBottom: 15,
    color: '#666',
  },
  otpInput: {
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  otpHelperText: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 1,
    marginRight: 10,
    borderColor: '#4a6ea9',
    borderWidth: 1,
  },
  linkButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#4a6ea9',
  },
});

export default LinkBankScreen;
