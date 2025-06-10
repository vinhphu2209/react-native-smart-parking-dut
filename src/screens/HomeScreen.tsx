import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Text, ActivityIndicator, Avatar } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../api/api';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      if (user?.mssv) {
        const userData = await getUserProfile(user.mssv);
        updateUser(userData);
      }
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

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '0 VNĐ';
    return `${amount.toLocaleString('vi-VN')} VNĐ`;
  };

  return (
    <ScrollView 
      style={styles.container}
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
                  color="#fff"
                  style={{ backgroundColor: "#4a6ea9" }}
                />
              </View>
              <Title style={styles.welcomeText}>Xin chào, {user?.name || 'Người dùng'}</Title>
              
              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Mã sinh viên</Text>
                  <Text style={styles.infoValue}>{user?.mssv || 'N/A'}</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Số dư tài khoản</Text>
                  <Text style={styles.balanceAmount}>
                    {formatCurrency(user?.balance)}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Mã RFID</Text>
                  <Text style={styles.infoValue}>{user?.id_rfid || 'Chưa có'}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.historyCard}>
            <Card.Content>
              <Title style={styles.historyTitle}>Lịch sử ra vào gần đây</Title>
              <Paragraph style={styles.historyText}>
                Xem lịch sử gửi xe của bạn tại tab "Lịch sử ra vào".
              </Paragraph>
              <Button 
                mode="outlined" 
                style={styles.viewHistoryButton}
                icon="history"
                onPress={() => navigation.navigate('History')}
              >
                Xem lịch sử ra vào
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
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4a6ea9',
  },
  userInfoCard: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 20,
    color: '#4a6ea9',
  },
  infoContainer: {
    marginTop: 10,
  },
  infoItem: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4a6ea9',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  historyCard: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 2,
  },
  historyTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  historyText: {
    marginBottom: 16,
  },
  viewHistoryButton: {
    borderColor: '#4a6ea9',
  },
});

export default HomeScreen;
