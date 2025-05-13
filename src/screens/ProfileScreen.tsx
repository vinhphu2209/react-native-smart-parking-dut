import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, Avatar, List, Divider, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../api/api';

const ProfileScreen: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Thông tin người dùng có thể chỉnh sửa
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Thông tin mật khẩu mới
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form về giá trị ban đầu
    setName(user?.name || '');
    setEmail(user?.email || '');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditing(false);
  };

  const handleSave = async () => {
    // Kiểm tra các trường nhập liệu
    if (!name || !email) {
      Alert.alert('Lỗi', 'Họ tên và email không được để trống');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setIsLoading(true);

      const updateData: {name: string, email: string, password?: string} = {
        name,
        email
      };

      if (newPassword) {
        updateData.password = newPassword;
      }

      await updateUserProfile(updateData);
      
      // Cập nhật thông tin người dùng trong context
      updateUser({
        name,
        email
      });

      setIsEditing(false);
      setNewPassword('');
      setConfirmPassword('');

      Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Lỗi khi đăng xuất:', error);
              Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'} 
          backgroundColor="#4a6ea9"
        />
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <Divider style={styles.divider} />

      {isEditing ? (
        <View style={styles.editForm}>
          <TextInput
            label="Họ và tên"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.passwordTitle}>Đổi mật khẩu (tùy chọn)</Text>

          <TextInput
            label="Mật khẩu mới"
            value={newPassword}
            onChangeText={setNewPassword}
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

          <View style={styles.buttonContainer}>
            <Button 
              mode="outlined" 
              onPress={handleCancel}
              style={styles.cancelButton}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSave}
              style={styles.saveButton}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator color="#fff" /> : 'Lưu'}
            </Button>
          </View>
        </View>
      ) : (
        <View>
          <List.Section>
            <List.Item
              title="Thông tin tài khoản"
              left={props => <List.Icon {...props} icon="account" />}
              right={props => <Button onPress={handleEdit} mode="text" compact>Chỉnh sửa</Button>}
            />
            <Divider />
            <List.Item
              title="Liên kết ngân hàng"
              description={user?.bank_linked ? 'Đã liên kết' : 'Chưa liên kết'}
              left={props => <List.Icon {...props} icon="bank" />}
            />
            <Divider />
            <List.Item
              title="Số dư hiện tại"
              description={user?.balance ? `${user.balance.toLocaleString('vi-VN')} đ` : '0 đ'}
              left={props => <List.Icon {...props} icon="wallet" />}
            />
            <Divider />
            <List.Item
              title="Nạp tiền"
              left={props => <List.Icon {...props} icon="cash-plus" />}
              onPress={() => Alert.alert('Thông báo', 'Tính năng nạp tiền đang được phát triển')}
            />
            <Divider />
            <List.Item
              title="Trợ giúp & Hỗ trợ"
              left={props => <List.Icon {...props} icon="help-circle" />}
              onPress={() => Alert.alert('Thông báo', 'Tính năng trợ giúp đang được phát triển')}
            />
            <Divider />
          </List.Section>

          <Button 
            mode="contained" 
            onPress={handleLogout}
            style={styles.logoutButton}
            icon="logout"
          >
            Đăng xuất
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  divider: {
    marginVertical: 15,
  },
  editForm: {
    marginTop: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    borderColor: '#4a6ea9',
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#4a6ea9',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#C62828',
  },
});

export default ProfileScreen;
