import React from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Text, Avatar, List, Divider, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuth();

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

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '0 VNĐ';
    return `${amount.toLocaleString('vi-VN')} VNĐ`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'} 
          color="#fff"
          style={{ backgroundColor: "#4a6ea9" }}
        />
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.mssv}</Text>
      </View>

      <Divider style={styles.divider} />

      <View>
        <List.Section>
          <List.Item
            title="Mã số sinh viên"
            description={user?.mssv || 'N/A'}
            left={props => <List.Icon {...props} icon="card-account-details" />}
          />
          <Divider />
          <List.Item
            title="Mã RFID"
            description={user?.id_rfid || 'Chưa có'}
            left={props => <List.Icon {...props} icon="nfc" />}
          />
          <Divider />
          <List.Item
            title="Số dư hiện tại"
            description={formatCurrency(user?.balance)}
            left={props => <List.Icon {...props} icon="wallet" />}
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
          onPress={() => navigation.navigate('TopUpStack', { screen: 'TopUp' })}
          style={styles.topUpButton}
          icon="cash-plus"
        >
          Nạp tiền
        </Button>

        <Button 
          mode="contained" 
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
        >
          Đăng xuất
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
  topUpButton: {
    marginTop: 20,
    backgroundColor: '#4a6ea9',
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#C62828',
  },
});

export default ProfileScreen;
