import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ActivityIndicator, Avatar } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { parkingIn, parkingOut, getUserProfile } from '../api/api';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingParkingIn, setIsLoadingParkingIn] = useState(false);
  const [isLoadingParkingOut, setIsLoadingParkingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const userData = await getUserProfile();
      updateUser(userData);
    } catch (error) {
      console.error('Lỗi khi tải thông tin người dùng:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserProfile();
    setRefreshing(false);
  };

  const handleParkingIn = async () => {
    try {
      setIsLoadingParkingIn(true);
      const response = await parkingIn();
      Alert.alert('Thành công', response.message || 'Đã quét thẻ vào bãi thành công!');
      await fetchUserProfile(); // Cập nhật thông tin người dùng sau khi vào bãi
    } catch (error) {
      console.error('Lỗi khi quét thẻ vào:', error);
      Alert.alert('Lỗi', 'Không thể quét thẻ vào bãi. Vui lòng thử lại.');
    } finally {
      setIsLoadingParkingIn(false);
    }
  };

  const handleParkingOut = async () => {
    try {
      setIsLoadingParkingOut(true);
      const response = await parkingOut();
      Alert.alert('Thành công', response.message || 'Đã quét thẻ ra bãi thành công!');
      await fetchUserProfile(); // Cập nhật thông tin người dùng sau khi ra bãi
    } catch (error) {
      console.error('Lỗi khi quét thẻ ra:', error);
      Alert.alert('Lỗi', 'Không thể quét thẻ ra bãi. Vui lòng thử lại.');
    } finally {
      setIsLoadingParkingOut(false);
    }
  };

  const handleLinkBank = () => {
    navigation.navigate('LinkBank');
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {isLoadingProfile ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a6ea9" />
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
      ) : (
        <>
          <Card style={styles.userInfoCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.avatarContainer}>
                <Avatar.Text 
                  size={70} 
                  label={user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'} 
                  backgroundColor="#4a6ea9" 
                />
              </View>
              <Title style={styles.welcomeText}>Xin chào, {user?.name || 'Người dùng'}</Title>
              
              <View style={styles.balanceContainer}>
                <View style={styles.balanceBox}>
                  <Text style={styles.balanceLabel}>Số dư tài khoản</Text>
                  <Text style={styles.balanceAmount}>
                    {user?.balance ? `${user.balance.toLocaleString('vi-VN')} đ` : 'Chưa có thông tin'}
                  </Text>
                </View>
                
                <View style={styles.bankStatusContainer}>
                  <Text style={styles.bankStatusLabel}>Trạng thái ngân hàng</Text>
                  <Text style={[
                    styles.bankStatusText,
                    user?.bank_linked ? styles.bankLinked : styles.bankNotLinked
                  ]}>
                    {user?.bank_linked ? 'Đã liên kết' : 'Chưa liên kết'}
                  </Text>
                  
                  {!user?.bank_linked && (
                    <Button 
                      mode="contained" 
                      style={styles.linkBankButton}
                      onPress={handleLinkBank}
                    >
                      Liên kết ngay
                    </Button>
                  )}
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.actionsCard}>
            <Card.Content>
              <Title style={styles.actionsTitle}>Quản lý bãi đỗ xe</Title>
              
              <View style={styles.actionButtonsContainer}>
                <Button 
                  mode="contained" 
                  style={[styles.actionButton, styles.inButton]}
                  icon="login-variant"
                  onPress={handleParkingIn}
                  disabled={isLoadingParkingIn}
                  loading={isLoadingParkingIn}
                >
                  Quét thẻ vào bãi
                </Button>
                
                <Button 
                  mode="contained" 
                  style={[styles.actionButton, styles.outButton]}
                  icon="logout-variant"
                  onPress={handleParkingOut}
                  disabled={isLoadingParkingOut}
                  loading={isLoadingParkingOut}
                >
                  Quét thẻ ra bãi
                </Button>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.historyCard}>
            <Card.Content>
              <Title style={styles.historyTitle}>Lịch sử gần đây</Title>
              <Paragraph style={styles.historyText}>
                Xem lịch sử gửi xe của bạn tại tab "Lịch sử"
              </Paragraph>
              <Button 
                mode="outlined" 
                style={styles.viewHistoryButton}
                icon="history"
                onPress={() => navigation.navigate('History')}
              >
                Xem lịch sử
              </Button>
            </Card.Content>
          </Card>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  userInfoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 10,
    marginTop: 10
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4a6ea9',
  },
  balanceContainer: {
    width: '100%',
    marginTop: 20,
  },
  balanceBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#2E7D32',
  },
  bankStatusContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  bankStatusLabel: {
    fontSize: 14,
    color: '#666',
  },
  bankStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  bankLinked: {
    color: '#2E7D32',
  },
  bankNotLinked: {
    color: '#C62828',
    marginBottom: 10,
  },
  linkBankButton: {
    marginTop: 5,
    backgroundColor: '#4a6ea9',
  },
  actionsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  actionsTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: '#333',
  },
  actionButtonsContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 8,
  },
  inButton: {
    backgroundColor: '#4a6ea9',
  },
  outButton: {
    backgroundColor: '#689f38',
  },
  historyCard: {
    marginBottom: 16,
    elevation: 2,
  },
  historyTitle: {
    fontSize: 18,
    color: '#333',
  },
  historyText: {
    marginBottom: 10,
  },
  viewHistoryButton: {
    borderColor: '#4a6ea9',
    borderWidth: 1,
  }
});

export default HomeScreen;
